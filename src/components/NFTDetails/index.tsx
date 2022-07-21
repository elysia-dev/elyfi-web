import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Trans, useTranslation } from 'react-i18next';
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

import AssetImage00 from 'src/assets/images/market/assetImage00.png';
import AssetImage01 from 'src/assets/images/market/assetImage01.png';
import AssetImage02 from 'src/assets/images/market/assetImage02.png';

import AroundAsset00 from 'src/assets/images/market/aroundAsset00.png';
import AroundAsset01 from 'src/assets/images/market/aroundAsset01.png';
import AroundAsset02 from 'src/assets/images/market/aroundAsset02.png';

import MainnetContext from 'src/contexts/MainnetContext';
import { useWeb3React } from '@web3-react/core';
import useUserCryptoBalances from 'src/hooks/useUserCryptoBalances';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import envs from 'src/core/envs';
import {
  getNFTContract,
  nftTotalSupplyFetcher,
} from 'src/clients/BalancesFetcher';
import { utils } from 'ethers';
import TxContext from 'src/contexts/TxContext';
import TxStatus from 'src/enums/TxStatus';
import useSWR from 'swr';
import ProductPoint00 from 'src/assets/images/market/productPoint00.svg';
import ProductPoint01 from 'src/assets/images/market/productPoint01.svg';
import ProductPoint02 from 'src/assets/images/market/productPoint02.svg';
import ProductPoint03 from 'src/assets/images/market/productPoint03.svg';
import ProductPoint04 from 'src/assets/images/market/productPoint04.svg';
import ProductPoint05 from 'src/assets/images/market/productPoint05.svg';
import advanceReservation from 'src/utiles/advanceReservation';
import { JsonRpcProvider } from '@ethersproject/providers';
import RecentActivityType from 'src/enums/RecentActivityType';
import NewTab from 'src/assets/images/market/new_tab.png';
import ChangeNetworkModal from '../Market/Modals/ChangeNetworkModal';
import NFTPurchaseModal from '../Market/Modals/NFTPurchaseModal';
import TwitterConfirmModal from '../Market/Modals/TwitterConfirmModal';
import TokenRewardModal from '../Market/Modals/TokenRewardModal';
import SelectWalletModal from '../Market/Modals/SelectWalletModal';
import ReconnectWallet from '../Market/Modals/components/ReconnectWallet';
import NewsCard from './NewsCard';
import Guide from './Guide';

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
export type NFTType = {
  'collateral Info': {
    type: string;
    link: string;
  }[];
  attributes: { trait_type: string; value: string }[];
  image: string;
};

const provider = new JsonRpcProvider(process.env.REACT_APP_JSON_RPC);

const NFTDetails = (): JSX.Element => {
  const { account, deactivate, library } = useWeb3React();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { value: mediaQuery } = useMediaQueryType();
  const { t } = useTranslation();
  const navigate = useNavigator();
  const { lng } = useParams<{ lng: string }>();
  const { id } = useParams<{ id: string }>();
  const [modalType, setModalType] = useState('');
  const { type: mainnetType, changeMainnet } = useContext(MainnetContext);
  const { txType, txStatus } = useContext(TxContext);
  const { balances } = useUserCryptoBalances();
  const [currentTab, setCurrentTab] = useState(0);

  const [purchasedNFT, setPurchasedNFT] = useState<number | undefined>();
  const [nftInfo, setNftInfo] = useState<NFTType | undefined>();
  const current = moment();
  const openSeaLink = (i: number) =>
    `https://opensea.io/assets/ethereum/${envs.market.nftAddress}/${i}`;
  const etherscanLink = `https://etherscan.io/address/${envs.market.controllerAddress}`;

  const totalPurchase = 54000;

  const startTime = moment(
    '2022.07.21 17:00:00 +9:00',
    'YYYY.MM.DD hh:mm:ss Z',
  );
  const endedTime = moment(
    '2022.08.05 20:00:00 +9:00',
    'YYYY.MM.DD hh:mm:ss Z',
  );

  const { data: nftTotalSupply, mutate } = useSWR(['nftTotalSupply'], {
    fetcher: nftTotalSupplyFetcher(),
  });
  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );

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
      link: 'https://finance.yahoo.com/news/elyfi-launches-us-real-estate-120000334.html',
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
    new DrawWave(ctx, browserWidth).drawOnNFTDetailPages(
      headerY,
      TokenColors.ELFI,
      browserHeight,
      true,
    );
  };

  const purchaseButtonAction = () => {
    const wallet = sessionStorage.getItem('@connect');

    return account
      ? mainnetType === MainnetType.Ethereum
        ? setModalType('purchase')
        : wallet === 'metamask'
        ? setModalType('changeNetwork')
        : setModalType('reconnect')
      : setModalType('selectWallet');
  };

  const purchaseButtonDisable = useMemo(() => {
    return current.isBetween(
      moment(startTime).subtract(1, 'hours').format('YYYY.MM.DD HH:mm:ss'),
      endedTime,
    )
      ? (advanceReservation.includes(account || '') ||
          current.isBetween(startTime, endedTime)) &&
          totalPurchase > (nftTotalSupply || 0)
      : false;
  }, [nftTotalSupply, current, totalPurchase]);

  const getPurchasedNFT = useCallback(async () => {
    try {
      const nftContract = getNFTContract(library.getSigner());
      const count = await nftContract.balanceOf(account, 0);
      setPurchasedNFT(parseInt(utils.formatUnits(count, 0), 10));
    } catch (error) {
      console.log(error);
      setPurchasedNFT(0);
    }
  }, [library, account]);

  const getUrl = async () => {
    // const nftContract = getNFTContract(provider);
    // const info = await nftContract.uri(0);
    // console.log(info);
    // axios
    //   .get(`https://slate.textile.io/ipfs/${info.split(/ipfs:\/\//)[1]}`)
    //   .then((res) => {
    //     console.log(res.data);
    //     setNftInfo(res.data);
    //   });
  };

  useEffect(() => {
    id !== '0' && navigate(`/${lng}/market`);
  });

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
      if (localStorage.getItem(`@event${account}`) === account) {
        return;
      }
      setModalType('twitter');
      getPurchasedNFT();
      mutate();
    }

    return () => {
      clearTimeout(
        setTimeout(() => {
          setModalType('twitter');
        }, 3000),
      );
    };
  }, [txStatus, txType]);

  useEffect(() => {
    getUrl();
  }, []);

  const setTabPageViewer = (currentTab: number): JSX.Element => {
    switch (currentTab) {
      case NFTDetailTab.ProductInfo:
      default:
        return (
          <section className="nft-details__nft-info">
            <NFTInfo
              type={t('market.nftType.0')}
              interest={0.3}
              nftInfo={nftInfo}
            />
          </section>
        );
      case NFTDetailTab.RealEstateInfo:
        return (
          <section className="nft-details__real-estate-info">
            <RealEstateInfo
              youtubeLink="brUfVSkMFNY"
              tableInfo={{
                location: '2046 Norwalk Ave, LA, CA 90041',
                locationLink:
                  'https://www.google.com/maps/place/2046%20Norwalk%20Ave,%20LA,%20CA%2090041',
                assetType: t('nftMarket.realEstateInfoData.0'),
                landArea: '6,214sqft',
                yearOfRemodeling: t('nftMarket.realEstateInfoData.1', {
                  year: 2022,
                }),
                buildingArea: '1,384sqft',
                floor: t('nftMarket.realEstateInfoData.2'),
                estimatedSalesPrice: '$ 1,600,000',
              }}
              assetFeature={{
                title: [
                  t('nftMarket.realEstateFeatureContent.title.0'),
                  t('nftMarket.realEstateFeatureContent.title.1'),
                  t('nftMarket.realEstateFeatureContent.title.2'),
                ],
                content: [
                  t('nftMarket.realEstateFeatureContent.content.0'),
                  t('nftMarket.realEstateFeatureContent.content.1'),
                  t('nftMarket.realEstateFeatureContent.content.2'),
                ],
                image: [
                  'https://elysia.mypinata.cloud/ipfs/QmayBV1Vvakd15hFsUdrG6sj5Wztm4G94gagbJwX3MNKSt',
                  'https://elysia.mypinata.cloud/ipfs/QmdHKQU8fbJpGvcrkSC7kr4MPTbJL5PJn52nCDuSK9pWnZ',
                  'https://elysia.mypinata.cloud/ipfs/Qma5rzz3EdgkqkuaCSDca7UG8BSnxMuvA5YFasLDHbWr4U',
                ],
              }}
              aroundAssetInfo={[
                {
                  title: 'Crescent St, LA, CA',
                  image: AroundAsset00,
                  price: '$1,480,000 ~',
                  completion: t('nftMarket.realEstateInfoData.1', {
                    year: 1924,
                  }),
                  landArea: '1,624sqft',
                },
                {
                  title: 'Minneapolis St, LA, CA',
                  image: AroundAsset01,
                  price: '$1,485,000 ~',
                  completion: t('nftMarket.realEstateInfoData.1', {
                    year: 1952,
                  }),
                  landArea: '1,600sqft',
                },
                {
                  title: 'Range View Ave, LA, CA',
                  image: AroundAsset02,
                  price: '$1,695,000 ~',
                  completion: t('nftMarket.realEstateInfoData.1', {
                    year: 1909,
                  }),
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
              location="2046 Norwalk Ave, LA, CA 90041"
              link={{
                grantDeed: t('nftMarket.document.grantDeed'),
                ein: t('nftMarket.document.ein'),
                articleOfOrganization: t(
                  'nftMarket.document.articlesOfOrganization',
                ),
                statementOfInformation: t(
                  'nftMarket.document.statementOfInformation',
                ),
                llcOperationAgreement: t(
                  'nftMarket.document.llcOperatingAgreement',
                ),
                rentalAgreement: t('nftMarket.document.rentalAgreement'),
                collateralAgreement: t(
                  'nftMarket.document.collateralAgreement',
                ),
              }}
            />
          </section>
        );
      case NFTDetailTab.BorrowerInfo:
        return (
          <section className="nft-details__borrower">
            <Borrower
              name={t('nftMarket.borrowerTable.data.0')}
              licenseNumber={'220111-0189192'}
              registrationLink={
                'https://elysia.mypinata.cloud/ipfs/QmR6qCLFtsE4bDZdhEpejPCJNo44vV1cLgZKgTtNW1fh3G'
              }
            />
          </section>
        );
    }
  };

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
          onClose={() => {
            setModalType('');
            localStorage.setItem(
              `@eventclose${account}`,
              account ? account : '',
            );
          }}
          onSubmit={() => {
            setModalType('tokenReward');
            localStorage.removeItem(`@event${account}`);
            localStorage.removeItem(`@eventclose${account}`);
            window.open(
              'https://twitter.com/intent/tweet?url=https%3A%2F%2Fwww.elyfi.world%2Fko&text=ELYFI[…]%EB%A6%AC%ED%8C%8C%EC%9D%B4,ELFI,%EB%B6%80%EB%8F%99%EC%82%B0,PF',
            );
          }}
          onDiscard={() => {
            localStorage.setItem(`@event${account}`, account ? account : '');
            setModalType('');
          }}
        />
      ) : modalType === 'tokenReward' ? (
        <TokenRewardModal
          endedTime={endedTime}
          onClose={() => setModalType('')}
          tokenAmount={purchasedNFT ? (purchasedNFT * 10 * 0.01) / 0.01858 : 0}
          tokenName={'ELFI'}
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
        {/* <Link
          className="nft-details__guide pc-only"
          to={{
            pathname: `/${lng}/market/guide`,
          }}>
          {t('nftMarket.guide')}
        </Link> */}
        <article className="nft-details__header" ref={headerRef}>
          <Header
            onButtonClick={purchaseButtonAction}
            purchasedNFT={purchasedNFT}
            isDisabled={purchaseButtonDisable}
            mainnetType={mainnetType}
            openseaLink={openSeaLink(0)}
          />
        </article>
        <article className="nft-details__purchase">
          <Purchase
            userTotalPurchase={nftTotalSupply || 0}
            totalPurchase={totalPurchase}
            startTime={startTime}
            endedTime={endedTime}
            etherscanLink={etherscanLink}
          />
        </article>
        <article className="nft-details__content">
          <article className="nft-details__product-point">
            <h2>{t(`nftMarket.productPointTitle`)}</h2>
            <div>
              {[
                ProductPoint00,
                ProductPoint01,
                ProductPoint02,
                ProductPoint03,
                ProductPoint04,
                ProductPoint05,
              ].map((image, index) => {
                return (
                  <section>
                    <img src={image} alt="product image" />
                    <div>
                      <h3>{t(`nftMarket.productPoint.title.${index}`)}</h3>
                      <p>
                        {t(`nftMarket.productPoint.content.${index}`, {
                          percent: 12,
                        })}
                      </p>
                    </div>
                  </section>
                );
              })}
            </div>
          </article>
          <article className="nft-details__tab__wrapper">
            <div>
              <h2>{t('nftMarket.productDetail')}</h2>
              <a href={openSeaLink(0)} target="_blank">
                <img src={NewTab} alt="new tab icon" />
              </a>
            </div>
            <section className="nft-details__tab">
              {[
                t('nftMarket.nftInfo'),
                t('nftMarket.realEstateInfo'),
                t('nftMarket.bondNft'),
                t('nftMarket.borrower'),
              ].map((data, index) => {
                return (
                  <div
                    className={currentTab === index ? '' : 'disable'}
                    onClick={() => setCurrentTab(index)}>
                    <b>{data}</b>
                  </div>
                );
              })}
            </section>
            <section>{setTabPageViewer(currentTab)}</section>
          </article>
          <article className="nft-details__faq">
            <div>
              <h2>{t('nftMarket.question.0')}</h2>
              <Link
                to={{
                  pathname: `/${lng}/faq`,
                }}>
                {t('nftMarket.viewMore')}
              </Link>
            </div>
            <Guide />
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
            <li>
              <Trans i18nKey={'nftMarket.terms.2'}>
                text
                <u>
                  <a
                    target="_blank"
                    href={openSeaLink(0)}
                    style={{ color: '#00bfff' }}>
                    link
                  </a>
                </u>
              </Trans>
            </li>
            <li>{t('nftMarket.terms.3')}</li>
            <li>{t('nftMarket.terms.4')}</li>
            <li>{t('nftMarket.terms.5')}</li>
            <li>{t('nftMarket.terms.6')}</li>
            <li>{t('nftMarket.terms.7')}</li>
            <li>{t('nftMarket.terms.8')}</li>
          </ul>
          <div>
            <button
              onClick={purchaseButtonAction}
              className={purchaseButtonDisable ? '' : 'disabled'}>
              {t('nftMarket.purchase')}
            </button>
          </div>
        </article>
      </main>
    </>
  );
};

export default NFTDetails;
