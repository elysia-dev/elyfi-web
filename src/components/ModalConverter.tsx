

const ModalConverter: React.FunctionComponent<{
  handlerProps: boolean,
  title: string[],
  setState: (
    value: React.SetStateAction<boolean>
  ) => void,
}> = ({ handlerProps, title, setState }) => {
  return (
    <div className="modal__converter">
      <div
        className={`modal__converter__column${
          handlerProps ? ' selected' : ''
        }`}
        onClick={() => {
          setState(true);
        }}>
        <h2>{title[0]}</h2>
      </div>
      <div
        className={`modal__converter__column${
          !handlerProps ? ' selected' : ''
        }`}
        onClick={() => {
          setState(false);
        }}>
        <h2>{title[1]}</h2>
      </div>
    </div>
  )
}

export default ModalConverter;