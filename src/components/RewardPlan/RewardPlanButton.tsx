import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

type Props = {
  stakingType: string;
};

const RewardPlanButton: FunctionComponent<Props> = ({ stakingType }) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation();
  return (
    <>
      <div className="reward-plan-button">
        <a
          style={{
            cursor: 'pointer',
          }}
          href={`/${lng}/rewardplan/${stakingType}`}
          rel="noopener noreferrer">
          <p className="bold blue">
            {t("dashboard.reward_plan--button")}
          </p>
        </a>
      </div>
    </>
  );
};

export default RewardPlanButton;
