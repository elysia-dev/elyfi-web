import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';

type Props = {
  stakingType: string;
  isStaking: boolean;
};

const LegacyStakingButton: FunctionComponent<Props> = ({
  stakingType,
  isStaking,
}) => {
  const { lng } = useParams<{ lng: string }>();
  const { t } = useTranslation();
  return (
    <>
      <div className="reward-plan-button">
        <Link
          style={{
            cursor: 'pointer',
          }}
          to={`/${lng}/legacystaking/${stakingType}`}>
          <p className="bold blue">이전 스테이킹 프로그램 {'>'}</p>
        </Link>
      </div>
    </>
  );
};

export default LegacyStakingButton;
