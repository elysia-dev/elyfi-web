import { useWeb3React } from '@web3-react/core';
import { useState } from 'react'
import { getERC20 } from 'src/core/utils/getContracts';
import BalanceContext, { BalanceContextBase, initialBalanceContextBase } from '../contexts/BalanceContext'

const TokenProvider: React.FC = (props) => {
  const { account, library } = useWeb3React();
  const [state, setState] = useState<BalanceContextBase>(initialBalanceContextBase);

  const loadBalance = async (address: string) => {
    const contract = getERC20(address, library);

    if (!contract) return;

    setState({ balance: (await contract.balanceOf(account)) })
  }

  return (
    <BalanceContext.Provider
      value={{
        ...state,
        loadBalance,
      }}>
      {props.children}
    </BalanceContext.Provider>
  );
}

export default TokenProvider;