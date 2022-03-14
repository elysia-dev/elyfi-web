import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import reactGA from 'react-ga';
import PageEventType from 'src/enums/PageEventType';
import ButtonEventType from 'src/enums/ButtonEventType';
import { useNavigate, useParams } from 'react-router-dom';
import LanguageType from 'src/enums/LanguageType';

import MainPopupKo from 'src/assets/images/popup/ko.png';
import MainPopupEn from 'src/assets/images/popup/en.png';

const ShowingPopup: React.FC<{
  visible: boolean;
  closeHandler: () => void;
}> = ({ visible, closeHandler }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { lng } = useParams<{ lng: string }>();

  const dailyPopupDisable = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    window.localStorage.setItem('@disableTime', today.getDate().toString());
    closeHandler();
  };

  const showingPopup = () => {
    const nowTime = new Date();
    const setTime = window.localStorage.getItem('@disableTime') || '0';

    nowTime.getDate() < parseInt(setTime, 10) && closeHandler();
  };

  useEffect(() => {
    showingPopup();
  }, []);

  return !visible ? (
    <div className="main__popup">
      <div className="main__popup__container">
        <div>
          <div onClick={() => dailyPopupDisable()}>
            <div className="main__popup__button" />
            <p>{t('main.popup.disable_popup')}</p>
          </div>
          <div className="close-button" onClick={closeHandler}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            reactGA.event({
              category: PageEventType.MoveToInternalPage,
              action: ButtonEventType.DepositButtonOnEventModal,
            });
            navigate(`/${lng}/staking/ELFI`);
          }}>
          <img src={lng === LanguageType.KO ? MainPopupKo : MainPopupEn} />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ShowingPopup;
