import {
  useContext,
  useEffect,
  useRef,
  Suspense,
  useMemo,
  useState,
  lazy,
  useCallback,
} from 'react';
import MediaQuery from 'src/enums/MediaQuery';
import TokenColors from 'src/enums/TokenColors';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import DrawWave from 'src/utiles/drawWave';
import { useTranslation, Trans } from 'react-i18next';
import { useWeb3React } from '@web3-react/core';
import moment from 'moment';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import Token from 'src/enums/Token';
import useStakingRoundData from 'src/hooks/useStakingRoundData';
import useStakingFetchRoundData from 'src/hooks/useStakingFetchRoundData';
import FinishedStaking from 'src/components/Staking/FinishedStaking';
import { constants, ethers, utils } from 'ethers';
import StakingModalType from 'src/enums/StakingModalType';
import Skeleton from 'react-loading-skeleton';

const ClaimStakingRewardModal = lazy(
  () => import('src/components/Modal/ClaimStakingRewardModal'),
);
const StakingModal = lazy(() => import('src/components/Modal/StakingModal'));
const TransactionConfirmModal = lazy(
  () => import('src/components/Modal/TransactionConfirmModal'),
);

const LegacyStaking: React.FC = () => {
  const { account } = useWeb3React();
  const { t, i18n } = useTranslation();
  const current = moment();
  const { type: getMainnetType } = useContext(MainnetContext);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { value: mediaQuery } = useMediaQueryType();

  const rewardToken = useMemo(() => {
    return getMainnetType === MainnetType.BSC ? Token.BUSD : Token.DAI;
  }, [getMainnetType]);

  const currentPhase = useMemo(() => {
    return getMainnetType === MainnetType.BSC ? 2 : 7;
  }, [getMainnetType]);

  const { apr: poolApr } = useStakingRoundData(
    currentPhase - 1,
    Token.ELFI,
    rewardToken,
  );

  const { roundData, loading, error, fetchRoundData } =
    useStakingFetchRoundData(Token.ELFI, rewardToken, poolApr, currentPhase);

  console.log(loading);

  const currentRound = useMemo(() => {
    return roundData[currentPhase];
  }, [currentPhase, roundData]);

  const [selectModalRound, setRoundModal] = useState(0);
  const [modalValue, setModalValue] = useState(constants.Zero);
  const [modalType, setModalType] = useState('');
  const [isUnstaking, setIsUnstaking] = useState(true);

  const [transactionModal, setTransactionModal] = useState(false);
  const [transactionWait, setTransactionWait] = useState<boolean>(false);

  const accountAmount = useMemo(() => {
    return roundData.some((data) => {
      return data.accountPrincipal.gt(0);
    });
  }, [getMainnetType, account, roundData]);

  const modalVisible = useCallback(
    (type: StakingModalType) => {
      return modalType === type;
    },
    [modalType],
  );

  useEffect(() => {
    setRoundModal(0);
  }, [getMainnetType]);

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const headerY =
      headerRef.current.offsetTop + document.body.clientWidth > 1190
        ? canvas.height / 3 / dpr
        : 90;
    const browserWidth = canvas.width / dpr + 40;
    const browserHeight = canvas.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    if (mediaQuery === MediaQuery.Mobile) return;

    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      TokenColors.EL,
      browserHeight,
      true,
    );
  };

  useEffect(() => {
    draw();
    window.addEventListener('scroll', () => draw());
    window.addEventListener('resize', () => draw());

    return () => {
      window.removeEventListener('scroll', () => draw());
      window.removeEventListener('resize', () => draw());
    };
  }, [document.body.clientHeight]);

  return (
    <div className="legacy">
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <Suspense fallback={null}>
        {currentPhase === roundData.length && (
          <>
            <TransactionConfirmModal
              visible={transactionModal}
              closeHandler={() => {
                setTransactionModal(false);
              }}
            />
            <ClaimStakingRewardModal
              visible={modalVisible(StakingModalType.Claim)}
              stakedToken={Token.ELFI}
              token={Token.ELFI}
              balance={undefined}
              endedBalance={
                roundData[selectModalRound]?.accountReward || constants.Zero
              }
              stakingBalance={
                loading
                  ? constants.Zero
                  : roundData[selectModalRound].accountPrincipal
              }
              currentRound={currentRound}
              round={selectModalRound + 1}
              closeHandler={() => {
                setModalType('');
                setTransactionWait(false);
              }}
              afterTx={() => {
                account && fetchRoundData(account);
              }}
              transactionModal={() => setTransactionModal(true)}
              transactionWait={transactionWait}
              setTransactionWait={() => setTransactionWait(true)}
            />
            <StakingModal
              visible={modalVisible(StakingModalType.Staking)}
              closeHandler={() => {
                setModalType('');
                setTransactionWait(false);
              }}
              stakedToken={Token.ELFI}
              stakedBalance={
                loading
                  ? constants.Zero
                  : roundData[selectModalRound].accountPrincipal
              }
              round={selectModalRound + 1}
              afterTx={() => {
                account && fetchRoundData(account);
              }}
              endedModal={() => {
                setModalType(StakingModalType.StakingEnded);
              }}
              transactionModal={() => setTransactionModal(true)}
              transactionWait={transactionWait}
              setTransactionWait={() => setTransactionWait(true)}
              disableTransactionWait={() => setTransactionWait(false)}
              isUnstaking={isUnstaking}
            />
          </>
        )}
      </Suspense>
      <section className="legacy__header">
        <h2>{t('staking.legacy.title')}</h2>
        <p>{t('staking.legacy.content')}</p>
        <div ref={headerRef} />
      </section>
      {loading ? (
        <Skeleton width={'100%'} height={600} />
      ) : (
        <section className={`legacy__body ${accountAmount ? 'connect' : ''}`}>
          {accountAmount ? (
            <section className="staking__round__previous__wrapper">
              {
                // eslint-disable-next-line array-callback-return
                roundData.map((item, index) => {
                  if (currentPhase !== roundData.length) return;
                  if (current.diff(item.endedAt) > 0) {
                    return (
                      <FinishedStaking
                        key={`Finished_${index}`}
                        index={index}
                        item={item}
                        stakedToken={Token.ELFI}
                        rewardToken={rewardToken}
                        setModalType={setModalType}
                        setRoundModal={setRoundModal}
                        setModalValue={setModalValue}
                        setIsUnstaking={() => setIsUnstaking(false)}
                      />
                    );
                  }
                })
              }
            </section>
          ) : (
            <>
              <div className="legacy__body--left">
                <div className="legacy__body__all-round">
                  <h2>{t('staking.legacy.round')}</h2>
                  <p>2021.07.27 ~ 2022.04.17 KST</p>
                </div>
              </div>
              <div className="legacy__body--right">
                {!account ? (
                  <div className="legacy__body__undefined-data">
                    <h2>{t('staking.legacy.undefined.wallet')}</h2>
                  </div>
                ) : (
                  !accountAmount && (
                    <div className="legacy__body__undefined-data">
                      <h2>
                        {t('staking.legacy.undefined.amount', {
                          token: 'ELFI',
                        })}
                      </h2>
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default LegacyStaking;
