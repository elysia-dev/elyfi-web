import { Trans, useTranslation } from 'react-i18next';
import SpinnerToken from 'src/assets/images/market/tokenSpinning.mp4';
import Logo from 'src/assets/images/ELYFI_logo.svg';
import moment from 'moment';

interface Props {
  tokenName: string;
  tokenAmount: number;
  endedTime: moment.Moment;
  onClose: () => void;
}

const TokenRewardModal: React.FC<Props> = ({
  tokenName,
  tokenAmount,
  endedTime,
  onClose,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <>
      <div className="market_modal" style={{ display: 'block' }}>
        <div className="market_modal__wrapper">
          <header className={`market_modal__header `}>
            <img
              src={Logo}
              alt="Elyfi logo"
              style={{ width: 120, height: 28 }}
            />
            <div onClick={onClose}>
              <div></div>
              <div></div>
            </div>
          </header>
          <div className="market_modal__token-reward">
            <b>
              <Trans>
                {t('nftModal.complete.header', {
                  tokenName,
                  tokenAmount: tokenAmount.toFixed(4),
                })}
              </Trans>
            </b>
            <video
              src={SpinnerToken}
              muted={true}
              loop={true}
              autoPlay={true}
            />
            <section>
              <p>{t('nftModal.complete.title')}</p>
              <b>
                {moment(endedTime)
                  .add(1, 'day')
                  .format(
                    i18n.language === 'en' ? 'MM-DD-YYYY' : 'YYYY.MM.DD',
                  )}{' '}
                KST
              </b>
              <p>
                <Trans>{t('nftModal.complete.content')}</Trans>
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenRewardModal;
