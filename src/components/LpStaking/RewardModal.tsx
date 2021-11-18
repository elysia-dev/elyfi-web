import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Token from 'src/enums/Token';
import TxContext from 'src/contexts/TxContext';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import { formatSixFracionDigit } from 'src/utiles/formatters';
import useClaimReward from 'src/hooks/useClaimReward';
import { LpRewardModal } from 'src/core/types/RewardTypes';

const RewardModal: React.FunctionComponent<LpRewardModal> = ({
  visible,
  closeHandler,
  rewardToReceive,
}) => {
  const { t } = useTranslation();
  const { txWaiting } = useContext(TxContext);
  const claim = useClaimReward();

  const receiveRewardHandler = () => {
    claim();
  };

  useEffect(() => {
    if (txWaiting) {
      closeHandler();
    }
  }, [txWaiting]);

  return (
    <div className="modal" style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name spoqa__bold">
                {t('lpstaking.receive_reward')}
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
              <img src={elfi} />
              {Token.ELFI}
            </div>
            <div className="lp_reward_elfi">
              {formatSixFracionDigit(rewardToReceive.elfiReward)}
              <div>{Token.ELFI}</div>
            </div>
          </div>
          <div className="spoqa__bold">
            <div>
              <img src={eth} />
              {Token.ETH}
            </div>
            <div className="lp_reward_eth">
              {formatSixFracionDigit(rewardToReceive.ethReward)}
              <div>{Token.ETH}</div>
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
              {formatSixFracionDigit(rewardToReceive.daiReward)}
              <div>{Token.DAI}</div>
            </div>
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
