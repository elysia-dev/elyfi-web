import React, { useEffect, useState } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { useHistory, useParams } from 'react-router-dom';
import getLibrary from '../core/utils/getLibrary';
import { useTranslation } from 'react-i18next';
import { setServers } from 'dns';
import Service from '../modules/mobile/service/Service';
import Main from '../modules/mobile/main/Main';
import { useEagerConnect } from '../hooks/connectHoots'


function EthAddress() {
  const triedEager = useEagerConnect()
  const { i18n } = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  if (window.ethereum?.isMetaMask || window.ethereum?.isImToken) {
    return (
      <Web3ReactProvider getLibrary={getLibrary}>
        <Service triedEager={triedEager} />
      </Web3ReactProvider>
    );
  } else {
    return <Main />;
  }
}

export default EthAddress;
