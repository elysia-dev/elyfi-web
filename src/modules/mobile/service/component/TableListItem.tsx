import { FunctionComponent, useState } from 'react';
import '../../css/styleM.scss';
 
import Asset000 from '../../../../shared/images/assets/elysia-asset00.png';
import Asset001 from '../../../../shared/images/assets/elysia-asset01.png';
 

interface Props {
  TokenName: string;
  ListSeleted: boolean;
  Image: string;
  MarketSize?: number;
  TotalBorrowed?: number;
  DepositApy?: number;
  BorrowApr?: number
}

const TableListItem: FunctionComponent<Props> = (props: Props) => {
  return (
    <>
      <div className="table__body--upper">
        <div className="table__body__wrapper-image">
          <img src={props.Image} className="table__body__image" />
          <p className="table__body__image-text">{props.TokenName}</p>
        </div>
        <div>
          <p>
            {!props.MarketSize ? "-" : props.MarketSize}
          </p>
        </div>
        <div>
          <p>
            {!props.TotalBorrowed ? "-" : props.TotalBorrowed}
          </p>
        </div>
        <div>
          <p>
            {!props.DepositApy ? "-" : props.DepositApy}
          </p>
        </div>
        <div>
          <p>
            {!props.BorrowApr ? "-" : props.BorrowApr}
          </p>
        </div>
      </div>
      <div className="table__body--lower" style={{ display: !props.ListSeleted ? "none" : "flex" }}>
        <div>
          <p className="table__button">
            Deposit
          </p>
        </div>
        <div>
          <p className="table__button">
            Borrow
          </p>
        </div>
      </div>
    </>
  );
}
 

export default TableListItem;
 