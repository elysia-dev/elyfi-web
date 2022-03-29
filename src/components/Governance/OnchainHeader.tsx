import { useTranslation } from 'react-i18next';
import MainnetType from 'src/enums/MainnetType';
import MediaQuery from 'src/enums/MediaQuery';
import { IBSCOnChainTopic, IOnChainToipc } from 'src/clients/OnChainTopic';

interface Props {
  mainnetType: MainnetType;
  onChainData: IOnChainToipc[] | undefined;
  onChainBscData: IBSCOnChainTopic[] | undefined;
  mediaQuery: MediaQuery;
}

const OnchainHeader: React.FC<Props> = ({
  mainnetType,
  onChainData,
  onChainBscData,
  mediaQuery,
}) => {
  const { t } = useTranslation();

  return mediaQuery === MediaQuery.PC ? (
    <div>
      <h3>
        {t('governance.on_chain_voting', {
          count:
            mainnetType === MainnetType.Ethereum
              ? onChainData?.length
              : onChainBscData?.length,
        })}
      </h3>
      <div>
        <p>
          {t(
            `governance.on_chain_voting__content.${
              mainnetType === MainnetType.Ethereum ? 'tally' : 'snapshot'
            }`,
          )}
        </p>
        <a
          href={`${t(
            `governance.link.${
              mainnetType === MainnetType.Ethereum ? 'tally' : 'snapshot'
            }`,
          )}`}
          target="_blank"
          rel="noopener noreferer">
          <div
            className="deposit__table__body__amount__button"
            style={{
              width: 230,
            }}>
            <p>
              {t(
                `governance.onChain_button.${
                  mainnetType === MainnetType.Ethereum ? 'tally' : 'snapshot'
                }`,
              )}
            </p>
          </div>
        </a>
      </div>
    </div>
  ) : (
    <div>
      <div>
        <h3>
          {t('governance.on_chain_voting', {
            count: onChainData?.length,
          })}
        </h3>
        <a
          href={`${t(
            `governance.link.${
              mainnetType === MainnetType.Ethereum ? 'tally' : 'snapshot'
            }`,
          )}`}
          target="_blank"
          rel="noopener noreferer">
          <div
            className="deposit__table__body__amount__button"
            style={{
              width: 150,
            }}>
            <p>
              {t(
                `governance.onChain_button.${
                  mainnetType === MainnetType.Ethereum ? 'tally' : 'snapshot'
                }`,
              )}
            </p>
          </div>
        </a>
      </div>
      <p>{t('governance.data_verification__content')}</p>
    </div>
  );
};

export default OnchainHeader;
