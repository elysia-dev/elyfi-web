import { useTranslation } from 'react-i18next';
import Token from 'src/enums/Token';
import { formatSixFracionDigit } from 'src/utiles/formatters';
import CountUp from 'react-countup';
import Skeleton from 'react-loading-skeleton';
import CurrentStakingAmount from 'src/components/Staking/CurrentStakingAmount';
import CurrentRewardAmount from 'src/components/Staking/CurrentRewardAmount';
import useLpPrice from 'src/hooks/useLpPrice';
import useSWR from 'swr';
import envs from 'src/core/envs';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import RoundData from 'src/core/types/RoundData';
import { BigNumber, constants } from 'ethers';

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
  roundData: RoundData;
  expectedReward: {
    before: BigNumber;
    value: BigNumber;
  };
  currentToken: Token;
}

const CurrentStakingContainer: React.FC<Props> = ({
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
  roundData,
  expectedReward,
  currentToken,
}) => {
  const { t } = useTranslation();
  const { lpPriceState } = useLpPrice();

  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );

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
              <p className="equal_amount">
                <CurrentStakingAmount
                  tokenUsdPrice={
                    currentToken === Token.ELFI_ETH_LP
                      ? lpPriceState.ethLpPrice
                      : currentToken === Token.ELFI_DAI_LP
                      ? lpPriceState.daiLpPrice
                      : currentToken === Token.ELFI_EL_LP
                      ? lpPriceState.elLpPrice
                      : priceData?.elfiPrice || 0
                  }
                  isLoading={lpPriceState.loading}
                  roundData={roundData?.accountPrincipal || constants.Zero}
                />
              </p>
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

              <p className="equal_amount">
                <CurrentRewardAmount
                  tokenUsdPrice={priceData?.elfiPrice || 0}
                  isLoading={lpPriceState.loading}
                  roundData={roundData?.accountReward || constants.Zero}
                  rewardBefore={expectedReward.before}
                  rewardValue={expectedReward.value}
                />
              </p>
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

export default CurrentStakingContainer;
