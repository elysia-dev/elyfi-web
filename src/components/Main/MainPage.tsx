import { lazy, RefObject, Suspense } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import reactGA from 'react-ga';
import PageEventType from 'src/enums/PageEventType';
import ButtonEventType from 'src/enums/ButtonEventType';
import { Link, useParams } from 'react-router-dom';
import LanguageType from 'src/enums/LanguageType';

import AssetDom from 'src/assets/images/main/asset-dom.svg';
import Pit from 'src/assets/images/main/pit.svg';
import FallbackSkeleton from 'src/utiles/FallbackSkeleton';
import useNavigator from 'src/hooks/useNavigator';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

interface Props {
  mainHeaderY: RefObject<HTMLParagraphElement>;
  mainHeaderMoblieY: RefObject<HTMLParagraphElement>;
}

const MainPage: React.FC<Props> = ({ mainHeaderY, mainHeaderMoblieY }) => {
  const { t } = useTranslation();
  const navigate = useNavigator();
  const { lng } = useParams<{ lng: string }>();

  return (
    <>
      <div className="main__title__container">
        <div className="main__title__text-container">
          <p>
            <Trans i18nKey="main.landing.header__title" />
          </p>
          <p>{t('main.landing.header__content')}</p>
        </div>
        <div className="main__title__button pc-only">
          <div>
            <p>{t('main.landing.button__market--detail')}</p>
            <Link
              to={`/${lng}/market`}
              onClick={() => {
                reactGA.event({
                  category: PageEventType.MoveToInternalPage,
                  action: ButtonEventType.DepositButton,
                });
              }}>
              <p ref={mainHeaderY}>{t('main.landing.button__market')}</p>
            </Link>
          </div>
          <div>
            <p>{t('main.landing.button__deposit--detail')}</p>
            <Link
              to={`/${lng}/deposit`}
              onClick={() => {
                reactGA.event({
                  category: PageEventType.MoveToExternalPage,
                  action: ButtonEventType.LearnMoreButton,
                });
              }}>
              <p>{t('main.landing.button__deposit')}</p>
            </Link>
          </div>
        </div>
      </div>
      <div className="main__image-wrapper">
        <Suspense fallback={<div style={{ height: '100%' }} />}>
          <LazyImage name="dom" src={AssetDom} />
          <LazyImage name="pit" src={Pit} />
        </Suspense>
      </div>
      <div className="main__title__button mobile-only">
        <div>
          <p>{t('main.landing.button__market--detail')}</p>
          <Link
            to={`/${lng}/market`}
            onClick={() => {
              reactGA.event({
                category: PageEventType.MoveToInternalPage,
                action: ButtonEventType.DepositButton,
              });
            }}>
            <p ref={mainHeaderY}>{t('main.landing.button__market')}</p>
          </Link>
        </div>
        <div>
          <p>{t('main.landing.button__deposit--detail')}</p>
          <Link
            to={`/${lng}/deposit`}
            onClick={() => {
              reactGA.event({
                category: PageEventType.MoveToExternalPage,
                action: ButtonEventType.LearnMoreButton,
              });
            }}>
            <p>{t('main.landing.button__deposit')}</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default MainPage;
