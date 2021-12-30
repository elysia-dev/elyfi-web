import MediaQuery from "src/enums/MediaQuery";
import useMediaQueryType from "src/hooks/useMediaQueryType";
import ELFI from 'src/assets/images/ELFI.png'
import envs from 'src/core/envs';
import ELFIButton from 'src/assets/images/navigation__elfi.png';
import { useWeb3React } from '@web3-react/core';
import { mainnetTypes } from 'src/core/data/mainnets';
import { useContext } from "react";
import MainnetType from 'src/enums/MainnetType';
import MainnetContext from "src/contexts/MainnetContext";


const MainnetSwitch: React.FunctionComponent<{
  mainNetwork: boolean;
  setMainNetwork: (value: React.SetStateAction<boolean>) => void;
}> = ({ mainNetwork, setMainNetwork }) => {
  const { active } = useWeb3React();
  const { value: mediaQuery } = useMediaQueryType();
  const { 
    type: mainnetType, 
    name: mainnetName, 
    image: mainnetImage, 
    changeMainnet, 
    setCurrentMainnet 
  } = useContext(MainnetContext)

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
          <img src={mainnetImage} />
          <h2>
            {mainnetName}
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
              if (type !== mainnetType) return;
              return mainnetTypes.map((types, index) => {
                if (types.type === mainnetType) return;
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