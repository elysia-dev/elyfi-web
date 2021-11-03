type Props = {
  onHandler: () => void;
  btnTitle: string;
};

function LpButton(props: Props) {
  const { onHandler, btnTitle } = props;
  return (
    <button className="spoqa__medium lp_button" onClick={() => onHandler()}>
      {btnTitle}
    </button>
  );
}

export default LpButton;
