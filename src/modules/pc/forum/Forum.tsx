import { useState } from 'react';
import '../css/style.scss';
import ForumBackground from 'src/shared/images/forum-background.png';
import Pinned from './images/pinned.svg';
import WhiteLogo from './images/White-logo.svg';
import Twitter from './images/twitter.svg';
import Telegram from './images/telegram.png';
import Github from './images/github.png';
import { useTranslation } from 'react-i18next';
import LanguageConverter from '../component/LanguageConverter';

const Forum = () => {
  const { i18n, t } = useTranslation();
  const [state, setState] = useState({
    forumPage: 1
  });


  return (
    <div className="forum" style={{ backgroundImage: `url(${ForumBackground})`, backgroundRepeat: "no-repeat", backgroundColor: "#000030" }}>
      <h1 className="forum__header-text"><span className="forum__header-text--blue">{t("main.elyfi")}</span>{t("forum.title")}</h1>
      <div style={{ minHeight: 400 }}>
        <table className="forum__table">
          <thead>
            <tr>
              <th style={{ width: 50 }}>
              </th>
              <th>
                <p>
                  {t("forum.topic")}
                </p>
              </th>
              <th>
                <p>
                  {t("forum.activity")}
                </p>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>
                <img src={Pinned} alt="pinned" />
              </th>
              <th>
                <p
                  className="forum__table-subject"
                  onClick={() => {
                    setState({ ...state, forumPage: state.forumPage === 1 ? 0 : 1 })
                  }}
                >
                  ELYFI DOCS released
                </p>
              </th>
              <th>
                <p>
                  21.04.05
                </p>
              </th>
            </tr>
            <tr style={{ display: state.forumPage === 1 ? "table-row" : "none" }}>
              <th>
              </th>
              <th colSpan={2}>
                <p>We are excited to announce the release of ELYFI, a decentralized crypto lending protocol using real estate assets as collateral.<br /><br />Read the docs here (Korean only): <a href='https://elyfi-docs.elysia.land' style={{ cursor: 'pointer', color: 'white' }}>[https://elyfi-docs.elysia.land]</a><br /><br />
                  ELYFI will be the first DeFi protocol to apply real world assets into the money pool. real estate owners will be able to borrow cryptocurrencies using their properties as collateral, while lenders receive APYs from margin deposit wallets reflecting property income.
                  English docs released later this week. We will also introduce detailed specs each week while we continue testing the product. Beta App coming soon!</p>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="forum__footer">
        <img className="forum__footer-white-logo" src={WhiteLogo} alt="Elysia" />
        <div className="forum__footer-wrapper">
          <LanguageConverter />

          <hr className="forum__footer-line" style={{ borderColor: "#00A7FF", width: 0, height: 30 }} />
          <div className="forum__footer-logo-wrapper">
            <a href='https://twitter.com/Elysia_HQ' target='_blank'>
              <img className="forum__footer-logo" src={Twitter} />
            </a>
            <a href='https://t.me/elysia_official' target='_blank'>
              <img className="forum__footer-logo" src={Telegram} style={{ width: 22, height: 22 }} />
            </a>
            <a href='https://github.com/elysia-dev' target='_blank'>
              <img className="forum__footer-logo" src={Github} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forum;