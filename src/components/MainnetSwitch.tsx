import MediaQuery from "src/enums/MediaQuery";
import useMediaQueryType from "src/hooks/useMediaQueryType";
import ELFI from 'src/assets/images/ELFI.png'
import envs from 'src/core/envs';
import ELFIButton from 'src/assets/images/navigation__elfi.png';
import ETHButton from 'src/assets/images/navigation__eth.png';
import BSCButton from 'src/assets/images/navigation__bsc.png';
import { useWeb3React } from '@web3-react/core';
import { IMainnet, mainnets } from 'src/core/data/mainnets';
import { useMemo } from "react";


const MainnetSwitch: React.FunctionComponent<{
  mainNetwork: boolean;
  setMainNetwork: (value: React.SetStateAction<boolean>) => void;
}> = ({ mainNetwork, setMainNetwork }) => {
  const { active, chainId } = useWeb3React();

  const currnetChain = useMemo(() => {
    return mainnets.find((mainnet) => {
      return mainnet.chainId === chainId
    })
  }, [chainId])

  const { value: mediaQuery } = useMediaQueryType();

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

  const changeMainnet = async (mainnet: IMainnet) => {
    try {
      await window.ethereum?.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: mainnet.chainHexId,
          }
        ]
      })
    } catch (e) {
      if (e.code === 4902) {
        try {
          await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: mainnet.addParams.chainId,
                chainName: mainnet.addParams.chainName,
                nativeCurrency: mainnet.addParams.nativeCurrency,
                blockExplorerUrls: mainnet.addParams.blockExplorerUrls,
                rpcUrls: mainnet.addParams.rpcUrls,
              },
            ],
          });
        } catch (addError) {
          console.error(addError);
        }
      }
      console.log(e)
    }
  }
  
  return (
    <div className="navigation__mainnet__container">
      {
        mediaQuery === MediaQuery.PC && (
          <img src={ELFIButton} className="navigation__metamask-add-el-button" onClick={() => addELFIToken()}/>
        )
      }
      <div className="navigation__mainnet__wrapper">
        <div className="navigation__mainnet__current" onClick={() => {
          setMainNetwork(!mainNetwork)
        }}>
          <img src={currnetChain?.image || ELFIButton} />
          <h2>
            {currnetChain?.name || ""}
          </h2>
        </div>
        <div className="navigation__mainnet__change-network__wrapper" style={{
          display: mainNetwork === true ? "flex" : 'none'
        }}>
          <p>
            Change Network
          </p>
          {
            mainnets.map((mainnet, index) => {
              if (mainnet.chainId === currnetChain?.chainId) return;
              return (
                <div 
                  key={index}
                  className="navigation__mainnet__change-network" 
                  onClick={() => {
                    changeMainnet(mainnet).then(() => {
                      setMainNetwork(false)
                    })
                  }}
                >
                  <img src={mainnet.image} />
                  <h2>
                    {
                      mainnet.name
                    }
                  </h2>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default MainnetSwitch;