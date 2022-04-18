import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { lpRoundDate } from 'src/core/data/lpStakingTime';
import { DetailBoxItemStakingProps } from 'src/core/types/LpStakingTypeProps';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import Guide from '../Guide';

const DetailBoxItemStaking: FunctionComponent<DetailBoxItemStakingProps> = (
  props,
) => {
  const { account } = useWeb3React();
  const {
    tokens: { token0, token1 },
    totalStakedLiquidity,
    isLoading,
  } = props;
  const { t } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();

  return mediaQuery === MediaQuery.PC ? (
    <>
      <div className="staking__lp__detail-box__staking__header">
        <div>
          <p>
            {t('lpstaking.lp_token_staked', {
              token0,
              token1,
            })}
          </p>
          <Guide content={t('guide.staked_total_amount')} />
        </div>
        <div className="staking__lp__detail-box__staking__button disable">
          <p>{t('staking.staking')}</p>
        </div>
      </div>
      <div className="staking__lp__detail-box__staking__value">
        {isLoading ? (
          <h2 className="amount">{account ? totalStakedLiquidity : 0}</h2>
        ) : (
          <Skeleton width={100} height={38} />
        )}
      </div>
    </>
  ) : (
    <>
      <div className="staking__lp__detail-box__staking__header">
        <div>
          <p>
            {t('lpstaking.lp_token_staked', {
              token0,
              token1,
            })}
          </p>
          <Guide content={t('guide.staked_total_amount')} />
        </div>
      </div>
      <div className="staking__lp__detail-box__staking__value">
        {isLoading ? (
          <h2 className="amount">{account ? totalStakedLiquidity : 0}</h2>
        ) : (
          <Skeleton width={80} height={18} />
        )}
      </div>
      <div className="staking__lp__detail-box__staking__button disable">
        <p>{t('staking.staking')}</p>
      </div>
    </>
  );
};

export default DetailBoxItemStaking;
