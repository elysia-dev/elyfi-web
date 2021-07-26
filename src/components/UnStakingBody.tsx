import { useState } from "react";

const UnStakingBody = () => {
  const [amount, setAmount] = useState<string>('');
  return (
    <div>
      <div className="modal__value-wrapper">
        <p className="modal__maximum bold" onClick={() => { }}>
          MAX
        </p>
        <p className="modal__value bold">
          <input
            type="number"
            className="modal__text-input"
            placeholder="0"
            value={amount}
            style={{ fontSize: amount.length < 8 ? 60 : amount.length > 12 ? 35 : 45 }}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => { 
              ["-", "+", "e"].includes(e.key) && e.preventDefault();
            }}
            onChange={({ target }) => {
              target.value = target.value.replace(/(\.\d{18})\d+/g, '$1');
              
              setAmount(target.value);
            }}
          />
        </p>
      </div>
      <div className="modal__staking__container">
        <p className="spoqa__bold">
          언스테이킹 가능한 양
        </p>
        <div>
          <p className="spoqa__bold">
            1차 스테이킹 수량
          </p>
          <p className="spoqa__bold">
            1000000 EL
          </p>
        </div>
      </div>
      <div className={`modal__button${amount === "" ? "--disable" : ""}`} onClick={() => { }}>
        <p>
          UNSTAKING
        </p>
      </div>
    </div>
  )
}

export default UnStakingBody;