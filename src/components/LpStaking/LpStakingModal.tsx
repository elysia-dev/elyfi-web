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
import LoadingIndicator from 'src/components/LoadingIndicator';
import { useWeb3React } from '@web3-react/core';
import Token from 'src/enums/Token';
import moment from 'moment';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import useStakingPool from 'src/hooks/useStakingPool';
import useERC20Info from 'src/hooks/useERC20Info';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import useTxTracking from 'src/hooks/useTxTracking';
import txStatus from 'src/enums/TxStatus';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import SelectBox from 'src/components/SelectBox';
import positionABI from 'src/core/abi/NonfungiblePositionManager.json';
import stakerABI from 'src/core/abi/StakerABI.json';
import AbiCoder from 'ethers/lib/utils';
import Position, { TokenInfo } from 'src/core/types/Position';

const LpStakingModal: React.FunctionComponent<{
  visible: boolean;
  closeHandler: () => void;
  afterTx: () => void;
  stakedToken: Token.ELFI | Token.EL;
  stakedBalance: BigNumber;
  round: number;
  endedModal: () => void;
  setTxStatus: (status: txStatus) => void;
  setTxWaiting: (status: boolean) => void;
  transactionModal: () => void;
  firstToken: string;
  secondToken: string;
  positions: Position[];
  lpTokens: TokenInfo[];
}> = ({
  visible,
  closeHandler,
  afterTx,
  stakedBalance,
  stakedToken,
  round,
  transactionModal,
  firstToken,
  secondToken,
  positions,
  lpTokens,
}) => {
  const { t } = useTranslation();
  const { account, library } = useWeb3React();
  const [stakingMode, setStakingMode] = useState<boolean>(true);
  const [amount, setAmount] = useState({ value: '', max: false });
  const current = moment();
  const { setTransaction, failTransaction } = useContext(TxContext);
  const stakingPool = useStakingPool(stakedToken, round >= 3);
  const {
    allowance,
    balance,
    loading: allowanceLoading,
    refetch,
    contract,
  } = useERC20Info(
    stakedToken === Token.EL ? envs.elAddress : envs.governanceAddress,
    stakingPool.address,
  );
  const { waiting, wait } = useWatingTx();
  const amountLteZero =
    !amount || utils.parseEther(amount.value || '0').isZero();
  const amountGtBalance = utils.parseEther(amount.value || '0').gt(balance);
  const amountGtStakedBalance = utils
    .parseEther(amount.value || '0')
    .gt(stakedBalance);
  const initTxTracker = useTxTracking();
  const [selectedToken, setSelectedToken] = useState<{
    id: string;
    liquidity: string;
    selectBoxTitle: string;
  }>({
    id: '',
    liquidity: '',
    selectBoxTitle: t('lpstaking.lp_staking_modal_default'),
  });

  useEffect(() => {
    setAmount({
      max: false,
      value: '',
    });
  }, [stakingMode, visible]);

  const secondImg = secondToken === Token.ETH ? eth : dai;
  const stakingPoolAdress =
    secondToken === Token.ETH
      ? envs.ethElfiPoolAddress
      : envs.daiElfiPoolAddress;
  const rewardTokenAddress =
    secondToken === Token.ETH ? envs.wEth : envs.daiAddress;

  const lpStakingHandler = async () => {
    const encode = new ethers.utils.AbiCoder().encode(
      ['tuple(address,address,uint256,uint256,address)[]'],

      [
        [
          [
            envs.governanceAddress, // 두 번 이더 / 다이
            stakingPoolAdress,
            1635751200,
            1638005456,
            account,
          ],
          [
            rewardTokenAddress, // 두 번 이더 / 다이
            stakingPoolAdress,
            1635751200,
            1638005456,
            account,
          ],
        ],
      ],
    );

    const contract1 = new ethers.Contract(
      envs.nonFungiblePositionAddress,
      positionABI,
      library.getSigner(),
    );
    const res: ContractTransaction = await contract1[
      'safeTransferFrom(address,address,uint256,bytes)'
    ](account, envs.stakerAddress, selectedToken.id, encode);

    const tracker = initTxTracker('LpStakingModal', 'LpStaking', ``);
    setTransaction(
      res,
      tracker,
      'Deposit' as RecentActivityType,
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
                  firstToken,
                  secondToken,
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
              {lpTokens.length === 0 ? (
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
                  positions={positions}
                  selectedToken={selectedToken}
                  setSelectedToken={setSelectedToken}
                  lpTokens={lpTokens}
                />
              )}

              {!stakingMode ? (
                <p>
                  {amountGtStakedBalance
                    ? t('staking.insufficient_balance')
                    : t('staking.unstaking')}
                </p>
              ) : !allowanceLoading && allowance.gte(balance) ? (
                <div
                  className={`modal__button${
                    lpTokens.length === 0
                      ? '--disable'
                      : selectedToken.id
                      ? ''
                      : '--disable'
                  }`}
                  onClick={() =>
                    lpTokens.length === 0
                      ? ''
                      : selectedToken.id
                      ? lpStakingHandler()
                      : ''
                  }>
                  <p>{t('staking.staking')}</p>
                </div>
              ) : (
                <div
                  className={'modal__button'}
                  onClick={() => {
                    const tracker = initTxTracker(
                      'LpStakingModal',
                      `Approve`,
                      `${stakedToken} ${round}round`,
                    );

                    tracker.clicked();

                    contract
                      .approve(stakingPool.address, constants.MaxUint256)
                      .then((tx) => {
                        setTransaction(
                          tx,
                          tracker,
                          RecentActivityType.Approve,
                          () => {
                            closeHandler();
                            transactionModal();
                          },
                          () => {
                            refetch();
                            afterTx();
                          },
                        );
                      })
                      .catch((e) => {
                        failTransaction(tracker, closeHandler, e);
                      });
                  }}>
                  <p>
                    {t('dashboard.protocol_allow', { tokenName: stakedToken })}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LpStakingModal;
