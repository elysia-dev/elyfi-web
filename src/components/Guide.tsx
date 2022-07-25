import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageType from 'src/enums/LanguageType';
import PortfolioInfoKor from 'src/assets/images/portfolio_info--kor.png';
import PortfolioInfoEng from 'src/assets/images/portfolio_info--eng.png';
import PortfolioInfoChn from 'src/assets/images/portfolio_info--cha.png';

type Props = {
  content: string;
};

function Guide(props: Props): JSX.Element {
  const { t, i18n } = useTranslation();
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  return (
    <div
      style={{
        display: 'inline-block',
        border: '1.5px solid #4C4D72',
        width: 15,
        height: 15,
        borderRadius: 15,
        textAlign: 'center',
        lineHeight: 1,
        marginLeft: 11,
        fontSize: 13,
        color: '#4C4D72',
      }}
      onMouseEnter={(e) => {
        setIsBoxVisible(true);
      }}
      onMouseLeave={() => {
        setIsBoxVisible(false);
      }}>
      ?
      {isBoxVisible && (
        <div
          style={{
            position: 'absolute',
            width: props.content === 'ABToken' ? '330px' : '330px',
            left: props.content === 'ABToken' ? '-5px' : '-5px',
            padding: '5px 15px',
            background: '#fff',
            boxShadow: '0 0 6px rgb(0 0 0/16%)',
            zIndex: 99,
            lineHeight: 1.5,
            textAlign: 'left',
          }}>
          {props.content === 'ABToken' ? (
            <div className="portfolio__info__details__content">
              <b className="spoqa__bold">{t('portfolio.abtoken_title')}</b>
              <p>{t('portfolio.abtoken_content')}</p>
              <div className="portfolio__info__details__image">
                {i18n.language === LanguageType.KO ? (
                  <img
                    src={PortfolioInfoKor}
                    style={{
                      width: '300px',
                      marginTop: '20px',
                      marginBottom: 10,
                      objectFit: 'scale-down',
                    }}
                  />
                ) : i18n.language === LanguageType.CN ? (
                  <img
                    src={PortfolioInfoChn}
                    style={{
                      width: '300px',
                      marginTop: '20px',
                      marginBottom: 10,
                      objectFit: 'scale-down',
                    }}
                  />
                ) : (
                  <img
                    src={PortfolioInfoEng}
                    style={{
                      width: '300px',
                      marginTop: '20px',
                      marginBottom: 10,
                      objectFit: 'scale-down',
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            props.content
          )}
        </div>
      )}
    </div>
  );
}

export default Guide;
