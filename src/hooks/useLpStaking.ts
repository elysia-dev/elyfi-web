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
) => void = () => {
  const { account, library } = useWeb3React();
  const { setTransaction } = useContext(TxContext);
  const initTxTracker = useTxTracking();

  const staking = async (
    stakingPoolAdress: string,
    rewardTokenAddress: string,
    tokenId: string,
  ) => {
    try {
      const encode = new ethers.utils.AbiCoder().encode(
        ['tuple(address,address,uint256,uint256,address)[]'],
        [
          [
            lpTokenValues(stakingPoolAdress, envs.governanceAddress),
            lpTokenValues(stakingPoolAdress, rewardTokenAddress),
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
      ](account, envs.stakerAddress, tokenId, encode);
      const tracker = initTxTracker('LpStakingModal', 'LpStaking', ``);
      setTransaction(
        res,
        tracker,
        'Deposit' as RecentActivityType,
        () => {},
        () => {},
      );
    } catch (error) {
      throw Error(error);
    }
  };

  return staking;
};

export default useLpStaking;
