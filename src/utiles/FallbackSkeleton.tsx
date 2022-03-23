import Skeleton from "react-loading-skeleton";

export interface IProps {
  width?: number | string;
  height?: number | string;
}

const FallbackSkeleton: React.FC <IProps> = ({ width, height }) => {
  return <div style={{ display: 'block', width: "100%", height: "100%" }}><Skeleton width={width || "100%"} height={height || "100%"} /></div>
}

export default FallbackSkeleton;