interface WalletBtnType {
  content: string;
  isLoading?: boolean;
  onClickHandler: () => void;
  isPayAmount: boolean | undefined;
}

const PurchaseButton: React.FC<WalletBtnType> = ({
  content,
  isLoading,
  onClickHandler,
  isPayAmount,
}) => {
  return (
    <div
      className={`market_modal__purchase_btn ${
        isLoading && 'purchase_loading'
      }`}>
      <button
        style={{ background: isPayAmount ? '#e6e6e6' : undefined }}
        onClick={() => onClickHandler()}>
        {content}
      </button>
    </div>
  );
};

export default PurchaseButton;
