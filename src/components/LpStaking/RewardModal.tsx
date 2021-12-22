import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Token from 'src/enums/Token';
import TxContext from 'src/contexts/TxContext';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import { formatSixFracionDigit } from 'src/utiles/formatters';
import useClaimReward from 'src/hooks/useClaimReward';
import { LpRewardModalProps } from 'src/core/types/RewardTypes';
import ModalHeader from '../ModalHeader';

const RewardModal: React.FunctionComponent<LpRewardModalProps> = ({
  visible,
  closeHandler,
  rewardToReceive,
}) => {
  const { t } = useTranslation();
  const { txWaiting } = useContext(TxContext);
  const claim = useClaimReward();

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
