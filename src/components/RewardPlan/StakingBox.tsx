import { BigNumber } from 'ethers';
import { FunctionComponent } from 'react';
import Token from 'src/enums/Token';
import elfi from 'src/assets/images/ELFI.png';
import el from 'src/assets/images/el.png';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import { useTranslation } from 'react-i18next';
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
  const tokenImg = props.unit === Token.DAI ? elfi : el;
  const { t } = useTranslation();

  return (
    <>
      <div className="reward__token">
        <img src={tokenImg} />
        <h2>
          {t(`reward.token_staking__reward_plan`, { token: props.unit === 'DAI' ? 'ELFI' : 'EL' })}
        </h2>
      </div>
      <div className="reward__token__array-handler">
        <div 
          className={`reward__token__array-handler--left${
            props.staking === 0 ? ' disabled' : ''
          }`}
          onClick={() => {
            props.staking > 0 &&
              props.setState({
                ...props.state,
                elStaking: isDai ? props.state.elStaking : props.staking - 1,
                currentElfiLevel: isDai
                  ? props.staking - 1
                  : props.state.currentElfiLevel,
              });
          }} 
        >
          <i />
          <i />
        </div>
        <div 
          className={`reward__token__array-handler--right${
            props.staking >= stakingRoundTimes.length - 1 ? ' disabled' : ''
          }`}
          onClick={() => {
            props.staking < stakingRoundTimes.length - 1 &&
              props.setState({
                ...props.state,
                elStaking: isDai ? props.state.elStaking : props.staking + 1,
                currentElfiLevel: isDai
                  ? props.staking + 1
                  : props.state.currentElfiLevel,
              });
          }}
        >
          <i />
          <i />
        </div>
      </div>
      <div className="reward__token__container">
        <StakingBoxHeader
          nth={props.nth}
          loading={props.loading}
          poolApr={props.poolApr}
          poolPrincipal={props.poolPrincipal}
          staking={props.staking}
          unit={props.unit}
        />
        <div className="reward__token__data">
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
      </div>
      
    </>
  );
};

export default StakingBox;
