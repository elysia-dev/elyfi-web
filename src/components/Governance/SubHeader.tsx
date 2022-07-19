import { useTranslation } from 'react-i18next';
import Questionmark from '../Questionmark';

interface Props {
  content: string;
  button?: string;
  questionmark?: string;
  link?: string;
}

const SubHeader: React.FC<Props> = ({
  link,
  content,
  questionmark,
  button,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <header>
        <h3>
          {content}
          {questionmark && (
            <span>
              <Questionmark content={questionmark} />
            </span>
          )}
        </h3>
        {link && (
          <a href={link} target="_blank" rel="noopener noreferer">
            <p>
              {button} {'>'}
            </p>
          </a>
        )}
      </header>
    </>
  );
};

export default SubHeader;
