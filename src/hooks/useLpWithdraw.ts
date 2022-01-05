import { useWeb3React } from '@web3-react/core';
import { ContractTransaction, ethers } from 'ethers';
import envs from 'src/core/envs';
import stakerABI from 'src/core/abi/StakerABI.json';
import { useContext } from 'react';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import { lpTokenValues } from 'src/utiles/lpTokenValues';
import buildEventEmitter from 'src/utiles/buildEventEmitter';

const useLpWithdraw: () => (
  poolAddress: string,
  rewardTokenAddress: string,
  tokenId: string,
  round: number,
) => void = () => {
  const { account, library } = useWeb3React();
  const { setTransaction } = useContext(TxContext);
  const iFace = new ethers.utils.Interface(stakerABI);

  const unstake = async (
    poolAddress: string,
    rewardTokenAddress: string,
    tokenId: string,
    round: number,
  ) => {
    try {
      const staker = new ethers.Contract(
        envs.stakerAddress,
        stakerABI,
        library.getSigner(),
      );
      const elfiUnstake = iFace.encodeFunctionData('unstakeToken', [
        lpTokenValues(poolAddress, envs.governanceAddress, round - 1),
        tokenId,
      ]);
      const rewardUnstake = iFace.encodeFunctionData('unstakeToken', [
        lpTokenValues(poolAddress, rewardTokenAddress, round - 1),
        tokenId,
      ]);
      const withdraw = iFace.encodeFunctionData('withdrawToken', [
        tokenId,
        account,
        '0x',
      ]);
      const res = await staker.multicall([
        elfiUnstake,
        rewardUnstake,
        withdraw,
      ]);
      const emitter = buildEventEmitter('LpUnstaking', 'unstaking', ``);
      setTransaction(
        res,
        emitter,
        'Withdraw' as RecentActivityType,
        () => {},
        () => {},
      );
    } catch (error: any) {
      throw new Error(`${error.message}`);
    }
  };
  return unstake;
};

export default useLpWithdraw;
