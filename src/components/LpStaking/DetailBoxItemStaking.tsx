import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import lpStakingTime, { lpRoundDate } from 'src/core/data/lpStakingTime';
import { DetailBoxItemStakingProps } from 'src/core/types/LpStakingTypeProps';
import Guide from '../Guide';
import Button from './Button';

const DetailBoxItemStaking: FunctionComponent<DetailBoxItemStakingProps> = (
  props,
) => {
  const { account } = useWeb3React();
  const {
    tokens: { token0, token1 },
    totalStakedLiquidity,
    setModalAndSetStakeToken,
    round,
  } = props;
  const { t } = useTranslation();
  const isStakingDate = moment().isBetween(
    lpRoundDate[round - 1].startedAt,
    lpRoundDate[round - 1].endedAt,
  );

  return (
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
        <div
          onClick={() => isStakingDate && account && setModalAndSetStakeToken()}
          className={`staking__lp__detail-box__staking__button ${
            !isStakingDate || !account ? 'disable' : ''
          }`}>
          <p>{t('staking.staking')}</p>
        </div>
      </div>
      <div className="staking__lp__detail-box__staking__value">
        <h2 className="amount">{account ? totalStakedLiquidity : 0}</h2>
      </div>
    </>
  );
};

export default DetailBoxItemStaking;
