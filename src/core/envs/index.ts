import testVars from './test.json';
import prodVars from './prod.json';

interface EnvironmentVariables {
  moneyPool: {
    bscMoneyPoolAddress: string;
    moneyPoolAddress: string;
    daiTokenizerAddress: string;
    usdtTokeninzerAddress: string;
  };
  incentivePool: {
    prevDaiIncentivePool: string;
    prevUSDTIncentivePool: string;
    currentDaiIncentivePool: string;
    currentUSDTIncentivePool: string;
    busdIncentivePoolAddress: string;
  };
  staking: {
    elStakingPoolAddress: string;
    elfyStakingPoolAddress: string;
    elfyV2StakingPoolAddress: string;
    elfyV2StakingPoolRewardAddress: string;
  };
  lpStaking: {
    daiElfiPoolAddress: string;
    ethElfiPoolAddress: string;
    stakerAddress: string;
    nonFungiblePositionAddress: string;
    refundedAddress: string;
  };
  token: {
    governanceAddress: string;
    elAddress: string;
    daiAddress: string;
    usdtAddress: string;
    wEthAddress: string;
    bscElfiAddress: string;
    busdAddress: string;
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
  };
  tokenizer: {
    daiTokenizerAddress: string;
    usdtTokeninzerAddress: string;
  };
}

const vars =
  process.env.NODE_ENV === 'production' && !process.env.REACT_APP_TEST_MODE
    ? (prodVars as unknown as EnvironmentVariables)
    : (testVars as unknown as EnvironmentVariables);

export default vars;
