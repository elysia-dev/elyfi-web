import { useEffect, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import reactGA from 'react-ga';
import PageEventType from 'src/enums/PageEventType';
import ButtonEventType from 'src/enums/ButtonEventType';
import { useHistory, useParams } from 'react-router-dom';
import LanguageType from 'src/enums/LanguageType';

import MainPopupKo from 'src/assets/images/popup/ko.svg';
import MainPopupEn from 'src/assets/images/popup/en.svg';
import Skeleton from 'react-loading-skeleton';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

const ShowingPopup: React.FC<{
  visible: boolean;
  closeHandler: (value: React.SetStateAction<boolean>) => void;
}> = ({ visible, closeHandler }) => {
  const { t } = useTranslation();
  const History = useHistory();
  const { lng } = useParams<{ lng: string }>();

  const dailyPopupDisable = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    window.localStorage.setItem('@disableTime', today.getDate().toString());
    closeHandler(true);
  };

  const showingPopup = () => {
    const nowTime = new Date();
    const setTime = window.localStorage.getItem('@disableTime') || '0';

    nowTime.getDate() < parseInt(setTime, 10) && closeHandler(true);
  };

  useEffect(() => {
    showingPopup();
  }, [visible]);

  return !visible ? (
    <div className="main__popup">
      <div className="main__popup__container">
        <div>
          <div onClick={() => dailyPopupDisable()}>
            <div className="main__popup__button" />
            <p>{t('main.popup.disable_popup')}</p>
          </div>
          <div
            className="close-button"
            onClick={() => {
              closeHandler(true);
            }}>
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
            History.push({ pathname: `/${lng}/staking/ELFI` });
          }}>
          <Suspense fallback={<Skeleton width={500} height={500} />}>
            <LazyImage
              name={'popup-image'}
              src={lng === LanguageType.KO ? MainPopupKo : MainPopupEn}
            />
          </Suspense>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default ShowingPopup;
