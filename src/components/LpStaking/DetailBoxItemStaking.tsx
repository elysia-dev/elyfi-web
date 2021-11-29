import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import lpStakingTime from 'src/core/data/lpStakingTime';
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
  } = props;
  const { t } = useTranslation();
  const isStakingDate = moment().isBetween(
    lpStakingTime.startedAt,
    lpStakingTime.endedAt,
  );

  return (
    <>
      <div
        style={{
          padding: '19px 25px 22px 29px',
        }}>
        <div
          className="spoqa__bold"
          style={{
            paddingBottom: 7,
            fontSize: 17,
          }}>
          {t('lpstaking.lp_token_staked', {
            token0,
            token1,
          })}
          <Guide content={t('guide.staked_total_amount')} />
        </div>
        <div
          className="spoqa__bold"
          style={{
            textAlign: 'right',
            paddingTop: 19,
            paddingBottom: 30,
            fontSize: 30,
            display: 'flex',
            alignItems: 'center',
          }}>
          <span
            className="spoqa__bold"
            style={{
              fontSize: 25,
              marginLeft: 'auto',
              marginRight: 3,
            }}>
            {`$ `}
          </span>
          {account ? totalStakedLiquidity : 0}
        </div>
        <div
          style={{
            textAlign: 'center',
          }}>
          <Button
            btnTitle={t('staking.staking')}
            onHandler={() =>
              isStakingDate && account && setModalAndSetStakeToken()
            }
            disabledBtn={
              isStakingDate
                ? undefined
                : { background: '#f8f8f8', color: '#949494' }
            }
          />
        </div>
      </div>
    </>
  );
};

export default DetailBoxItemStaking;
