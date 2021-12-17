import { useEffect, useState } from 'react';
import TempAssets from 'src/assets/images/temp_assets.png';
import OffChainTopic, { INapData } from 'src/clients/OffChainTopic';
import Skeleton from 'react-loading-skeleton';
import { IProposals, OnChainTopic } from 'src/clients/OnChainTopic';
import { utils } from 'ethers';
import { GET_ALL_ASSET_BONDS } from 'src/queries/assetBondQueries';
import { GetAllAssetBonds } from 'src/queries/__generated__/GetAllAssetBonds';
import { useQuery } from '@apollo/client';
import AssetList from 'src/containers/AssetList';
import { useTranslation, Trans } from 'react-i18next';
import GovernanceGuideBox from 'src/components/GovernanceGuideBox';
import { useParams, useHistory } from 'react-router-dom';
import LanguageType from 'src/enums/LanguageType';

const Governance = () => {
  const [onChainLoading, setOnChainLoading] = useState(true)
  const [offChainLoading, setOffChainLoading] = useState(true)
  const [onChainData, setOnChainData] = useState<IProposals[]>([])
  const [offChainNapData, setOffChainNapData] = useState<INapData[]>([])
  const { data, loading } = useQuery<GetAllAssetBonds>(GET_ALL_ASSET_BONDS);
  const { t } = useTranslation();
  const History = useHistory();
  const { lng } = useParams<{ lng: string }>();
  
  const getOnChainNAPDatas = async () => {
    try {
      const getOnChainApis = await OnChainTopic.getOnChainTopicData()
      const getNAPCodes = getOnChainApis.data.data.proposals.filter((topic) => {
        return topic.data.description.startsWith("NAP")
        // return topic.data.description.match(/(?<=NAP).*(?=:)/)?.toString()
      })
      return getNAPCodes || undefined;
    } catch (e) {
      console.log(e)
      setOnChainLoading(false)
    }

  }
  const getOffChainNAPTitles = async () => {
    try {
      const getOffChainApis = await OffChainTopic.getTopicList()
      const getNAPTitles = getOffChainApis.data.topic_list.topics.filter((topic) => {
        return topic.title.startsWith("NAP")
      })
      return getNAPTitles.map((title) => title.id) || undefined;
    } catch (e) {
      console.log(e)
      setOffChainLoading(false)
    }
  }
  

  useEffect(() => {
    getOnChainNAPDatas().then((res) => {
      res === undefined ? setOnChainLoading(false) :
        res.map((data) => {
          return setOnChainData(_data => [
            ..._data,
            {
              data: {
                description: data.data.description.match(/(?<=NAP).*(?=:)/)?.toString()
              },
              status: data.status,
              totalVotesCast: data.totalVotesCast,
              totalVotesCastAbstained: data.totalVotesCastAbstained,
              totalVotesCastAgainst: data.totalVotesCastAgainst,
              totalVotesCastInSupport: data.totalVotesCastInSupport
            } as IProposals
          ])
        }) 
        setOnChainLoading(false)
    })

    getOffChainNAPTitles().then((title_res) => {
      title_res === undefined ? setOffChainLoading(false) : 
        title_res.map(async (_res, _x) => {
          const getNATData = await OffChainTopic.getTopicResult(_res)
          const getHTMLStringData: string = getNATData.data.post_stream.posts[0].cooked.toString();

          setOffChainNapData(napData => [ 
            ...napData, 
            {
              id: _x,
              nap: getHTMLStringData.match(/(?<=NAP#: ).*(?=<)/)?.toString() || "",
              status: getHTMLStringData.match(/(?<=Status: ).*(?=<)/)?.toString() || "",
              images: getHTMLStringData.match(/(?<=a href=").*(?=" rel="noopener nofollow ugc">Collateral Image)/)?.toString() || "",
              votes: getNATData.data.post_stream.posts[0].polls[0].options,
              totalVoters: getNATData.data.post_stream.posts[0].polls[0].voters,
            } as INapData 
          ])
        })
      
        setOffChainLoading(false)
    })
  }, [])

  const offChainContainer = (data: INapData) => {
    return (
      <div className="governance__validation__assets governance__asset">
        <div>
          <img src={data.images} />
        </div>
        <div>
          <div className="governance__asset__nap">
            <p>
              NAP#: {data.nap}
            </p>
          </div>
          <div className="governance__asset__status">
            <p>
              {t("governance.status")}: {data.status}
            </p>
          </div>
          <div>
            {data.votes.map((vote, _x) => {
              return (
                <div>
                  <h2>
                    {vote.html}
                  </h2>
                  <progress 
                    className={`governance__asset__progress-bar index-${_x}`}
                    value={vote.votes}
                    max={data.totalVoters}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
  const onChainConatainer = (data: IProposals) => {
    return (
      <div className="governance__onchain-vote__assets governance__asset">
        <div>
          <img src={TempAssets} />
        </div>
        <div>
          <div className="governance__nap">
            <p>
              NAP#: {data.data.description}
            </p>
          </div>
          <div className="governance__status">
            <p>
              {t("governance.status")}: {data.status}
            </p>
          </div>
          <div>
            <div>
              <h2>
                For
              </h2>
              <progress 
                className="governance__asset__progress-bar index-0"
                value={parseFloat(utils.formatEther(data.totalVotesCastInSupport))}
                max={parseFloat(utils.formatEther(data.totalVotesCast))}
              />
            </div>
            <div>
              <h2>
                Againest
              </h2>
              <progress 
                className="governance__asset__progress-bar index-1"
                value={parseFloat(utils.formatEther(data.totalVotesCastAgainst))}
                max={parseFloat(utils.formatEther(data.totalVotesCast))}
              />
            </div>
            <div>
              <h2>
                Abstain
              </h2>
              <progress 
                className="governance__asset__progress-bar index-2"
                value={parseFloat(utils.formatEther(data.totalVotesCastAbstained))}
                max={parseFloat(utils.formatEther(data.totalVotesCast))}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="governance">
      <section className="governance__content">
        <div>
          <h2>
            {t("governance.title")}
          </h2>
          <p>
            {t("governance.content")}
          </p>
        </div>
        <div className="governance__content__button__wrapper">
          <div className="governance__content__button"
            onClick={() => History.push({ pathname: `/${lng}/staking/ELFI` })}
          >
            <p>
              {t("governance.button--staking")}
            </p>
          </div>
          <div className="governance__content__button" onClick={() => 
              window.open(lng === LanguageType.KO ? "https://elysia.gitbook.io/elyfi-governance-faq/v/kor/" : "https://elysia.gitbook.io/elyfi-governance-faq/")}>
            <p>
              {t("governance.button--governance_faq")}
            </p>
          </div>
        </div>
      </section>
      <GovernanceGuideBox />
      <section className="governance__validation governance__header">
        <div>
          <h3>
            {t("governance.data_verification", { count: offChainNapData.length })}
          </h3>
          <p>
            {t("governance.data_verification__content")}
          </p>
        </div>
        {
          offChainLoading ? (
            <Skeleton width={"100%"} height={600} /> 
          ) : (
            <div className="governance__grid">
              {offChainNapData.map((data, index) => {
                return offChainContainer(data)
              })}
            </div>
          )
        }
      </section>
      <section className="governance__onchain-vote governance__header">
        <div>
          <h3>
            {t("governance.on_chain_voting", { count: onChainData.length })}
          </h3>
          <p>
            {t("governance.on_chain_voting__content")}
          </p>
        </div>
        {
          onChainLoading ? (
            <Skeleton width={"100%"} height={600} />
          ) : (
            <div className="governance__grid">
              {onChainData.map((data, index) => {
                return onChainConatainer(data)
              })}
            </div>
          )
        }
      </section>
      <section className="governance__loan governance__header">
        <div>
          <h3>
            {t("governance.loan_list", { count: data?.assetBondTokens.length })}
          </h3>
          <p>
            {t("governance.loan_list__content")}
          </p>
        </div>
        {
          loading ? (
            <Skeleton width={1148} height={768} />
          ) : (
            <AssetList assetBondTokens={data?.assetBondTokens || []} />
          )
        }
      </section>
    </div>
  )
}

export default Governance;