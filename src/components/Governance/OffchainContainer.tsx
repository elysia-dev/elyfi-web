import { lazy, Suspense } from "react";
import { INapData } from "src/clients/OffChainTopic";
import reactGA from 'react-ga';
import PageEventType from 'src/enums/PageEventType';
import ButtonEventType from 'src/enums/ButtonEventType';
import { useTranslation } from "react-i18next";
import FallbackSkeleton from "src/utiles/FallbackSkeleton";

const LazyImage = lazy(() => import('src/utiles/lazyImage'));


interface Props {
  data: INapData
}

const OffChainContainer: React.FC<Props> = ({
  data
}) => {
  const { t } = useTranslation();

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
      <Suspense fallback={<FallbackSkeleton width={"100%"} height={300} />}>
        <div>
          <LazyImage src={`https://${data.images}`} name="container-images" />
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
      </Suspense>
    </div>
  );
};

export default OffChainContainer;