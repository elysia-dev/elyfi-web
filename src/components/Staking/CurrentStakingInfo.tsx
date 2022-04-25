import { BigNumber, constants } from 'ethers';
import { useTranslation } from 'react-i18next';
import Token from 'src/enums/Token';
import {
  toCompactForBignumber,
  toPercentWithoutSign,
} from 'src/utiles/formatters';

interface Props {
  poolApr: BigNumber;
  totalPrincipal: BigNumber;
  rewardToken: Token;
}

const CurrentStakingInfo: React.FC<Props> = ({
  poolApr,
  totalPrincipal,
  rewardToken,
}) => {
  const { t } = useTranslation();
  return (
    <section className="staking__round__header">
      <div>
        <p>{t('staking.elfi.apr')}</p>
        <h2 className="percent">
          {poolApr.eq(constants.MaxUint256)
            ? '-'
            : toPercentWithoutSign(poolApr || 0)}
        </h2>
      </div>
      <div>
        <p>{t('staking.elfi.total_amount')}</p>
        <h2>
          {toCompactForBignumber(totalPrincipal)} {rewardToken}
        </h2>
      </div>
    </section>
  );
};

export default CurrentStakingInfo;
