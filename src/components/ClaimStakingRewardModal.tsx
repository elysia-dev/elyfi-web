import { useWeb3React } from '@web3-react/core';
import { BigNumber, utils } from 'ethers';
import { FunctionComponent, useContext } from 'react';
import LoadingIndicator from 'src/components/LoadingIndicator';
import ElifyTokenImage from 'src/assets/images/ELFI.png';
import DaiImage from 'src/assets/images/dai.png';
import { formatCommaSmall } from 'src/utiles/formatters';
import Token from 'src/enums/Token';
import { useTranslation } from 'react-i18next';
import useStakingPool from 'src/hooks/useStakingPool';
import useWatingTx from 'src/hooks/useWaitingTx';
import useTxTracking from 'src/hooks/useTxTracking';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import ModalHeader from './ModalHeader';

const ClaimStakingRewardModal: FunctionComponent<{
  stakedToken: Token.ELFI | Token.EL;
  token: Token.ELFI | Token.DAI;
  balance: BigNumber;
  visible: boolean;
  round: number;
  closeHandler: () => void;
  afterTx: () => void;
  transactionModal: () => void;
}> = ({
  visible,
  stakedToken,
  token,
  balance,
  round,
  closeHandler,
  afterTx,
  transactionModal,
}) => {
  const { account } = useWeb3React();
  const stakingPool = useStakingPool(stakedToken, round >= 3);
  const { waiting } = useWatingTx();
  const { t } = useTranslation();
  const initTxTracker = useTxTracking();
  const { setTransaction, failTransaction } = useContext(TxContext);

  return (
    <div
      className="modal modal__incentive"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader
          image={token === Token.ELFI ? ElifyTokenImage : DaiImage}
          title={token}
          onClose={closeHandler}
        />
        <div className="modal__body">
          {waiting ? (
            <LoadingIndicator />
          ) : (
            <>
              <div className="modal__incentive__body">
                <p
                  className="modal__incentive__value bold"
                  style={{
                    fontSize:
                      window.sessionStorage.getItem('@MediaQuery') !== 'PC'
                        ? 30
                        : 60,
                  }}>
                  {formatCommaSmall(balance)}
                </p>
              </div>
              <div
                className="modal__button"
                onClick={() => {
                  if (!account) return;

                  const tracker = initTxTracker(
                    'ClaimStakingRewardModal',
                    'Claim',
                    `${utils.formatEther(
                      balance,
                    )} ${stakedToken} ${round}round`,
                  );

                  tracker.clicked();

                  // TRICKY
                  // ELFI V2 StakingPool need round - 2 value
                  stakingPool
                    ?.claim(
                      (round >= 3 && stakedToken === Token.ELFI
                        ? round - 2
                        : round
                      ).toString(),
                    )
                    .then((tx) => {
                      setTransaction(
                        tx,
                        tracker,
                        (stakedToken + 'Claim') as RecentActivityType,
                        () => {
                          transactionModal();
                          closeHandler();
                        },
                        () => {
                          afterTx();
                        },
                      );
                    })
                    .catch((e) => {
                      failTransaction(tracker, closeHandler, e);
                    });
                }}>
                <p>{t('staking.claim_reward')}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimStakingRewardModal;
