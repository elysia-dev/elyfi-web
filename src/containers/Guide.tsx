import { useTranslation } from 'react-i18next';
import Navigation from 'src/components/Navigation';
import Footer from 'src/components/Footer';

import Guide02 from 'src/assets/images/guide/01.png';
import Guide03 from 'src/assets/images/guide/02.png';
import Guide04 from 'src/assets/images/guide/03.png';
import Guide05 from 'src/assets/images/guide/04.png';
import Guide06 from 'src/assets/images/guide/05.png';
import Guide07 from 'src/assets/images/guide/06.png';
import Guide08 from 'src/assets/images/guide/07.png';
import Guide09 from 'src/assets/images/guide/08.png';
import Guide10 from 'src/assets/images/guide/10.png';
import Guide11 from 'src/assets/images/guide/11.png';
import Guide12 from 'src/assets/images/guide/12.png';
import Guide13 from 'src/assets/images/guide/13.png';
import Guide14 from 'src/assets/images/guide/14.png';
import Guide16 from 'src/assets/images/guide/16.png';
import Guide17 from 'src/assets/images/guide/17.png';
import Guide18 from 'src/assets/images/guide/18.png';
import Guide19 from 'src/assets/images/guide/19.png';
import Guide20 from 'src/assets/images/guide/20.png';
import Guide21 from 'src/assets/images/guide/21.png';

import Guide02Eng from 'src/assets/images/guide/Eng/01.png';
import Guide03Eng from 'src/assets/images/guide/Eng/02.png';
import Guide04Eng from 'src/assets/images/guide/Eng/03.png';
import Guide05Eng from 'src/assets/images/guide/Eng/04.png';
import Guide06Eng from 'src/assets/images/guide/Eng/05.png';
import Guide07Eng from 'src/assets/images/guide/Eng/06.png';
import Guide08Eng from 'src/assets/images/guide/Eng/07.png';
import Guide09Eng from 'src/assets/images/guide/Eng/08.png';
import Guide10Eng from 'src/assets/images/guide/Eng/10.png';
import Guide11Eng from 'src/assets/images/guide/Eng/11.png';
import Guide12Eng from 'src/assets/images/guide/Eng/12.png';
import Guide13Eng from 'src/assets/images/guide/Eng/13.png';
import Guide14Eng from 'src/assets/images/guide/Eng/14.png';
import Guide16Eng from 'src/assets/images/guide/Eng/16.png';
import Guide17Eng from 'src/assets/images/guide/Eng/17.png';
import Guide18Eng from 'src/assets/images/guide/Eng/18.png';
import Guide19Eng from 'src/assets/images/guide/Eng/19.png';
import Guide20Eng from 'src/assets/images/guide/Eng/20.png';
import Guide21Eng from 'src/assets/images/guide/Eng/21.png';

import Guide02Chn from 'src/assets/images/guide/Chn/01.png';
import Guide03Chn from 'src/assets/images/guide/Chn/02.png';
import Guide04Chn from 'src/assets/images/guide/Chn/03.png';
import Guide05Chn from 'src/assets/images/guide/Chn/04.png';
import Guide06Chn from 'src/assets/images/guide/Chn/05.png';
import Guide07Chn from 'src/assets/images/guide/Chn/06.png';
import Guide08Chn from 'src/assets/images/guide/Chn/07.png';
import Guide09Chn from 'src/assets/images/guide/Chn/08.png';
import Guide10Chn from 'src/assets/images/guide/Chn/10.png';
import Guide11Chn from 'src/assets/images/guide/Chn/11.png';
import Guide12Chn from 'src/assets/images/guide/Chn/12.png';
import Guide13Chn from 'src/assets/images/guide/Chn/13.png';
import Guide14Chn from 'src/assets/images/guide/Chn/14.png';
import Guide16Chn from 'src/assets/images/guide/Chn/16.png';
import Guide17Chn from 'src/assets/images/guide/Chn/17.png';
import Guide18Chn from 'src/assets/images/guide/Chn/18.png';
import Guide19Chn from 'src/assets/images/guide/Chn/19.png';
import Guide20Chn from 'src/assets/images/guide/Chn/20.png';
import Guide21Chn from 'src/assets/images/guide/Chn/21.png';

import YouTube from 'react-youtube';

import { useEffect, useState } from 'react';
import LanguageType from 'src/enums/LanguageType';
import VotingGuide from 'src/components/VotingGuide';

const Guide: React.FunctionComponent = () => {
  const { t, i18n } = useTranslation();
  const [currentPicture, setPicture] = useState(0);
  const clickHandler = (no: number) => {
    setPicture(currentPicture === no ? 0 : no);
  };
  const addressCopy = (add: string) => {
    if (!document.queryCommandSupported('copy')) {
      return alert('This browser does not support the copy function.');
    }
    const area = document.createElement('textarea');
    area.value = add;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    alert('Copied!!');
  };
  const [guideIndex, setGuideIndex] = useState(0);

  useEffect(() => {
    setPicture(0);
  }, [guideIndex]);

  const PrerequisitesPage = () => {
    return (
      <>
        <div className="guide__container">
          <h3>{t('guide.content_title.0')}</h3>
          <div className="guide__content">
            <p className="guide__content__bold">
              {t('guide.content.section01.0')}
            </p>
            <ul>
              <li>
                <p>{t('guide.content.section01.1')}</p>
              </li>
              <li>
                <p>{t('guide.content.section01.2')}</p>
              </li>
              <li>
                <p>{t('guide.content.section01.3')}</p>
              </li>
              <li>
                <p>{t('guide.content.section01.4')}</p>
              </li>
            </ul>
            <div>
              <h2>{t('guide.content.section01.5')}</h2>
              <YouTube
                videoId={t('guide.youtube_link.0')}
                className={'guide__youtube'}
                containerClassName={'guide__youtube__wrapper'}
              />
              <p>
                {t('guide.content.section01.6')}
                <br />
                {i18n.language === LanguageType.KO ? (
                  <>
                    <a
                      className="guide__link"
                      href={'https://metamask.io/download.html'}
                      target="_blank">
                      여기
                    </a>
                    에서 Metamask 크롬 확장 프로그램을 설치할 수 있습니다.
                  </>
                ) : (
                  <>
                    You can install the Matamask extension on Chrome from{' '}
                    <a
                      className="guide__link"
                      href={'https://metamask.io/download.html'}
                      target="_blank">
                      here
                    </a>
                  </>
                )}
              </p>
            </div>
            <div>
              <h2>{t('guide.content.section01.9')}</h2>
              <YouTube
                videoId={t('guide.youtube_link.1')}
                className={'guide__youtube'}
                containerClassName={'guide__youtube__wrapper'}
              />
              <p>{t('guide.content.section01.10')}</p>
            </div>
            <div>
              <h2>{t('guide.content.section01.11')}</h2>
              <YouTube
                videoId={t('guide.youtube_link.2')}
                className={'guide__youtube'}
                containerClassName={'guide__youtube__wrapper'}
              />
              <p>
                {t('guide.content.section01.12')}
                <ul>
                  <li>
                    <p>{t('guide.content.section01.13')}</p>
                    <ul>
                      <li>
                        <p>{t('guide.content.section01.14')}</p>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <p>{t('guide.content.section01.15')}</p>
                    <ul>
                      <li>
                        <p>
                          {t('guide.content.section01.16')}
                          <br />({t('guide.content.section01.17')}{' '}
                          <span
                            style={{
                              color: '#00A7FF',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                            onClick={() =>
                              addressCopy(
                                '0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4',
                              )
                            }>
                            0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4
                          </span>
                          )
                        </p>
                      </li>
                    </ul>
                  </li>
                </ul>
              </p>
            </div>
            <div>
              <h2>{t('guide.content.section01.18')}</h2>
              <YouTube
                videoId={t('guide.youtube_link.3')}
                className={'guide__youtube'}
                containerClassName={'guide__youtube__wrapper'}
              />
              <p>{t('guide.content.section01.19')}</p>
              <ul>
                <li>
                  <p>{t('guide.content.section01.20')}</p>
                </li>
                <ul>
                  <li>
                    <p>{t('guide.content.section01.21')}</p>
                  </li>
                </ul>
                <li>
                  <p>{t('guide.content.section01.22')}</p>
                </li>
                <ul>
                  <li>
                    <p>{t('guide.content.section01.23')}</p>
                  </li>
                </ul>
                <ul>
                  <li>
                    <p>{t('guide.content.section01.24')}</p>
                  </li>
                </ul>
                <li>
                  <p>{t('guide.content.section01.25')}</p>
                </li>
              </ul>

              <div style={{ margin: 50 }} />
              <p className="guide__content__bold">
                {t('guide.content.section01.26')}
              </p>
            </div>
          </div>
        </div>

        <div className="guide__container">
          <h3>{t('guide.content_title.1')}</h3>
          <p className="guide__content__bold">
            {t('guide.content.section02.0')}
          </p>
          <p>{t('guide.content.section02.1')}</p>
          <div className="guide__content">
            <p className="guide__content__bold">
              {t('guide.content.section02.2')}
            </p>
            <ul>
              <li>
                <p>{t('guide.content.section02.3')}</p>
              </li>
              <ul>
                <li>
                  <p>
                    {t('guide.content.section02.4')}
                    <a
                      className="guide__link"
                      href={'https://elyfi.world/'}
                      target="_blank">
                      https://defi.elysia.land/
                    </a>
                  </p>
                </li>
              </ul>
              <li>
                <p>{t('guide.content.section02.5')}</p>
              </li>
              <ul>
                <li>
                  <p>
                    {t('guide.content.section02.6')}
                    <a
                      className="guide__link"
                      href={'https://app.elyfi.world/'}
                      target="_blank">
                      https://app.elyfi.world/
                    </a>
                  </p>
                </li>
              </ul>
            </ul>
          </div>
        </div>
        <div className="guide__container">
          <h3>{t('guide.content_title.2')}</h3>
          <div className="guide__content">
            <ol>
              <li>
                <p>{t('guide.content.section03.0')}</p>
                <div
                  onClick={() => {
                    clickHandler(1);
                  }}
                  style={{
                    width: currentPicture === 1 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 1 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide02 : Guide02Eng
                    }
                    alt="Guide"
                  />
                  <p>{t('guide.content.section03.1')}</p>
                </div>
              </li>
              <li>
                <p>{t('guide.content.section03.2')}</p>
                <div
                  onClick={() => {
                    clickHandler(2);
                  }}
                  style={{
                    width: currentPicture === 2 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 2 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide03 : Guide03Eng
                    }
                    alt="Guide"
                  />
                  <p>{t('guide.content.section03.3')}</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </>
    );
  };
  const DepositWithdrawPage = () => {
    return (
      <>
        <div className="guide__container">
          <h3>{t('guide.content_title.3')}</h3>
          <YouTube
            videoId={t('guide.youtube_link.4')}
            className={'guide__youtube'}
            containerClassName={'guide__youtube__wrapper'}
          />
          <div className="guide__content">
            <ol>
              <li>
                <p>{t('guide.content.section04.0')}</p>
                <div
                  onClick={() => {
                    clickHandler(1);
                  }}
                  style={{
                    width: currentPicture === 1 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 1 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide04 : Guide04Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section04.1')}</p>
                <div
                  onClick={() => {
                    clickHandler(2);
                  }}
                  style={{
                    width: currentPicture === 2 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 2 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide06 : Guide06Eng
                    }
                    alt="Guide"
                  />
                  <p>{t('guide.content.section04.2')}</p>
                </div>
                <div
                  onClick={() => {
                    clickHandler(3);
                  }}
                  style={{
                    width: currentPicture === 3 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 3 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide05 : Guide05Eng
                    }
                    alt="Guide"
                  />
                  <p>{t('guide.content.section04.3')}</p>
                </div>
              </li>
              <li>
                <p>{t('guide.content.section04.4')}</p>
              </li>
              <li>
                <p>{t('guide.content.section04.5')}</p>
              </li>
            </ol>
          </div>
        </div>
        <div className="guide__container">
          <h3>{t('guide.content_title.4')}</h3>
          <YouTube
            videoId={t('guide.youtube_link.5')}
            className={'guide__youtube'}
            containerClassName={'guide__youtube__wrapper'}
          />
          <div className="guide__content">
            <ol>
              <li>
                <p>{t('guide.content.section05.0')}</p>
                <div
                  onClick={() => {
                    clickHandler(4);
                  }}
                  style={{
                    width: currentPicture === 4 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 4 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide04 : Guide04Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section05.1')}</p>
                <div
                  onClick={() => {
                    clickHandler(5);
                  }}
                  style={{
                    width: currentPicture === 5 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 5 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide07 : Guide07Eng
                    }
                    alt="Guide"
                  />
                  <p>{t('guide.content.section05.2')}</p>
                </div>
              </li>
              <li>
                <p>{t('guide.content.section05.3')}</p>
              </li>
              <li>
                <p>{t('guide.content.section05.4')}</p>
              </li>
            </ol>
          </div>
        </div>
        <div className="guide__container">
          <h3>{t('guide.content_title.5')}</h3>
          <YouTube
            videoId={t('guide.youtube_link.6')}
            className={'guide__youtube'}
            containerClassName={'guide__youtube__wrapper'}
          />
          <div className="guide__content">
            <ol>
              <li>
                <p>
                  {t('guide.content.section06.0')}
                  <br />
                  {t('guide.content.section06.1')}{' '}
                  <span
                    style={{
                      color: '#00A7FF',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                    }}
                    onClick={() =>
                      addressCopy('0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4')
                    }>
                    0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4
                  </span>
                </p>
              </li>
              <li>
                <p>{t('guide.content.section06.2')}</p>
                <div
                  onClick={() => {
                    clickHandler(6);
                  }}
                  style={{
                    width: currentPicture === 6 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 6 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide08 : Guide08Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section06.3')}</p>
                <div
                  onClick={() => {
                    clickHandler(7);
                  }}
                  style={{
                    width: currentPicture === 7 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 7 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide09 : Guide09Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section06.4')}</p>
              </li>
            </ol>
          </div>
        </div>

        <div className="guide__container">
          <h3>{t('guide.content_title.10')}</h3>
          <YouTube
            videoId={t('guide.youtube_link.7')}
            className={'guide__youtube'}
            containerClassName={'guide__youtube__wrapper'}
          />
          <p className="guide__content__bold">
            {t('guide.content.section11.4')}
          </p>

          <div className="guide__content">
            <p className="guide__content__bold">
              {t('guide.content.section11.0')}
            </p>
            <ol>
              <li>
                <p>{t('guide.content.section11.1')}</p>
                <div
                  onClick={() => {
                    clickHandler(8);
                  }}
                  style={{
                    width: currentPicture === 8 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 8 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide17 : Guide17Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section11.2')}</p>
                <div
                  onClick={() => {
                    clickHandler(9);
                  }}
                  style={{
                    width: currentPicture === 9 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 9 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide18 : Guide18Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section11.3')}</p>
                <div
                  onClick={() => {
                    clickHandler(10);
                  }}
                  style={{
                    width: currentPicture === 10 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 10 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide19 : Guide19Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
            </ol>
          </div>
        </div>
      </>
    );
  };

  const StakingPage = () => {
    return (
      <>
        <div className="guide__container">
          <h3>{t('guide.content_title.6')}</h3>
          {/* <YouTube
            videoId={
              i18n.language === LanguageType.KO 
                ? 
                "pdLeHjG5IRM" 
                : 
                (i18n.language === LanguageType.ZHHANS 
                  ? 
                  "yPNdIDWwmFw" 
                  :
                  "IEJJlwsiSU8"
                )
            }
            className={"guide__youtube"}
            containerClassName={"guide__youtube__wrapper"}
          /> */}
          <div className="guide__content">
            <p className="guide__content__bold">
              {t('guide.content.section07.0')}
            </p>
            <ol>
              <li>
                <p>{t('guide.content.section07.1')}</p>
                <div
                  onClick={() => {
                    clickHandler(1);
                  }}
                  style={{
                    width: currentPicture === 1 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 1 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide10 : Guide10Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section07.2')}</p>
                <div
                  onClick={() => {
                    clickHandler(2);
                  }}
                  style={{
                    width: currentPicture === 2 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 2 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide11 : Guide11Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section07.3')}</p>
                <div
                  onClick={() => {
                    clickHandler(3);
                  }}
                  style={{
                    width: currentPicture === 3 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 3 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide12 : Guide12Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>
                  {t('guide.content.section07.4')}
                  <br />
                  {t('guide.content.section07.5')}
                </p>
              </li>
              <li>
                <p>{t('guide.content.section07.6')}</p>
              </li>
            </ol>
          </div>
        </div>

        <div className="guide__container">
          <h3>{t('guide.content_title.7')}</h3>
          {/* <YouTube
            videoId={
              i18n.language === LanguageType.KO 
                ? 
                "vIaPjwP3yBA" 
                : 
                (i18n.language === LanguageType.ZHHANS 
                  ? 
                  "YRBagqQN-0Y" 
                  :
                  "R3JGJlUARlw"
                )
            }
            className={"guide__youtube"}
            containerClassName={"guide__youtube__wrapper"}
          /> */}
          <div className="guide__content">
            <ol>
              <li>
                <p>{t('guide.content.section08.0')}</p>
                <div
                  onClick={() => {
                    clickHandler(4);
                  }}
                  style={{
                    width: currentPicture === 4 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 4 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide10 : Guide10Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section08.1')}</p>
                <div
                  onClick={() => {
                    clickHandler(5);
                  }}
                  style={{
                    width: currentPicture === 5 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 5 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide11 : Guide11Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section08.2')}</p>
                <div
                  onClick={() => {
                    clickHandler(6);
                  }}
                  style={{
                    width: currentPicture === 6 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 6 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide16 : Guide16Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section08.3')}</p>
              </li>
              <li>
                <p>{t('guide.content.section08.4')}</p>
              </li>
            </ol>
          </div>
        </div>

        <div className="guide__container">
          <h3>{t('guide.content_title.11')}</h3>

          <div className="guide__content">
            <div>
              <p>{t('guide.content.section12.0')}</p>
            </div>
            <ol>
              <li>
                <p>{t('guide.content.section12.1')}</p>
                <div
                  onClick={() => {
                    clickHandler(12);
                  }}
                  style={{
                    width: currentPicture === 12 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 12 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide20 : Guide20Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section12.2')}</p>
                <div
                  onClick={() => {
                    clickHandler(13);
                  }}
                  style={{
                    width: currentPicture === 13 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 13 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide21 : Guide21Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section12.3')}</p>
              </li>
              <li>
                <p>{t('guide.content.section12.4')}</p>
              </li>
            </ol>
          </div>
        </div>

        <div className="guide__container">
          <h3>{t('guide.content_title.8')}</h3>
          {/* <YouTube
            videoId={
              i18n.language === LanguageType.KO 
                ? 
                "FvNhKqZ-4cc" 
                : 
                (i18n.language === LanguageType.ZHHANS 
                  ? 
                  "q6zhA7sGNfw" 
                  :
                  "WoBIgUZ1Ffk"
                )
            }
            className={"guide__youtube"}
            containerClassName={"guide__youtube__wrapper"}
          /> */}
          <div className="guide__content">
            <ol>
              <li>
                <p>{t('guide.content.section09.0')}</p>
                <div
                  onClick={() => {
                    clickHandler(7);
                  }}
                  style={{
                    width: currentPicture === 7 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 7 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide13 : Guide13Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section09.1')}</p>
                <div
                  onClick={() => {
                    clickHandler(8);
                  }}
                  style={{
                    width: currentPicture === 8 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 8 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide14 : Guide14Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section09.2')}</p>
              </li>
            </ol>
          </div>
        </div>

        <div className="guide__container">
          <h3>{t('guide.content_title.10')}</h3>
          <YouTube
            videoId={t('guide.youtube_link.7')}
            className={'guide__youtube'}
            containerClassName={'guide__youtube__wrapper'}
          />
          <p className="guide__content__bold">
            {t('guide.content.section11.4')}
          </p>

          <div className="guide__content">
            <p className="guide__content__bold">
              {t('guide.content.section11.0')}
            </p>
            <ol>
              <li>
                <p>{t('guide.content.section11.1')}</p>
                <div
                  onClick={() => {
                    clickHandler(9);
                  }}
                  style={{
                    width: currentPicture === 9 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 9 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide17 : Guide17Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section11.2')}</p>
                <div
                  onClick={() => {
                    clickHandler(10);
                  }}
                  style={{
                    width: currentPicture === 10 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 10 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide18 : Guide18Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
              <li>
                <p>{t('guide.content.section11.3')}</p>
                <div
                  onClick={() => {
                    clickHandler(11);
                  }}
                  style={{
                    width: currentPicture === 11 ? 'calc(100% - 5%)' : 300,
                  }}
                  className={`guide__onclick${
                    currentPicture === 11 ? '--active' : ''
                  }`}>
                  <img
                    className="guide__image"
                    src={
                      i18n.language === LanguageType.KO ? Guide19 : Guide19Eng
                    }
                    alt="Guide"
                  />
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="guide__container">
          <h3>{t('guide.content_title.12')}</h3>

          <div className="guide__content">
            <p className="guide__content__bold">
              {t('guide.content_title.13')}
            </p>
            <YouTube
              videoId={t('guide.youtube_link.8')}
              className={'guide__youtube'}
              containerClassName={'guide__youtube__wrapper'}
            />
          </div>
          <div className="guide__content">
            <p className="guide__content__bold">
              {t('guide.content_title.14')}
            </p>
            <YouTube
              videoId={t('guide.youtube_link.9')}
              className={'guide__youtube'}
              containerClassName={'guide__youtube__wrapper'}
            />
          </div>
          <div className="guide__content">
            <p className="guide__content__bold">
              {t('guide.content_title.15')}
            </p>
            <YouTube
              videoId={t('guide.youtube_link.10')}
              className={'guide__youtube'}
              containerClassName={'guide__youtube__wrapper'}
            />
          </div>
          <div className="guide__content">
            <p className="guide__content__bold">
              {t('guide.content_title.16')}
            </p>
            <YouTube
              videoId={t('guide.youtube_link.11')}
              className={'guide__youtube'}
              containerClassName={'guide__youtube__wrapper'}
            />
          </div>
        </div>
      </>
    );
  };
  return (
    <div className="guide">
      <div className="text__title" style={{ marginTop: 100 }}>
        <p className="bold">{t('guide.title')}</p>
        <hr />
      </div>
      <div className="guide__handler">
        {Array(4)
          .fill(1)
          .map((_value, index) => {
            return (
              <div
                className={`guide__handler__button${
                  guideIndex === index ? '' : ' disable'
                }`}
                onClick={() => setGuideIndex(index)}>
                <p className="bold">{t(`guide.button.${index}`)}</p>
              </div>
            );
          })}
      </div>
      {guideIndex === 0 && <PrerequisitesPage />}
      {guideIndex === 1 && <DepositWithdrawPage />}
      {guideIndex === 2 && <StakingPage />}
      {guideIndex === 3 && <VotingGuide />}
    </div>
  );
};

export default Guide;
