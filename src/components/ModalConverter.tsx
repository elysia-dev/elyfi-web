const ModalConverter: React.FunctionComponent<{
  handlerProps: boolean;
  title: string[];
  setState: (value: React.SetStateAction<boolean>) => void;
  isEndedRound: boolean;
}> = ({ handlerProps, title, setState, isEndedRound }) => {
  return (
    <div className="modal__converter">
      {isEndedRound && (
        <div
          className={`modal__converter__column${
            handlerProps ? ' selected' : ''
          }`}
          onClick={() => {
            setState(true);
          }}>
          <h2>{title[0]}</h2>
        </div>
      )}
      {title.length === 2 && (
        <div
          className={`modal__converter__column${
            !handlerProps ? ' selected' : ''
          }`}
          onClick={() => {
            setState(false);
          }}>
          <h2>{title[1]}</h2>
        </div>
      )}
    </div>
  );
};

export default ModalConverter;
