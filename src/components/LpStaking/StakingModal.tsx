import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useWatingTx from 'src/hooks/useWaitingTx';
import LoadingIndicator from 'src/components/LoadingIndicator';
import TxContext from 'src/contexts/TxContext';
import elfi from 'src/assets/images/ELFI.png';
import SelectBox from 'src/components/SelectBox';
import useLpStaking from 'src/hooks/useLpStaking';
import { LpStakingModalProps } from 'src/core/types/LpStakingTypeProps';

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
      staking(stakingPoolAddress, rewardTokenAddress, selectedToken.id);
    } catch (error) {
      alert(error);
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
    <div className="modal" style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <img
              src={elfi}
              alt={elfi}
              style={{
                width: 41,
                height: 41,
                zIndex: 5,
              }}
            />
            <img
              src={tokenImg}
              alt={tokenImg}
              style={{
                width: 41,
                height: 41,
                marginLeft: -20,
                marginRight: -6,
              }}
            />
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name spoqa__bold">
                {t('lpstaking.lp_token_staking_title', {
                  token0,
                  token1,
                })}
              </p>
            </div>
          </div>
          <div
            className="close-button"
            onClick={() => {
              closeHandler();
              setSelectedToken({
                id: '',
                liquidity: '',
                selectBoxTitle: t('lpstaking.lp_staking_modal_default'),
              });
            }}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className="modal__converter">
          <div
            className={`modal__converter__column${
              stakingMode ? '--selected' : ''
            }`}
            onClick={() => {
              setStakingMode(true);
            }}>
            <p className="bold">{t('staking.staking')}</p>
          </div>
        </div>
        {waiting ? (
          <LoadingIndicator />
        ) : (
          <div className="modal__body">
            <div>
              {unstakedPositions.length === 0 ? (
                <div
                  className="spoqa"
                  style={{
                    fontSize: 15,
                    color: '#646464',
                    textAlign: 'center',
                    paddingTop: 91,
                    paddingBottom: 91,
                  }}>
                  {t('lpstaking.no_lp_token')}
                </div>
              ) : (
                <SelectBox
                  selectedToken={selectedToken}
                  setSelectedToken={setSelectedToken}
                  unstakedPositions={unstakedPositions}
                />
              )}
              <div
                className={`modal__button${
                  unstakedPositions.length === 0
                    ? '--disable'
                    : selectedToken.id
                    ? ''
                    : '--disable'
                }`}
                onClick={() =>
                  unstakedPositions.length === 0
                    ? ''
                    : selectedToken.id
                    ? lpStakingHandler()
                    : ''
                }>
                <p>{t('staking.staking')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StakingModal;
