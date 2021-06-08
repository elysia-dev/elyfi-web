import { FunctionComponent, useState } from 'react';
import "../../css/style.scss";
import numberFormat from '../../../../utiles/numberFormat';

interface Props {
  TokenName: string;
  Image: string;
  MarketSize?: number;
  TotalBorrowed?: number;
  DepositApy?: number;
  BorrowApr?: number;
}

const TableListItem: FunctionComponent<Props> = (props: Props) => {
  
  return (
    <>
      <tr>
        <th>
          <div style={{ justifyContent: 'left', gap: 10 }}>
            <img src={props.Image} />
            <p>{props.TokenName}</p>
          </div>
        </th>
        <th>
          <p>
            {!props.MarketSize ? "-" : "$ " + numberFormat(props.MarketSize)}
          </p>
        </th>
        <th>
          <p>
            {!props.TotalBorrowed ? "-" : "$ " + numberFormat(props.TotalBorrowed)}
          </p>
        </th>
        <th>
          <p>
            {!props.DepositApy ? "-" : props.DepositApy.toFixed(2) + " %"}
          </p>
        </th>
        <th>
          <p>
            {!props.BorrowApr ? "-" : props.BorrowApr.toFixed(2) + " %"}
          </p>
        </th>
        <th>
          <div className="tokens__table-body-button">
            <p>Deposit / Borrow</p>
          </div>
        </th>
      </tr>
    </>
  );
}
 

export default TableListItem;
 