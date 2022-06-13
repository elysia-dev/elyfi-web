import { useWeb3React } from '@web3-react/core';
import { useEffect, useState } from 'react';
import MainnetContext, {
  IMainnetContextTypes,
} from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import { mainnets } from 'src/core/data/mainnets';
import useCurrentChain from 'src/hooks/useCurrentChain';

// ! FIXME
// 2. Remove redundant loading(false)
const MainnetProvider: React.FC = (props) => {
  const { active, library } = useWeb3React();
  const currentChain = useCurrentChain();
  const [loading, setLoading] = useState(true);

  const [currentMainnet, setMainnet] = useState<IMainnetContextTypes>({
    type: window.sessionStorage.getItem('@network')
      ? window.sessionStorage.getItem('@network') === 'Ethereum'
        ? MainnetType.Ethereum
        : MainnetType.BSC
      : MainnetType.Ethereum,
    unsupportedChainid: true,
    active: false,
  });

  useEffect(() => {
    if (!active) {
      setLoading(false);
      if (currentMainnet.unsupportedChainid) {
        setMainnet({
          ...currentMainnet,
          unsupportedChainid: false,
          active,
        });
      }
      return;
    }
    currentChain !== undefined
      ? (setMainnet({
          ...currentMainnet,
          type: currentChain.type,
          unsupportedChainid: false,
          active,
        }),
        window.sessionStorage.setItem('@network', currentChain.type),
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
    if (!library) return;
    const getChainData = mainnets.find((data) => {
      return data.chainId === mainnetChainId;
    });
    try {
      await library.provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: getChainData!.chainHexId,
          },
        ],
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
            ? await library.provider.request({
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
