import { BigNumber } from 'ethers';
import moment from 'moment';
import { Dispatch, SetStateAction } from 'react';
import FinishedStaking from 'src/components/Staking/FinishedStaking';
import { IStakingPoolRound } from 'src/core/data/stakingRoundTimes';
import RoundData from 'src/core/types/RoundData';
import Token from 'src/enums/Token';


interface Props {
  roundData: RoundData[],
  stakingRoundDate: IStakingPoolRound[],
  stakedToken: Token.EL | Token.ELFI,
  rewardToken: Token.ELFI | Token.DAI | Token.BUSD,
  roundInProgress: number,
  setModalType: Dispatch<SetStateAction<string>>,
  setRoundModal: Dispatch<SetStateAction<number>>,
  setModalValue: Dispatch<SetStateAction<BigNumber>>
  setIsUnstaking: () => void;
}

const PreviousRoundBox: React.FC<Props> = ({
  roundData,
  stakingRoundDate,
  stakedToken,
  rewardToken,
  roundInProgress,
  setModalType,
  setRoundModal,
  setModalValue,
  setIsUnstaking
}) => {
  const current = moment();

  return (
    <>
    {
      // eslint-disable-next-line array-callback-return
      roundData.map((item, index) => {
        if (stakingRoundDate.length !== roundData.length)
          return;
        if (current.diff(item.endedAt) > 0) {
          return (
            <FinishedStaking
              key={`Finished_${index}`}
              index={index}
              item={item}
              stakedToken={stakedToken}
              rewardToken={rewardToken}
              roundInProgress={roundInProgress}
              setModalType={setModalType}
              setRoundModal={setRoundModal}
              setModalValue={setModalValue}
              setIsUnstaking={setIsUnstaking}
            />
          );
        }
      })
    }
    </>
  )
}

export default PreviousRoundBox;