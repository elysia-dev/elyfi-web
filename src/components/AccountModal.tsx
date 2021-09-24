import { useWeb3React } from '@web3-react/core';
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import mainnetConverter from 'src/utiles/mainnetConverter';
import TxContext from 'src/contexts/TxContext';
import Fail from "src/assets/images/status__fail.png";
import Confirm from "src/assets/images/status__confirm.png";
import NewTab from "src/assets/images/new_tab.png";
import Copy from "src/assets/images/copy.png";
import envs from 'src/core/envs';
import RecentActivityType from 'src/enums/RecentActivityType';

const AccountModal: React.FunctionComponent<{
  visible: boolean,
  closeHandler: () => void
}> = ({ visible, closeHandler }) => {
  const { account, deactivate, chainId } = useWeb3React();
  const { t } = useTranslation();
  const { reset } = useContext(TxContext);

  const AddressCopy = (data: string) => {
    if (!document.queryCommandSupported("copy")) {
      return alert("This browser does not support the copy function.");
    }
    const area = document.createElement('textarea');
    area.value = data;
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    document.body.removeChild(area);
    alert("Copied!!");
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
              reset();
              closeHandler();
            }}>
              <p>
                {t("navigation.disconnect")}
              </p>
            </div>
          </div>
          <div className="modal__account__mainnet-info__button">
            <div onClick={() => AddressCopy(account!)} >
              <img src={Copy} alt="Copy Address" />
              <p>
                {t("transaction.copy_address")}
              </p>
            </div>
            <a
              href={`${envs.etherscanURI}/address/${account}`}
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
              href={window.localStorage.getItem("@txHash") === null ? undefined : `${envs.etherscanURI}/tx/${window.localStorage.getItem("@txHash")}`}
              target="_blank"
              className={window.localStorage.getItem("@txHash") === null ? "disable" : ""}
            >
              <div>
                <p className="spoqa__bold">
                  {/* window.localStorage.getItem("@txTracking") */}
                  {t(`transaction.${window.localStorage.getItem("@txTracking") === null ? RecentActivityType.Idle : RecentActivityType[window.localStorage.getItem("@txTracking") as keyof typeof RecentActivityType]}` || t("transaction.activity"))}
                </p>

                <div>
                  <img
                    style={{ display: window.localStorage.getItem("@txStatus") === null || window.localStorage.getItem("@txStatus") === "PENDING" ? "none" : "block" }}
                    src={
                      window.localStorage.getItem("@txStatus") === "FAIL" ?
                        Fail
                        : window.localStorage.getItem("@txStatus") === "CONFIRM" ?
                          Confirm
                          :
                          Fail
                    }
                    alt="status" />
                  <div className="lds-spinner" style={{ display: window.localStorage.getItem("@txStatus") === "PENDING" ? "block" : "none" }}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                  <p className="spoqa__bold" style={{ display: window.localStorage.getItem("@txStatus") === null ? "none" : "block" }}>
                    {window.localStorage.getItem("@txStatus") === "FAIL" ?
                      "FAILED!"
                      : window.localStorage.getItem("@txStatus") === "CONFIRM" ?
                        "Confirmed!"
                        : window.localStorage.getItem("@txStatus") === "PENDING" ?
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
