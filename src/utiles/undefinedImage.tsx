import { lazy } from 'react';
import UnKnownImage from 'src/assets/images/undefined_image.svg';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

const UndefinedImage: React.FC<{
  image: string;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}> = ({ image, setImage }) => {
  const { value: mediaQuery } = useMediaQueryType();

  return image ? (
    <LazyImage src={image} name={`csp_image`} setImage={setImage} />
  ) : (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
      <LazyImage
        src={UnKnownImage}
        name="Asset image is temporarily unavailable"
        style={{
          width: mediaQuery === MediaQuery.PC ? 'auto' : 50,
          marginBottom: 20,
        }}
      />
      <p
        style={{
          textAlign: 'center',
          color: '#888',
          fontSize: mediaQuery === MediaQuery.PC ? 16 : 10,
        }}>
        Asset image is temporarily unavailable
      </p>
    </div>
  );
};

export default UndefinedImage;
