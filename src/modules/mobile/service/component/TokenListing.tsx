import { FunctionComponent, useState } from 'react';
import '../../css/styleM.scss';

import Asset000 from '../../../../shared/images/assets/elysia-asset00.png';
import Asset001 from '../../../../shared/images/assets/elysia-asset01.png';

import AssetTypes from '../../../../enums/AssetType';
import TokenTypes from '../../../../enums/TokenType';
import TableListItem from './TableListItem';
import { TokenList } from '../../../../types/TokenList';

interface Props {
  header: string;
  tokenlist: TokenList[];
}

const TokenListing: FunctionComponent<Props> = (props: Props) => {
  const [state, setstate] = useState({
    selectColumn: 0,
    selectItem: 0,
  })
  console.log(props.tokenlist.filter((item) => item.tokenName));
  
  return (
    <div className="tokens__token-wrapper">
      <div className="tokens__header-wrapper">
        <h1 className="tokens__header-text">
          {props.header}
        </h1>
        <hr className="tokens__header-line"/>
      </div>
      <div className="table">
        <ul className="table__header">
          <p className={`table__header-column${state.selectColumn === 1 ? "--selected" : ""}`}
            onClick={() => setstate({ ...state, selectColumn: 1 })}>Assets</p>
          <p className={`table__header-column${state.selectColumn === 2 ? "--selected" : ""}`}
            onClick={() => setstate({ ...state, selectColumn: 2 })}>Market Size</p>
          <p className={`table__header-column${state.selectColumn === 3 ? "--selected" : ""}`}
            onClick={() => setstate({ ...state, selectColumn: 3 })}>Total Borrowed</p>
          <p className={`table__header-column${state.selectColumn === 4 ? "--selected" : ""}`}
            onClick={() => setstate({ ...state, selectColumn: 4 })}>Deposit APY</p>
          <p className={`table__header-column${state.selectColumn === 5 ? "--selected" : ""}`}
            onClick={() => setstate({ ...state, selectColumn: 5 })}>Borrow APR</p>
        </ul>
        <div className="table__body">
          {props.tokenlist.map((_x, index) => {
            return (
              <li className={`table__body-item col-${index}`}
                onClick={() => setstate({ ...state, selectItem: index + 1 })}
                style={{ boxShadow: state.selectItem === index + 1 ? "0px 0px 7px #00000029" : "0px 0px 3px #00000029" }}
              >
                <TableListItem 
                  TokenName={_x.tokenName}
                  Image={
                    _x.type === TokenTypes.ASSETS 
                    ?
                    (_x.image === AssetTypes.COMMERCIAL 
                      ? 
                      Asset000 
                      : 
                      Asset001)
                    :
                    (_x.image)
                  }
                  ListSeleted={state.selectItem === index + 1}
                  MarketSize={_x.marketSize}
                  TotalBorrowed={_x.totalBorrowed}
                  DepositApy={_x.depositApy}
                  BorrowApr={_x.borrowApr}
                />
              </li>
            )
          })}
        </div>
      </div>
      <div style={{ height: 100 }} />
    </div>
  );
}

export default TokenListing;