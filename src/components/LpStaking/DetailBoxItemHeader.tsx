import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { DetailBoxItemHeaderProps } from 'src/core/types/LpStakingTypeProps';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import Guide from '../Guide';

const DetailBoxItemHeader: FunctionComponent<DetailBoxItemHeaderProps> = (
  props,
) => {
  const { totalLiquidity, apr, token1, isLoading } = props;
  const { value: mediaQuery } = useMediaQueryType();
  const { t } = useTranslation();

  return (
    <>
      <div>
        <div>
          <p>APR</p>
          <Guide content={t('guide.apr')} />
        </div>
        {isLoading ? (
          <h2 className="percent">{apr}</h2>
        ) : (
          <Skeleton
            width={115}
            height={mediaQuery === MediaQuery.PC ? 25 : 13}
          />
        )}
      </div>
      <div>
        <div>
          <p>{t('lpstaking.lp_token_total_liquidity')}</p>
          <Guide content={t('guide.total_liquidity', { token: token1 })} />
        </div>
        {isLoading ? (
          <h2 className="percent">{totalLiquidity}</h2>
        ) : (
          <Skeleton
            width={145}
            height={mediaQuery === MediaQuery.PC ? 25 : 13}
          />
        )}
      </div>
    </>
  );
};

export default DetailBoxItemHeader;
