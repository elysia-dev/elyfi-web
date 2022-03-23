import { Dispatch, SetStateAction } from "react";
import { BigNumber } from "ethers";
import { IStakingPoolRound } from "src/core/data/stakingRoundTimes";
import RoundData from "src/core/types/RoundData";
import Token from "src/enums/Token";
import StakingProgress from 'src/components/Staking/StakingProgress';


interface Props {
  roundInProgress: number,
  stakingRoundDate: IStakingPoolRound[],
  roundData: RoundData[],
  stakedToken: Token.EL | Token.ELFI,
  rewardToken: Token.ELFI | Token.DAI | Token.BUSD,
  setModalType: Dispatch<SetStateAction<string>>,
  setRoundModal: Dispatch<SetStateAction<number>>,
  setModalValue: Dispatch<SetStateAction<BigNumber>>,
  isWrongMainnet: boolean,
  currentRound: RoundData,
  expectedReward: {
    before: BigNumber;
    value: BigNumber;
  },
  setIsUnstaking: () => void;
}

const CurrentStakingSelectBox: React.FC<Props> = ({
  roundInProgress,
  stakingRoundDate,
  roundData,
  stakedToken,
  rewardToken,
  setModalType,
  setRoundModal,
  setModalValue,
  currentRound,
  expectedReward,
  isWrongMainnet,
  setIsUnstaking
}) => {

  return (
    <>
    {
      roundInProgress !== -1 &&
      stakingRoundDate.length === roundData.length && (
        <StakingProgress
          currentRound={currentRound}
          expectedReward={expectedReward}
          stakedToken={stakedToken}
          rewardToken={rewardToken}
          roundData={roundData}
          setModalType={setModalType}
          setModalValue={setModalValue}
          setRoundModal={setRoundModal}
          isWrongMainnet={isWrongMainnet}
          setIsUnstaking={setIsUnstaking}
        />
      )
    }
    </>
  )
}

export default CurrentStakingSelectBox;