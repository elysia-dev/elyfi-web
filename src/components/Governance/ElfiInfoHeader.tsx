import { useTranslation } from 'react-i18next';
import { INapData, TopicList } from 'src/clients/OffChainTopic';
import MainnetType from 'src/enums/MainnetType';
import MediaQuery from 'src/enums/MediaQuery';

interface Props {
  mediaQuery: MediaQuery;
  mainnetType: MainnetType;
  offChainNapData: INapData[] | undefined;
}

const ElfiInfoHeader: React.FC<Props> = ({
  mainnetType,
  offChainNapData,
  mediaQuery,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <header>
        <h3>{t('governance.vote.header')}</h3>
      </header>
    </>
  );
};

export default ElfiInfoHeader;
