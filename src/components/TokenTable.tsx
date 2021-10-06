
import { useTranslation } from "react-i18next";
import ELFIIcon from 'src/assets/images/elfi--icon.png';
import Skeleton from 'react-loading-skeleton';

interface Props {
  tokenImage: string;
  tokenName: string;
  index: number;
  onClick?: (e: any) => void;
  depositBalance?: string;
  depositBalanceDivValue?: string;
  depositAPY?: string;
  miningAPR?: string;
  walletBalance?: string;
  walletBalanceDivValue?: string;
  isDisable: boolean;
  skeletonLoading: boolean;
}

const TokenTable: React.FC<Props> = ({
  tokenImage,
  tokenName,
  index,
  onClick,
  depositBalance,
  depositAPY,
  miningAPR,
  walletBalance,
  isDisable,
  skeletonLoading,
  depositBalanceDivValue,
  walletBalanceDivValue
}) => {
  const { t } = useTranslation();

  return (
    <>
      {window.sessionStorage.getItem("@MediaQuery") === "PC" ? (
        <tr
          className={`tokens__table__row${!isDisable ? "" : "--disable"}`}
          key={index}
          onClick={!isDisable ? onClick : undefined}
        >
          <th className={`tokens__table__image`}>
            <div>
              {isDisable && (
                <div className="tokens__table__image--disable" />
              )}
              <img src={tokenImage} alt='token' />
              <p className="spoqa__bold">{tokenName}</p>
            </div>
          </th>
          <th>
            {
              skeletonLoading ?
                <Skeleton width={120} />
                :
                <>
                  <p className="spoqa__bold">
                    {/* {!isDisable ? toCompactForBignumber(depositBalance[index] || constants.Zero) : "-"} <span className="token-name spoqa__bold">{tokenName}</span> */}
                    {!isDisable ? (<>{depositBalance} <span className="token-name spoqa__bold">{tokenName}</span></>) : "-"}
                  </p>
                  <p className="spoqa div-balance">
                    {!isDisable ? ("$ " + depositBalanceDivValue) : "-"}
                  </p>
                </>
            }
          </th>
          <th>
            {!isDisable ? (
              skeletonLoading ?
                <Skeleton width={120} />
                :
                <>
                  <p className={`spoqa`}>
                    {depositAPY || 0}
                  </p>
                  <div className={`tokens__table__apr`}>
                    <img src={ELFIIcon} />
                    <p className="spoqa__bold">{miningAPR || 0}</p>
                  </div>
                </>
            ) : <p>-</p>}
          </th>
          <th>
            {
              skeletonLoading ?
                <Skeleton width={120} />
                :
                <>
                  <p className="spoqa__bold">
                    {!isDisable ? (<>{walletBalance} <span className="token-name spoqa__bold">{tokenName}</span></>) : "-"}
                  </p>
                  <p className="spoqa div-balance">
                    {!isDisable ? ("$ " + walletBalanceDivValue) : "-"}
                  </p>
                </>
            }
          </th>
        </tr>
      ) : (
        <div
          className={`tokens__table__row${!isDisable ? "" : "--disable"}`}
          key={index}
          onClick={!isDisable ? onClick : undefined}
        >
          <div className="tokens__table__image">
            {isDisable && (
              <div className="tokens__table__image--disable" />
            )}
            <div>
              <img src={tokenImage} alt='token' />
              <p className="spoqa__bold">{tokenName}</p>
            </div>
          </div>
          <div className="tokens__table__content">
            <div className="tokens__table__content__data">
              <p className="spoqa">
                {t("dashboard.deposit_balance")}
              </p>
              {
                skeletonLoading ?
                  <Skeleton width={120} />
                  :
                  <>
                    <p className="spoqa__bold">
                      {!isDisable ? (<>{depositBalance} <span className="token-name spoqa__bold">{tokenName}</span></>) : "-"}
                    </p>
                    <p className="spoqa div-balance">
                      {!isDisable ? ("$ " + depositBalanceDivValue) : "-"}
                    </p>
                  </>
              }
            </div>
            <div className="tokens__table__content__data">
              <p className="spoqa">
                {t("dashboard.deposit_apy")}
              </p>
              {
                skeletonLoading ?
                  <Skeleton width={120} />
                  :
                  (
                    <>
                      <p className="spoqa__bold">
                        {!isDisable ? depositAPY || 0 : "-"}
                      </p>
                      {!isDisable && (
                        <div className="tokens__table__apr">
                          <img src={ELFIIcon} />
                          <p className="spoqa">{miningAPR || 0}</p>
                        </div>
                      )}
                    </>
                  )
              }
            </div>
            <div className="tokens__table__content__data">
              <p className="spoqa">
                {t("dashboard.wallet_balance")}
              </p>
              {
                skeletonLoading ?
                  <Skeleton width={120} />
                  :
                  <>
                    <p className="spoqa__bold">
                      {!isDisable ? (<>{walletBalance} <span className="token-name spoqa__bold">{tokenName}</span></>) : "-"}
                    </p>
                    <p className="spoqa div-balance">
                      {!isDisable ? ("$ " + walletBalanceDivValue) : "-"}
                    </p>
                  </>
              }
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TokenTable;