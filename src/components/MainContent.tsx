import { Trans, useTranslation } from 'react-i18next';
import { useParams, useHistory } from 'react-router-dom';

const MainContent: React.FunctionComponent<{
  index: number,
  data: {
    image: string,
    link: string
  }
}> = ({ index, data }) => {

  const { t } = useTranslation();
  const History = useHistory();

  return (
    <div className="main__section">
      <div className="main__content__image-container">
      {
        index % 2 ? 
          <img src={data.image} /> : 
          <></>
      }
      </div>
      <div className="main__content">
        <div>
          <h2 className="blue">
            #{index + 1}
          </h2>
        </div>
        <div>
          <p>
            <Trans>
              {t(`main.section.${index}.header`)}
            </Trans>
          </p>
          <p className="main__content__details">
            {t(`main.section.${index}.content`)}
          </p>
          <div onClick={() => History.push({ pathname: data.link })}>
            <p>
              {t(`main.section.${index}.button`)}
            </p>
          </div>
        </div>
      </div>
      <div className="main__content__image-container">
      {
        !(index % 2) ? 
          <img src={data.image} /> : 
          <></>
      }
      </div>
    </div>
  )
}

export default MainContent;