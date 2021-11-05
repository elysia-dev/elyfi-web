import moment from 'moment';
import lpStakingTime from 'src/core/data/lpStakingTime';

type Props = {
  onHandler: () => void;
  btnTitle: string;
};

function LpButton(props: Props) {
  const { onHandler, btnTitle } = props;
  const isStakingDate = moment().isBefore(lpStakingTime.startedAt);

  return (
    <button
      className="spoqa__medium lp_button"
      style={{
        background: isStakingDate ? '#f8f8f8' : undefined,
        color: isStakingDate ? '#949494' : undefined,
      }}
      onClick={() => (isStakingDate ? '' : onHandler())}>
      {btnTitle}
    </button>
  );
}

export default LpButton;
