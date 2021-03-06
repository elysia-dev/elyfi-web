import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import envs from 'src/core/envs';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import { useWeb3React } from '@web3-react/core';
import ReactGA from 'react-ga';
import {
  erc20GasPriceFetcher,
  gasPriceFetcher,
} from 'src/clients/BalancesFetcher';
import usePurchaseNFT from 'src/hooks/usePurchaseNFT';
import NFTPurchaseType from 'src/enums/NFTPurchaseType';
import { useTranslation } from 'react-i18next';
import { utils } from 'ethers';
import buildEventEmitter from 'src/utiles/buildEventEmitter';
import ModalViewType from 'src/enums/ModalViewType';
import TransactionType from 'src/enums/TransactionType';
import Confirm from './components/Confirm';
import InputQuantity from './components/InputQuantity ';
import LoadingIndicator from './components/LoadingIndicator';
import ModalHeader from './components/ModalHeader';
import PurchaseButton from './components/PurchaseButton';
import SelectCrypto from './components/SelectCrypto';
import Step from './components/Step';
import WalletAmount from './components/WalleAmount';
import Approve from './components/Approve';
interface ModalType {
  modalClose: () => void;
  balances: {
    usdc: number;
    eth: number;
  };
  remainingNFT: number;
  btnLocation: string;
}

const NFTPurchaseModal: React.FC<ModalType> = ({
  modalClose,
  balances,
  remainingNFT,
  btnLocation,
}) => {
  const { account, library, chainId } = useWeb3React();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState('');
  const [purchaseType, setPurchaseType] = useState('ETH');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectVisible, setSelectVisible] = useState(false);
  const [isPendingApprove, setIsPendingApprove] = useState(false);
  const [isClickedMaxBtn, setIsClickedMaxBtn] = useState(false);
  const { purchaseNFT, isApprove, approve, isLoading } = usePurchaseNFT(
    balances.usdc,
  );
  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );
  const [gasFee, setGasFee] = useState(0);

  const ethGasFee = 196250 * 0.00000002;
  const usdcGasFee = 92163 * 0.00000002;

  const { data: approveGasFee } = useSWR(
    [{ account, library, key: 'approveGasPrice' }],
    {
      fetcher: erc20GasPriceFetcher(),
    },
  );

  const paymentAmount = useMemo(() => {
    return priceData
      ? (parseInt(quantity === '' ? '0' : quantity, 10) * 10) /
          (purchaseType === 'ETH' ? priceData?.ethPrice : 1)
      : 0;
  }, [priceData, quantity, purchaseType]);

  const paymentEth = useMemo(() => {
    return paymentAmount + paymentAmount * 0.05;
  }, [paymentAmount]);

  const isPayAmount = () => {
    if (!priceData) return;

    if (parseInt(quantity, 10) > remainingNFT) {
      return true;
    }

    if (purchaseType === NFTPurchaseType.ETH) {
      return paymentEth > balances.eth;
    }
    if (purchaseType === NFTPurchaseType.USDC) {
      return paymentAmount > balances.usdc || (usdcGasFee || 0) > balances.eth;
    }
  };

  useEffect(() => {
    setGasFee(purchaseType === 'ETH' ? ethGasFee : usdcGasFee);
  }, [purchaseType]);

  return (
    <div className="market_modal">
      <div className="market_modal__wrapper">
        <ModalHeader
          title={t('nftModal.purchaseModal.header')}
          isPurchaseModal={true}
          modalClose={modalClose}
        />
        <Step
          stepColor={true}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
        {currentStep === 1 ? (
          <>
            <InputQuantity
              setQuantity={setQuantity}
              quantity={quantity}
              dollar={parseInt(quantity === '' ? '0' : quantity, 10) * 10}
              crypto={
                purchaseType === NFTPurchaseType.ETH
                  ? paymentEth
                  : paymentAmount
              }
              purchaseType={purchaseType}
              max={() => {
                setQuantity(
                  purchaseType === NFTPurchaseType.USDC
                    ? ((balances.usdc * 1) / 10).toString()
                    : (
                        ((balances.eth -
                          balances.eth * 0.05 -
                          (ethGasFee || 0)) *
                          (priceData?.ethPrice || 0)) /
                        10
                      ).toFixed(0),
                );
                setIsClickedMaxBtn(true);
              }}
            />
            <SelectCrypto
              setPurchaseType={setPurchaseType}
              purchaseType={purchaseType}
              selectVisible={selectVisible}
              setSelectVisible={setSelectVisible}
            />
            <WalletAmount balances={balances} remainingNFT={remainingNFT} />
          </>
        ) : !isLoading && currentStep === 2 ? (
          purchaseType === NFTPurchaseType.USDC && !isApprove ? (
            <Approve
              approveGasFeeInfo={{
                approveGasFee,
                gasFeeToDollar:
                  (approveGasFee ? approveGasFee : 0) *
                  (priceData ? priceData.ethPrice : 0),
              }}
            />
          ) : (
            <Confirm
              quantity={quantity}
              dollar={parseInt(quantity, 10) * 10}
              crypto={
                purchaseType === NFTPurchaseType.ETH
                  ? paymentEth
                  : paymentAmount
              }
              purchaseType={purchaseType}
              gasFeeInfo={{
                gasFee,
                gasFeeToDollar: gasFee * (priceData ? priceData.ethPrice : 0),
              }}
            />
          )
        ) : (
          isLoading && <LoadingIndicator />
        )}
        <PurchaseButton
          content={
            currentStep === 1
              ? parseInt(quantity, 10) > remainingNFT
                ? t('nftModal.button.insufficientNFT')
                : isPayAmount()
                ? t('nftModal.button.insufficientWallet')
                : quantity === '0'
                ? t('nftModal.button.next')
                : t('nftModal.button.next')
              : currentStep === 2
              ? purchaseType === NFTPurchaseType.USDC && !isApprove
                ? isPendingApprove
                  ? t('nftModal.button.approvePendingTx')
                  : t('nftModal.button.approve')
                : t('nftModal.button.purchase')
              : t('nftModal.button.pendingTx')
          }
          isPayAmount={isPayAmount() || quantity === '' || quantity[0] === '0'}
          onClickHandler={async () => {
            if (
              isPayAmount() ||
              quantity === '0' ||
              parseInt(quantity, 10) > remainingNFT ||
              isLoading
            )
              return;
            if (currentStep === 2) {
              if (purchaseType === NFTPurchaseType.USDC && !isApprove) {
                setIsPendingApprove(true);
                await approve();
                setIsPendingApprove(false);
                return;
              }
              purchaseNFT(
                String(parseInt(quantity, 10) * 10),
                purchaseType,
                modalClose,
                btnLocation,
                isClickedMaxBtn,
                purchaseType === NFTPurchaseType.ETH
                  ? String(paymentEth)
                  : undefined,
              );
            }
            setCurrentStep((prev) => {
              if (prev === 1) {
                const emitter = buildEventEmitter(
                  ModalViewType.NFTPurchaseModal,
                  'Next',
                  JSON.stringify({
                    product: 'Bond NFT_0',
                    chainId,
                    address: account,
                    nftPurchaseType: purchaseType,
                    nftAmount: `${quantity}(${parseInt(quantity, 10) * 10})`,
                    depositAmount: utils.parseUnits(
                      purchaseType === 'ETH'
                        ? String(paymentEth)
                        : String(parseInt(quantity, 10) * 10),
                      purchaseType === 'ETH' ? 18 : 6,
                    ),
                  }),
                );
                emitter.clicked();
              }
              return prev + 1;
            });
          }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default NFTPurchaseModal;
