import { FunctionComponent } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const GovernanceGuideBox: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <div className="jreward__governance-title">
      <div>
        <div>
          <div />
          <p className="spoqa">
            <Trans i18nKey="reward.governance--header" />
          </p>
        </div>
        <p className="spoqa">{t('reward.governance--content')}</p>
      </div>
      <div>
        <div>
          <div>
            <p className="spoqa__bold">{t('reward.elyfi')}</p>
          </div>
          <div>
            <div>
              <p>{t('reward.protocol_profit')}</p>
            </div>
            <div className="dashed_arrow">
              <div className="line" />
              <div className="down_arrow" />
            </div>
            <div className="dashed_arrow">
              <div className="up_arrow" />
              <div className="line" />
            </div>
            <div>
              <p>{t('reward.participate_governance')}</p>
            </div>
          </div>
          <div>
            <p className="spoqa__bold">{t('reward.elyfi_holder')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernanceGuideBox;
