import { CSSProperties } from 'react';

export interface IProps {
  src: string;
  name: string;
  style?: CSSProperties;
}

const LazyImage: React.FC<IProps> = ({ src, name, style }) => {
  return <img src={src} className={name} alt={name} style={style} />;
};

export default LazyImage;
