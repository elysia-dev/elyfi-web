import { useWeb3React } from '@web3-react/core';
import { useContext, useEffect, useMemo, useState } from 'react';
import MainnetContext, {
  IMainnetContextTypes,
} from 'src/contexts/MainnetContext';
import envs from 'src/core/envs';
import MainnetType from 'src/enums/MainnetType';
import { mainnets } from 'src/core/data/mainnets';
import useCurrentChain from 'src/hooks/useCurrentChain';
import Loading from 'src/components/Loading';
import { Web3Context } from './Web3Provider';

// ! FIXME
// 2. Remove redundant loading(false)
const MainnetProvider: React.FC = (props) => {
  const { active } = useContext(Web3Context);
  const currentChain = useCurrentChain();
  const [loading, setLoading] = useState(true);

  const [currentMainnet, setMainnet] = useState<IMainnetContextTypes>({
    type: MainnetType.BSC,
    unsupportedChainid: true,
    active: false,
  });

  useEffect(() => {
    if (!active) {
      setLoading(false);
      if (currentMainnet.unsupportedChainid) {
        setMainnet({ ...currentMainnet, unsupportedChainid: false, active });
      }
      return;
    }
    currentChain !== undefined
      ? (setMainnet({
          type: currentChain.type,
          unsupportedChainid: false,
          active,
        }),
        setLoading(false))
      : (setMainnet({ ...currentMainnet, unsupportedChainid: true, active }),
        console.log('Error!'),
        setLoading(false));
  }, [currentChain, active]);

  const setCurrentMainnet = (data: MainnetType) => {
    setMainnet({ ...currentMainnet, type: data });
    setLoading(false);
  };

  const changeMainnet = async (mainnetChainId: number) => {
    const getChainData = mainnets.find((data) => {
      return data.chainId === mainnetChainId;
    });
    try {
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: getChainData!.chainHexId,
          },
        ],
      });
      if (getChainData) {
        setMainnet({
          ...currentMainnet,
          type: getChainData.type,
        });
      }
    } catch (e: any) {
      if (e.code === 4902) {
        try {
          getChainData
            ? await window.ethereum?.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: getChainData.addParams.chainId,
                    chainName: getChainData.addParams.chainName,
                    nativeCurrency: getChainData.addParams.nativeCurrency,
                    blockExplorerUrls: getChainData.addParams.blockExplorerUrls,
                    rpcUrls: getChainData.addParams.rpcUrls,
                  },
                ],
              })
            : (console.log('undefined mainnet!!'),
              setMainnet({ ...currentMainnet, unsupportedChainid: true }));
        } catch (_e) {
          console.error(_e);
          setMainnet({ ...currentMainnet, unsupportedChainid: true });
        }
      }
      console.log(e);
      setMainnet({ ...currentMainnet, unsupportedChainid: true });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <MainnetContext.Provider
      value={{
        ...currentMainnet,
        changeMainnet,
        setCurrentMainnet,
      }}>
      {props.children}
    </MainnetContext.Provider>
  );
};

export default MainnetProvider;
