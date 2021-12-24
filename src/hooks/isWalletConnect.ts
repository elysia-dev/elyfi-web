import { useWeb3React } from "@web3-react/core";
import envs from "src/core/envs";


const isWalletConnect = (): boolean => {
  const { active, chainId } = useWeb3React();
  const isValidChain = envs.requiredNetwork === 'ganache' || chainId === envs.requiredChainId

  return active && isValidChain
}

export default isWalletConnect;