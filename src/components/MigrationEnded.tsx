import { useTranslation } from 'react-i18next';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import ModalHeader from 'src/components/ModalHeader';

const MigrationEnded: React.FunctionComponent<{
  visible: boolean;
  round: number;
  onClose: () => void;
}> = ({ visible, round, onClose }) => {
  const { t, i18n } = useTranslation();

  return (
    <div
      className="modal modal__alert"
      style={{ display: visible ? 'block' : 'none' }}>
      <div className="modal__container">
        <ModalHeader title={t('staking.migration')} onClose={onClose} />
        <div className="modal__alert__content">
          <h2>
            {t('staking.nth_staking_round_ended', {
              nth: toOrdinalNumber(i18n.language, round),
            })}
          </h2>
          <div className="modal__alert__wrapper">
            <p>
              {t('staking.nth_period', {
                nth: toOrdinalNumber(i18n.language, round),
              })}
            </p>
            <div>
              <p>
                {stakingRoundTimes[round - 1].startedAt.format(
                  'YYYY.MM.DD HH:mm:ss',
                )}
              </p>
              <p>~</p>
              <p>
                {stakingRoundTimes[round - 1].endedAt.format(
                  'YYYY.MM.DD HH:mm:ss',
                ) + ` (KST)`}
              </p>
            </div>
          </div>
        </div>
        <div className={`modal__button`} onClick={onClose}>
          <p>{t('staking.ok')}</p>
        </div>
      </div>
    </div>
  );
};

export default MigrationEnded;
