import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import MediaQuery from 'src/enums/MediaQuery';
import TokenColors from 'src/enums/TokenColors';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import useNavigator from 'src/hooks/useNavigator';
import DrawWave from 'src/utiles/drawWave';
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

import AroundAsset00 from 'src/assets/images/market/aroundAsset00.png';
import AroundAsset01 from 'src/assets/images/market/aroundAsset01.png';
import AroundAsset02 from 'src/assets/images/market/aroundAsset02.png';

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
import Token from 'src/enums/Token';
import RecentActivityType from 'src/enums/RecentActivityType';
import ChangeNetworkModal from '../Market/Modals/ChangeNetworkModal';
import NFTPurchaseModal from '../Market/Modals/NFTPurchaseModal';
import TwitterConfirmModal from '../Market/Modals/TwitterConfirmModal';
import TokenRewardModal from '../Market/Modals/TokenRewardModal';
import SelectWalletModal from '../Market/Modals/SelectWalletModal';
import ReconnectWallet from '../Market/Modals/components/ReconnectWallet';
import NewsCard from './NewsCard';

export interface INews {
  title: string;
  content: string;
  link: string;
  image: string;
}

enum NFTDetailTab {
  ProductInfo,
  RealEstateInfo,
  ProductStructure,
  BorrowerInfo,
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
  const [currentTab, setCurrentTab] = useState(0);

  const current = moment();

  const totalPurchase = 54000;

  const startTime = moment(
    '2022.07.21 20:00:00 +9:00',
    'YYYY.MM.DD hh:mm:ss Z',
  );
  const endedTime = moment(
    '2022.08.04 20:00:00 +9:00',
    'YYYY.MM.DD hh:mm:ss Z',
  );

  const { data: nftTotalSupply, mutate } = useSWR(['nftTotalSupply'], {
    fetcher: nftTotalSupplyFetcher(),
  });

  const newsData: INews[] = [
    {
      title: 'Bloomberg',
      content: 'ELYFI Launches US Real Estate Investment Product',
      link: 'https://www.bloomberg.com/press-releases/2022-07-06/elyfi-launches-us-real-estate-investment-product',
      image: News00,
    },
    {
      title: 'Yahoo finance',
      content: 'ELYFI Launches US Real Estate Investment Product',
      link: 'https://finance.yahoo.com/news/elyfi-launches-us-real-estate-120000334.html?guccounter=1',
      image: News01,
    },
    {
      title: 'Token Post',
      content: '엘리파이, 美 부동산 투자 상품 출시…대출채권 조각 구매 가능',
      link: 'https://www.tokenpost.kr/article-98820',
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
    // const info = await nftContract.uri(1); asset ipfs url
  }, [library, account]);

  const setTabPageViewer = (currentTab: number): JSX.Element => {
    switch (currentTab) {
      case NFTDetailTab.ProductInfo:
      default:
        return (
          <section className="nft-details__nft-info">
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
          </section>
        );
      case NFTDetailTab.RealEstateInfo:
        return (
          <section className="nft-details__real-estate-info">
            <RealEstateInfo
              youtubeLink="zZMusws1Rb8"
              tableInfo={{
                location: '2046 Norwalk Ave, LA, CA 90041',
                locationLink: 'https://naver.com',
                assetType: '단독주택 (single-family house)',
                landArea: '6,214sqft',
                yearOfRemodeling: '2022년',
                buildingArea: '1,384sqft',
                floor: '2층 (3rooms 4baths)',
                estimatedSalesPrice: '$ 1,600,000',
              }}
              assetFeature={{
                title: [
                  'Flipping을 통한 수익률 극대화',
                  '우수한 입지',
                  'No 융자, Low 리스크',
                ],
                content: [
                  '약 175평의 넓은 대지와 뒤뜰을 가지고 있는 2층 단독주택을 최근 리모델링하였고, 이에 높은 수익률이 기대되는 매물입니다.',
                  'Occidental 대학교가 인근에 위치해 있어 배후수요가 탄탄하며, 베버리힐즈, LA코리아타운 등으로 이어지는 교통환경이 우수한 지역으로 입지가 훌륭합니다.',
                  '본 부동산은 대출이 없기 때문에 권리상 어떤 선순위도 존재하지 않습니다.',
                ],
                image: [AroundAsset00, AroundAsset01, AroundAsset02],
              }}
              aroundAssetInfo={[
                {
                  title: 'Crescent St, Los Angeles, CA',
                  image: AroundAsset00,
                  price: '$1,480,000 ~',
                  completion: '1924년',
                  landArea: '1,624sqft',
                },
                {
                  title: 'Minneapolis St, Los Angeles, CA',
                  image: AroundAsset01,
                  price: '$1,485,000 ~',
                  completion: '1952년',
                  landArea: '1,600sqft',
                },
                {
                  title: 'Range View Ave, LA, CA',
                  image: AroundAsset02,
                  price: '$1,695,000 ~',
                  completion: '1909년',
                  landArea: '1,721sqft',
                },
              ]}
            />
          </section>
        );
      case NFTDetailTab.ProductStructure:
        return (
          <section className="nft-details__bond-nft">
            <BondNFT
              link={{
                grantDeed: '',
                ein: '',
                articleOfOrganization: '',
                statementOfInformation: '',
                llcOperationAgreement: '',
                rentalAgreement: '',
                collateralAgreement: '',
              }}
            />
          </section>
        );
      case NFTDetailTab.BorrowerInfo:
        return (
          <section className="nft-details__borrower">
            <Borrower
              name={'Elyloan Inc'}
              licenseNumber={'220111-0189192'}
              delinquentTax={'해당없음'}
              defaultingOnDebt={'해당없음'}
              registrationLink={
                'https://ipfs.io/ipfs/bafybeidtfourbfi4oy3nlos4v7vmvn3oyy5ufbtxjdux2gnl3al5pyutsy'
              }
            />
          </section>
        );
    }
  };

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
          remainingNFT={totalPurchase - (nftTotalSupply || 0)}
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
      ) : modalType === 'twitter' ? (
        <TwitterConfirmModal
          endedTime={endedTime}
          onClose={() => setModalType('')}
          onSubmit={() => {}}
          onDiscard={() => {}}
        />
      ) : modalType === 'tokenReward' ? (
        <TokenRewardModal
          endedTime={endedTime}
          onClose={() => setModalType('')}
          tokenAmount={1234}
          tokenName={Token.ELFI}
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
      <main className="nft-details" ref={headerRef}>
        <div className="component__text-navigation">
          <p onClick={() => navigate(`/${lng}/market`)} className="pointer">
            {t('navigation.market')}
          </p>
          &nbsp;&gt;&nbsp;
          <p>{t('nftMarket.title')}</p>
        </div>
        <Link
          className="nft-details__guide"
          to={{
            pathname: `/${lng}/faq`,
          }}>
          {t('nftMarket.guide')}
        </Link>
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
            isDisabled={
              !current.isBetween(startTime, endedTime) ||
              totalPurchase <= (nftTotalSupply || 0)
            }
            mainnetType={mainnetType}
          />
        </article>
        <article className="nft-details__purchase">
          <Purchase
            userTotalPurchase={nftTotalSupply || 0}
            totalPurchase={totalPurchase}
            startTime={startTime}
            endedTime={endedTime}
          />
        </article>
        <article className="nft-details__content">
          <article className="nft-details__product-point">
            <h2>{t(`nftMarket.productPointTitle`)}</h2>
            <div>
              {[News02, News02, News02, News02, News02, News02].map(
                (image, index) => {
                  return (
                    <div>
                      <h3>{t(`nftMarket.productPoint.title.${index}`)}</h3>
                      <p>
                        {t(`nftMarket.productPoint.content.${index}`, {
                          percent: 12,
                        })}
                      </p>
                    </div>
                  );
                },
              )}
            </div>
          </article>
          <article>
            <section className="nft-details__tab">
              {['상품정보', '미국부동산정보', '상품구조', '차입자정보'].map(
                (data, index) => {
                  console.log(index);
                  return (
                    <div
                      className={currentTab === index ? '' : 'disable'}
                      onClick={() => setCurrentTab(index)}>
                      <b>{data}</b>
                    </div>
                  );
                },
              )}
            </section>
            <section>{setTabPageViewer(currentTab)}</section>
          </article>

          <article className="nft-details__news">
            <h2>{t('nftMarket.newsTitle')}</h2>
            <section>
              {newsData.map((data, index) => {
                return <NewsCard data={data} index={index} />;
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
