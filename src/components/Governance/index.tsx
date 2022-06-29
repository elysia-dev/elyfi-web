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
import moment from 'moment';
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
import TimeSVG from 'src/assets/images/governance/time.svg';
import ELFISVG from 'src/assets/images/token/ELFI.svg';
import ArrowSVG from 'src/assets/images/governance/arrow.svg';
import SnapShotImg from 'src/assets/images/governance/Snapshot_logo.png';
import priceMiddleware from 'src/middleware/priceMiddleware';
import { pricesFetcher } from 'src/clients/Coingecko';
import Token from 'src/enums/Token';
import {
  formatCommaSmallFourDisits,
  toCompact,
  toCompactForBignumber,
} from 'src/utiles/formatters';
import LanguageType from 'src/enums/LanguageType';
import ElfiInfoHeader from './ElfiInfoHeader';
import Questionmark from '../Questionmark';
import useStakingRoundDataV2 from '../Staking/hooks/useStakingRoundDataV2';

const OffchainHeader = lazy(() => import('./OffchainHeader'));
const OnchainHeader = lazy(() => import('./OnchainHeader'));
const Header = lazy(() => import('./Header'));
const OffChainContainer = lazy(
  () => import('src/components/Governance/OffchainContainer'),
);
const OnchainContainer = lazy(
  () => import('src/components/Governance/OnchainContainer'),
);
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
            <Suspense fallback={<div style={{ height: 30 }} />}>
              <OffchainHeader
                mainnetType={mainnetType}
                offChainNapData={offChainNapData}
                mediaQuery={mediaQuery}
              />
            </Suspense>
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
                            <a
                              href={data.link}
                              rel="noopener noreferer"
                              target="_blank">
                              <article key={`NAP_${index}`}>
                                <header>
                                  <p>{data.nap}</p>
                                </header>
                                <section>
                                  <p>{data.title}</p>
                                  <p>{data.summary}</p>
                                </section>
                                <div>
                                  {data.endedDate &&
                                    moment().isBefore(data.endedDate) && (
                                      <>
                                        <img src={TimeSVG} />
                                        &nbsp;
                                        <p>
                                          {moment
                                            .duration(
                                              moment().diff(data.endedDate),
                                            )
                                            .hours() * -1}{' '}
                                          hours{' '}
                                          {moment
                                            .duration(
                                              moment().diff(data.endedDate),
                                            )
                                            .minutes() * -1}{' '}
                                          minutes left
                                        </p>
                                      </>
                                    )}
                                  <div>
                                    <div
                                      style={{
                                        backgroundColor: moment().isBefore(
                                          data.endedDate,
                                        )
                                          ? '#57b275'
                                          : '#7346E4',
                                      }}
                                    />
                                    <p>
                                      &nbsp;
                                      {moment().isBefore(data.endedDate)
                                        ? `Active`
                                        : `Closed`}
                                    </p>
                                  </div>
                                </div>
                              </article>
                            </a>
                            {offChainElyIPData &&
                              offChainElyIPData.length === 3 && (
                                <a
                                  href={elyIPData.link}
                                  rel="noopener noreferer"
                                  target="_blank">
                                  <article key={`ELYIP_${index}`}>
                                    <header className="ELYIP">
                                      <p>{elyIPData.nap}</p>
                                    </header>
                                    <section>
                                      <p>{elyIPData.title}</p>
                                      <p>{elyIPData.summary}</p>
                                    </section>
                                    <div>
                                      {elyIPData.endedDate &&
                                        moment().isBefore(
                                          elyIPData.endedDate,
                                        ) && (
                                          <>
                                            <img src={TimeSVG} />
                                            <p>
                                              {moment
                                                .duration(
                                                  moment().diff(
                                                    elyIPData.endedDate,
                                                  ),
                                                )
                                                .hours() * -1}{' '}
                                              hours{' '}
                                              {moment
                                                .duration(
                                                  moment().diff(
                                                    elyIPData.endedDate,
                                                  ),
                                                )
                                                .minutes() * -1}{' '}
                                              minutes left
                                            </p>
                                          </>
                                        )}
                                      <div>
                                        <div
                                          style={{
                                            backgroundColor: moment().isBefore(
                                              elyIPData.endedDate,
                                            )
                                              ? '#57b275'
                                              : '#7346E4',
                                          }}
                                        />
                                        <p>
                                          &nbsp;
                                          {moment().isBefore(
                                            elyIPData.endedDate,
                                          )
                                            ? `Active`
                                            : `Closed`}
                                        </p>
                                      </div>
                                    </div>
                                  </article>
                                </a>
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
            <Suspense fallback={<div style={{ height: 50 }} />}>
              <OnchainHeader
                mainnetType={mainnetType}
                onChainData={onChainData}
                onChainSnapshotData={onChainSnapshotData}
                mediaQuery={mediaQuery}
              />
            </Suspense>
          </div>

          <Suspense fallback={<div style={{ height: 600 }} />}>
            {/* need refactoring... */}
            {onChainSnapshotLoading && offChainLoading ? (
              <Skeleton width={'100%'} height={600} />
            ) : onChainSnapshotData && onChainSnapshotData.length > 0 ? (
              <div className="governance__grid">
                {onChainSnapshotData.map((data: any) => {
                  const endedAt = moment.unix(data.timestamp).format();
                  return (
                    <a
                      href={`https://snapshot.org/#/elyfi-bsc.eth/proposal/${data.id}`}
                      rel="noopener noreferer"
                      target="_blank">
                      <article>
                        <header>
                          <p>{data.data.description}</p>
                        </header>
                        <section>
                          <p>{data.title}</p>
                          <p>{data.summary}</p>
                        </section>
                        <div>
                          {moment().isBefore(endedAt) && (
                            <>
                              <img src={TimeSVG} />
                              &nbsp;
                              <p>
                                {`${
                                  moment
                                    .duration(moment().diff(endedAt))
                                    .hours() * -1
                                } hours ${
                                  moment
                                    .duration(moment().diff(endedAt))
                                    .minutes() * -1
                                } minutes left`}
                              </p>
                            </>
                          )}
                          <div>
                            <div
                              style={{
                                backgroundColor: moment().isBefore(endedAt)
                                  ? '#57b275'
                                  : '#7346E4',
                              }}
                            />
                            <p>
                              &nbsp;
                              {moment().isBefore(endedAt) ? `Active` : `Closed`}
                            </p>
                          </div>
                        </div>
                      </article>
                    </a>
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
              <ElfiInfoHeader
                mainnetType={mainnetType}
                offChainNapData={offChainNapData}
                mediaQuery={mediaQuery}
              />
            </Suspense>
          </div>
          <section className="governance__elfi__info">
            <section className="governance__elfi__info__first">
              <header>
                <div>
                  <span>
                    <strong>01</strong>
                  </span>
                  <strong>{t('governance.vote.first.header')}</strong>
                  <a
                    href="https://coinmarketcap.com/currencies/elyfi/"
                    rel="noopener noreferer"
                    target="_blank">
                    <p>{t('governance.vote.first.market')}</p>
                  </a>
                </div>
                <p>{t('governance.vote.first.content')}</p>
              </header>
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
              <header>
                <div>
                  <span>
                    <strong>02</strong>
                  </span>
                  <strong>{t('governance.vote.second.header')}</strong>
                  <a
                    href={`/${lng}/staking/ELFI`}
                    rel="noopener noreferer"
                    target="_blank">
                    <p>{t('governance.vote.second.staking')}</p>
                  </a>
                </div>
                <p>{t('governance.vote.second.content')}</p>
              </header>
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
              {/* <header>
                <span>
                  <strong>03</strong>
                </span>
                <strong>{t('governance.vote.third.header')}</strong>
                <p>{t('governance.vote.third.content')}</p>
              </header> */}
              <header>
                <div>
                  <span>
                    <strong>03</strong>
                  </span>
                  <strong>{t('governance.vote.third.header')}</strong>
                  <a
                    href={
                      lng === LanguageType.KO
                        ? 'https://elysia.gitbook.io/elyfi-user-guide/v/korean-2/governance/governance-faq'
                        : 'https://elysia.gitbook.io/elyfi-user-guide/governance'
                    }
                    rel="noopener noreferer"
                    target="_blank">
                    <p>{t('governance.vote.third.guide')}</p>
                  </a>
                </div>
                <p>{t('governance.vote.third.content')}</p>
              </header>
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

        {/* <section className="governance__loan governance__header">
          <Suspense fallback={<div style={{ height: 300 }} />}>
            <div>
              <div>
                <h3>
                  {t('governance.loan_list', {
                    count: assetBondTokensBackedByEstate
                      ? assetBondTokensBackedByEstate.length
                      : 0,
                  })}
                </h3>
              </div>
              <p>{t('governance.loan_list__content')}</p>
            </div>
            <>
              {assetBondTokensBackedByEstate.length === 0 ? (
                isAssetList ? (
                  <div className="loan__list--null">
                    <p>{t('loan.loan_list--null')}</p>
                  </div>
                ) : (
                  <Skeleton width={'100%'} height={300} />
                )
              ) : (
                <>
                  <AssetList
                    prevRoute={'governance'}
                    assetBondTokens={
                      [...(assetBondTokensBackedByEstate || [])].slice(
                        0,
                        pageNumber * defaultShowingLoanData,
                      ) || []
                    }
                  />
                  {assetBondTokensBackedByEstate &&
                    assetBondTokensBackedByEstate.length >=
                      pageNumber * defaultShowingLoanData && (
                      <div>
                        <button
                          className="portfolio__view-button"
                          onClick={() => viewMoreHandler()}>
                          {t('loan.view-more')}
                        </button>
                      </div>
                    )}
                </>
              )}
            </>
          </Suspense>
        </section> */}
      </div>
    </>
  );
};

export default Governance;
