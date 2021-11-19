import { BigNumber } from 'ethers';
import { FunctionComponent } from 'react';
import SmallProgressBar from './SmallProgressBar';
import StakingBoxHeader from './StakingBoxHeader';
import StakingDetailInfo from './StakingDetailInfo';
import StakingProgressFill from './StakingProgressFill';

type Props = {
  nth: string;
  loading: boolean;
  poolApr: BigNumber;
  poolPrincipal: BigNumber;
  staking: number;
  unit: string;
  start: number;
  end: number;
  state: {
    elStaking: number;
    currentElfiLevel: number;
  };
  setState: (
    value: React.SetStateAction<{
      elStaking: number;
      currentElfiLevel: number;
    }>,
  ) => void;
  miningStart?: number;
  miningEnd?: number;
  currentPhase?: number;
  OrdinalNumberConverter?: (value: number) => string;
};

// 컴포넌트명 변경 해줘야함

const StakingBox: FunctionComponent<Props> = (props: Props) => {
  const isDai = props.unit === 'DAI';
  const rewardOrMining = isDai ? 'reward' : 'mining';
  return (
    <>
      <StakingBoxHeader
        nth={props.nth}
        loading={props.loading}
        poolApr={props.poolApr}
        poolPrincipal={props.poolPrincipal}
        staking={props.staking}
        unit={props.unit}
      />
      <div className="reward__data-wrapper">
        <SmallProgressBar
          start={props.start}
          end={props.end}
          rewardOrMining={rewardOrMining}
          totalMiningValue={
            isDai
              ? props.staking > 1
                ? '50,000'
                : '25,000'
              : (3000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          max={isDai ? (props.staking > 1 ? 50000 : 25000) : 3000000}
          unit={props.unit}
          nth={props.nth}
          stakingRoundFill={
            <StakingProgressFill
              nth={props.nth}
              staking={props.staking}
              unit={props.unit}
              end={props.end}
              currentPhase={props.currentPhase}
              OrdinalNumberConverter={props.OrdinalNumberConverter}
            />
          }
        />
        <StakingDetailInfo
          nth={props.nth}
          isDai={props.unit === 'DAI'}
          staking={props.staking}
          unit={props.unit}
          start={props.start}
          end={props.end}
          state={props.state}
          setState={props.setState}
          miningStart={props.miningStart}
          miningEnd={props.miningEnd}
        />
      </div>
    </>
  );
};

export default StakingBox;
