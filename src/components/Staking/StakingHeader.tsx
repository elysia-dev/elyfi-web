import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import MediaQuery from 'src/enums/MediaQuery';
import LegacyStakingButton from 'src/components/LegacyStaking/LegacyStakingButton';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

interface Props {
  mediaQuery: MediaQuery;
  image: string;
  subImage: string | undefined;
  title: string;
  stakingType: string;
}

const StakingHeader: React.FC<Props> = ({
  mediaQuery,
  image,
  subImage,
  title,
  stakingType,
}) => {
  const { t } = useTranslation();

  return (
    <div className="staking__title__content__wrapper">
      {mediaQuery === MediaQuery.PC ? (
        <>
          <div className="staking__title__content">
            <div className="staking__title__content__token-wrapper">
              <Suspense fallback={<div style={{ width: 37, height: 37 }} />}>
                <LazyImage src={image} name="token-images" />
                {subImage && <LazyImage src={subImage} name="token-images" />}
              </Suspense>
              <h2>{title}</h2>
            </div>
            <LegacyStakingButton stakingType={stakingType} />
          </div>
        </>
      ) : (
        <>
          <div className="staking__title__content__token-wrapper">
            <div>
              <Suspense fallback={<div style={{ width: 21, height: 21 }} />}>
                <LazyImage src={image} name="token-images" />
                {subImage && <LazyImage src={subImage} name="token-images" />}
              </Suspense>
              <h2>{title}</h2>
            </div>
            <LegacyStakingButton stakingType={stakingType} />
          </div>
        </>
      )}
    </div>
  );
};
export default StakingHeader;
