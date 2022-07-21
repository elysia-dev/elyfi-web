interface Button {
  content: string;
  onClickHandler?: () => void;
  image?: string;
}

const WalletButton: React.FC<Button> = ({ content, image, onClickHandler }) => {
  return (
    <div className="market_modal__button">
      <button onClick={() => onClickHandler && onClickHandler()}>
        {image && <img src={image} alt={'image'} />}
        <p>{content}</p>
      </button>
    </div>
  );
};

export default WalletButton;
