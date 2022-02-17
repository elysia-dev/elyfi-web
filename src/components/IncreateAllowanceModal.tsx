
import { useWeb3React } from '@web3-react/core';
import { useContext, useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import ModalButton from 'src/components/ModalButton';
import TxContext from 'src/contexts/TxContext';
import TxStatus from 'src/enums/TxStatus';
import LoadingIndicator from './LoadingIndicator';

export enum PermissionType {
  Deposit = "Deposit",
  Staking = "Staking"
}

const IncreateAllowanceModal: React.FunctionComponent<{
  onClick: () => void;
  type: PermissionType;
}> = ({
  onClick,
  type
}) => {
  const { library } = useWeb3React();
  const connected = window.sessionStorage.getItem('@connect');
  const txHash = window.localStorage.getItem("@permissionTxHash")
  const { initTransaction } = useContext(TxContext)
  const [status, setStatus] = useState<TxStatus>(TxStatus.IDLE)
  const { t } = useTranslation();
  
  useEffect(() => {
    if (library && connected !== 'false' && txHash) {
      setStatus(TxStatus.PENDING)
      library.waitForTransaction(txHash)
        .then((res: any) => {
          if (res && res.status === 1) {
            setStatus(TxStatus.CONFIRM)
            initTransaction(TxStatus.CONFIRM, false);
          } else if (res && res.status !== 1) {
            setStatus(TxStatus.FAIL)
          }
        })
        .catch((e: any) => {
          console.error(e);
          initTransaction(TxStatus.FAIL, false);
        })
        .finally(() => {
          window.localStorage.removeItem("@permissionTxHash")
          setTimeout(() => {
            setStatus(TxStatus.IDLE)
          }, 5000);
        })
    }
  }, [library])
  
  return (
    <>
      <div className="modal__increate-allowance" style={{ padding : status === TxStatus.PENDING ? 0 : 30 }}>
        {
          status === TxStatus.PENDING ?
            <LoadingIndicator  />
            :
            (
              <>
                <h2>
                  {t("modal.permission.title")}
                </h2>
                <div className="modal__increate-allowance__content">
                  <p>
                    <Trans i18nKey={`modal.permission.content--${type === PermissionType.Deposit ? "deposit" : "staking"}`} />
                  </p>
                </div>
                <p>
                  <Trans i18nKey="modal.permission.comment" />
                </p>
              </>
            )
        }
      </div>
      {
        status !== TxStatus.PENDING && (
          <ModalButton
            className={`modal__button`}
            onClick={onClick}
            content={t("modal.permission.button")}
          /> 
        )
      }
    </>
    
  )
}

export default IncreateAllowanceModal;