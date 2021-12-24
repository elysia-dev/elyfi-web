import { useCallback, useEffect, useRef, useState } from 'react';
import TempAssets from 'src/assets/images/temp_assets.png';
import wave from 'src/assets/images/wave_elyfi.png';
import OffChainTopic, { INapData } from 'src/clients/OffChainTopic';
import Skeleton from 'react-loading-skeleton';
import { IProposals, OnChainTopic } from 'src/clients/OnChainTopic';
import { BigNumber, utils } from 'ethers';
import { GET_ALL_ASSET_BONDS } from 'src/queries/assetBondQueries';
import { GetAllAssetBonds } from 'src/queries/__generated__/GetAllAssetBonds';
import { useQuery } from '@apollo/client';
import AssetList from 'src/containers/AssetList';
import { useTranslation, Trans } from 'react-i18next';
import GovernanceGuideBox from 'src/components/GovernanceGuideBox';
import { useParams, useHistory } from 'react-router-dom';
import LanguageType from 'src/enums/LanguageType';
import moment from 'moment';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';

const Governance = () => {
  const [onChainLoading, setOnChainLoading] = useState(true);
  const [offChainLoading, setOffChainLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const governanceRef = useRef<HTMLParagraphElement>(null);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [onChainData, setOnChainData] = useState<IProposals[]>([]);
  const [offChainNapData, setOffChainNapData] = useState<INapData[]>([]);
  const { data, loading } = useQuery<GetAllAssetBonds>(GET_ALL_ASSET_BONDS);
  const { t } = useTranslation();
  const History = useHistory();
  const { lng } = useParams<{ lng: string }>();

  const getInnerValue = () => {
    setInnerWidth(window.innerWidth);
    setInnerHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', getInnerValue);

    return () => {
      window.removeEventListener('resize', getInnerValue);
    };
  }, []);

  const { value: mediaQuery } = useMediaQueryType()

  // const draw = () => {
  //   const dpr = window.devicePixelRatio;
  //   const canvas: HTMLCanvasElement | null = canvasRef.current;
  //   if (!governanceRef.current) return;
  //   const governanceYValue = governanceRef.current.offsetTop;
  //   if (!canvas) return;
  //   canvas.width = window.innerWidth * dpr;
  //   canvas.height = document.body.clientHeight * dpr;
  //   const browserWidth = document.body.clientWidth;
  //   const browserHeight = document.body.clientHeight / 1.27 + 500;
  //   const context = canvas.getContext('2d');
  //   if (!context) return;
  //   context.scale(dpr, dpr);
  //   context.strokeStyle = '#00BFFF';
  //   context.beginPath();
  //   context.moveTo(0, governanceYValue * 1.2);
  //   context.bezierCurveTo(
  //     browserWidth * 0.3,
  //     governanceYValue * 1.333,
  //     browserWidth / 1.5,
  //     governanceYValue * 1.1025,
  //     browserWidth,
  //     governanceYValue * 1.077,
  //   );
  //   context.stroke();

  //   context.fillStyle = 'rgba(247, 251, 255, 1)';
  //   context.beginPath();
  //   context.moveTo(0, governanceYValue * 1.25);
  //   context.bezierCurveTo(
  //     browserWidth * 0.3,
  //     governanceYValue * 1.333,
  //     browserWidth / 1.5,
  //     governanceYValue * 1.077,
  //     browserWidth,
  //     governanceYValue * 1.1025,
  //   );
  //   context.lineTo(browserWidth, browserHeight);
  //   context.bezierCurveTo(
  //     browserWidth * 0.3,
  //     browserHeight * 0.98,
  //     browserWidth / 2,
  //     browserHeight * 1.04,
  //     0,
  //     browserHeight * 0.99,
  //   );
  //   context.fill();
  //   context.stroke();

  //   // context.fillStyle = "#ffffff";
  //   // context.moveTo(browserWidth / 3.2 + 10, yValue * 1.685);
  //   // context.arc(browserWidth / 3.2, yValue * 1.685, 10, 0, Math.PI * 2, true);
  // };

  const viewMoreHandler = useCallback(() => {
    setPageNumber((prev) => prev + 1);
  }, [pageNumber]);

  const getOnChainNAPDatas = async () => {
    try {
      const getOnChainApis = await OnChainTopic.getOnChainTopicData();
      const getNAPCodes = getOnChainApis.data.data.proposals.filter((topic) => {
        return topic.data.description.startsWith('NAP');
      });
      return getNAPCodes || undefined;
    } catch (e) {
      console.log(e);
      setOnChainLoading(false);
    }
  };
  const getOffChainNAPTitles = async () => {
    try {
      const getOffChainApis = await OffChainTopic.getTopicList();
      const getNAPTitles = getOffChainApis.data.topic_list.topics.filter(
        (topic) => {
          return topic.title.startsWith('NAP');
        },
      );
      return getNAPTitles.map((title) => title.id) || undefined;
    } catch (e) {
      console.log(e);
      setOffChainLoading(false);
    }
  };

  useEffect(() => {
    getOffChainNAPTitles().then((title_res) => {
      title_res === undefined
        ? setOffChainLoading(false)
        : title_res.map(async (_res, _x) => {
            const getNATData = await OffChainTopic.getTopicResult(_res);
            const getHTMLStringData: string =
              getNATData.data.post_stream.posts[0].cooked.toString();
            const regexNap = /NAP#: .*(?=<)/
            setOffChainNapData((napData) => [
              ...napData,
              {
                id: _x,
                nap:
                  getHTMLStringData.match(regexNap)?.toString().substring(5) ||
                  '',
                status:
                  getHTMLStringData.match(/Status: .*(?=<)/) ||
                  '',
                images:
                  getHTMLStringData.match(/slate.textile.io.*(?=" rel="noopener nofollow ugc">Collateral Image)/)?.toString() || '',
                votes:
                  getNATData.data.post_stream.posts[0].polls[0].options || '',
                totalVoters:
                  getNATData.data.post_stream.posts[0].polls[0].voters || '',
                link: `https://forum.elyfi.world/t/${getNATData.data.slug}`,
                endedDate:
                  getNATData.data.post_stream.posts[0].polls[0].close || '',
              } as INapData,
            ]);
          });
      setOffChainLoading(false);
    });

    getOnChainNAPDatas().then((res) => {
      res === undefined
        ? setOnChainLoading(false)
        : res.map((data) => {
            return setOnChainData((_data) => {
              if (!(data.status === 'ACTIVE')) return [..._data];
              return [
                ..._data,
                {
                  data: {
                    description: data.data.description
                      .match(/NAP#: .*(?=<)/)
                      ?.toString(),
                  },
                  status: data.status,
                  totalVotesCast: data.totalVotesCast,
                  totalVotesCastAbstained: data.totalVotesCastAbstained,
                  totalVotesCastAgainst: data.totalVotesCastAgainst,
                  totalVotesCastInSupport: data.totalVotesCastInSupport,
                  id: data.id.match(/(?=).*(?=-proposal)/)?.toString(),
                } as IProposals,
              ];
            });
          });
      setOnChainLoading(false);
    });
  }, []);

  const offChainContainer = (data: INapData) => {
    return (
      <div
        className="governance__validation__assets governance__asset"
        onClick={() => window.open(data.link)}>
        <div>
          <img src={data.images} />
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
        onClick={() =>
          window.open(
            `https://www.withtally.com/governance/elyfi/proposal/${data.id}`,
          )
        }>
        <div>
          <img
            src={
              offChainNapData.filter(
                (offChainData) => offChainData.nap === data.data.description,
              )[0]?.images || TempAssets
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
                value={parseFloat(
                  utils.formatEther(data.totalVotesCastInSupport),
                )}
                max={parseFloat(utils.formatEther(data.totalVotesCast))}
              />
            </div>
            <div>
              <h2>Againest</h2>
              <progress
                className="governance__asset__progress-bar index-1"
                value={parseFloat(
                  utils.formatEther(data.totalVotesCastAgainst),
                )}
                max={parseFloat(utils.formatEther(data.totalVotesCast))}
              />
            </div>
            <div>
              <h2>Abstain</h2>
              <progress
                className="governance__asset__progress-bar index-2"
                value={parseFloat(
                  utils.formatEther(data.totalVotesCastAbstained),
                )}
                max={parseFloat(utils.formatEther(data.totalVotesCast))}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      /> */}
      <img
        style={{
          position: 'absolute',
          left: 0,
          top: governanceRef.current?.offsetTop,
          width: '100%',
          zIndex: -1,
        }}
        src={wave}
        alt={wave}
      />
      ;
      <div className="governance">
        <section
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
              ref={governanceRef}
              className="governance__content__button"
              onClick={() =>
                window.open(
                  lng === LanguageType.KO
                    ? 'https://elysia.gitbook.io/elyfi-governance-faq/v/kor/'
                    : 'https://elysia.gitbook.io/elyfi-governance-faq/',
                )
              }>
              <p>{t('governance.button--governance_faq')}</p>
            </div>
          </div>
        </section>
        <GovernanceGuideBox />
        <section className="governance__validation governance__header">
          {
            mediaQuery === MediaQuery.PC ? (
              <div>
                <h3>
                  {t('governance.data_verification', {
                    count: offChainNapData.filter((data) =>
                      moment().isBefore(data.endedDate),
                    ).length,
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
                      count: offChainNapData.filter((data) =>
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
                <div>
                  <p>{t('governance.data_verification__content')}</p>
                </div>
              </div>
            )
          }
          
          {offChainLoading ? (
            <Skeleton width={'100%'} height={600} />
          ) : offChainNapData.filter((data) =>
              moment().isBefore(data.endedDate),
            ).length > 0 ? (
            <div className="governance__grid">
              {offChainNapData.map((data, index) => {
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
        {
            mediaQuery === MediaQuery.PC ? (
              <div>
                <h3>
                  {t('governance.on_chain_voting', { count: onChainData.length })}
                </h3>
                <div>
                  <p>{t('governance.on_chain_voting__content')}</p>
                  <a
                    href="https://www.withtally.com/governance/elyfi"
                    target="_blank"
                    rel="noopener noreferer">
                    <div
                      className="deposit__table__body__amount__button"
                      style={{
                        width: 230,
                      }}>
                      <p>{t('governance.onChain_tally_button')}</p>
                    </div>
                  </a>
                </div>
              </div>
            ) : (
              <div>
                <div>
                  <h3>
                    {t('governance.on_chain_voting', { count: onChainData.length })}
                  </h3>
                  <a
                    href="https://www.withtally.com/governance/elyfi"
                    target="_blank"
                    rel="noopener noreferer">
                    <div
                      className="deposit__table__body__amount__button"
                      style={{
                        width: 150,
                      }}>
                      <p>{t('governance.onChain_tally_button')}</p>
                    </div>
                  </a>
                </div>
                <div>
                  <p>{t('governance.data_verification__content')}</p>
                </div>
              </div>
            )
          }
          
          {onChainLoading ? (
            <Skeleton width={'100%'} height={600} />
          ) : onChainData.length > 0 ? (
            <div className="governance__grid">
              {onChainData.map((data, index) => {
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
          <div>
            <h3>
              {t('governance.loan_list', {
                count: data?.assetBondTokens.length,
              })}
            </h3>
            <p>{t('governance.loan_list__content')}</p>
          </div>
          {loading ? (
            <Skeleton width={1148} height={768} />
          ) : (
            <>
              {/* <AssetList assetBondTokens={data?.assetBondTokens || []} /> */}
              <AssetList
                assetBondTokens={
                  /* Tricky : javascript의 sort는 mutuable이라 아래와 같이 복사 후 진행해야한다. */
                  [...(data?.assetBondTokens || [])]
                    .slice(0, pageNumber * 9)
                    .sort((a, b) => {
                      return b.loanStartTimestamp! - a.loanStartTimestamp! >= 0
                        ? 1
                        : -1;
                    }) || []
                }
              />
              {data?.assetBondTokens.length &&
                data?.assetBondTokens.length >= pageNumber * 9 && (
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
        </section>
      </div>
    </>
  );
};

export default Governance;
