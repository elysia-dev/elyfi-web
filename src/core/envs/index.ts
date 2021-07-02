import testVars from './test.json';
import prodVars from './prod.json';

interface EnvironmentVariables {
  moneyPoolAddress: string
  incentivePoolAddress: string
  governanceAddress: string
  testStableAddress: string
  requiredNetwork: string
  subgraphURI: string
}

const vars = process.env.NODE_ENV === 'production' ? prodVars as EnvironmentVariables : testVars as EnvironmentVariables

export default vars