const ModalHeader: React.FunctionComponent<{
  image?: string;
  subImage?: string;
  title: string;
  onClose?: () => void;
}> = ({ image, subImage, title, onClose }) => {
  return (
    <div className="modal__header">
      <div className="modal__header__content">
        {!!image && (
          <img className="modal__header__image" src={image} alt="Token image" />
        )}
        {!!subImage && !!image && (
          <img
            className="modal__header__image--sub-token"
            src={subImage}
            alt="Token image"
          />
        )}
        <h2 className="modal__header__name">{title}</h2>
      </div>
      {!!onClose && (
        <div className="close-button" onClick={() => onClose()}>
          <div className="close-button--1">
            <div className="close-button--2" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalHeader;
