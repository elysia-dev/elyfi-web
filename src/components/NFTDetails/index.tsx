import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import MediaQuery from 'src/enums/MediaQuery';
import TokenColors from 'src/enums/TokenColors';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import useNavigator from 'src/hooks/useNavigator';
import DrawWave from 'src/utiles/drawWave';
import Questionmark from 'src/components/Questionmark';
import ContractImage from 'src/assets/images/market/contract.gif';
import Clip from 'src/assets/images/market/clip.svg';
import NFTStructure from 'src/assets/images/market/NFTStructure.png';
import BondAsset from 'src/assets/images/market/bondAssets.png';
import MainnetType from 'src/enums/MainnetType';
import Header from 'src/components/NFTDetails/Header';
import Purchase from 'src/components/NFTDetails/Purchase';
import NFTInfo from 'src/components/NFTDetails/NFTInfo';
import BondNFT from 'src/components/NFTDetails/BondNFT';
import Borrower from 'src/components/NFTDetails/Borrower';
import RealEstateInfo from 'src/components/NFTDetails/RealEstateInfo';
import moment from 'moment';
import News00 from 'src/assets/images/market/news00.png';
import News01 from 'src/assets/images/market/news01.png';
import News02 from 'src/assets/images/market/news02.png';
import MainnetContext from 'src/contexts/MainnetContext';
import { useWeb3React } from '@web3-react/core';
import useUserCryptoBalances from 'src/hooks/useUserCryptoBalances';
import {
  getNFTContract,
  nftTotalSupplyFetcher,
} from 'src/clients/BalancesFetcher';
import { utils } from 'ethers';
import TxContext from 'src/contexts/TxContext';
import TxStatus from 'src/enums/TxStatus';
import useSWR from 'swr';
import RecentActivityType from 'src/enums/RecentActivityType';
import ChangeNetworkModal from '../Market/Modals/ChangeNetworkModal';
import NFTPurchaseModal from '../Market/Modals/NFTPurchaseModal';
import SelectWalletModal from '../Market/Modals/SelectWalletModal';
import ReconnectWallet from '../Market/Modals/components/ReconnectWallet';

interface INews {
  title: string;
  content: string;
  link: string;
  image: string;
}

const NFTDetails = (): JSX.Element => {
  const { account, deactivate, library } = useWeb3React();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { value: mediaQuery } = useMediaQueryType();
  const { t } = useTranslation();
  const navigate = useNavigator();
  const { lng } = useParams<{ lng: string }>();
  const [modalType, setModalType] = useState('');
  const { type: mainnetType, changeMainnet } = useContext(MainnetContext);
  const { txType, txStatus } = useContext(TxContext);
  const { balances } = useUserCryptoBalances();
  const [purchasedNFT, setPurchasedNFT] = useState(0);

  const { data: nftTotalSupply, mutate } = useSWR(['nftTotalSupply'], {
    fetcher: nftTotalSupplyFetcher(),
  });

  const newsData: INews[] = [
    {
      title: 'Bloomberg',
      content: 'ELYFI Launches US Real Estate Investment Product',
      link: '',
      image: News00,
    },
    {
      title: 'Yahoo finance',
      content: 'ELYFI Launches US Real Estate Investment Product',
      link: '',
      image: News01,
    },
    {
      title: 'Token Post',
      content: '엘리파이, 美 부동산 투자 상품 출시…대출채권 조각 구매 가능',
      link: '',
      image: News02,
    },
  ];

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY = headerRef.current.offsetTop + 80;
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const browserHeight = canvas.height / dpr;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.scale(dpr, dpr);
    if (mediaQuery === MediaQuery.Mobile) return;
    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      TokenColors.ELFI,
      browserHeight,
      true,
    );
  };

  const getPurchasedNFT = useCallback(async () => {
    const nftContract = getNFTContract(library.getSigner());
    const count = await nftContract.balanceOf(account, 1);
    setPurchasedNFT(parseInt(utils.formatUnits(count, 0), 10));
  }, [library, account]);

  useEffect(() => {
    draw();
    window.addEventListener('scroll', () => draw());
    window.addEventListener('resize', () => draw());

    return () => {
      window.removeEventListener('scroll', () => draw());
      window.removeEventListener('resize', () => draw());
    };
  }, [document.body.clientHeight]);

  useEffect(() => {
    if (mainnetType === MainnetType.Ethereum) {
      setModalType('');
    }
  }, [mainnetType]);

  useEffect(() => {
    if (!account) return;
    getPurchasedNFT();
  }, [account]);

  useEffect(() => {
    if (!account) return;
    if (
      txStatus === TxStatus.CONFIRM &&
      txType === RecentActivityType.PurchasedNFT
    ) {
      getPurchasedNFT();
      mutate();
    }
  }, [txStatus, txType]);

  return (
    <>
      {modalType === 'selectWallet' ? (
        <SelectWalletModal
          modalClose={() => setModalType('')}
          selectWalletModalVisible={true}
        />
      ) : modalType === 'purchase' ? (
        <NFTPurchaseModal
          modalClose={() => setModalType('')}
          balances={balances}
          remainingNFT={540000 - (nftTotalSupply || 0)}
        />
      ) : modalType === 'changeNetwork' ? (
        <ChangeNetworkModal
          modalClose={() => setModalType('')}
          network={MainnetType.Ethereum}
          onClickHandler={() => changeMainnet(1)}
        />
      ) : modalType === 'reconnect' ? (
        <ReconnectWallet
          modalClose={() => setModalType('')}
          onClickHandler={() => {
            deactivate();
            setModalType('selectWallet');
          }}
        />
      ) : (
        <></>
      )}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <main className="nft-details">
        <div className="component__text-navigation">
          <p onClick={() => navigate(`/${lng}/market`)} className="pointer">
            {t('navigation.market')}
          </p>
          &nbsp;&gt;&nbsp;
          <p>{t('nftMarket.title')}</p>
        </div>
        <article className="nft-details__header">
          <Header
            onButtonClick={() => {
              const wallet = sessionStorage.getItem('@connect');

              return account
                ? mainnetType === MainnetType.Ethereum
                  ? setModalType('purchase')
                  : wallet === 'metamask'
                  ? setModalType('changeNetwork')
                  : setModalType('reconnect')
                : setModalType('selectWallet');
            }}
            purchasedNFT={purchasedNFT}
            mainnetType={mainnetType}
          />
        </article>
        <article className="nft-details__content">
          <article className="nft-details__purchase">
            <Purchase
              userTotalPurchase={nftTotalSupply || 0}
              totalPurchase={54000}
              startTime={moment(
                '2022.07.18 19:00:00 +9:00',
                'YYYY.MM.DD hh:mm:ss Z',
              )}
              endedTime={moment(
                '2022.08.01 19:00:00 +9:00',
                'YYYY.MM.DD hh:mm:ss Z',
              )}
            />
          </article>
          <article className="nft-details__nft-info">
            <NFTInfo
              type={'채권 NFT'}
              principal={10}
              interest={0.3}
              expectedAPY={12}
              overdueAPY={15}
              loanDate={moment('2022.08.01', 'YYYY.MM.DD')}
              maturityDate={moment('2022.11.30', 'YYYY.MM.DD')}
              loanAgreementLink={'https://www.elyfi.world/ko'}
              pledgeAgreementLink={'https://www.elyfi.world/ko'}
              notaryDeedLink={'https://www.elyfi.world/ko'}
            />
          </article>
          <article className="nft-details__bond-nft">
            <BondNFT />
          </article>
          <article className="nft-details__borrower">
            <Borrower
              name={'Elyloan Inc'}
              licenseNumber={'220111-0189192'}
              delinquentTax={'해당없음'}
              defaultingOnDebt={'해당없음'}
              registrationLink={
                'https://ipfs.io/ipfs/bafybeidtfourbfi4oy3nlos4v7vmvn3oyy5ufbtxjdux2gnl3al5pyutsy'
              }
            />
          </article>
          <article className="nft-details__real-estate-info">
            <RealEstateInfo
              assetName={'Norwalk Ave'}
              location={'2046 Norwalk Ave, LA, CA 90041'}
              buildingArea={'6,214 sqft / 1,034 + 350 sqft'}
              assetType={'단독 주택'}
              comment={
                'Eagle Rock은 Occidental College가 위치해 있는 지역으로 근처에 상업거리인 Colorado Blvd가 인접 하여 좋은 입지를 가지고 있습니다.'
              }
            />
          </article>
          <article className="nft-details__news">
            <h2>{t('nftMarket.newsTitle')}</h2>
            <section>
              {newsData.map((data, index) => {
                return (
                  <section key={index}>
                    <img src={data.image} alt="News image" />
                    <b>{data.title}</b>
                    <p>{data.content}</p>
                    <a target="_blank" href={data.link}>
                      {t('nftMarket.newsButton')}
                    </a>
                  </section>
                );
              })}
            </section>
          </article>
        </article>
        <article className="nft-details__terms">
          <b>{t('nftMarket.termsTitle')}</b>
          <ul>
            <li>{t('nftMarket.terms.0')}</li>
            <li>{t('nftMarket.terms.1')}</li>
            <li>{t('nftMarket.terms.2')}</li>
            <li>{t('nftMarket.terms.3')}</li>
            <li>{t('nftMarket.terms.4')}</li>
            <li>{t('nftMarket.terms.5')}</li>
            <li>{t('nftMarket.terms.6')}</li>
            <li>{t('nftMarket.terms.7')}</li>
          </ul>
        </article>
      </main>
    </>
  );
};

export default NFTDetails;
