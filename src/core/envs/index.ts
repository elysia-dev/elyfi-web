import testVars from './test.json';
import prodVars from './prod.json';

interface EnvironmentVariables {
  moneyPoolAddress: string
  incentivePoolAddress: string
  governanceAddress: string
  testStableAddress: string
  elStakingPoolAddress: string
  elfyStakingPoolAddress: string
  requiredNetwork: string
  requiredChainId: number
  subgraphURI: string
}

const vars = (
  process.env.NODE_ENV === 'production'
  && !process.env.REACT_APP_TEST_MODE
) ? prodVars as EnvironmentVariables : testVars as EnvironmentVariables

export default vars