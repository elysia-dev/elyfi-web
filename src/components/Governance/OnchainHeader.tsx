import { useTranslation } from 'react-i18next';
import MainnetType from 'src/enums/MainnetType';
import MediaQuery from 'src/enums/MediaQuery';
import { IBSCOnChainTopic, IOnChainTopic } from 'src/clients/OnChainTopic';
import Questionmark from '../Questionmark';

interface Props {
  mainnetType: MainnetType;
  onChainData: IOnChainTopic[] | undefined;
  onChainSnapshotData: IBSCOnChainTopic[] | undefined;
  mediaQuery: MediaQuery;
}

const OnchainHeader: React.FC<Props> = ({
  mainnetType,
  onChainData,
  onChainSnapshotData,
  mediaQuery,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <header>
        <h3>
          {t('governance.on_chain_voting')}{' '}
          <span>
            <Questionmark content={t('governance.guide.onchain')} />
          </span>
        </h3>

        <a
          href={`${t(`governance.link.snapshot`)}`}
          target="_blank"
          rel="noopener noreferer">
          <p>
            {t(`governance.onChain_button.snapshot`)} {'>'}
          </p>
        </a>
      </header>
    </>
  );
};

export default OnchainHeader;
