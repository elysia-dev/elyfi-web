import testVars from './test.json';
import prodVars from './prod.json';

interface EnvironmentVariables {
  moneyPoolAddress: string;
  governanceAddress: string;
  testStableAddress: string;
  elStakingPoolAddress: string;
  elfyStakingPoolAddress: string;
  elfyV2StakingPoolAddress: string;
  elAddress: string;
  requiredNetwork: string;
  requiredChainId: number;
  subgraphURI: string;
  etherscanURI: string;
  daiAddress: string;
  usdtAddress: string;
  daiElfiPoolAddress: string;
  ethElfiPoolAddress: string;
  wEthAddress: string;
  nonFungiblePositionAddress: string;
  stakerAddress: string;
  lpTokenStakingStartTime: number;
  lpTokenStakingEndTime: number;
  stakerSubgraphURL: string;
  lpTokenPoolSubgraphURL: string;
  refundedAddress: string;
  appURI: string;
  etherscan: string;
  daiTokenizerAddress: string;
  usdtTokeninzerAddress: string;
  bscMainnetChainId: number;
  bscMoneyPoolAddress: string;
  bscElfiAddress: string;
  busdAddress: string;
  bscSubgraphURI: string;
}

const vars =
  process.env.NODE_ENV === 'production' && !process.env.REACT_APP_TEST_MODE
    ? (prodVars as EnvironmentVariables)
    : (testVars as EnvironmentVariables);

export default vars;
