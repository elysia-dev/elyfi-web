import { BigNumber, Contract, ethers, utils } from 'ethers';
import { useState } from 'react';
import useSWR from 'swr';
import envs from 'src/core/envs';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import { useWeb3React } from '@web3-react/core';
import { gasPriceFetcher } from 'src/clients/BalancesFetcher';
import controllerAbi from 'src/abis/Controller.json';
import Confirm from './components/Confirm';
import InputQuantity from './components/InputQuantity ';
import LoadingIndicator from './components/LoadingIndicator';
import ModalHeader from './components/ModalHeader';
import PurchaseButton from './components/PurchaseButton';
import SelectCrypto from './components/SelectCrypto';
import Step from './components/Step';
import WalletAmount from './components/WalleAmount';
interface ModalType {
  modalClose: () => void;
  balances: {
    usdc: number;
    eth: number;
  };
}

const getControllerContract = (provider: any): Contract => {
  return new ethers.Contract(
    controllerAbi.address,
    controllerAbi.abi,
    provider,
  );
};

const NFTPurchaseModal: React.FC<ModalType> = ({ modalClose, balances }) => {
  const { account, library } = useWeb3React();
  const [quantity, setQuantity] = useState('0');
  const [purchaseType, setPurchaseType] = useState('ETH');
  const [currentStep, setCurrentStep] = useState(1);
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

  console.log('gasFee', gasFee);

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
        {currentStep === 1 ? (
          <>
            {' '}
            <InputQuantity
              setQuantity={setQuantity}
              quantity={quantity}
              dollar={parseInt(quantity, 10) * 10}
              crypto={
                priceData &&
                (parseInt(quantity, 10) * 10) /
                  (purchaseType === 'ETH' ? priceData?.ethPrice : 1)
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
              priceData &&
              (parseInt(quantity, 10) * 10) /
                (purchaseType === 'ETH' ? priceData?.ethPrice : 1)
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
        )}
        <PurchaseButton
          content={
            currentStep === 1
              ? priceData &&
                gasFee &&
                (parseInt(quantity, 10) * 10) / priceData?.ethPrice + gasFee >
                  balances.eth
                ? '금액이 부족합니다.'
                : '다음'
              : currentStep === 2
              ? '구매하기'
              : '구매요청 처리중'
          }
          onClickHandler={async () => {
            if (currentStep === 2) {
              console.log('deposit');
              const controllerContract = getControllerContract(
                library.getSigner(),
              );
              controllerContract
                .deposit(
                  0,
                  utils.parseUnits('100', 6),
                  // utils.parseUnits(String(parseInt(quantity, 10) * 10), 6),
                  // priceData &&
                  //   utils.parseUnits(
                  //     (
                  //       (parseInt(quantity, 10) * 10) /
                  //       (purchaseType === 'ETH' ? priceData?.ethPrice : 1)
                  //     ).toFixed(5),
                  //     0,
                  //   ),
                  // { value: utils.parseEther('0.0910') },
                )
                .then((res: any) => {
                  console.log('res', res);
                })
                .catch((error: Error) => {
                  console.log(error);
                });
            }
            setCurrentStep((prev) => prev + 1);
          }}
        />
      </div>
    </div>
  );
};

export default NFTPurchaseModal;
