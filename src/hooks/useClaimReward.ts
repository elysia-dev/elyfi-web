import { ContractTransaction, ethers } from 'ethers';
import envs from 'src/core/envs';
import stakerABI from 'src/core/abi/StakerABI.json';
import { useContext } from 'react';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import { Web3Context } from 'src/providers/Web3Provider';
import useTxTracking from './useTxTracking';

const useClaimReward: () => () => void = () => {
  const { account, provider } = useContext(Web3Context);
  const { setTransaction } = useContext(TxContext);
  const initTxTracker = useTxTracking();
  const iFace = new ethers.utils.Interface(stakerABI);

  const claim = async () => {
    const staker = new ethers.Contract(
      envs.stakerAddress,
      stakerABI,
      provider?.getSigner(),
    );
    try {
      const elfi = iFace.encodeFunctionData('claimReward', [
        envs.governanceAddress,
        account,
        0,
      ]);
      const dai = iFace.encodeFunctionData('claimReward', [
        envs.daiAddress,
        account,
        0,
      ]);
      const eth = iFace.encodeFunctionData('claimReward', [
        envs.wEthAddress,
        account,
        0,
      ]);
      const res = await staker.multicall([elfi, dai, eth]);
      const tracker = initTxTracker('LpStakingModal', 'ClaimReward', ``);
      setTransaction(
        res,
        tracker,
        'Claim' as RecentActivityType,
        () => {},
        () => {},
      );
    } catch (error: any) {
      console.error(error);
      throw new Error(`${error.message}`);
    }
  };

  return claim;
};

export default useClaimReward;
