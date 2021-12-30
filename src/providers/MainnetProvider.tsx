import { useWeb3React } from "@web3-react/core";
import { useEffect, useMemo, useState } from "react";
import MainnetContext, { IMainnetContextTypes } from "src/contexts/MainnetContext";
import envs from "src/core/envs";
import ETHButton from 'src/assets/images/navigation__eth.png';
import BSCButton from 'src/assets/images/navigation__bsc.png';
import MainnetType from "src/enums/MainnetType";
import { mainnets } from "src/core/data/mainnets";
import useCurrentChain from "src/hooks/useCurrentChain";

const MainnetProvider: React.FC = (props) => {
  const { chainId } = useWeb3React();
  const CurrentChain = useCurrentChain();

  const [currentMainnet, setMainnet] = useState<IMainnetContextTypes>({
    type: chainId === envs.bscMainnetChainId ? MainnetType.BSC : MainnetType.Ethereum,
    name: chainId === envs.bscMainnetChainId ? "BSC" : "Ethereum",
    image: chainId === envs.bscMainnetChainId ? BSCButton : ETHButton
  })

  const changeMainnet = async (mainnet: IMainnetContextTypes) => {
    const getChainData = mainnets.find((data) => {
      return data.chainId === (mainnet.type === MainnetType.Ethereum ? envs.requiredChainId : envs.bscMainnetChainId)
    })
    console.log(getChainData)
    try {
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: getChainData!.chainHexId,
          }
        ]
      })
    } catch (e) {
      if (e.code === 4902) {
        try {
          getChainData ? (
            await window.ethereum?.request({
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
          ) : (
            console.log("undefined mainnet!!")
          )
        } catch (_e) {
          console.error(_e);
        }
      }
      console.log(e)
    }
  }


  const setCurrentMainnet = (data: IMainnetContextTypes) => setMainnet(data)

  useEffect(() => {
    CurrentChain !== undefined ? (
      setMainnet({
        ...currentMainnet,
        name: CurrentChain.name,
        image: CurrentChain.image,
        type: CurrentChain.type
      })
    ) : (
      console.log("Error!")
    )
  }, [chainId])

  return (
    <MainnetContext.Provider
      value={{
        ...currentMainnet,
        changeMainnet,
        setCurrentMainnet
      }}
    >
      {props.children}
    </MainnetContext.Provider>
  )
}

export default MainnetProvider;
