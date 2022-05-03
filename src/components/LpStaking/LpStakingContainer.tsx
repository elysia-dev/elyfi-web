import { lazy, Suspense, useContext } from 'react';
import elfi from 'src/assets/images/ELFI.png';
import { BigNumber, constants } from 'ethers';
import RoundData from 'src/core/types/RoundData';
import Token from 'src/enums/Token';
import { formatCommaSmall } from 'src/utiles/formatters';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import ReactGA from 'react-ga';
import ModalViewType from 'src/enums/ModalViewType';
import StakingModalType from 'src/enums/StakingModalType';
import { formatEther } from 'ethers/lib/utils';
import { useWeb3React } from '@web3-react/core';
import { isWrongNetwork } from 'src/utiles/isWrongNetwork';
import useCurrentChain from 'src/hooks/useCurrentChain';
import MainnetContext from 'src/contexts/MainnetContext';

const StakingHeader = lazy(
  () => import('src/components/Staking/StakingHeader'),
);
const CurrentLpStakingInfo = lazy(
  () => import('src/components/LpStaking/CurrentLpStakingInfo'),
);
const CurrentStakingContainer = lazy(
  () => import('src/components/Staking/CurrentStakingContainer'),
);

interface Props {
  tokenTitle: string;
  subImage: string;
  v2LPPoolApr: number;
  totalPrincipal: BigNumber;
  uniswapLink: string;
  isAprLoading: boolean;
  isRoundDataLoading: boolean;
  roundData: RoundData;
  rewardToken: Token;
  setToken: (value: React.SetStateAction<Token>) => void;
  setModalValue: (value: React.SetStateAction<BigNumber>) => void;
  setModalType: (value: React.SetStateAction<string>) => void;
  expectedReward: {
    before: BigNumber;
    value: BigNumber;
  };
  tokenType: Token;
  setExpectedReward: (token: Token) => void;
}

const LpStakingContainer: React.FC<Props> = ({
  tokenTitle,
  subImage,
  v2LPPoolApr,
  totalPrincipal,
  uniswapLink,
  isAprLoading,
  isRoundDataLoading,
  roundData,
  rewardToken,
  setToken,
  setModalValue,
  setModalType,
  expectedReward,
  tokenType,
  setExpectedReward,
}) => {
  const { account } = useWeb3React();
  const { value: mediaQuery } = useMediaQueryType();
  const currentChain = useCurrentChain();
  const { type: getMainnetType } = useContext(MainnetContext);
  const isWrongMainnet = isWrongNetwork(getMainnetType, currentChain?.name);

  return (
    <section className="staking__v2__container">
      <Suspense fallback={<div style={{ height: 40 }} />}>
        <StakingHeader
          mediaQuery={mediaQuery}
          image={elfi}
          subImage={subImage}
          title={tokenTitle}
          stakingType={'LP'}
        />
      </Suspense>
      <Suspense fallback={<div style={{ height: 200 }} />}>
        <>
          <CurrentLpStakingInfo
            poolApr={v2LPPoolApr}
            totalPrincipal={totalPrincipal}
            rewardToken={Token.UNI}
            tokenName={tokenTitle}
            link={uniswapLink}
            isLoading={isAprLoading}
            isRoundDataLoading={isRoundDataLoading}
          />
          <CurrentStakingContainer
            stakingAmount={`${formatCommaSmall(
              roundData?.accountPrincipal || constants.Zero,
            )}`}
            stakedToken={Token.UNI}
            isStaking={!account || isWrongMainnet}
            stakingOnClick={() => {
              if (!account || isWrongMainnet) {
                return;
              }
              ReactGA.modalview(
                tokenTitle + ModalViewType.StakingOrUnstakingModal,
              );
              setToken(tokenType);
              setModalValue(roundData.accountPrincipal);
              setModalType(StakingModalType.Staking);
            }}
            claimStart={parseFloat(formatEther(expectedReward.before))}
            claimEnd={parseFloat(
              formatEther(
                expectedReward.before.isZero()
                  ? roundData?.accountReward || constants.Zero
                  : expectedReward.value,
              ),
            )}
            claimOnClick={() => {
              if (expectedReward.value.isZero() || !account) {
                return;
              }
              setExpectedReward(tokenType);
              ReactGA.modalview(
                tokenTitle + ModalViewType.StakingIncentiveModal,
              );
              setToken(tokenType);

              setModalValue(expectedReward.value);
              setModalType(StakingModalType.Claim);
            }}
            isClaim={expectedReward.value.isZero() || !account}
            rewardToken={rewardToken}
            isLoading={isRoundDataLoading}
            roundData={roundData}
            expectedReward={expectedReward}
            currentToken={tokenType}
          />
        </>
      </Suspense>
    </section>
  );
};

export default LpStakingContainer;
