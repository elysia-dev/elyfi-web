import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Token from 'src/enums/Token';
import TxContext from 'src/contexts/TxContext';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import { formatSixFracionDigit } from 'src/utiles/formatters';
import { LpRewardModalProps } from 'src/core/types/RewardTypes';
import buildEventEmitter from 'src/utiles/buildEventEmitter';
import ModalViewType from 'src/enums/ModalViewType';
import TransactionType from 'src/enums/TransactionType';
import ElyfiVersions from 'src/enums/ElyfiVersions';
import { useWeb3React } from '@web3-react/core';
import { ethers, utils } from 'ethers';
import stakerABI from 'src/core/abi/StakerABI.json';
import envs from 'src/core/envs';
import RecentActivityType from 'src/enums/RecentActivityType';
import ModalHeader from '../ModalHeader';

const iFace = new utils.Interface(stakerABI);

const RewardModal: React.FunctionComponent<LpRewardModalProps> = ({
  visible,
  closeHandler,
  rewardToReceive,
}) => {
  const { t } = useTranslation();
  const { txWaiting } = useContext(TxContext);
  const { account, chainId, library } = useWeb3React();
  const { setTransaction } = useContext(TxContext);

  const claim = async () => {
    const staker = new ethers.Contract(
      envs.stakerAddress,
      stakerABI,
      library.getSigner(),
    );
    try {
      const res = await staker.multicall([
        iFace.encodeFunctionData('claimReward', [
          envs.governanceAddress,
          account,
          0,
        ]),
        iFace.encodeFunctionData('claimReward', [
          envs.daiAddress,
          account,
          0,
        ]),
        iFace.encodeFunctionData('claimReward', [
          envs.wEthAddress,
          account,
          0,
        ])
      ]);

      setTransaction(
        res,
        buildEventEmitter(
          ModalViewType.LPStakingIncentiveModal,
          TransactionType.Claim,
          JSON.stringify({
            version: ElyfiVersions.V1,
            chainId,
            address: account,
            incentiveDaiAmount: rewardToReceive.daiReward,
            incentiveEthAmount: rewardToReceive.ethReward,
            incentiveElfiAmount: rewardToReceive.elfiReward
          })
        ),
        'Claim' as RecentActivityType,
        () => {},
        () => {},
      );
    } catch (error: any) {
      console.error(error);
      throw new Error(`${error.message}`);
    }
  };

  const receiveRewardHandler = async () => {
    try {
      await claim();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (txWaiting) {
      closeHandler();
    }
  }, [txWaiting]);

  return (
    <div className="modal modal__lp__reward" style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader
          title={t('lpstaking.receive_reward')}
          onClose={() => closeHandler()}
        />
        <div className="modal__lp__reward__container">
          <div>
            <div>
              <img src={elfi} />
              <h2>
                {Token.ELFI}
              </h2>
            </div>
            <h2>
              {formatSixFracionDigit(rewardToReceive.elfiReward)}
              <span className="bold">
                {Token.ELFI}
              </span>
            </h2>
          </div>
          
          <div>
            <div>
              <img src={eth} />
              <h2>
                {Token.ETH}
              </h2>
            </div>
            <h2>
              {formatSixFracionDigit(rewardToReceive.ethReward)}
              <span className="bold">{Token.ETH}</span>
            </h2>
          </div>
          <div>
            <div>
              <img src={dai} />
              <h2>
                {Token.DAI}
              </h2>
            </div>
            <h2>
              {formatSixFracionDigit(rewardToReceive.daiReward)}
              <span>{Token.DAI}</span>
            </h2>
          </div>
        </div>
        <div>
          <div
            className={`modal__button`}
            onClick={() => receiveRewardHandler()}>
            <p>{t('staking.claim_reward')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardModal;
