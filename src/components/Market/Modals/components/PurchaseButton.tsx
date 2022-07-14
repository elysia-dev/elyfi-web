interface WalletBtnType {
  content: string;
  isLoading?: boolean;
  onClickHandler: () => void;
}

const PurchaseButton: React.FC<WalletBtnType> = ({
  content,
  isLoading,
  onClickHandler,
}) => {
  return (
    <div
      className={`market_modal__purchase_btn ${
        isLoading && 'purchase_loading'
      }`}>
      <button onClick={() => onClickHandler()}>{content}</button>
    </div>
  );
};

export default PurchaseButton;
