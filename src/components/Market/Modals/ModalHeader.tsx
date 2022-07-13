interface Title {
  title: string;
  isPurchaseModal?: boolean;
}

const ModalHeader: React.FC<Title> = ({ title, isPurchaseModal }) => {
  return (
    <header className={`market_modal__header ${isPurchaseModal && 'nft'}`}>
      <h3>{title}</h3>
      <div>
        <div></div>
        <div></div>
      </div>
    </header>
  );
};

export default ModalHeader;
