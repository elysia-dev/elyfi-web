import { FunctionComponent } from 'react'
import { MintedTokenType } from 'src/types/MintedTokenType';

interface Props {
  visible?: boolean
  tokenlist: MintedTokenType;
  onClose: () => void;
}

const MintedModal: FunctionComponent<Props> = (props: Props) => {
  return (
    <div className="modal modal--minted" style={{ display: props.visible ? "block" : "none" }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <img className="modal__header__image" src={props.tokenlist!.image} alt="Token" />
            <p className="modal__header__name bold">{props.tokenlist!.tokenName}</p>
          </div>
          <div className="close-button" onClick={props.onClose}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className="modal__body">
          <p className="modal__body__maximum bold">MAX</p>
          <p className="modal__body__value bold">0</p>
        </div>
        <div className="modal__footer">
          <p className="modal__footer__text bold">
            Withdrawalable Amount
          </p>
          <div className="modal__footer__amount-wrapper">
            <p className="modal__footer__amount-text">
              Your ELFI Balance in ELYFI
            </p>
            <p className="modal__footer__amount">
              0 {props.tokenlist.tokenName}
            </p>
          </div>
        </div>
        <div className="modal__button">
          <p>Withdraw</p>
        </div>
      </div>
    </div>
  )
}

export default MintedModal;