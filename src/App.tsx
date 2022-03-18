import './i18n';

// import { Web3ReactProvider } from '@web3-react/core';
import { Web3ReactProvider } from '@web3-react/core';
import { BrowserRouter as Router } from 'react-router-dom';
import getLibrary from './core/utils/getLibrary';
import AppNavigator from './AppNavigator';

import 'src/stylesheet/public.scss';
import 'src/stylesheet/pc.scss';
import 'src/stylesheet/tablet.scss';
import 'src/stylesheet/mobile.scss';
import TxProvider from './providers/TxProvider';
import MainnetProvider from './providers/MainnetProvider';

const App: React.FC = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <MainnetProvider>
        <TxProvider>
          <Router>
            <AppNavigator />
          </Router>
        </TxProvider>
      </MainnetProvider>
    </Web3ReactProvider>
  );
};

export default App;
