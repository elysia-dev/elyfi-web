import { BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import Token from 'src/enums/Token';
import { toCompact, toCompactForBignumber } from 'src/utiles/formatters';

interface Props {
  poolApr: number;
  totalPrincipal: BigNumber;
  rewardToken: Token;
  isLoading: boolean;
  tokenName: string;
  link: string;
  isRoundDataLoading: boolean;
}

const CurrentLpStakingInfo: React.FC<Props> = ({
  poolApr,
  totalPrincipal,
  rewardToken,
  isLoading,
  tokenName,
  link,
  isRoundDataLoading,
}) => {
  const { t } = useTranslation();

  return (
    <div className="staking__v2__content">
      <div>
        <div>
          <p>{t('staking.elfi.apr')}</p>
          {isLoading ? (
            <Skeleton width={60} height={15} />
          ) : (
            <h2 className="percent">
              {poolApr === 0 || !poolApr ? '-' : toCompact(poolApr)}
            </h2>
          )}
        </div>
        <div>
          <p>{t('staking.elfi.total_amount')}</p>
          {isRoundDataLoading ? (
            <Skeleton width={50} height={20} />
          ) : (
            <h2>
              {toCompactForBignumber(totalPrincipal)} {rewardToken}
            </h2>
          )}
        </div>
      </div>

      <div>
        <p>{t('staking.lp.receive_token', { pool: tokenName })}</p>
        <div onClick={() => window.open(link)}>
          <p>{t('staking.lp.receive_button')}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentLpStakingInfo;
