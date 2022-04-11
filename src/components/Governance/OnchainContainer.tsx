import { IProposals } from 'src/clients/OnChainTopic';
import { lazy, Suspense, useMemo } from 'react';
import reactGA from 'react-ga';
import PageEventType from 'src/enums/PageEventType';
import ButtonEventType from 'src/enums/ButtonEventType';
import { useTranslation } from 'react-i18next';
import { TopicList } from 'src/clients/OffChainTopic';
import { utils } from 'ethers';
import UnKnownImage from 'src/assets/images/undefined_image.svg';

import TempAssets from 'src/assets/images/governance/temp_assets.svg';
import FallbackSkeleton from 'src/utiles/FallbackSkeleton';
import MainnetType from 'src/enums/MainnetType';

interface Props {
  data: IProposals;
  offChainNapData: TopicList[] | undefined;
  mainnetType: MainnetType;
}

const OnChainContainer: React.FC<Props> = ({
  data,
  offChainNapData,
  mainnetType,
}) => {
  const { t } = useTranslation();
  const dataDescription: string = data.data.description.trim();
  const offChainData = useMemo(() => {
    return offChainNapData
      ? offChainNapData!.filter((offChainData: any) => {
          return offChainData.nap.trim() === dataDescription;
        })
      : undefined;
  }, [mainnetType, offChainNapData]);

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
      <Suspense fallback={<FallbackSkeleton width={'100%'} height={300} />}>
        <div>
          <img
            src={
              offChainNapData && offChainData?.length !== 0
                ? 'https://' + offChainData![0].images
                : TempAssets
            }
            alt="vote image"
            onError={(e: any) => {
              e.target.src = UnKnownImage;
            }}
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
                  data.totalVotesCast
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
                  data.totalVotesCast
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
                  data.totalVotesCast
                    ? typeof data.totalVotesCast === 'number'
                      ? data.totalVotesCast
                      : parseFloat(utils.formatEther(data.totalVotesCast))
                    : 0
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
