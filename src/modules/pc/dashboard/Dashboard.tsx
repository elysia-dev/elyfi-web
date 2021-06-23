import 'src/stylesheets/style.scss';
import { useWeb3React } from '@web3-react/core';
import Investors from './Investors';
import DisableWalletPage from './DisableWalletPage';

const Dashboard = () => {
  const { active } = useWeb3React();

  return (
    <div className="elysia--pc">
      {!active ?
        <DisableWalletPage />
        :
        <Investors />
      }
    </div>
  );
}

export default Dashboard;