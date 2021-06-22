import { FunctionComponent } from "react";
import numberFormat from "src/utiles/numberFormat";

interface Props {
  loan: number,
  totalLoan: number,
  interest: number,
  overdueInterest: number,
  mortgageRate: number,
  abToken: number
}
const InvestmentStatus: FunctionComponent<Props> = (props: Props) => {
  const TempBUSDValue = 1117.43;
  // loan: 대출금, totalLoan: 총 대출금, interest: 이자, overdueInterest: 연체이자, mortgageRate: 금리, abToken: 부실토큰 판매금

  return (
    <div className="portfolio__investment-status__container">
      <p className="portfolio__investment-status__title bold">
        Investment Status
      </p>
      <table>
        <tr>
          <td>
            대출금
          </td>
          <td>
            <div>
              <p>$ {numberFormat(props.totalLoan * TempBUSDValue)}</p>
              <p>{props.totalLoan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} BUSD</p>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            상환 예정 금액
          </td>
          <td>
            <div>
              <p>$ {numberFormat(props.totalLoan + props.interest + props.overdueInterest * TempBUSDValue)}</p>
              <p>{(props.totalLoan + props.interest + props.overdueInterest).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} BUSD</p>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            예상 수익률
          </td>
          <td>
            <div>
              <p>{props.mortgageRate * 100}%</p>
            </div>
          </td>
        </tr>
      </table>
      <table>
        <tr>
          <td>
            누적 대출금
          </td>
          <td>
            <div>
              <p>$ {numberFormat(props.loan * TempBUSDValue)}</p>
              <p>{props.loan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} BUSD</p>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            누적 상환 완료 금액
          </td>
          <td>
            <div>
              <p>$ {numberFormat(props.loan * props.interest * props.overdueInterest + props.abToken * TempBUSDValue)}</p>
              <p>{(props.loan * props.interest * props.overdueInterest + props.abToken).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} BUSD</p>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            누적 수익
          </td>
          <td>
            <div>
              <p>$ {numberFormat(props.loan * props.interest * props.overdueInterest * TempBUSDValue)}</p>
              <p>{(props.loan * props.interest * props.overdueInterest * TempBUSDValue).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} BUSD</p>
            </div>
          </td>
        </tr>
      </table>
    </div>
  )
}

export default InvestmentStatus;