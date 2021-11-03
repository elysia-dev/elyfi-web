import {
  BigNumber,
  constants,
  ContractTransaction,
  ethers,
  providers,
  utils,
} from 'ethers';
import { useContext, useState, useEffect } from 'react';
import envs from 'src/core/envs';
import { useTranslation } from 'react-i18next';
import useWatingTx from 'src/hooks/useWaitingTx';
import { useWeb3React } from '@web3-react/core';
import Token from 'src/enums/Token';
import moment from 'moment';
import useStakingPool from 'src/hooks/useStakingPool';
import useERC20Info from 'src/hooks/useERC20Info';
import useTxTracking from 'src/hooks/useTxTracking';
import txStatus from 'src/enums/TxStatus';
import TxContext from 'src/contexts/TxContext';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import stakerABI from 'src/core/abi/StakerABI.json';
import { formatSixFracionDigit } from 'src/utiles/formatters';
import RecentActivityType from 'src/enums/RecentActivityType';

const RewardModal: React.FunctionComponent<{
  visible: boolean;
  closeHandler: () => void;
  totalReward: {
    elfiReward: number;
    wEthReward: number;
    daiReward: number;
  };
}> = ({ visible, closeHandler, totalReward }) => {
  const { t } = useTranslation();
  const { account, library } = useWeb3React();
  const { setTransaction } = useContext(TxContext);
  const initTxTracker = useTxTracking();

  const receiveRewardHandler = async () => {
    const staker = new ethers.Contract(
      envs.stakerAddress,
      stakerABI,
      library.getSigner(),
    );
    const iFace = new ethers.utils.Interface(stakerABI);
    const callOne = iFace.encodeFunctionData('claimReward', [
      envs.governanceAddress,
      account,
      0,
    ]);
    const callTwo = iFace.encodeFunctionData('claimReward', [
      envs.daiAddress,
      account,
      0,
    ]);
    const callThree = iFace.encodeFunctionData('claimReward', [
      envs.wEth,
      account,
      0,
    ]);
    const res: ContractTransaction = await staker.multicall([
      callOne,
      callTwo,
      callThree,
    ]);
    const tracker = initTxTracker('LpStakingModal', 'ClaimReward', `1 2round`);
    setTransaction(
      res,
      tracker,
      'Claim' as RecentActivityType,
      () => {
        closeHandler();
      },
      () => {},
    );
  };

  return (
    <div className="modal" style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name spoqa__bold">
                {t('staking.receive_reward')}
              </p>
            </div>
          </div>
          <div
            className="close-button"
            onClick={() => {
              closeHandler();
            }}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className="lptoken_reward_Modal_body">
          <div className="spoqa__bold">
            <div>
              <img src={eth} />
              {Token.ETH}
            </div>
            <div className="lp_reward_eth">
              {formatSixFracionDigit(totalReward.wEthReward)}
              <div>{Token.ETH}</div>
            </div>
          </div>
          <div className="spoqa__bold">
            <div>
              <img src={elfi} />
              {Token.ELFI}
            </div>
            <div className="lp_reward_elfi">
              {formatSixFracionDigit(totalReward.elfiReward)}
              <div>{Token.ELFI}</div>
            </div>
          </div>
          <div
            className="spoqa__bold"
            style={{
              marginBottom: 0,
            }}>
            <div>
              <img src={dai} />
              {Token.DAI}
            </div>
            <div className="lp_reward_dai">
              {formatSixFracionDigit(totalReward.daiReward)}
              <div>{Token.DAI}</div>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`modal__button`}
            onClick={() => receiveRewardHandler()}>
            <p>{t('staking.receive_reward')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;
