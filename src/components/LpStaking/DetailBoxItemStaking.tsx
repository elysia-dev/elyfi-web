import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import lpStakingTime from 'src/core/data/lpStakingTime';
import { DetailBoxItemStakingProps } from 'src/core/types/LpStakingTypeProps';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
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
  } = props;
  const { t } = useTranslation();
  const isStakingDate = moment().isBetween(
    lpStakingTime.startedAt,
    lpStakingTime.endedAt,
  );
  const { value: mediaQuery } = useMediaQueryType();

  return (
    mediaQuery === MediaQuery.PC ? (
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
            onClick={() =>
              isStakingDate && account && setModalAndSetStakeToken()
            }
            className={`staking__lp__detail-box__staking__button ${!isStakingDate ? "disable" : ""}`}
          >
            <p>
              {t('staking.staking')}
            </p>
          </div>
        </div>
        <div className="staking__lp__detail-box__staking__value">
          <h2 className="amount">
          {account ? totalStakedLiquidity : 0}
          </h2>
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
          <h2 className="amount">
          {account ? totalStakedLiquidity : 0}
          </h2>
        </div>
        <div
          onClick={() =>
            isStakingDate && account && setModalAndSetStakeToken()
          }
          className={`staking__lp__detail-box__staking__button ${!isStakingDate ? "disable" : ""}`}
        >
          <p>
            {t('staking.staking')}
          </p>
        </div>
      </>
    )
  );
};

export default DetailBoxItemStaking;
