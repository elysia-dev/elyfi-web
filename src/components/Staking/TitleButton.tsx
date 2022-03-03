import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Token from 'src/enums/Token';

type Props = {
  buttonName: string;
  link: string;
  linkName?: string;
  linkImage?: string;
};

const TitleButton: FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();
  const { buttonName, link, linkName, linkImage } = props;

  return (
    <div className="staking__title__button">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {linkImage && <img src={linkImage} alt={linkName} />}
        <p>{buttonName}</p>
      </a>
    </div>
  );
};

export default TitleButton;
