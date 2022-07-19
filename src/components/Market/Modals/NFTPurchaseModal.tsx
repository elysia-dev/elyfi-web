import { useMemo, useState } from 'react';
import useSWR from 'swr';
import envs from 'src/core/envs';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import { useWeb3React } from '@web3-react/core';
import { gasPriceFetcher } from 'src/clients/BalancesFetcher';
import usePurchaseNFT from 'src/hooks/usePurchaseNFT';
import NFTPurchaseType from 'src/enums/NFTPurchaseType';
import { useTranslation } from 'react-i18next';
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
}

const NFTPurchaseModal: React.FC<ModalType> = ({
  modalClose,
  balances,
  remainingNFT,
}) => {
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const [quantity, setQuantity] = useState('0');
  const [purchaseType, setPurchaseType] = useState('ETH');
  const [currentStep, setCurrentStep] = useState(1);
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

  const { data: gasFee } = useSWR([{ account, key: 'gasPrice' }], {
    fetcher: gasPriceFetcher(),
  });

  const paymentAmount = useMemo(() => {
    return priceData
      ? (parseInt(quantity, 10) * 10) /
          (purchaseType === 'ETH' ? priceData?.ethPrice : 1)
      : 0;
  }, [priceData, quantity, purchaseType]);

  const paymentEth = useMemo(() => {
    return paymentAmount + paymentAmount * 0.05;
  }, [paymentAmount]);

  const isPayAmount = () => {
    if (!priceData) return;

    if (purchaseType === NFTPurchaseType.ETH) {
      return paymentEth > balances.eth;
    }
    if (purchaseType === NFTPurchaseType.USDC) {
      return paymentAmount > balances.usdc || (gasFee || 0) > balances.eth;
    }
  };

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
              dollar={parseInt(quantity, 10) * 10}
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
                        ((balances.eth - balances.eth * 0.05 - (gasFee || 0)) *
                          (priceData?.ethPrice || 0)) /
                        10
                      ).toFixed(0),
                );
              }}
            />
            <SelectCrypto
              setPurchaseType={setPurchaseType}
              purchaseType={purchaseType}
            />
            <WalletAmount balances={balances} remainingNFT={remainingNFT} />
          </>
        ) : !isLoading && currentStep === 2 ? (
          purchaseType === NFTPurchaseType.USDC && !isApprove ? (
            <Approve />
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
                gasFeeToDollar:
                  (gasFee ? gasFee : 0) * (priceData ? priceData.ethPrice : 0),
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
                ? t('nftModal.button.approve')
                : t('nftModal.button.purchase')
              : t('nftModal.button.pendingTx')
          }
          isPayAmount={isPayAmount() || quantity === '0'}
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
                await approve();
                return;
              }
              purchaseNFT(
                String(parseInt(quantity, 10) * 10),
                purchaseType,
                modalClose,
                purchaseType === NFTPurchaseType.ETH
                  ? String(paymentEth)
                  : undefined,
              );
            }
            setCurrentStep((prev) => prev + 1);
          }}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default NFTPurchaseModal;
