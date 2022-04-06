import { FunctionComponent, lazy, Suspense } from 'react';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

type Props = {
  buttonName: string;
  link: string;
  linkName?: string;
  linkImage?: string;
};

const TitleButton: FunctionComponent<Props> = (props) => {
  const { buttonName, link, linkName, linkImage } = props;

  return (
    <a
      className="staking__title__button"
      href={link}
      target="_blank"
      rel="noopener noreferrer">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Suspense fallback={null}>
          {linkImage && <LazyImage src={linkImage} name={linkName || ''} />}
        </Suspense>
        <p>{buttonName}</p>
      </div>
    </a>
  );
};

export default TitleButton;
