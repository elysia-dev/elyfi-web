import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

type Props = {
  stakingType: string;
};

const RewardPlanButton: FunctionComponent<Props> = ({ stakingType }) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation();
  return (
    <>
      <div className="reward-plan-button">
        <Link
          style={{
            cursor: 'pointer',
          }}
          to={`/${lng}/rewardplan/${stakingType}`}>
          <p className="bold blue">{t('dashboard.reward_plan--button')}</p>
        </Link>
      </div>
    </>
  );
};

export default RewardPlanButton;
