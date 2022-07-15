import { BigNumber, Contract, ethers, utils } from 'ethers';
import { useContext, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import envs from 'src/core/envs';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import { useWeb3React } from '@web3-react/core';
import { gasPriceFetcher } from 'src/clients/BalancesFetcher';
import controllerAbi from 'src/abis/Controller.json';
import nftAbi from 'src/abis/NftBond.json';
import buildEventEmitter from 'src/utiles/buildEventEmitter';
import ModalViewType from 'src/enums/ModalViewType';
import TransactionType from 'src/enums/TransactionType';
import ElyfiVersions from 'src/enums/ElyfiVersions';
import TxContext from 'src/contexts/TxContext';
import usePurchaseNFT from 'src/hooks/usePurchaseNFT';
import RecentActivityType from 'src/enums/RecentActivityType';
import NFTPurchaseType from 'src/enums/NFTPurchaseType';
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
}

const NFTPurchaseModal: React.FC<ModalType> = ({ modalClose, balances }) => {
  const { account } = useWeb3React();
  const [quantity, setQuantity] = useState('0');
  const [purchaseType, setPurchaseType] = useState('ETH');
  const [currentStep, setCurrentStep] = useState(1);
  const { purchaseNFT } = usePurchaseNFT(balances.usdc);
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

  return (
    <div className="market_modal">
      <div className="market_modal__wrapper">
        <ModalHeader
          title="채권 NFT"
          isPurchaseModal={true}
          modalClose={modalClose}
        />
        <Step
          stepColor={true}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
        <Approve />
        {/* {currentStep === 1 ? (
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
            />
            <SelectCrypto
              setPurchaseType={setPurchaseType}
              purchaseType={purchaseType}
            />
            <WalletAmount balances={balances} />
          </>
        ) : currentStep === 2 ? (
          <Confirm
            quantity={quantity}
            dollar={parseInt(quantity, 10) * 10}
            crypto={
              purchaseType === NFTPurchaseType.ETH ? paymentEth : paymentAmount
            }
            purchaseType={purchaseType}
            gasFeeInfo={{
              gasFee,
              gasFeeToDollar:
                (gasFee ? gasFee : 0) * (priceData ? priceData.ethPrice : 0),
            }}
          />
        ) : (
          <LoadingIndicator />
        )} */}
        <PurchaseButton
          content={
            currentStep === 1
              ? priceData &&
                (parseInt(quantity, 10) * 10) / priceData?.ethPrice +
                  (gasFee || 0) >
                  balances.eth
                ? '금액이 부족합니다.'
                : '다음'
              : currentStep === 2
              ? '구매하기'
              : '구매요청 처리중'
          }
          onClickHandler={async () => {
            if (currentStep === 2) {
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
        />
      </div>
    </div>
  );
};

export default NFTPurchaseModal;
