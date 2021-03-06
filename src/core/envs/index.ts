import testVars from './test.json';
import prodVars from './prod.json';

interface EnvironmentVariables {
  moneyPool: {
    bscMoneyPoolAddress: string;
    moneyPoolAddress: string;
    daiTokenizerAddress: string;
    usdtTokenizerAddress: string;
  };
  incentivePool: {
    prevDaiIncentivePool: string;
    prevUSDTIncentivePool: string;
    currentDaiIncentivePool: string;
    currentUSDTIncentivePool: string;
    busdIncentivePoolAddress: string;
    usdcIncentivePoolAddress: string;
  };
  market: {
    controllerAddress: string;
    nftAddress: string;
  };
  staking: {
    elStakingPoolAddress: string;
    elfyStakingPoolAddress: string;
    elfyV2StakingPoolAddress: string;
    elfyV2StakingPoolRewardAddress: string;
    elfyBscStakingPoolAddress: string;
  };
  lpStaking: {
    daiElfiPoolAddress: string;
    ethElfiPoolAddress: string;
    ethElfiV2PoolAddress: string;
    daiElfiV2PoolAddress: string;
    stakerAddress: string;
    nonFungiblePositionAddress: string;
    refundedAddress: string;
  };
  token: {
    governanceAddress: string;
    elAddress: string;
    daiAddress: string;
    usdtAddress: string;
    usdcAddress: string;
    wEthAddress: string;
    bscElfiAddress: string;
    busdAddress: string;
    testBscElfiAddress: string;
    testUsdcLTokenAddress: string;
  };
  network: {
    requiredNetwork: string;
    requiredChainId: number;
    bscMainnetChainId: number;
  };
  subgraphApiEndpoint: {
    subgraphURI: string;
    lpTokenPoolSubgraphURL: string;
    stakerSubgraphURL: string;
    bscSubgraphURI: string;
  };
  externalApiEndpoint: {
    etherscanURI: string;
    bscscanURI: string;
    cachedUniswapV3URL: string;
    coingackoURL: string;
  };
  tokenizer: {
    daiTokenizerAddress: string;
    usdtTokenizerAddress: string;
    busdTokenizerAddress: string;
    usdcTokenizerAddress: string;
  };
  jsonRpcUrl: {
    bsc: string;
  };
  stakingV2MoneyPool: {
    elfiStaking: string;
    elfiBscStaking: string;
    elfiEthLp: string;
    elfiDaiLp: string;
  };
  dataPipeline: {
    eth: string;
    bsc: string;
  };
}

const vars =
  process.env.NODE_ENV === 'production' && !process.env.REACT_APP_TEST_MODE
    ? (prodVars as unknown as EnvironmentVariables)
    : (testVars as unknown as EnvironmentVariables);

export default vars;
