import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ModalHeader from 'src/components/Modal/ModalHeader';
import MainnetContext from 'src/contexts/MainnetContext';
import { MainnetData, MainnetList } from 'src/core/data/mainnets';
import MainnetType from 'src/enums/MainnetType';

const NetworkChangeModal: React.FunctionComponent<{
  visible: boolean;
  closeHandler: () => void;
}> = ({ visible, closeHandler }) => {
  const { t } = useTranslation();
  const { changeMainnet } = useContext(MainnetContext);

  return (
    <div
      className="modal modal__network-change-modal"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader
          title={t('modal.network_change.title')}
          onClose={closeHandler}
        />
        <div className="modal__connect__content">
          <p>{t('modal.network_change.content')}</p>
        </div>
        <div className="modal__network-change-modal__button__wrapper">
          {MainnetList.map((data, index) => {
            const mainnetType =
              data.type === MainnetType.BSCTest ? MainnetType.BSC : data.type;
            return (
              <div
                key={index}
                className="modal__network-change-modal__button"
                onClick={() => {
                  changeMainnet(MainnetData[mainnetType].chainId).then(() =>
                    closeHandler(),
                  );
                }}>
                <img src={MainnetData[mainnetType].image} />
                <h2>{MainnetData[mainnetType].name}</h2>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NetworkChangeModal;
