interface Button {
  content: string;
  image?: string;
}

const WalletButton: React.FC<Button> = ({ content, image }) => {
  return (
    <div className="market_modal__button">
      <button>
        {image && <img src={image} alt={'image'} />}
        <p>{content}</p>
      </button>
    </div>
  );
};

export default WalletButton;
