import { useTranslation } from 'react-i18next';
import Token from 'src/enums/Token';
import { formatSixFracionDigit } from 'src/utiles/formatters';
import CountUp from 'react-countup';
import Skeleton from 'react-loading-skeleton';

interface Props {
  stakingAmount: string;
  stakedToken: Token;
  isStaking: boolean;
  stakingOnClick: () => void;
  claimStart: number;
  claimEnd: number;
  isClaim: boolean;
  rewardToken: Token;
  claimOnClick: () => void;
  isLoading: boolean;
}

const CurrnetStakingHandler: React.FC<Props> = ({
  stakingAmount,
  stakedToken,
  isStaking,
  stakingOnClick,
  claimStart,
  claimEnd,
  isClaim,
  rewardToken,
  claimOnClick,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <section className="staking__round__remaining-data current">
      <div className="staking__round__remaining-data__body">
        <>
          <div>
            <h2>{t('staking.staking_amount')}</h2>
            <div>
              <h2>
                {isLoading ? (
                  <Skeleton width={70} height={30} />
                ) : (
                  stakingAmount
                )}
                <span className="token-amount bold">{stakedToken}</span>
              </h2>
              <div
                className={`staking__round__button ${
                  isStaking ? ' disable' : ''
                }`}
                onClick={stakingOnClick}>
                <p>{t('staking.staking_btn')}</p>
              </div>
            </div>
          </div>
          <div>
            <h2>{t('staking.reward_amount')}</h2>
            <div>
              <h2>
                {isLoading ? (
                  <Skeleton width={70} height={30} />
                ) : isClaim ? (
                  '-'
                ) : (
                  <CountUp
                    start={claimStart}
                    end={claimEnd}
                    formattingFn={(number) => {
                      return formatSixFracionDigit(number);
                    }}
                    decimals={6}
                    duration={1}
                  />
                )}
                <span className="token-amount bold">{rewardToken}</span>
              </h2>
              <div
                className={`staking__round__button ${
                  isClaim ? ' disable' : ''
                }`}
                onClick={claimOnClick}>
                <p>{t('staking.claim_reward')}</p>
              </div>
            </div>
          </div>
        </>
      </div>
    </section>
  );
};

export default CurrnetStakingHandler;
