import { useContext, useEffect, useState } from 'react';
import envs from 'src/core/envs';
import { useTranslation } from 'react-i18next';
import useWatingTx from 'src/hooks/useWaitingTx';
import LoadingIndicator from 'src/components/LoadingIndicator';
import Token from 'src/enums/Token';
import TxContext from 'src/contexts/TxContext';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import SelectBox from 'src/components/SelectBox';
import { TokenInfo } from 'src/core/types/Position';
import useLpStaking from 'src/hooks/useLpStaking';

const StakingModal: React.FunctionComponent<{
  visible: boolean;
  closeHandler: () => void;
  token0: string;
  token1?: Token.DAI | Token.ETH;
  unstakedPositions: TokenInfo[];
}> = ({ visible, closeHandler, token0, token1, unstakedPositions }) => {
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

  const secondImg = token1 === Token.ETH ? eth : dai;
  const stakingPoolAdress =
    token1 === Token.ETH ? envs.ethElfiPoolAddress : envs.daiElfiPoolAddress;
  const rewardTokenAddress =
    token1 === Token.ETH ? envs.wEthAddress : envs.daiAddress;

  const lpStakingHandler = async () => {
    try {
      staking(stakingPoolAdress, rewardTokenAddress, selectedToken.id);
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
              src={secondImg}
              alt={secondImg}
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
