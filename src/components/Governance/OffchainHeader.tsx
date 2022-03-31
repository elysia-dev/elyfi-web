import { useTranslation } from 'react-i18next';
import { TopicList } from 'src/clients/OffChainTopic';
import MainnetType from 'src/enums/MainnetType';
import MediaQuery from 'src/enums/MediaQuery';
import moment from 'moment';

interface Props {
  mediaQuery: MediaQuery;
  mainnetType: MainnetType;
  offChainNapData: TopicList[] | undefined;
}

const OffchainHeader: React.FC<Props> = ({
  mainnetType,
  offChainNapData,
  mediaQuery,
}) => {
  const { t } = useTranslation();

  return mediaQuery === MediaQuery.PC ? (
    <>
      <h3>
        {t('governance.data_verification', {
          count:
            offChainNapData &&
            offChainNapData
              .filter((data: any) => data.network === mainnetType)
              .filter((data: any) => {
                return moment().isBefore(data.endedDate);
              }).length,
        })}
      </h3>
      <div>
        <p>{t('governance.data_verification__content')}</p>
        <a
          href="https://forum.elyfi.world/"
          target="_blank"
          rel="noopener noreferer">
          <div
            className="deposit__table__body__amount__button"
            style={{
              width: 230,
            }}>
            <p>{t('governance.forum_button')}</p>
          </div>
        </a>
      </div>
    </>
  ) : (
    <>
      <div>
        <h3>
          {t('governance.data_verification', {
            count:
              offChainNapData &&
              offChainNapData
                .filter((data: any) => data.network === mainnetType)
                .filter((data: any) => moment().isBefore(data.endedDate))
                .length,
          })}
        </h3>
        <a
          href="https://forum.elyfi.world/"
          target="_blank"
          rel="noopener noreferer">
          <div
            className="deposit__table__body__amount__button"
            style={{
              width: 150,
            }}>
            <p>{t('governance.forum_button')}</p>
          </div>
        </a>
      </div>
      <p>{t('governance.data_verification__content')}</p>
    </>
  );
};

export default OffchainHeader;
