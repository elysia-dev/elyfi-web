import { Trans, useTranslation } from 'react-i18next';

import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import useNavigator from 'src/hooks/useNavigator';

const MainContent: React.FunctionComponent<{
  index: number;
  data: {
    image: () => JSX.Element;
    link: string;
    ga: () => void;
  };
}> = ({ index, data }) => {
  const { t } = useTranslation();
  const navigate = useNavigator();

  const { value: mediaQuery } = useMediaQueryType();

  return (
    <div className="main__section">
      {!(index % 2) && mediaQuery !== MediaQuery.Mobile ? (
        <div className="main__content__image-container">{data.image()}</div>
      ) : (
        <></>
      )}
      <div className="main__content">
        <div>
          <h2 className="blue">#{index + 1}</h2>
        </div>
        <div>
          <p>
            <Trans>{t(`main.section.${index}.header`)}</Trans>
          </p>
          <p className="main__content__details">
            {t(`main.section.${index}.content`)}
          </p>
          {mediaQuery === MediaQuery.Mobile && (
            <div className="main__content__image-container">{data.image()}</div>
          )}
          <div
            onClick={() => {
              data.ga();
              navigate(data.link);
            }}
            className="main__content__button">
            <p>{t(`main.section.${index}.button`)}</p>
          </div>
        </div>
      </div>
      {index % 2 && mediaQuery !== MediaQuery.Mobile ? (
        <div className="main__content__image-container">{data.image()}</div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MainContent;
