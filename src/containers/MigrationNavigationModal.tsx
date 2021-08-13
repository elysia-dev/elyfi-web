import { FunctionComponent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next';

// Create deposit & withdraw
const MigrationNavigationModal: FunctionComponent<{
  visible: boolean,
  closeHandler: () => void,
  SelectELFIModal: () => void,
  SelectELModal: () => void
}> = ({ visible, SelectELModal, closeHandler, SelectELFIModal }) => {
  const { t } = useTranslation();

  return (
    <div className="modal modal--deposit" style={{ display: visible ? "block" : "none" }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
          </div>
          <div className="close-button" onClick={closeHandler}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className="modal__body">
          <div className="migration">
            <div className="migration__button" onClick={SelectELFIModal}>
              <div>
                <p className="spoqa">
                  {t("staking.popup_button.0")}
                </p>
                <p className="spoqa__bold">
                  {t("staking.popup_button.1")}
                </p>
              </div>
              <div>
                <p className="spoqa__bold">
                  {">"}
                </p>
              </div>
            </div>
            <div className="migration__button" onClick={SelectELModal}>
              <div>
                <p className="spoqa">
                  {t("staking.popup_button.2")}
                </p>
                <p className="spoqa__bold">
                  {t("staking.popup_button.3")}
                </p>
              </div>
              <div>
                <p className="spoqa__bold">
                  {">"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MigrationNavigationModal;