import { FunctionComponent } from 'react';

type Props = {
  stakingType: string;
};

const RewardPlanButton: FunctionComponent<Props> = ({ stakingType }) => {
  return (
    <>
      <div className="reward-plan-button">
        <a
          style={{
            cursor: 'pointer',
          }}
          href={`/rewardplan/${stakingType}`}
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
