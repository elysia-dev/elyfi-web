import { useTranslation } from 'react-i18next';
import { useEffect, useState, useContext } from 'react';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import envs from 'src/core/envs';
import stakerABI from 'src/core/abi/StakerABI.json';
import { BigNumber, constants, ethers, utils } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import {
  formatDecimalFracionDigit,
  formatSixFracionDigit,
} from 'src/utiles/formatters';
import TxContext from 'src/contexts/TxContext';
import Token from 'src/enums/Token';
import Guide from '../Guide';
import LpButton from './LpButton';
import RewardModal from './RewardModal';

function LpReward() {
  const { t } = useTranslation();
  const { account, library } = useWeb3React();
  const [totalReward, setTotalReward] = useState<{
    elfiReward: number;
    wEthReward: number;
    daiReward: number;
  }>({
    elfiReward: 0,
    wEthReward: 0,
    daiReward: 0,
  });
  const [stakingModalVisible, setStakingModalVisible] = useState(false);
  const { txWaiting, txStatus } = useContext(TxContext);

  const staker = new ethers.Contract(
    envs.stakerAddress,
    stakerABI,
    library.getSigner(),
  );

  const getReward = async () => {
    try {
      setTotalReward({
        ...totalReward,
        daiReward: parseFloat(
          utils.formatEther(await staker.rewards(envs.daiAddress, account)),
        ),
        wEthReward: parseFloat(
          utils.formatEther(await staker.rewards(envs.wEthAddress, account)),
        ),
        elfiReward: parseFloat(
          utils.formatEther(
            await staker.rewards(envs.governanceAddress, account),
          ),
        ),
      });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (txWaiting) return;
    getReward();
  }, [txWaiting]);

  return (
    <>
      <RewardModal
        visible={stakingModalVisible}
        closeHandler={() => setStakingModalVisible(false)}
        totalReward={totalReward}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 110,
        }}>
        <div className="spoqa__bold">
          {t('lpstaking.reward_amount')}
          <Guide content={t('guide.receive_reward')} />
        </div>
        <div className="header_line" />
      </div>
      <div className="lp_reward_content_wrapper">
        <div className="spoqa__bold lp_reward_content">
          <div className="lp_token_wrapper">
            <div>
              <img src={elfi} />
              {Token.ELFI}
            </div>
            <div
              style={{
                color: '#00BFFF',
              }}>
              {`${formatDecimalFracionDigit(totalReward.elfiReward, 4)} `}
              <div>{Token.ELFI}</div>
            </div>
          </div>
          <div className="lp_token_wrapper">
            <div>
              <img src={eth} />
              {Token.ETH}
            </div>
            <div
              style={{
                color: '#627EEA',
              }}>
              {`${formatDecimalFracionDigit(totalReward.wEthReward, 4)} `}
              <div>{Token.ETH}</div>
            </div>
          </div>
          <div className="lp_token_wrapper">
            <div>
              <img src={dai} />
              {Token.DAI}
            </div>
            <div
              style={{
                color: '#FBC54E',
              }}>
              {`${formatDecimalFracionDigit(totalReward.daiReward, 4)} `}
              <div>{Token.DAI}</div>
            </div>
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: 25,
          }}>
          <LpButton
            onHandler={() => setStakingModalVisible(true)}
            btnTitle={t('staking.claim_reward')}
          />
        </div>
      </div>
    </>
  );
}

export default LpReward;
