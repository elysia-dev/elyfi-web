import { lazy, Suspense, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
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
import MainnetType from 'src/enums/MainnetType';
import { parseTokenId } from 'src/utiles/parseTokenId';
import CollateralCategory from 'src/enums/CollateralCategory';
import {
  onChainGovernancBsceMiddleware,
  onChainGovernanceMiddleware,
} from 'src/middleware/onChainMiddleware';
import { offChainGovernanceMiddleware } from 'src/middleware/offChainMiddleware';
import { onChainQuery } from 'src/queries/onChainQuery';
import useReserveData from 'src/hooks/useReserveData';
import { IAssetBond } from 'src/core/types/reserveSubgraph';
import FallbackSkeleton from 'src/utiles/FallbackSkeleton';

const OffchainHeader = lazy(() => import('src/components/OffchainHeader'))
const OnchainHeader = lazy(() => import('src/components/OnchainHeader'));
const Header = lazy(() => import('src/components/GovernanceHeader'));
const OffChainContainer = lazy(() => import('src/components/OffchainContainer'));
const OnchainContainer = lazy(() => import('src/components/OnchainContainer'));
const AssetList = lazy(() => import('src/containers/AssetList'));

const Governance = (): JSX.Element => {
  const [pageNumber, setPageNumber] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { reserveState, getAssetBondsByNetwork } = useReserveData();
  const { type: mainnetType } = useContext(MainnetContext);
  const assetBondTokens = getAssetBondsByNetwork(mainnetType);
  const { t } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();
  const defaultShowingLoanData = mediaQuery === MediaQuery.Mobile ? 8 : 9;
  const [isAssetList, setIsAssetList] = useState(false);
  const assetBondTokensBackedByEstate = assetBondTokens.filter((product) => {
    const parsedId = parseTokenId(product.id);
    return CollateralCategory.Others !== parsedId.collateralCategory;
  });

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

  const { data: onChainBscData, isValidating: onChainBscLoading } = useSWR(
    bscOnChainQuery(
      process.env.NODE_ENV === 'production' && !process.env.REACT_APP_TEST_MODE
        ? 'elyfi-bsc.eth'
        : 'test-elyfi-bsc.eth',
    ),
    onChainBscFetcher,
    {
      use: [onChainGovernancBsceMiddleware],
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
        setIsAssetList(true);
        draw();
      }
    }, 3500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

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
        <Suspense fallback={<Skeleton width={"100%"} height={400} />}>
          <Header headerRef={headerRef} />
        </Suspense>

        <section className="governance__validation governance__header">
          <div>
            <Suspense fallback={<Skeleton width={"100%"} height={50} />}>
              <OffchainHeader 
                mainnetType={mainnetType} 
                offChainNapData={offChainNapData} 
                mediaQuery={mediaQuery} 
              />
            </Suspense>
          </div>

          <Suspense fallback={<Skeleton width={"100%"} height={400} />}>
            {offChainLoading ? (
              <Skeleton width={'100%'} height={600} />
            ) : offChainNapData &&
              offChainNapData
                .filter((data: any) => data.network === mainnetType)
                .filter((data: any) => moment().isBefore(data.endedDate)).length >
                0 ? (
              <div className="governance__grid">
                {offChainNapData &&
                  offChainNapData
                    .filter((data: any) => data.network === mainnetType)
                    .map((data: any) => {
                      if (data.endedDate && moment().isBefore(data.endedDate)) {
                        return <OffChainContainer data={data} />;
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
          <Suspense fallback={<Skeleton width={"100%"} height={50} />}>
            <OnchainHeader 
              mainnetType={mainnetType} 
              onChainData={onChainData}
              onChainBscData={onChainBscData}
              mediaQuery={mediaQuery} 
            />
          </Suspense>

          <Suspense fallback={<Skeleton width={"100%"} height={400} />}>
            {/* need refactoring... */}
            {mainnetType === MainnetType.Ethereum ? (
              onChainLoading ? (
                <Skeleton width={'100%'} height={600} />
              ) : onChainData && onChainData.length > 0 ? (
                <div className="governance__grid">
                  {onChainData.map((data: any) => {
                    return <OnchainContainer data={data} offChainNapData={offChainNapData} />;
                  })}
                </div>
              ) : (
                <div className="governance__onchain-vote zero">
                  <p>{t('governance.onchain_list_zero')}</p>
                </div>
              )
            ) : onChainBscLoading ? (
              <Skeleton width={'100%'} height={600} />
            ) : onChainBscData && onChainBscData.length > 0 ? (
              <div className="governance__grid">
                {onChainBscData.map((data: any) => {
                  return <OnchainContainer data={data} offChainNapData={offChainNapData} />
                })}
              </div>
            ) : (
              <div className="governance__onchain-vote zero">
                <p>{t('governance.onchain_list_zero')}</p>
              </div>
            )}
          </Suspense>
        </section>

        <section className="governance__loan governance__header">
          <Suspense fallback={<FallbackSkeleton />}>
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
                    assetBondTokens={
                      /* Tricky : javascript의 sort는 mutuable이라 아래와 같이 복사 후 진행해야한다. */
                      [
                        ...((assetBondTokensBackedByEstate as IAssetBond[]) ||
                          []),
                      ]
                        .slice(0, pageNumber * defaultShowingLoanData)
                        .sort((a, b) => {
                          return b.loanStartTimestamp! -
                            a.loanStartTimestamp! >=
                            0
                            ? 1
                            : -1;
                        }) || []
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
        </section>
      </div>
    </>
  );
};

export default Governance;
