import { useTranslation } from "react-i18next";
import MediaQuery from "src/enums/MediaQuery";
import useMediaQueryType from "src/hooks/useMediaQueryType";

const TableBodyAmount: React.FunctionComponent<{
  header: string,
  buttonEvent: ((e: any) => void) | undefined,
  buttonContent: string,
  value: string | JSX.Element,
  tokenName: string,
  walletBalance?: string
}> = ({
  header,
  buttonEvent,
  buttonContent,
  value,
  tokenName,
  walletBalance
}) => {
  const { t } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();

  return (
    mediaQuery === MediaQuery.PC ? (
      <>
        <div>
          <h2>
            {header}
          </h2>
        </div>
        <div className="deposit__table__body__amount">
          <div onClick={buttonEvent} className="deposit__table__body__amount__button">
            <p>
              {buttonContent}
            </p>
          </div>
          <div>
            <h2>
              {value}<span className="bold">&nbsp;{tokenName}</span>
            </h2>
            <p>
              {walletBalance ? (
                `${t("dashboard.wallet_balance")} : ` + walletBalance + " " + tokenName
                ) : 
                ""
              }
            </p>
          </div>
        </div>
      </>
    ) : (
      <>
        <div className="deposit__table__body__amount">
          <div>
            <h2>
              {header}
            </h2>
          </div>
          <div>
            <h2>
              {value}<span className="bold">&nbsp;{tokenName}</span>
            </h2>
            <p>
              {walletBalance ? (
                `${t("dashboard.wallet_balance")} : ` + walletBalance + " " + tokenName
                ) : 
                ""
              }
            </p>
          </div>
        </div>

        <div onClick={buttonEvent} className="deposit__table__body__amount__button">
          <p>
            {buttonContent}
          </p>
        </div>
      </>
    )
  )
}

export default TableBodyAmount;