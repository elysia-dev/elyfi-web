import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useWatingTx from 'src/hooks/useWaitingTx';
import LoadingIndicator from 'src/components/LoadingIndicator';
import TxContext from 'src/contexts/TxContext';
import elfi from 'src/assets/images/ELFI.png';
import SelectBox from 'src/components/SelectBox';
import useLpStaking from 'src/hooks/useLpStaking';
import { LpStakingModalProps } from 'src/core/types/LpStakingTypeProps';
import ModalHeader from '../ModalHeader';
import ModalConverter from '../ModalConverter';

const StakingModal: React.FunctionComponent<LpStakingModalProps> = (props) => {
  const {
    visible,
    closeHandler,
    token0,
    token1,
    unstakedPositions,
    tokenImg,
    stakingPoolAddress,
    rewardTokenAddress,
    round,
    transactionWait,
    setTransactionWait,
  } = props;
  const { t } = useTranslation();
  const [stakingMode, setStakingMode] = useState<boolean>(true);
  const { txWaiting } = useContext(TxContext);
  const { waiting } = useWatingTx();
  const staking = useLpStaking();
  const [selectedToken, setSelectedToken] = useState<{
    id: string;
    liquidity: string;
    selectBoxTitle: string;
  }>({
    id: '',
    liquidity: '',
    selectBoxTitle: t('lpstaking.lp_staking_modal_default'),
  });

  const lpStakingHandler = async () => {
    try {
      setTransactionWait()
      await staking(
        stakingPoolAddress,
        rewardTokenAddress,
        selectedToken.id,
        round,
      );
    } catch (error: any) {
      closeHandler();
      console.error(error);
    } finally {
      setSelectedToken({
        id: '',
        liquidity: '',
        selectBoxTitle: t('lpstaking.lp_staking_modal_default'),
      });
    }
  };

  useEffect(() => {
    if (txWaiting) {
      closeHandler();
    }
  }, [txWaiting]);

  return (
    <div
      className="modal modal__lp__staking"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader
          image={elfi}
          subImage={tokenImg}
          title={t('lpstaking.lp_token_staking_title', {
            token0,
            token1,
          })}
          onClose={() => {
            closeHandler();
            setSelectedToken({
              id: '',
              liquidity: '',
              selectBoxTitle: t('lpstaking.lp_staking_modal_default'),
            });
          }}
        />
        <ModalConverter
          handlerProps={stakingMode}
          setState={setStakingMode}
          title={[t('staking.staking')]}
        />
        {transactionWait ? (
          <LoadingIndicator isTxActive={transactionWait} />
        ) : (
          <>
            <div className="modal__lp__staking__body">
              {unstakedPositions.length === 0 ? (
                <div className="modal__lp__staking__undefined">
                  <h2>{t('lpstaking.no_lp_token')}</h2>
                </div>
              ) : (
                <SelectBox
                  selectedToken={selectedToken}
                  setSelectedToken={setSelectedToken}
                  unstakedPositions={unstakedPositions}
                />
              )}
            </div>
          </>
        )}
        <div
          className={`modal__button${
            transactionWait 
              ? " disable" 
              : unstakedPositions.length === 0
              ? ' disable'
              : selectedToken.id
              ? ''
              : ' disable'
          }`}
          onClick={() =>
            transactionWait 
              ? '' 
              : unstakedPositions.length === 0
              ? ''
              : selectedToken.id
              ? lpStakingHandler()
              : ''
          }>
          <p>{t('staking.staking')}</p>
        </div>
      </div>
    </div>
  );
};

export default StakingModal;