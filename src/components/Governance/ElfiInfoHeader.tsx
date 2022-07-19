import { useTranslation } from 'react-i18next';
import { INapData, TopicList } from 'src/clients/OffChainTopic';
import MainnetType from 'src/enums/MainnetType';
import MediaQuery from 'src/enums/MediaQuery';

interface Props {
  index: string;
  content: string;
  link: string;
  linkContent: string;
  subContent: string;
}

const ElfiInfoHeader: React.FC<Props> = ({
  index,
  content,
  link,
  linkContent,
  subContent,
}) => {
  const { t } = useTranslation();

  return (
    <header>
      <div>
        <span>
          <strong>{index}</strong>
        </span>
        <strong>{content}</strong>
        <a href={link} rel="noopener noreferer" target="_blank">
          <p>{linkContent}</p>
        </a>
      </div>
      <p>{subContent}</p>
    </header>
  );
};

export default ElfiInfoHeader;
