import { FunctionComponent } from "react";
import { GetAllReserves_reserves } from "src/queries/__generated__/GetAllReserves";
import { daiToUsd } from "src/utiles/formatters";
import Skeleton from 'react-loading-skeleton';
import { constants } from "ethers";
import { useTranslation } from "react-i18next";

/*
    대출금 : borrow(repay filter) 총합
    누적 대출금 : borrow 총합
    상환예정금액 : totalBorrow
    예상 수익률 : deposit APR + mining?
    누적 상환 완료 금액 : repay fee까지 포함
    누적 수익? : repay 총합
  */
const InvestmentStatus: FunctionComponent<{
  loading: boolean,
  reserve?: GetAllReserves_reserves,
}> = ({ loading, reserve }) => {
  const { t } = useTranslation();
  return (
    <div className="portfolio__investment-status__container">
      <p className="portfolio__investment-status__title bold">
        {t("portfolio.investment_status")}
      </p>
      <table>
        <tr>
          <td>
            {t("portfolio.total_borrowed")}
          </td>
          <td>
            <div>
              {
                loading || !reserve ? <Skeleton /> :
                  <p>
                    {daiToUsd(
                      reserve.borrow
                        .filter((borrow) => !reserve.repay.find((repay) => repay.tokenId === borrow.tokenId))
                        .reduce((res, borrow) => res.add(borrow.amount), constants.Zero)
                    )}
                  </p>
              }
            </div>
          </td>
        </tr>
        <tr>
          <td>
            {t("portfolio.estimated_repayments")}
          </td>
          <td>
            <div>
              {
                loading || !reserve ? <Skeleton /> :
                  <p>{daiToUsd(reserve.totalBorrow)}</p>
              }
            </div>
          </td>
        </tr>
        <tr>
          <td>
            {t("portfolio.borrow_apy")}
          </td>
          <td>
            <div>
              {
                loading || !reserve ? <Skeleton /> :
                  <p>8.00%</p>
              }
            </div>
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            {t("portfolio.accumulated_borrowed")}
          </td>
          <td>
            <div>
              {
                loading || !reserve ? <Skeleton /> :
                  <p>
                    {daiToUsd(
                      reserve.borrow
                        .reduce((res, borrow) => res.add(borrow.amount), constants.Zero)
                    )}
                  </p>
              }
            </div>
          </td>
        </tr>
        <tr>
          <td>
            {t("portfolio.accumulated_repayment")}
          </td>
          <td>
            <div>
              {
                loading || !reserve ? <Skeleton /> :
                  <p>
                    {daiToUsd(
                      reserve.repay
                        .reduce((res, repay) => res.add(repay.userDTokenBalance).add(repay.feeOnCollateralServiceProvider), constants.Zero)
                    )}
                  </p>
              }
            </div>
          </td>
        </tr>
        <tr>
          <td>
            {t("portfolio.accumulated_yield")}
          </td>
          <td>
            <div>
              {
                loading || !reserve ? <Skeleton /> :
                  <p>
                    {daiToUsd(
                      reserve.repay
                        .reduce((res, repay) => res.add(repay.userDTokenBalance), constants.Zero)
                    )}
                  </p>
              }
            </div>
          </td>
        </tr>
      </table>
    </div>
  )
}

export default InvestmentStatus;