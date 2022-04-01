import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import ModalHeader from 'src/components/Modal/ModalHeader';

const InstallMetamask = (): JSX.Element => {
  const { t } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();
  const [modal, setModal] = useState(false);

  return mediaQuery === MediaQuery.PC ? (
    <div className="navigation__wallet" style={{ cursor: 'pointer' }}>
      <a
        href={'https://metamask.io/download.html'}
        style={{ cursor: 'pointer', width: 147, textAlign: 'center' }}>
        <p
          className="navigation__wallet__status"
          style={{ fontSize: 14.5, cursor: 'pointer' }}>
          {t('navigation.install_metamask')}
        </p>
      </a>
    </div>
  ) : (
    <>
      <div className="modal" style={{ display: modal ? 'block' : 'none' }}>
        <div className="modal__container">
          <ModalHeader
            title={t('modal.connect_wallet.title')}
            onClose={() => setModal(false)}
          />
          <div className="modal__confirm">
            <div>
              <h2>{t('modal.connect_metamask.content')}</h2>
            </div>
          </div>
          <div
            className="modal__button disable"
            onClick={() => setModal(false)}>
            <p>{t('modal.connect_metamask.button')}</p>
          </div>
        </div>
      </div>
      <div
        className="navigation__wallet"
        style={{ cursor: 'pointer' }}
        onClick={() => setModal(true)}>
        <p
          className="navigation__wallet__status"
          style={{ fontSize: 14.5, cursor: 'pointer' }}>
          {t('navigation.install_metamask')}
        </p>
      </div>
    </>
  );
};

export default InstallMetamask;
