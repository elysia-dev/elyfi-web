interface Title {
  title: string;
  isPurchaseModal?: boolean;
  modalClose: () => void;
}

const ModalHeader: React.FC<Title> = ({
  title,
  isPurchaseModal,
  modalClose,
}) => {
  return (
    <header className={`market_modal__header ${isPurchaseModal && 'nft'}`}>
      <h3>{title}</h3>
      <div onClick={() => modalClose()}>
        <div></div>
        <div></div>
      </div>
    </header>
  );
};

export default ModalHeader;
