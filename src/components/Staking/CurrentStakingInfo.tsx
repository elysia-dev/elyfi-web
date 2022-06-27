import { BigNumber, constants } from 'ethers';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import Token from 'src/enums/Token';
import {
  toCompactForBignumber,
  toPercentWithoutSign,
} from 'src/utiles/formatters';
import Questionmark from '../Questionmark';

interface Props {
  poolApr: BigNumber;
  totalPrincipal: BigNumber;
  rewardToken: Token;
  isLoading: boolean;
}

const CurrentStakingInfo: React.FC<Props> = ({
  poolApr,
  totalPrincipal,
  rewardToken,
  isLoading,
}) => {
  const { t } = useTranslation();
  return (
    <section className="staking__round__header">
      <div>
        <p>
          {t('staking.elfi.apr')}
          <span
            style={{
              marginLeft: 5,
            }}>
            <Questionmark content={t('staking.aprGuide')} />
          </span>
        </p>
        {isLoading ? (
          <Skeleton width={50} height={20} />
        ) : (
          <h2 className="percent">
            {poolApr.eq(constants.MaxUint256)
              ? '-'
              : toPercentWithoutSign(poolApr || 0)}
          </h2>
        )}
      </div>
      <div>
        <p>{t('staking.elfi.total_amount')}</p>
        {isLoading ? (
          <Skeleton width={50} height={20} />
        ) : (
          <h2>
            {toCompactForBignumber(totalPrincipal)} {rewardToken}
          </h2>
        )}
      </div>
    </section>
  );
};

export default CurrentStakingInfo;
