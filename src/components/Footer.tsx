import LanguageConverter from 'src/components/LanguageConverter';
import Twitter from 'src/assets/images/twitter.png';
import Telegram from 'src/assets/images/telegram.png';
import Github from 'src/assets/images/github.png';
import Discord from 'src/assets/images/discord.png';

const Footer = (): JSX.Element => {
  return (
    <footer className="footer">
      <div>
        <div className="footer__right-container">
          <LanguageConverter />
          <div className="footer__link">
            {[
              [Twitter, 'https://twitter.com/Elysia_HQ'],
              [Telegram, 'https://t.me/elysia_official'],
              [Github, 'https://github.com/elysia-dev'],
              [Discord, 'https://discord.gg/JjjYrE5Ww8'],
            ].map((data, index) => {
              return (
                <a key={`footer_${index}`} href={data[1]}>
                  <img src={data[0]} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
      <h2>ⓒ 2021·2022 | ELYFI | All rights reserved.</h2>
    </footer>
  );
};

export default Footer;
