interface WalletBtnType {
  content: string;
  isLoading?: boolean;
}

const PurchaseButton: React.FC<WalletBtnType> = ({ content, isLoading }) => {
  return (
    <div
      className={`market_modal__purchase_btn ${
        isLoading && 'purchase_loading'
      }`}>
      <button>{content}</button>
    </div>
  );
};

export default PurchaseButton;
