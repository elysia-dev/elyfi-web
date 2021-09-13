import { useWeb3React } from '@web3-react/core';
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import mainnetConverter from 'src/utiles/mainnetConverter';
import TxContext from 'src/contexts/TxContext';
import Fail from "src/assets/images/status__fail.png";
import Pending from "src/assets/images/pending.png";
import Confirm from "src/assets/images/status__confirm.png";
import txStatus from 'src/enums/txStatus';
import NewTab from "src/assets/images/new_tab.png";
import Copy from "src/assets/images/copy.png";

const AccountModal: React.FunctionComponent<{
  visible: boolean,
  closeHandler: () => void
}> = ({ visible, closeHandler }) => {
  const { account, activate, deactivate, active, chainId } = useWeb3React();
  const { t, i18n } = useTranslation();
  const { txState, txHash, ResetAllState } = useContext(TxContext);

  const AddressCopy = (add: string) => {
    if (!document.queryCommandSupported("copy")) {
      return alert("This browser does not support the copy function.");
    }
    const area = document.createElement('textarea');
    area.value = add;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    alert("Copied!!");
  }

  const RecentActivityContent = (localStorage: string) => {
    switch (localStorage) {
      case "ELClaim" : 
        return t("transaction.elfi_claim_reward");
      case "ELFIClaim" : 
        return t("transaction.dai_claim_reward");
      case "ELMigration" : 
        return t("transaction.el_elfi_transmission");
      case "ELFIMigration" : 
        return t("transaction.elfi_dai_transmission");
      case "Deposit" : 
        return t("transaction.dai_deposit");
      case "Withdraw" : 
        return t("transaction.dai_withdraw");
      case "Claim" : 
        return t("transaction.elfi_claim_reward");
      case "ELStakingWithdraw" : 
        return t("transaction.el_unstaking");
      case "ELFIStakingWithdraw" : 
        return t("transaction.elfi_unstaking");
      case "ELStake" : 
        return t("transaction.el_staking");
      case "ELFIStake" : 
        return t("transaction.elfi_staking");
      default: 
        return t("transaction.activity");

    }
  }

  return (
    <div className="modal" style={{ display: visible ? "block" : "none", opacity: 1 }}>
      <div className="modal__container">
        <div className="modal__header">
          <div className="modal__header__token-info-wrapper">
            <div className="modal__header__name-wrapper">
              <p className="modal__header__name spoqa__bold">{t("transaction.account")}</p>
            </div>
          </div>
          <div className="close-button" onClick={() => closeHandler()}>
            <div className="close-button--1">
              <div className="close-button--2" />
            </div>
          </div>
        </div>
        <div className="modal__account">
          <div className="modal__account__mainnet-info">
            <div>
              <p>
                {mainnetConverter(chainId)}
              </p>
              <div>
                <div />
                <p className="spoqa__bold">
                  {account?.slice(0, 8)}....{account?.slice(-6)}
                </p>
              </div>
            </div>
            <div onClick={() => {
              deactivate();
              ResetAllState();
              closeHandler();
            }}>
              <p>
                {t("navigation.disconnect")}
              </p>
            </div>
          </div>
          <div className="modal__account__mainnet-info__button">
            <div onClick={() => AddressCopy(account!)} >
              <img src={Copy} alt="Copy Address"  />
              <p>
                {t("transaction.copy_address")}
              </p>
            </div>
            <a
              href={`https://etherscan.io/address/${account}`}
              target="_blank"
              className="link"
            >
              <div>
                <img src={NewTab} alt="On Etherscan" />
                <p>
                  {t("transaction.on_etherscan")}
                </p>
              </div>
            </a>
          </div>

          <div className="modal__account__status" >
            <p className="modal__header__name spoqa__bold">
              {t("transaction.activity__title")}
            </p>

            <a
              href={`https://etherscan.io/tx/${window.localStorage.getItem("@txHash")}`}
              target="_blank"
              className="link"
            >
              <div>
                <p className="spoqa__bold">
                  {RecentActivityContent(window.localStorage.getItem("@txTracking") || "")}
                </p>
                
                <div>
                <img 
                  style={{ display: txState === txStatus.IDLE ? "none" : "block"}}
                  src={
                    txState === txStatus.FAIL ?
                      Fail
                      : txState === txStatus.CONFIRM ?
                        Confirm
                          : txState === txStatus.PENDING ?
                          Pending
                          :
                          Fail
                  } 
                  alt="status" />
                  <p className="spoqa__bold" style={{ display: txState === txStatus.IDLE ? "none" : "block"}}>
                    {txState === txStatus.FAIL ?
                      "FAILED!"
                      : txState === txStatus.CONFIRM ?
                        "Confirmed!"
                          : txState === txStatus.PENDING ?
                          "Pending.."
                          :
                          ""}
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountModal;
