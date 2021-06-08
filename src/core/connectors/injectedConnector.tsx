import { InjectedConnector } from '@web3-react/injected-connector'
// 56: binance, 97: binance test
const injectedConnector = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42, 56, 97] })

export default injectedConnector