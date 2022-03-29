import { CSSProperties } from 'react';
import Skeleton from 'react-loading-skeleton';

export interface IProps {
  width?: number | string;
  height?: number | string;
  style?: CSSProperties;
}

const FallbackSkeleton: React.FC<IProps> = ({ width, height, style }) => {
  return (
    <div
      style={{
        ...style,
        display: 'block',
        width: '100%',
        height: height || '100%',
      }}>
      <Skeleton width={width || '100%'} height={height || '100%'} />
    </div>
  );
};

export default FallbackSkeleton;
