import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import LanguageType from 'src/enums/LanguageType';

const MigrationEnded: React.FunctionComponent<{ 
  visible: boolean,
  round: number,
  onClose: () => void
}> = ({ visible, round, onClose }) => {
  const { t, i18n } = useTranslation();

  const OrdinalNumberConverter = (value: number) => {
    switch (value) {
      case 1: return i18n.language === LanguageType.EN ? "1st" : i18n.language === LanguageType.ZHHANS ? "一" : "1"
      case 2: return i18n.language === LanguageType.EN ? "2nd" : i18n.language === LanguageType.ZHHANS ? "二" : "2"
      case 3: return i18n.language === LanguageType.EN ? "3rd" : i18n.language === LanguageType.ZHHANS ? "三" : "3"
      case 4: return i18n.language === LanguageType.EN ? "4th" : i18n.language === LanguageType.ZHHANS ? "四" : "4"
      case 5: return i18n.language === LanguageType.EN ? "5th" : i18n.language === LanguageType.ZHHANS ? "五" : "5"
      case 6: return i18n.language === LanguageType.EN ? "6th" : i18n.language === LanguageType.ZHHANS ? "六" : "6"
      default: return ""
    }
  }

  return (
    <div className="modal modal--deposit" style={{ display: visible ? "block" : "none" }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name spoqa__bold">{t("staking.migration")}</p>
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
            {t("staking.nth_staking_round_ended", { nth: OrdinalNumberConverter(round) })}
          </p>
          <div>
            <p>
              {t("staking.nth_period", { nth: OrdinalNumberConverter(round) })}
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

export default MigrationEnded;  