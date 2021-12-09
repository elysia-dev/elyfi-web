import { useWeb3React } from '@web3-react/core';
import { ContractTransaction, ethers } from 'ethers';
import envs from 'src/core/envs';
import positionABI from 'src/core/abi/NonfungiblePositionManager.json';
import { lpTokenValues } from 'src/utiles/lpTokenValues';
import { useContext } from 'react';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import useTxTracking from './useTxTracking';

const useLpStaking: () => (
  stakingPoolAdress: string,
  rewardTokenAddress: string,
  tokenId: string,
  round: number,
) => void = () => {
  const { account, library } = useWeb3React();
  const { setTransaction } = useContext(TxContext);
  const initTxTracker = useTxTracking();

  const staking = async (
    stakingPoolAdress: string,
    rewardTokenAddress: string,
    tokenId: string,
    round: number,
  ) => {
    try {
      const encode = new ethers.utils.AbiCoder().encode(
        ['tuple(address,address,uint256,uint256,address)[]'],
        [
          [
            lpTokenValues(stakingPoolAdress, envs.governanceAddress, round - 1),
            lpTokenValues(stakingPoolAdress, rewardTokenAddress, round - 1),
          ],
        ],
      );

      const contract = new ethers.Contract(
        envs.nonFungiblePositionAddress,
        positionABI,
        library.getSigner(),
      );

      const res = await contract[
        'safeTransferFrom(address,address,uint256,bytes)'
      ](account, envs.stakerAddress, tokenId, encode, {
        gasLimit: 300000,
      });
      const tracker = initTxTracker('LpStakingModal', 'LpStaking', ``);
      setTransaction(
        res,
        tracker,
        'Deposit' as RecentActivityType,
        () => {},
        () => {},
      );
    } catch (error: any) {
      console.error(error.code);
      // throw Error(error);
    }
  };

  return staking;
};

export default useLpStaking;
