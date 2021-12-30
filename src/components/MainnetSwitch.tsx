import MediaQuery from "src/enums/MediaQuery";
import useMediaQueryType from "src/hooks/useMediaQueryType";
import ELFI from 'src/assets/images/ELFI.png'
import envs from 'src/core/envs';
import ELFIButton from 'src/assets/images/navigation__elfi.png';
import ETHButton from 'src/assets/images/navigation__eth.png';
import BSCButton from 'src/assets/images/navigation__bsc.png';
import { useWeb3React } from '@web3-react/core';
import { IMainnet, IMainnetTypes, mainnets, mainnetTypes } from 'src/core/data/mainnets';
import { useEffect, useMemo, useState } from "react";
import MainnetType from 'src/enums/MainnetType';


const MainnetSwitch: React.FunctionComponent<{
  mainNetwork: boolean;
  setMainNetwork: (value: React.SetStateAction<boolean>) => void;
}> = ({ mainNetwork, setMainNetwork }) => {
  const { active, chainId } = useWeb3React();
  const { value: mediaQuery } = useMediaQueryType();
  const [currentMainnet, setCurrentMainnet] = useState<{
    name: string,
    image: string,
    type: MainnetType
  }>({
    name: chainId === envs.bscMainnetChainId ? "BSC" : "Ethereum",
    image: chainId === envs.bscMainnetChainId ? BSCButton : ETHButton,
    type: chainId === envs.bscMainnetChainId ? MainnetType.BSC : MainnetType.Ethereum
  })

  const currentChain = useMemo(() => {
    return mainnets.find((mainnet) => {
      return mainnet.chainId === chainId
    })
  }, [chainId])

  useEffect(() => {
    currentChain !== undefined ? (
      setCurrentMainnet({
        ...currentMainnet,
        name: currentChain.name,
        image: currentChain.image,
        type: currentChain.type
      })
    ) : (
      console.log("Error!")
    )
  }, [chainId])

  const addELFIToken = async () => {
    const tokenAddress = envs.governanceAddress;
    const tokenDecimals = "18";
    const tokenSymbol = "ELFI";
    const tokenImage = ELFI;

    try {
      await window.ethereum?.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: tokenImage,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const changeMainnet = async (mainnet: IMainnetTypes) => {
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
  
  return (
    <div className="navigation__mainnet__container">
      {
        mediaQuery === MediaQuery.PC && (
          <img 
            src={ELFIButton} 
            className="navigation__metamask-add-el-button" 
            onClick={() => addELFIToken()}
            title="메타마스크에 ELFI 토큰 추가하기"
          />
        )
      }
      <div className="navigation__mainnet__wrapper">
        <div className="navigation__mainnet__current" onClick={() => {
          setMainNetwork(!mainNetwork)
        }}>
          <img src={currentMainnet.image} />
          <h2>
            {currentMainnet.name}
          </h2>
        </div>
        <div className="navigation__mainnet__change-network__wrapper" style={{
          display: mainNetwork === true ? "flex" : 'none'
        }}>
          <p>
            Change Network
          </p>
          {
            Object.keys(MainnetType).map((type) => {
              if (type !== currentMainnet.type) return;
              return mainnetTypes.map((types, index) => {
                if (types.type === currentMainnet.type) return;
                return (
                  <div 
                    key={index}
                    className="navigation__mainnet__change-network" 
                    onClick={() => {
                      active ? (
                        changeMainnet(types).then(() => {
                          setMainNetwork(false)
                        })
                      ) : (
                        setMainNetwork(false),
                        setCurrentMainnet(types)
                      )
                    }}
                  >
                    <img src={types.image} />
                    <h2>
                      {
                        types.name
                      }
                    </h2>
                  </div>
                )
              })
            })
          }
        </div>
      </div>
    </div>
  )
}

export default MainnetSwitch;