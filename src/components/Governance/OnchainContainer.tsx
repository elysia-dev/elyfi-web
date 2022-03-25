import { IProposals } from "src/clients/OnChainTopic";
import { lazy, Suspense } from "react";
import reactGA from 'react-ga';
import PageEventType from 'src/enums/PageEventType';
import ButtonEventType from 'src/enums/ButtonEventType';
import { useTranslation } from "react-i18next";
import { TopicList } from "src/clients/OffChainTopic";
import { utils } from "ethers";

import TempAssets from 'src/assets/images/governance/temp_assets.svg';
import Skeleton from "react-loading-skeleton";
import FallbackSkeleton from "src/utiles/FallbackSkeleton";

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

interface Props {
  data: IProposals;
  offChainNapData: TopicList[] | undefined;
}

const OnChainContainer: React.FC<Props> = ({
  data,
  offChainNapData
}) => {
  const { t } = useTranslation();


  return (
    <div
      className="governance__onchain-vote__assets governance__asset"
      onClick={() => {
        reactGA.event({
          category: PageEventType.MoveToExternalPage,
          action: ButtonEventType.OnChainVoteButtonOnGovernance,
        });
        window.open(`${t('governance.link.tally')}/proposal/${data.id}`);
      }}>
      <Suspense fallback={<FallbackSkeleton width={"100%"} height={300} />}>
        <div>
          <LazyImage
            name="Asset-image"
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
                  typeof data.totalVotesCastInSupport === 'number'
                    ? data.totalVotesCastInSupport
                    : parseFloat(
                        utils.formatEther(data.totalVotesCastInSupport),
                      )
                }
                max={
                  typeof data.totalVotesCast === 'number'
                    ? data.totalVotesCast
                    : parseFloat(utils.formatEther(data.totalVotesCast))
                }
              />
            </div>
            <div>
              <h2>Against</h2>
              <progress
                className="governance__asset__progress-bar index-1"
                value={
                  typeof data.totalVotesCastAgainst === 'number'
                    ? data.totalVotesCastAgainst
                    : parseFloat(utils.formatEther(data.totalVotesCastAgainst))
                }
                max={
                  typeof data.totalVotesCast === 'number'
                    ? data.totalVotesCast
                    : parseFloat(utils.formatEther(data.totalVotesCast))
                }
              />
            </div>
            <div>
              <h2>Abstain</h2>
              <progress
                className="governance__asset__progress-bar index-2"
                value={
                  typeof data.totalVotesCastAbstained === 'number'
                    ? data.totalVotesCastAbstained
                    : parseFloat(
                        utils.formatEther(data.totalVotesCastAbstained),
                      )
                }
                max={
                  typeof data.totalVotesCast === 'number'
                    ? data.totalVotesCast
                    : parseFloat(utils.formatEther(data.totalVotesCast))
                }
              />
            </div>
          </div>
        </div>
      </Suspense>
    </div>
  );
};


export default OnChainContainer;