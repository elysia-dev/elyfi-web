import { useWeb3React } from '@web3-react/core';
import { useContext, useState } from 'react';
import MainnetContext from 'src/contexts/MainnetContext';
import { MainnetData, MainnetList } from 'src/core/data/mainnets';
import { Web3Context } from 'src/providers/Web3Provider';
import ChangeNetworkGuideModal from './ChangeNetworkGuideModal';

const MainnetSwitch: React.FunctionComponent<{
  mainNetwork: boolean;
  setMainNetwork: (value: React.SetStateAction<boolean>) => void;
}> = ({ mainNetwork, setMainNetwork }) => {
  const { active, chainId } = useWeb3React();
  const {
    type: getMainnetType,
    changeMainnet,
    setCurrentMainnet,
  } = useContext(MainnetContext);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {/* <ChangeNetworkGuideModal
        modalVisible={modalVisible}
        closeModal={() => {
          setModalVisible(false);
        }}
      /> */}
      <div className="navigation__mainnet__container">
        <div className="navigation__mainnet__wrapper">
          <div
            className="navigation__mainnet__current"
            onClick={() => {
              // setModalVisible(
              //   window.sessionStorage.getItem('@walletConnect') === 'true',
              // );
              setMainNetwork(!mainNetwork);
            }}>
            <img src={MainnetData[getMainnetType].image} />
            <h2>{getMainnetType}</h2>
          </div>
          {mainNetwork === true && (
            <div
              className="navigation__mainnet__change-network__wrapper"
              style={{
                display: mainNetwork === true ? 'flex' : 'none',
              }}>
              {MainnetList.filter((data) => {
                return data.type !== getMainnetType;
              }).map((_data, index) => {
                return (
                  <div
                    key={index}
                    className="navigation__mainnet__change-network"
                    onClick={() => {
                      active &&
                      !(
                        window.sessionStorage.getItem('@walletConnect') ===
                        'true'
                      )
                        ? changeMainnet(MainnetData[_data.type].chainId).then(
                            () => {
                              setMainNetwork(false);
                            },
                          )
                        : (setMainNetwork(false),
                          setCurrentMainnet(_data.type));
                    }}>
                    <img src={MainnetData[_data.type].image} />
                    <h2>{MainnetData[_data.type].name}</h2>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MainnetSwitch;
