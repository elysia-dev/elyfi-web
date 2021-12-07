import { useEffect, useState } from 'react';
import TempAssets from 'src/assets/images/temp_assets.png';
import OffChainTopic from 'src/clients/OffChainTopic';
import Skeleton from 'react-loading-skeleton';
import { IProposals, OnChainTopic } from 'src/clients/OnChainTopic';
import { utils } from 'ethers';
import { GET_ALL_ASSET_BONDS } from 'src/queries/assetBondQueries';
import { GetAllAssetBonds } from 'src/queries/__generated__/GetAllAssetBonds';
import { useQuery } from '@apollo/client';
import AssetList from 'src/containers/AssetList';

interface IOffChainVote {
  html: string;
  id: string;
  votes: number;
}[]

interface INapData {
  id: number;
  nap: string;
  status: string;
  images: string;
  votes: IOffChainVote[];
  totalVoters: number;
}

const initialNapData: INapData = {
  id: 0,
  nap: "",
  status: "",
  images: "",
  votes: [
    {
      html: "",
      id: "",
      votes: 0
    }
  ],
  totalVoters: 0
}

const Governance = () => {
  const [onChainLoading, setOnChainLoading] = useState(true)
  const [offChainLoading, setOffChainLoading] = useState(true)
  const [onChainData, setOnChainData] = useState<IProposals[]>([])
  const [offChainNapData, setOffChainNapData] = useState<INapData[]>([])
  const { data, loading } = useQuery<GetAllAssetBonds>(GET_ALL_ASSET_BONDS);
  
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
              Status: {data.status}
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
              Status: {data.status}
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
            ELYFI 거버넌스
          </h2>
          <p>
            엘리파이는 탈중앙 조직(DAO)에 의해 운영되는 디파이(DeFi) 프로토콜입니다. <br/>
            ELFI 토큰을 보유한 홀더는 누구나 탈중앙 조직멤버로서 엘리파이 운영에 참여할 수 있으며, 스테이킹시 프로토콜 순이익을 분배받을 수 있습니다.
          </p>
        </div>
        <div className="governance__content__button__wrapper">
          <div className="governance__content__button">
            <p>
              ELFI 스테이킹 하기
            </p>
          </div>
          <div className="governance__content__button">
            <p>
              Governance FAQ
            </p>
          </div>
        </div>
      </section>
      <section className="governance__elyfi-graph">
        <div>
          <div>
            <p>
              ELYFI
            </p>
          </div>
        </div>
        <div className="governance__elyfi-graph__arrow-container">
          <div>
            <p>
              프로토콜 순 이익
            </p>
          </div>
          <div className="arrow-wrapper">
            <div className="line" />
            <div className="right-arrow" />
          </div>
          <div className="arrow-wrapper">
            <div className="left-arrow" />
            <div className="line"/>
          </div>
          <div>
            <p>
              거버넌스 참여
            </p>
          </div>
        </div>
        <div>
          <div>
            <p>
              ELYFI Holder
            </p>
          </div>
        </div>
      </section>
      <section className="governance__validation governance__header">
        <div>
          <h3>
            데이터 검증 리스트 ({offChainNapData.length} 건)
          </h3>
          <p>
            오프체인 거버넌스(DAO)에서 투표가 진행중인 매물 리스트 입니다.
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
            온체인 투표 ({onChainData.length} 건)
          </h3>
          <p>
            온체인 거버넌스(DAO)에서 투표가 진행중인 매물 리스트 입니다.
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
            대출리스트 ({data?.assetBondTokens.length} 건)
          </h3>
          <p>
            거버넌스(DAO)에서 통과해서 엘리파이에 DAI로 실행뙨 대출 리스트입니다.
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