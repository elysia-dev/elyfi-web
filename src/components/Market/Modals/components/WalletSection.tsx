interface Content {
  content: JSX.Element;
}

const WalletSection: React.FC<Content> = ({ content }) => {
  return <section className="market_modal__section">{content}</section>;
};

export default WalletSection;
