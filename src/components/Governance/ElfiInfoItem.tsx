import Questionmark from '../Questionmark';

type Props = {
  title: string;
  content: string;
  questionmark?: string;
};

const ElfiInfoItem: React.FC<Props> = ({ title, content, questionmark }) => {
  return (
    <div>
      <p>
        {title}
        {questionmark && (
          <span>
            <Questionmark content={questionmark} />
          </span>
        )}
      </p>
      <p>{content}</p>
    </div>
  );
};

export default ElfiInfoItem;
