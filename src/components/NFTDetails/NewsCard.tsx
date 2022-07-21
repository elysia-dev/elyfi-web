import { useTranslation } from 'react-i18next';
import { INews } from 'src/components/NFTDetails';

interface Props {
  index: number;
  data: INews;
}

const NewsCard: React.FC<Props> = ({ index, data }) => {
  const { t } = useTranslation();

  return (
    <a key={index} target="_blank" href={data.link}>
      <img src={data.image} alt="News image" />
      <b>{data.title}</b>
      <p>{data.content}</p>
      <a>{t('nftMarket.newsButton')}</a>
    </a>
  );
};

export default NewsCard;
