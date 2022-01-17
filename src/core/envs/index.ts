import testVars from './test.json';
import prodVars from './prod.json';

interface EnvironmentVariables {
  moneyPool: {
    moneyPoolAddress: string;
    daiTokenizerAddress: string;
    usdtTokeninzerAddress: string;
    prevDaiIncentivePool: string;
    prevUSDTIncentivePool: string;
    currentDaiIncentivePool: string;
    currentUSDTIncentivePool: string;
  };
  staking: {
    elStakingPoolAddress: string;
    elfyStakingPoolAddress: string;
    elfyV2StakingPoolAddress: string;
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
  };
  network: {
    requiredNetwork: string;
    requiredChainId: number;
  };
  subgraphApiEndpoint: {
    subgraphURI: string;
    lpTokenPoolSubgraphURL: string;
    stakerSubgraphURL: string;
  };
  externalApiEndpoint: {
    etherscanURI: string;
  };
  testStableAddress: string;
}

const vars =
  process.env.NODE_ENV === 'production' && !process.env.REACT_APP_TEST_MODE
    ? (prodVars as unknown as EnvironmentVariables)
    : (testVars as unknown as EnvironmentVariables);

export default vars;
