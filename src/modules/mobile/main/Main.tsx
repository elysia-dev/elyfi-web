import React from 'react';
import Navigation from '../component/Navigation';
import MainBackground from '../../../shared/images/main-background.png';
import DownArrow from '../../../shared/images/down-arrow.png';
import Service00 from '../../../shared/images/service00.png';
import Service01 from '../../../shared/images/service01.png';
import Service02 from '../../../shared/images/service02.png';
import Forum from '../forum/Forum';

import '../css/styleM.scss';
import { useTranslation } from 'react-i18next';

const Main: React.FC = () => {

  const MainRef = React.createRef<HTMLDivElement>();
  const ForumRef = React.createRef<HTMLDivElement>();
  const WorksRef = React.createRef<HTMLDivElement>();

  const { t } = useTranslation();

  const Scroll = (ref: string) => {
    // ref.current.scrollIntoView({ behavior: 'smooth' })
    var element = document.getElementById(ref);
    const offset = 0;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element!.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
  return (
    <div className={`elysia--mobile`}>
      <section className="main" id="main" ref={MainRef} style={{ backgroundImage: `url(${MainBackground})` }}>
        <Navigation />
        <div className="main__content-container">
          <h1 className="main__content--bold">
            <span className="main__content--blue">{t("main.elyfi")}</span> : <br />{t("main.elyfi-title")}
          </h1>
          <p className="main__content">
            {t("main.elyfi-content")}
          </p>
        </div>
        <div className="main__down-arrow-wrapper">
          <img className="main__down-arrow" src={DownArrow} alt="" onClick={() => Scroll("works")} />
        </div>
      </section>
      <section className="works" id="works" ref={WorksRef}>
        <div className="works__component">
          <h1 className="works__title title-text--bold">
            {t("service.title")}
          </h1>
          <p className="works__sub-title title-text">
            {t("service.sub-title")}
          </p>
          <div className="works__container">
            <img className="works__image" src={Service00} alt="" />
            <div className="works__text-wrapper">
              <h1 className="works__header-text">
                {t("service.blockchain")}
              </h1>
              <p className="works__text">
                {t("service.blockchain-content")}
              </p>
            </div>
          </div>
          <div className="works__container">
          <img className="works__image scroll-animation scroll-animation--left" src={Service01} alt="" />
            <div className="works__text-wrapper scroll-animation" data-sa-delay="200">
              <h1 className="works__header-text">
                {t("service.real-asset")}
              </h1>
              <p className="works__text">
                {t("service.real-asset-content")}
              </p>
            </div>
          </div>
          <div className="works__container">
            <img className="works__image  scroll-animation scroll-animation--right" src={Service02} alt="" />
            <div className="works__text-wrapper scroll-animation" data-sa-delay="200">
              <h1 className="works__header-text">
                {t("service.nfts")}
              </h1>
              <p className="works__text">
                {t("service.nfts-content")}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="forum" id="forum" ref={ForumRef} style={{ height: '100%' }}>
        <Forum />
      </section>
    </div>
  );
}

export default Main;
