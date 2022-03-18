import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import TempAssets from 'src/assets/images/temp_assets.png';
import Skeleton from 'react-loading-skeleton';
import { useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';
import { utils } from 'ethers';
import moment from 'moment';
import reactGA from 'react-ga';
import useSWR from 'swr';

import {
  bscOnChainQuery,
  IProposals,
  onChainBscFetcher,
  onChainFetcher,
} from 'src/clients/OnChainTopic';
import { INapData, topicListFetcher } from 'src/clients/OffChainTopic';
import AssetList from 'src/containers/AssetList';
import GovernanceGuideBox from 'src/components/GovernanceGuideBox';
import LanguageType from 'src/enums/LanguageType';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import PageEventType from 'src/enums/PageEventType';
import ButtonEventType from 'src/enums/ButtonEventType';
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

const Governance = (): JSX.Element => {
  const [pageNumber, setPageNumber] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { reserveState, getAssetBondsByNetwork } = useReserveData();
  const { type: mainnetType } = useContext(MainnetContext);
  const assetBondTokens = getAssetBondsByNetwork(mainnetType);
  const { t } = useTranslation();
  const History = useHistory();
  const { value: mediaQuery } = useMediaQueryType();
  const { lng } = useParams<{ lng: string }>();
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
    if (mediaQuery === MediaQuery.Mobile) {
      new DrawWave(ctx, browserWidth).drawMobileOnPages(
        headerY,
        TokenColors.ELFI,
        browserHeight,
        true,
      );
      return;
    }
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

  const offChainContainer = (data: INapData) => {
    return (
      <div
        className="governance__validation__assets governance__asset"
        onClick={() => {
          reactGA.event({
            category: PageEventType.MoveToExternalPage,
            action: ButtonEventType.OffChainVoteButtonOnGovernance,
          });
          window.open(data.link);
        }}>
        <div>
          <img src={`https://${data.images}`} />
        </div>
        <div>
          <div className="governance__asset__nap">
            <p>NAP# :&nbsp;</p>
            <p>{data.nap}</p>
          </div>
          <div className="governance__asset__status">
            <p>{t('governance.status')} :&nbsp;</p>
            <p>{data.status}</p>
          </div>
          <div>
            {data.votes.map((vote, _x) => {
              return (
                <div>
                  <h2>{vote.html}</h2>
                  <progress
                    className={`governance__asset__progress-bar index-${_x}`}
                    value={vote.votes}
                    max={data.totalVoters}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const onChainConatainer = (data: IProposals) => {
    return (
      <div
        className="governance__onchain-vote__assets governance__asset"
        onClick={() => {
          reactGA.event({
            category: PageEventType.MoveToExternalPage,
            action: ButtonEventType.OnChainVoteButtonOnGovernance,
          });
          mainnetType === MainnetType.BSC
            ? window.open(
                `https://snapshot.org/#/elyfi-bsc.eth/proposal/${data.id}`,
              )
            : window.open(`${t('governance.link.tally')}/proposal/${data.id}`);
        }}>
        <div>
          <img
            src={
              offChainNapData &&
              offChainNapData.filter((offChainData: any) => {
                return offChainData.nap.substring(1) === data.data.description;
              })[0]?.images
                ? 'https://' +
                  offChainNapData.filter((offChainData: any) => {
                    return (
                      offChainData.nap.substring(1) === data.data.description
                    );
                  })[0]?.images
                : TempAssets
            }
          />
        </div>
        <div>
          <div className="governance__nap">
            <p>NAP# :&nbsp;</p>
            <p>{data.data.description}</p>
          </div>
          <div className="governance__status">
            <p>{t('governance.status')} :&nbsp;</p>
            <p>{data.status}</p>
          </div>
          <div>
            <div>
              <h2>For</h2>
              <progress
                className="governance__asset__progress-bar index-0"
                value={
                  data.totalVotesCastInSupport
                    ? typeof data.totalVotesCastInSupport === 'number'
                      ? data.totalVotesCastInSupport
                      : parseFloat(
                          utils.formatEther(data.totalVotesCastInSupport),
                        )
                    : 0
                }
                max={
                  data.totalVotesCastInSupport
                    ? typeof data.totalVotesCast === 'number'
                      ? data.totalVotesCast
                      : parseFloat(utils.formatEther(data.totalVotesCast))
                    : 0
                }
              />
            </div>
            <div>
              <h2>Against</h2>
              <progress
                className="governance__asset__progress-bar index-1"
                value={
                  data.totalVotesCastAgainst
                    ? typeof data.totalVotesCastAgainst === 'number'
                      ? data.totalVotesCastAgainst
                      : parseFloat(
                          utils.formatEther(data.totalVotesCastAgainst),
                        )
                    : 0
                }
                max={
                  data.totalVotesCastAgainst
                    ? typeof data.totalVotesCast === 'number'
                      ? data.totalVotesCast
                      : parseFloat(utils.formatEther(data.totalVotesCast))
                    : 0
                }
              />
            </div>
            <div>
              <h2>Abstain</h2>
              <progress
                className="governance__asset__progress-bar index-2"
                value={
                  data.totalVotesCastAbstained
                    ? typeof data.totalVotesCastAbstained === 'number'
                      ? data.totalVotesCastAbstained
                      : parseFloat(
                          utils.formatEther(data.totalVotesCastAbstained),
                        )
                    : 0
                }
                max={
                  data.totalVotesCastAbstained
                    ? typeof data.totalVotesCast === 'number'
                      ? data.totalVotesCast
                      : parseFloat(utils.formatEther(data.totalVotesCast))
                    : 0
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        <section
          ref={headerRef}
          className="governance__content"
          style={{
            marginBottom: 100,
          }}>
          <div>
            <h2>{t('governance.title')}</h2>
            <p>{t('governance.content')}</p>
          </div>
          <div className="governance__content__button__wrapper">
            <div
              className="governance__content__button"
              onClick={() =>
                History.push({ pathname: `/${lng}/staking/ELFI` })
              }>
              <p>{t('governance.button--staking')}</p>
            </div>
            <div
              className="governance__content__button"
              onClick={() =>
                window.open(
                  lng === LanguageType.KO
                    ? 'https://elysia.gitbook.io/elyfi-user-guide/v/korean-2/governance/governance-faq'
                    : 'https://elysia.gitbook.io/elyfi-user-guide/governance',
                )
              }>
              <p>{t('governance.button--governance_faq')}</p>
            </div>
          </div>
        </section>
        <GovernanceGuideBox />
        <section className="governance__validation governance__header">
          {mediaQuery === MediaQuery.PC ? (
            <div>
              <h3>
                {t('governance.data_verification', {
                  count:
                    offChainNapData &&
                    offChainNapData
                      .filter((data: any) => data.network === mainnetType)
                      .filter((data: any) => {
                        return moment().isBefore(data.endedDate);
                      }).length,
                })}
              </h3>
              <div>
                <p>{t('governance.data_verification__content')}</p>
                <a
                  href="https://forum.elyfi.world/"
                  target="_blank"
                  rel="noopener noreferer">
                  <div
                    className="deposit__table__body__amount__button"
                    style={{
                      width: 230,
                    }}>
                    <p>{t('governance.forum_button')}</p>
                  </div>
                </a>
              </div>
            </div>
          ) : (
            <div>
              <div>
                <h3>
                  {t('governance.data_verification', {
                    count:
                      offChainNapData &&
                      offChainNapData
                        .filter((data: any) => data.network === mainnetType)
                        .filter((data: any) =>
                          moment().isBefore(data.endedDate),
                        ).length,
                  })}
                </h3>
                <a
                  href="https://forum.elyfi.world/"
                  target="_blank"
                  rel="noopener noreferer">
                  <div
                    className="deposit__table__body__amount__button"
                    style={{
                      width: 150,
                    }}>
                    <p>{t('governance.forum_button')}</p>
                  </div>
                </a>
              </div>
              <p>{t('governance.data_verification__content')}</p>
            </div>
          )}

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
                      return offChainContainer(data);
                    }
                    return null;
                  })}
            </div>
          ) : (
            <div className="governance__validation zero">
              <p>{t('governance.offchain_list_zero')}</p>
            </div>
          )}
        </section>
        <section className="governance__onchain-vote governance__header">
          {mediaQuery === MediaQuery.PC ? (
            <div>
              <h3>
                {t('governance.on_chain_voting', {
                  count:
                    mainnetType === MainnetType.Ethereum
                      ? onChainData?.length
                      : onChainBscData?.length,
                })}
              </h3>
              <div>
                <p>
                  {t(
                    `governance.on_chain_voting__content.${
                      mainnetType === MainnetType.Ethereum
                        ? 'tally'
                        : 'snapshot'
                    }`,
                  )}
                </p>
                <a
                  href={`${t(
                    `governance.link.${
                      mainnetType === MainnetType.Ethereum
                        ? 'tally'
                        : 'snapshot'
                    }`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferer">
                  <div
                    className="deposit__table__body__amount__button"
                    style={{
                      width: 230,
                    }}>
                    <p>
                      {t(
                        `governance.onChain_button.${
                          mainnetType === MainnetType.Ethereum
                            ? 'tally'
                            : 'snapshot'
                        }`,
                      )}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          ) : (
            <div>
              <div>
                <h3>
                  {t('governance.on_chain_voting', {
                    count: onChainData?.length,
                  })}
                </h3>
                <a
                  href={`${t(
                    `governance.link.${
                      mainnetType === MainnetType.Ethereum
                        ? 'tally'
                        : 'snapshot'
                    }`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferer">
                  <div
                    className="deposit__table__body__amount__button"
                    style={{
                      width: 150,
                    }}>
                    <p>
                      {t(
                        `governance.onChain_button.${
                          mainnetType === MainnetType.Ethereum
                            ? 'tally'
                            : 'snapshot'
                        }`,
                      )}
                    </p>
                  </div>
                </a>
              </div>
              <p>{t('governance.data_verification__content')}</p>
            </div>
          )}
          {mainnetType === MainnetType.Ethereum ? (
            onChainLoading ? (
              <Skeleton width={'100%'} height={600} />
            ) : onChainData && onChainData.length > 0 ? (
              <div className="governance__grid">
                {onChainData.map((data: any) => {
                  return onChainConatainer(data);
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
                return onChainConatainer(data);
              })}
            </div>
          ) : (
            <div className="governance__onchain-vote zero">
              <p>{t('governance.onchain_list_zero')}</p>
            </div>
          )}
        </section>
        <section className="governance__loan governance__header">
          <>
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
          </>
        </section>
      </div>
    </>
  );
};

export default Governance;
