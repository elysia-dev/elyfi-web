import { useTranslation } from 'react-i18next';
import { INapData, TopicList } from 'src/clients/OffChainTopic';
import MainnetType from 'src/enums/MainnetType';
import MediaQuery from 'src/enums/MediaQuery';
import moment from 'moment';
import Guide from '../Guide';
import Questionmark from '../Questionmark';

interface Props {
  mediaQuery: MediaQuery;
  mainnetType: MainnetType;
  offChainNapData: INapData[] | undefined;
}

const OffchainHeader: React.FC<Props> = ({
  mainnetType,
  offChainNapData,
  mediaQuery,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <header>
        <h3>
          {t('governance.data_verification')}
          <span>
            <Questionmark content={t('governance.guide.offchain')} />
          </span>
        </h3>
        <a
          href="https://forum.elyfi.world/"
          target="_blank"
          rel="noopener noreferer">
          <p>
            {t('governance.forum_button')} {'>'}
          </p>
        </a>
      </header>
    </>
  );
};

export default OffchainHeader;
