import { FunctionComponent } from 'react';

type Props = {
  stakingType: string;
};

const RewardPlanButton: FunctionComponent<Props> = ({ stakingType }) => {
  return (
    <>
      <div>
        <a
          style={{
            cursor: 'pointer',
          }}
          href={`/rewardplan/${stakingType}`}
          rel="noopener noreferrer">
          {'보상 플랜 확인 하기 >'}
        </a>
      </div>
    </>
  );
};

export default RewardPlanButton;
