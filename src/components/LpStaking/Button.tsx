import { FunctionComponent } from 'react';

type Props = {
  onHandler: () => void;
  btnTitle: string;
  disabledBtn?: { background: string; color: string };
};

const Button: FunctionComponent<Props> = (props) => {
  const { onHandler, btnTitle, disabledBtn } = props;

  return (
    <button
      className="spoqa__medium lp_button"
      style={disabledBtn}
      onClick={() => onHandler()}>
      {btnTitle}
    </button>
  );
};

export default Button;
