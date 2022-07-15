import { useTranslation } from 'react-i18next';
import { INews } from 'src/components/NFTDetails';

interface Props {
  index: number;
  data: INews;
}

const NewsCard: React.FC<Props> = ({ index, data }) => {
  const { t } = useTranslation();

  return (
    <section key={index}>
      <img src={data.image} alt="News image" />
      <b>{data.title}</b>
      <p>{data.content}</p>
      <a target="_blank" href={data.link}>
        {t('nftMarket.newsButton')}
      </a>
    </section>
  );
};

export default NewsCard;
