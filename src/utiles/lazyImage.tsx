import { CSSProperties } from 'react';

export interface IProps {
  src: string;
  name: string;
  style?: CSSProperties;
  setImage?: React.Dispatch<React.SetStateAction<string>>;
}

const LazyImage: React.FC<IProps> = ({ src, name, style, setImage }) => {
  return (
    <img
      src={src}
      className={name}
      alt={name}
      style={style}
      onError={() =>
        setImage &&
        setImage(
          'https://elysia-public.s3.ap-northeast-2.amazonaws.com/elyfi/borrow01.png',
        )
      }
    />
  );
};

export default LazyImage;
