import '../css/style.scss';
import { useWeb3React } from '@web3-react/core';
import { useContext } from 'react';
import WalletContext from '../../../contexts/WalletContext';
import UserType from '../../../enums/UserType';
import Borrowers from './borrowers/Repay';
import Investors from './Investors';
import DisableWalletPage from './DisableWalletPage';

const Dashboard = () => {
  const { userType } = useContext(WalletContext);
  const { active } = useWeb3React();
  
  return (
    <div className="elysia--pc">
      {!active ? 
        <DisableWalletPage />
        : 
        userType === UserType.Borrowers ?
          <Borrowers />
          :
          userType === UserType.Collateral ?
            <Investors />
            :
            <Investors />
        }
    </div>
  );
}

export default Dashboard;