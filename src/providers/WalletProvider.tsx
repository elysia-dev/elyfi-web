import { useEffect, useState } from 'react';
import WalletContext, { initialWalletContext, IWalletContext } from '../contexts/WalletContext';
import UserType from '../enums/UserType';
import { useWeb3React } from '@web3-react/core';

const WalletProvider: React.FC = (props) => {
  const { account } = useWeb3React();
  const [state, setState] = useState<IWalletContext>(initialWalletContext);

  const TempCollateralAddress = "0x6A040998EeB628Cf40683833812F0463C4FC79F9";
  const TempBorrowerAddress = "0xB91e9f737B2227E92A373fb071b66B10eC6770d0";

  const InitialState = () => {
    switch (account) {
      case TempCollateralAddress:
        setState({ ...state, userType: UserType.Collateral })
        break;
      case TempBorrowerAddress:
        setState({ ...state, userType: UserType.Borrowers })
        break;
      default:
        if(!!account) {
          setState({ ...state, userType: UserType.Guest })
        } else {
          setState({ ...state, userType: UserType.User })
        }
    }
  }

  useEffect(() => {
    InitialState()
  }, [account]);


  return (
    <WalletContext.Provider value={{
      ...state
    }}>
      {props.children}
    </WalletContext.Provider>
  );
}

export default WalletProvider;