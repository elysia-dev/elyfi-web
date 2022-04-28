import { useWeb3React } from '@web3-react/core';
import { constants } from 'ethers';
import {
  useEffect,
  useContext,
  useState,
  useCallback,
  useRef,
  lazy,
  Suspense,
  useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import Token from 'src/enums/Token';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import DrawWave from 'src/utiles/drawWave';
import TokenColors from 'src/enums/TokenColors';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import calcExpectedReward from 'src/core/utils/calcExpectedReward';
import { rewardPerDayByToken } from 'src/utiles/stakingReward';
import StakingModalType from 'src/enums/StakingModalType';
import useUniswapV2Apr from 'src/hooks/useUniswapV2Apr';
import useStakingRoundDataV2 from '../Staking/hooks/useStakingRoundDataV2';
import useStakingFetchRoundDataV2 from '../Staking/hooks/useStakingFetchRoundDataV2';
import LpStakingContainer from './LpStakingContainer';

const ClaimStakingRewardModalV2 = lazy(
  () => import('src/components/Staking/modal/ClaimStakingRewardModalV2'),
);
const StakingModalV2 = lazy(
  () => import('src/components/Staking/modal/StakingModalV2'),
);
const TransactionConfirmModal = lazy(
  () => import('src/components/Modal/TransactionConfirmModal'),
);

function LPStaking(): JSX.Element {
  const { account } = useWeb3React();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();
  const { type: getMainnetType } = useContext(MainnetContext);
  const [selectToken, setToken] = useState(Token.ELFI_DAI_LP);

  const rewardToken = Token.ELFI;

  const { apr: ethPoolApr, totalPrincipal: ethTotalPrincipal } =
    useStakingRoundDataV2(Token.ELFI_ETH_LP, Token.ELFI);

  const { apr: daiPoolApr, totalPrincipal: daiTotalPrincipal } =
    useStakingRoundDataV2(Token.ELFI_DAI_LP, Token.ELFI);

  const {
    roundData: ethRoundData,
    loading: ethLoading,
    error: ethError,
    fetchRoundData: ethFetchData,
  } = useStakingFetchRoundDataV2(Token.ELFI_ETH_LP, rewardToken, ethPoolApr);
  const {
    roundData: daiRoundData,
    loading: daiLoading,
    error: daiError,
    fetchRoundData: daiFetchData,
  } = useStakingFetchRoundDataV2(Token.ELFI_DAI_LP, rewardToken, daiPoolApr);

  const [modalType, setModalType] = useState('');
  const [transactionModal, setTransactionModal] = useState(false);
  const [transactionWait, setTransactionWait] = useState<boolean>(false);
  const [modalValue, setModalValue] = useState(constants.Zero);

  const { uniswapV2Apr, aprLoading } = useUniswapV2Apr();

  const v2LPPoolApr = useMemo(() => {
    return [uniswapV2Apr.elfiEthPool, uniswapV2Apr.elfiDaiPool];
  }, [uniswapV2Apr]);

  const [ethExpectedReward, setEthExpectedReward] = useState({
    before: constants.Zero,
    value: constants.Zero,
  });

  const [daiExpectedReward, setDaiExpectedReward] = useState({
    before: constants.Zero,
    value: constants.Zero,
  });

  const modalVisible = useCallback(
    (type: StakingModalType) => {
      return modalType === type;
    },
    [modalType],
  );

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY =
      headerRef.current.offsetTop +
      (document.body.clientWidth > 1190 ? 90 : 45);
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const browserHeight = canvas.height / dpr;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.scale(dpr, dpr);

    if (mediaQuery === MediaQuery.Mobile) {
      new DrawWave(ctx, browserWidth).drawMobileOnPages(
        headerY,
        TokenColors.ELFI,
        browserHeight,
        true,
        'LP',
      );
      return;
    }

    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      TokenColors.ELFI,
      browserHeight,
      true,
      'LP',
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

  const setExpectedReward = (token: Token) => {
    return token === Token.ELFI_ETH_LP
      ? setEthExpectedReward({
          ...ethExpectedReward,
          before: ethExpectedReward.value.isZero()
            ? ethRoundData[0].accountReward
            : ethExpectedReward.value,
          value: calcExpectedReward(
            ethRoundData[0],
            rewardPerDayByToken(Token.ELFI_ETH_LP, getMainnetType),
          ),
        })
      : setDaiExpectedReward({
          ...daiExpectedReward,
          before: daiExpectedReward.value.isZero()
            ? daiRoundData[0].accountReward
            : daiExpectedReward.value,
          value: calcExpectedReward(
            daiRoundData[0],
            rewardPerDayByToken(Token.ELFI_DAI_LP, getMainnetType),
          ),
        });
  };

  useEffect(() => {
    if (ethLoading || ethError) return;

    const ethInterval = setInterval(() => {
      if (!account) return;

      setEthExpectedReward({
        before: ethExpectedReward.value.isZero()
          ? ethRoundData[0].accountReward
          : ethExpectedReward.value,
        value: calcExpectedReward(
          ethRoundData[0],
          rewardPerDayByToken(Token.ELFI_ETH_LP, getMainnetType),
        ),
      });
    }, 2000);

    return () => {
      clearInterval(ethInterval);
    };
  });

  useEffect(() => {
    if (daiLoading || daiError) return;

    const daiInterval = setInterval(() => {
      if (!account) return;

      setDaiExpectedReward({
        before: daiExpectedReward.value.isZero()
          ? daiRoundData[0].accountReward
          : daiExpectedReward.value,
        value: calcExpectedReward(
          daiRoundData[0],
          rewardPerDayByToken(Token.ELFI_DAI_LP, getMainnetType),
        ),
      });
    }, 2000);

    return () => {
      clearInterval(daiInterval);
    };
  });

  useEffect(() => {
    setEthExpectedReward({
      before: constants.Zero,
      value: constants.Zero,
    });
    setDaiExpectedReward({
      before: constants.Zero,
      value: constants.Zero,
    });
  }, [getMainnetType]);

  return (
    <>
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
        {ethRoundData.length !== 0 && daiRoundData.length !== 0 && (
          <>
            <TransactionConfirmModal
              visible={transactionModal}
              closeHandler={() => {
                setTransactionModal(false);
              }}
            />
            <ClaimStakingRewardModalV2
              visible={modalVisible(StakingModalType.Claim)}
              stakedToken={selectToken}
              token={Token.ELFI}
              balance={
                selectToken === Token.ELFI_ETH_LP
                  ? ethExpectedReward
                  : daiExpectedReward
              }
              stakingBalance={
                selectToken === Token.ELFI_ETH_LP
                  ? ethLoading
                    ? constants.Zero
                    : ethRoundData[0]?.accountPrincipal
                  : daiLoading
                  ? constants.Zero
                  : daiRoundData[0]?.accountPrincipal
              }
              currentRound={
                selectToken === Token.ELFI_ETH_LP
                  ? ethRoundData[0]
                  : daiRoundData[0]
              }
              closeHandler={() => {
                setModalType('');
                setExpectedReward(
                  selectToken === Token.ELFI_ETH_LP
                    ? Token.ELFI_ETH_LP
                    : Token.ELFI_DAI_LP,
                );
                setTransactionWait(false);
              }}
              afterTx={() => {
                account && (daiFetchData(account), ethFetchData(account));
              }}
              transactionModal={() => setTransactionModal(true)}
              transactionWait={transactionWait}
              setTransactionWait={() => setTransactionWait(true)}
            />
            <StakingModalV2
              visible={modalVisible(StakingModalType.Staking)}
              closeHandler={() => {
                setModalType('');
                setTransactionWait(false);
              }}
              stakedToken={selectToken}
              stakedBalance={
                selectToken === Token.ELFI_ETH_LP
                  ? ethLoading
                    ? constants.Zero
                    : ethRoundData[0]?.accountPrincipal
                  : daiLoading
                  ? constants.Zero
                  : daiRoundData[0]?.accountPrincipal
              }
              afterTx={() => {
                account && daiFetchData(account);
                ethFetchData(account);
              }}
              endedModal={() => {
                setModalType(StakingModalType.StakingEnded);
              }}
              transactionModal={() => setTransactionModal(true)}
              transactionWait={transactionWait}
              setTransactionWait={() => setTransactionWait(true)}
              disableTransactionWait={() => setTransactionWait(false)}
              title={selectToken}
            />
          </>
        )}
      </Suspense>
      <section className="staking__v2">
        <div className="staking__v2__title">
          <div ref={headerRef} />
          <h2>{t('staking.lp.title')}</h2>
          <p>{t('staking.lp.content')}</p>
        </div>
        {getMainnetType === MainnetType.Ethereum ? (
          <section className="staking__v2__body">
            <LpStakingContainer
              tokenTitle={'ELFI-ETH LP'}
              subImage={eth}
              v2LPPoolApr={v2LPPoolApr[0]}
              totalPrincipal={ethTotalPrincipal}
              uniswapLink={
                'https://app.uniswap.org/#/add/v2/0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4/ETH?chain=mainnet'
              }
              isAprLoading={aprLoading}
              isRoundDataLoading={ethLoading}
              roundData={ethRoundData[0]}
              rewardToken={rewardToken}
              setToken={setToken}
              setModalValue={setModalValue}
              setModalType={setModalType}
              expectedReward={ethExpectedReward}
              tokenType={Token.ELFI_ETH_LP}
              setExpectedReward={setExpectedReward}
            />
            <LpStakingContainer
              tokenTitle={'ELFI-DAI LP'}
              subImage={dai}
              v2LPPoolApr={v2LPPoolApr[1]}
              totalPrincipal={daiTotalPrincipal}
              uniswapLink={
                'https://app.uniswap.org/#/add/v2/0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4/0x6b175474e89094c44da98b954eedeac495271d0f?chain=mainnet'
              }
              isAprLoading={aprLoading}
              isRoundDataLoading={daiLoading}
              roundData={daiRoundData[0]}
              rewardToken={rewardToken}
              setToken={setToken}
              setModalValue={setModalValue}
              setModalType={setModalType}
              expectedReward={daiExpectedReward}
              tokenType={Token.ELFI_DAI_LP}
              setExpectedReward={setExpectedReward}
            />
          </section>
        ) : (
          <>
            <div style={{ marginTop: 300 }} />
            <div className="staking__coming-soon lp">
              <div>
                <h2>COMING SOON</h2>
              </div>
              <div />
              <div />
              <div />
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default LPStaking;
