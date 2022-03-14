export interface IProps {
  src: string,
  name: string
}

const LazyImage:React.FC <IProps> = ({src, name}) => {
  return <img src={src} className={name} alt={name} />
}

export default LazyImage;