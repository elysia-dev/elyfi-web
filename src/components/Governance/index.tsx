import {
  lazy,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import axios from 'axios';
import envs from 'src/core/envs';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import useSWR from 'swr';
import {
  bscOnChainQuery,
  onChainBscFetcher,
  onChainFetcher,
} from 'src/clients/OnChainTopic';
import { topicListFetcher } from 'src/clients/OffChainTopic';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import DrawWave from 'src/utiles/drawWave';
import TokenColors from 'src/enums/TokenColors';
import MainnetContext from 'src/contexts/MainnetContext';
import { parseTokenId } from 'src/utiles/parseTokenId';
import CollateralCategory from 'src/enums/CollateralCategory';
import {
  onChainGovernancBsceMiddleware,
  onChainGovernanceMiddleware,
} from 'src/middleware/onChainMiddleware';
import {
  offChainElyIPMiddleware,
  offChainGovernanceMiddleware,
} from 'src/middleware/offChainMiddleware';
import { onChainQuery } from 'src/queries/onChainQuery';
import useReserveData from 'src/hooks/useReserveData';
import ELFISVG from 'src/assets/images/token/ELFI.svg';
import ArrowSVG from 'src/assets/images/governance/arrow.svg';
import SnapShotImg from 'src/assets/images/governance/Snapshot_logo.png';
import priceMiddleware from 'src/middleware/priceMiddleware';
import { pricesFetcher } from 'src/clients/Coingecko';
import Token from 'src/enums/Token';
import {
  formatCommaSmallFourDisits,
  toCompactForBignumber,
} from 'src/utiles/formatters';
import LanguageType from 'src/enums/LanguageType';
import ElfiInfoHeader from './ElfiInfoHeader';
import Questionmark from '../Questionmark';
import useStakingRoundDataV2 from '../Staking/hooks/useStakingRoundDataV2';
import SubHeader from './SubHeader';
import GovernanceItem from './GovernanceItem';

const Header = lazy(() => import('./Header'));
const AssetList = lazy(() => import('src/components/AssetList'));

const Governance = (): JSX.Element => {
  const [pageNumber, setPageNumber] = useState(1);
  const { lng } = useParams<{ lng: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { reserveState, getAssetBondsByNetwork } = useReserveData();
  const { type: mainnetType } = useContext(MainnetContext);
  const assetBondTokens = getAssetBondsByNetwork(mainnetType);
  const [supply, setSupply] = useState(0);
  const { t } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();
  const assetBondTokensBackedByEstate = assetBondTokens
    .filter((product) => {
      const parsedId = parseTokenId(product.id);
      return CollateralCategory.Others !== parsedId.collateralCategory;
    })
    .sort((a, b) => {
      return b.loanStartTimestamp! - a.loanStartTimestamp! >= 0 ? 1 : -1;
    });

  const { totalPrincipal } = useStakingRoundDataV2(Token.ELFI, Token.ELFI);

  const { data: onChainData, isValidating: onChainLoading } = useSWR(
    onChainQuery,
    onChainFetcher,
    {
      use: [onChainGovernanceMiddleware],
    },
  );

  const { data: offChainNapData, isValidating: offChainLoading } = useSWR(
    '/proxy/c/nap/10.json',
    topicListFetcher,
    {
      use: [offChainGovernanceMiddleware],
    },
  );
  const { data: offChainElyIPData, isValidating: offChainElyIPLoading } =
    useSWR('/proxy/c/elyip/14.json', topicListFetcher, {
      use: [offChainElyIPMiddleware],
    });

  const { data: onChainSnapshotData, isValidating: onChainSnapshotLoading } =
    useSWR(
      bscOnChainQuery(
        'elyfi-bsc.eth',
        // process.env.NODE_ENV === 'production' && !process.env.REACT_APP_TEST_MODE
        //   ? 'elyfi-bsc.eth'
        //   : 'test-elyfi-bsc.eth',
      ),
      onChainBscFetcher,
      {
        use: [onChainGovernancBsceMiddleware],
      },
    );
  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );

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

  const viewMoreHandler = useCallback(() => {
    setPageNumber((prev) => prev + 1);
  }, [pageNumber]);

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
    getAssetBondsByNetwork(mainnetType);
  }, [mainnetType, reserveState]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (assetBondTokensBackedByEstate.length === 0) {
        draw();
      }
    }, 3500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    axios.get('https://api.elyfi.world/q/elfiTotalCoins').then((res) => {
      setSupply(res.data);
    });
  });

  return (
    <>
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
      <div className="governance">
        <Suspense fallback={<div style={{ height: 600 }} ref={headerRef} />}>
          <Header headerRef={headerRef} />
        </Suspense>

        <section className="governance__validation governance__header">
          <div>
            {/* <Suspense fallback={<div style={{ height: 30 }} />}> */}
            <SubHeader
              link={'https://forum.elyfi.world/'}
              content={t('governance.data_verification')}
              questionmark={t('governance.guide.offchain')}
              button={t('governance.forum_button')}
            />
            {/* </Suspense> */}
          </div>

          <Suspense fallback={<div style={{ height: 600 }} />}>
            {!offChainElyIPData && !offChainNapData ? (
              <Skeleton width={'100%'} height={600} />
            ) : offChainNapData?.length !== 0 &&
              offChainElyIPData?.length !== 0 ? (
              <div className="governance__grid">
                {offChainNapData &&
                  offChainElyIPData &&
                  offChainNapData
                    .filter((data: any) => data.network === mainnetType)
                    .sort((prev, current) => current.id - prev.id)
                    .map((data: any, index) => {
                      if (data.endedDate) {
                        const elyIPData = offChainElyIPData.sort(
                          (prev, current) => prev.id - current.id,
                        )[offChainElyIPData.length - index - 1];
                        return (
                          <>
                            <GovernanceItem
                              data={data}
                              isSnapshot={false}
                              key={`NAP_${index}`}
                            />
                            {offChainElyIPData &&
                              offChainElyIPData.length === 3 && (
                                <GovernanceItem
                                  data={elyIPData}
                                  isSnapshot={false}
                                  key={`ELYIP_${index}`}
                                />
                              )}
                          </>
                        );
                      }
                      return null;
                    })}
              </div>
            ) : (
              <div className="governance__validation zero">
                <p>{t('governance.offchain_list_zero')}</p>
              </div>
            )}
          </Suspense>
        </section>

        <section className="governance__onchain-vote governance__header">
          <div>
            <SubHeader
              link={t(`governance.link.snapshot`)}
              content={t('governance.on_chain_voting')}
              questionmark={t('governance.guide.onchain')}
              button={t(`governance.onChain_button.snapshot`)}
            />
          </div>

          <Suspense fallback={<div style={{ height: 600 }} />}>
            {/* need refactoring... */}
            {onChainSnapshotLoading && offChainLoading ? (
              <Skeleton width={'100%'} height={600} />
            ) : onChainSnapshotData && onChainSnapshotData.length > 0 ? (
              <div className="governance__grid">
                {onChainSnapshotData.map((data: any, index) => {
                  return (
                    <GovernanceItem
                      data={data}
                      isSnapshot={true}
                      key={`Snapshot_${index}`}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="governance__onchain-vote zero">
                <p>{t('governance.onchain_list_zero')}</p>
              </div>
            )}
          </Suspense>
        </section>
        <section className="governance__elfi== governance__header">
          <div>
            <Suspense fallback={<div style={{ height: 30 }} />}>
              <SubHeader content={t('governance.vote.header')} />
            </Suspense>
          </div>
          <section className="governance__elfi__info">
            <section className="governance__elfi__info__first">
              <ElfiInfoHeader
                index={'01'}
                content={t('governance.vote.first.header')}
                link={'https://coinmarketcap.com/currencies/elyfi/'}
                linkContent={t('governance.vote.first.market')}
                subContent={t('governance.vote.first.content')}
              />
              <section>
                <figure>
                  <img src={ELFISVG} />
                </figure>
                <article>
                  <div>
                    <p>{t('governance.vote.first.price')}</p>
                    <p>${priceData?.elfiPrice}</p>
                  </div>
                  <div>
                    <p>
                      {t('governance.vote.first.totalSupply')}{' '}
                      <span>
                        <Questionmark
                          content={t('governance.vote.first.guide.0')}
                        />
                      </span>
                    </p>
                    <p>100,000,000 ELFI</p>
                  </div>
                  <div>
                    <p>
                      {t('governance.vote.first.totalCirculation')}{' '}
                      <span>
                        <Questionmark
                          content={t('governance.vote.first.guide.1')}
                        />
                      </span>
                    </p>
                    <p>100,000,000 ELFI</p>
                  </div>
                  <div>
                    <p>
                      {t('governance.vote.first.circulatingSupply')}{' '}
                      <span>
                        <Questionmark
                          content={t('governance.vote.first.guide.2')}
                        />
                      </span>
                    </p>
                    <p>
                      {formatCommaSmallFourDisits(supply).split('.')[0]} ELFI
                    </p>
                  </div>
                </article>
              </section>
            </section>
            <section className="governance__elfi__info__second">
              <ElfiInfoHeader
                index={'02'}
                content={t('governance.vote.second.header')}
                link={`/${lng}/staking/ELFI`}
                linkContent={t('governance.vote.second.staking')}
                subContent={t('governance.vote.second.content')}
              />
              <section>
                <article>
                  <div>
                    <p>{t('governance.vote.second.totalStaking')}</p>
                    <p>{toCompactForBignumber(totalPrincipal)} ELFI</p>
                  </div>
                  <div>
                    <p>{t('governance.vote.second.elfiStaker')}</p>
                    <p>29</p>
                  </div>
                </article>
              </section>
            </section>
            <section className="governance__elfi__info__third">
              <ElfiInfoHeader
                index={'03'}
                content={t('governance.vote.third.header')}
                link={
                  lng === LanguageType.KO
                    ? 'https://elysia.gitbook.io/elyfi-user-guide/v/korean-2/governance/governance-faq'
                    : 'https://elysia.gitbook.io/elyfi-user-guide/governance'
                }
                linkContent={t('governance.vote.third.guide')}
                subContent={t('governance.vote.third.content')}
              />
              <section>
                <article>
                  <a
                    href="https://forum.elyfi.world/"
                    rel="noopener noreferer"
                    target="_blank">
                    <div>
                      <img src={ELFISVG} />
                      <p>
                        ELYFI Forum <img src={ArrowSVG} />
                      </p>
                      <p>{t('governance.vote.third.forum')}</p>
                    </div>
                  </a>
                  <a
                    href="https://vote.elyfi.world/#/"
                    rel="noopener noreferer"
                    target="_blank">
                    <div>
                      <img src={SnapShotImg} />
                      <p>
                        Snapshot <img src={ArrowSVG} />
                      </p>
                      <p>{t('governance.vote.third.snapshot')}</p>
                    </div>
                  </a>
                </article>
              </section>
            </section>
          </section>
        </section>
      </div>
    </>
  );
};

export default Governance;
