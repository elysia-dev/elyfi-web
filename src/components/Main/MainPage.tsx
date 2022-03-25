import { lazy, RefObject, Suspense } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import reactGA from 'react-ga';
import PageEventType from 'src/enums/PageEventType';
import ButtonEventType from 'src/enums/ButtonEventType';
import { useHistory, useParams } from 'react-router-dom';
import LanguageType from 'src/enums/LanguageType';

import AssetDom from 'src/assets/images/main/asset-dom.svg'
import Pit from 'src/assets/images/main/pit.svg';
import FallbackSkeleton from 'src/utiles/FallbackSkeleton';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));


interface Props {
  mainHeaderY: RefObject<HTMLParagraphElement>;
  mainHeaderMoblieY: RefObject<HTMLParagraphElement>;
}

const MainPage: React.FC<Props> = ({
  mainHeaderY,
  mainHeaderMoblieY
}) => {
  const { t } = useTranslation();
  const History = useHistory();
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
          <div
            onClick={() => {
              reactGA.event({
                category: PageEventType.MoveToInternalPage,
                action: ButtonEventType.DepositButton,
              });
              History.push({ pathname: `/${lng}/deposit` });
            }}>
            <p ref={mainHeaderY}> {t('main.landing.button__deposit')}</p>
          </div>
          <div
            onClick={() => {
              reactGA.event({
                category: PageEventType.MoveToExternalPage,
                action: ButtonEventType.LearnMoreButton,
              });
              window.open(
                lng === LanguageType.KO
                  ? 'https://elysia.gitbook.io/elysia.finance/'
                  : 'https://elysia.gitbook.io/elysia.finance/v/eng',
              );
            }}>
            <p>{t('main.landing.button__view-more')}</p>
          </div>
        </div>
      </div>
      <div className="main__image-wrapper">
        <Suspense fallback={<div style={{ height: "100%" }} />}>
          <LazyImage name="dom" src={AssetDom} />
          <LazyImage name="pit" src={Pit} />
        </Suspense>
      </div>
      <div className="main__title__button mobile-only">
        <div
          onClick={() => {
            reactGA.event({
              category: PageEventType.MoveToInternalPage,
              action: ButtonEventType.DepositButton,
            });
            History.push({ pathname: `/${lng}/deposit` });
          }}>
          <p ref={mainHeaderMoblieY}>{t('main.landing.button__deposit')}</p>
        </div>
        <div
          onClick={() => {
            reactGA.event({
              category: PageEventType.MoveToExternalPage,
              action: ButtonEventType.LearnMoreButton,
            });
            window.open(
              lng === LanguageType.KO
                ? 'https://elysia.gitbook.io/elysia.finance/'
                : 'https://elysia.gitbook.io/elysia.finance/v/eng',
            );
          }}>
          <p>{t('main.landing.button__view-more')}</p>
        </div>
      </div>
    </>
  )
}

export default MainPage;