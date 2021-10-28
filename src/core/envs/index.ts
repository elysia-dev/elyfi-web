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
  wEth: string;
}

const vars =
  process.env.NODE_ENV === 'production' && !process.env.REACT_APP_TEST_MODE
    ? (prodVars as EnvironmentVariables)
    : (testVars as EnvironmentVariables);

export default vars;
