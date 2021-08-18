import { useTranslation } from 'react-i18next';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';

const StakingEnded: React.FunctionComponent<{
  visible: boolean,
  round: number,
  onClose: () => void
}> = ({ visible, round, onClose }) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="modal modal--deposit" style={{ display: visible ? "block" : "none" }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name spoqa__bold"></p>
            </div>
          </div>
          <div className="close-button" onClick={onClose}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className="modal__migration__alert">
          <p className="spoqa__bold">
            {t("staking.nth_staking_round_ended", { nth: toOrdinalNumber(i18n.language, round) })}
          </p>
          <div>
            <p>
              {t("staking.nth_period", { nth: toOrdinalNumber(i18n.language, round) })}
            </p>
            <div>
              <p>
                {stakingRoundTimes[round - 1].startedAt.format('YYYY.MM.DD HH:mm:ss')}
              </p>
              <p>
                ~
              </p>
              <p>
                {stakingRoundTimes[round - 1].endedAt.format('YYYY.MM.DD HH:mm:ss') + ` (KST)`}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`modal__button`}
          onClick={onClose}
        >
          <p>
            {t("staking.ok")}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StakingEnded;