import React from 'react'

const ClaimStakingRewardModal: React.FunctionComponent<{
  visible: boolean,
  closeHandler: () => void
}> = ({ visible, closeHandler }) => {
  return (
    <div className="modal" style={{ display: visible ? "block" : "none" }}>
      <div className="modal__container">
        <div className="modal__staking">
          <div className="close-button" onClick={() => closeHandler()}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
          <div className="modal__staking__button">
            <div>
              <p className="spoqa">
                가스비 절감을 위해
              </p>
              <h2 className="spoqa__bold">
                ELFI 토큰도 같이 출금하기
              </h2>
            </div>
            <div>
              <p className="modal__staking__button__arrow bold">
                {'>'}
              </p>
            </div>
          </div>
          <div className="modal__staking__button">
            <div>
              <p className="spoqa">
                ELFI 토큰은 나중에 수취하고
              </p>
              <h2 className="spoqa__bold">
                EL 토큰만 전송하기
              </h2>
            </div>
            <div>
              <p className="modal__staking__button__arrow bold">
                {'>'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClaimStakingRewardModal