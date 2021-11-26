import { useEffect, useState } from 'react';
import TempAssets from 'src/assets/images/temp_assets.png';
import OffChainTopic from 'src/clients/OffChainTopic';
import Skeleton from 'react-loading-skeleton';

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
  const [loading, setLoading] = useState({
    offChain: true
  })
  const [napData, setNapData] = useState<INapData[]>([])

  const getNAPTitles = async () => {
    try {
      const getApis = await OffChainTopic.getTopicList()
      const getNAPTitles = getApis.data.topic_list.topics.filter((topic) => {
        return topic.title.startsWith("NAP")
      })

      return getNAPTitles.map((title) => title.id) || undefined;
    } catch (e) {
      console.log(e)
      setLoading({ ...loading, offChain: false })
    }
  }

  useEffect(() => {
    getNAPTitles().then((title_res) => {
      title_res === undefined ? setLoading({ ...loading, offChain: false }) : 
        title_res.map(async (_res, _x) => {
          const getNATData = await OffChainTopic.getTopicResult(_res)
          const getHTMLStringData: string = getNATData.data.post_stream.posts[0].cooked.toString();

          setNapData(napData => [ 
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
      
        setLoading({ ...loading, offChain: false })
    })
  }, [])

  const OffChainContainer = (nap: string, status: string, images: string, votes: IOffChainVote[], totalVoters: number) => {
    return (
      <div className="governance__validation__assets governance__asset">
        <div>
          <img src={images} />
        </div>
        <div>
          <div className="governance__asset__nap">
            <p>
              NAP#: {nap}
            </p>
          </div>
          <div className="governance__asset__status">
            <p>
              Status: {status}
            </p>
          </div>
          <div>
            {votes.map((vote, _x) => {
              return (
                <div>
                  <p>
                    {vote.html}
                  </p>
                  <progress 
                    className="governance__asset__progress-bar"
                    value={vote.votes}
                    max={totalVoters}
                  />
                </div>
              )
            })}
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
      <section className="governance__validation">
        <div>
          <h3>
            데이터 검증 리스트 ({napData.length} 건)
          </h3>
          <p>
            오프체인 거버넌스(DAO)에서 투표가 진행중인 매물 리스트 입니다.
          </p>
        </div>
        {
          loading.offChain ? (
            <Skeleton width={"100%"} height={600} /> 
          ) : (
            <div className="governance__grid">
              {napData.map((data, index) => {
                return OffChainContainer(data.nap, data.status, data.images, data.votes, data.totalVoters)
              })}
            </div>
          )
        }
      </section>
      <section className="governance__onchain-vote">
        <div>
          <h3>
            온체인 투표 (3 건)
          </h3>
          <p>
            온체인 거버넌스(DAO)에서 투표가 진행중인 매물 리스트 입니다.
          </p>
        </div>
        <div className="governance__grid">
          <div className="governance__onchain-vote__assets governance__asset">
            <div>
              <img src={TempAssets} />
            </div>
            <div>
              <div className="governance__nap">
                <p>
                  NAP#: 124
                </p>
              </div>
              <div className="governance__status">
                <p>
                  Status: Voting
                </p>
              </div>
              <div>
                <div>
                  <p>
                    For
                  </p>
                  <progress 
                    className="governance__asset__progress-bar"
                    value={30}
                    max={100}
                  />
                </div>
                <div>
                  <p>
                    Againest
                  </p>
                  <progress 
                    className="governance__asset__progress-bar"
                    value={30}
                    max={100}
                  />
                </div>
                <div>
                  <p>
                    Abstain
                  </p>
                  <progress 
                    className="governance__asset__progress-bar"
                    value={30}
                    max={100}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="governance__loan">
        <div>
          <h3>
            대출리스트 (3 건)
          </h3>
          <p>
            거버넌스(DAO)에서 통과해서 엘리파이에 DAI로 실행뙨 대출 리스트입니다.
          </p>
        </div>
        <div className="governance__grid">
          <div className="governance__loan__assets governance__asset">
            <div>
              <img src={TempAssets} />
            </div>
            <div>
              <div>
                <p>
                  123.4456%
                </p>
              </div>
              <div>
                <p>
                  $ 123,456K
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Governance;