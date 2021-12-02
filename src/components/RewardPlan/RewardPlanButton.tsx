import { FunctionComponent } from 'react';
import { useParams } from 'react-router-dom';

type Props = {
  stakingType: string;
};

const RewardPlanButton: FunctionComponent<Props> = ({ stakingType }) => {
  const { lng } = useParams<{ lng: string }>();
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
            {'보상플랜 확인 하기 >'}
          </p>
        </a>
      </div>
    </>
  );
};

export default RewardPlanButton;
