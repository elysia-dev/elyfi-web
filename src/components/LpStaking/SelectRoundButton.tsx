import { FunctionComponent } from 'react';

type Props = {
  round: number;
  setRound: () => void;
};

const SelectRoundButton: FunctionComponent<Props> = ({ round, setRound }) => {
  return (
    <div
      style={{
        width: 200,
        height: 30,
        border: '1px solid #000000',
        cursor: 'pointer',
      }}
      onClick={setRound}>
      {round}차 버튼
    </div>
  );
};

export default SelectRoundButton;
