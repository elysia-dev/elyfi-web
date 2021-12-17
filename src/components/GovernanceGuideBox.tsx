import { FunctionComponent } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const GovernanceGuideBox: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <section className="governance__elyfi-graph">
      <div>
        <div>
          <p>
            {t("governance.graph.0")}
          </p>
        </div>
      </div>
      <div className="governance__elyfi-graph__arrow-container">
        <div>
          <p>
            {t("governance.graph.1")}
          </p>
        </div>
        <div className="arrow-wrapper">
          <div className="line" />
          <div className="right-arrow" />
        </div>
        <div className="arrow-wrapper">
          <div className="left-arrow" />
          <div className="line"/>
        </div>
        <div>
          <p>
            {t("governance.graph.2")}
          </p>
        </div>
      </div>
      <div>
        <div>
          <p>
            {t("governance.graph.3")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default GovernanceGuideBox;
