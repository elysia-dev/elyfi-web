import { FunctionComponent, useContext, useState } from 'react';
import '../../css/style.scss';

import Asset000 from '../../../../shared/images/assets/elysia-asset00.png';
import Asset001 from '../../../../shared/images/assets/elysia-asset01.png'; 

import TableListItem from './TableListItem';
import { TokenList } from '../../../../types/TokenList';
import TokenTypes from '../../../../enums/TokenType';
import AssetTypes from '../../../../enums/AssetType';
import TokenContext from '../../../../contexts/TokenContext';


interface Props {
  header: string;
  tokenlist: TokenList[];
}
const TokenListing: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState({
    selectColumn: 0,
    columnActivation: false
  })
  const { TokenReturn } = useContext(TokenContext);
  return (
    <div className="tokens__token-wrapper">
      <div className="tokens__header-wrapper">
        <h1 className="tokens__header-text">
          {props.header}
        </h1>
        <hr className="tokens__header-line"/>
      </div>
      <table className="tokens__table">
        <thead className="tokens__table-header">
          <tr>
            <th>
              <p className={`tokens__table-header-column${state.selectColumn === 1 && state.columnActivation ? "--selected" : ""}`}
                onClick={() => {
                  state.selectColumn === 1
                  ?
                  (setState({ ...state, columnActivation: !state.columnActivation }))
                  :
                  (setState({ ...state, selectColumn: 1, columnActivation: true }))
                }}>Assets</p>
            </th>
            <th>
              <p className={`tokens__table-header-column${state.selectColumn === 2 && state.columnActivation ? "--selected" : ""}`}
                onClick={() => {
                  state.selectColumn === 2
                  ?
                  (setState({ ...state, columnActivation: !state.columnActivation }))
                  :
                  (setState({ ...state, selectColumn: 2, columnActivation: true }))

                  TokenReturn("marketSize", state.columnActivation, props.tokenlist[0].type);
                }}>Market Size</p>
            </th>
            <th>
              <p className={`tokens__table-header-column${state.selectColumn === 3 && state.columnActivation ? "--selected" : ""}`}
                onClick={() => {
                  state.selectColumn === 3
                  ?
                  (setState({ ...state, columnActivation: !state.columnActivation }))
                  :
                  (setState({ ...state, selectColumn: 3, columnActivation: true }))

                  TokenReturn("totalBorrowed", state.columnActivation, props.tokenlist[0].type);
                }}>Total Borrowed</p>
            </th>
            <th>
              <p className={`tokens__table-header-column${state.selectColumn === 4 && state.columnActivation ? "--selected" : ""}`}
                onClick={() => {
                  state.selectColumn === 4
                  ?
                  (setState({ ...state, columnActivation: !state.columnActivation }))
                  :
                  (setState({ ...state, selectColumn: 4, columnActivation: true }))

                  TokenReturn("depositApy", state.columnActivation, props.tokenlist[0].type);
                }}>Deposit APY</p>
            </th>
            <th>
              <p className={`tokens__table-header-column${state.selectColumn === 5 && state.columnActivation ? "--selected" : ""}`}
               onClick={() => {
                state.selectColumn === 5
                  ?
                  (setState({ ...state, columnActivation: !state.columnActivation }))
                  :
                  (setState({ ...state, selectColumn: 5, columnActivation: true }))

                TokenReturn("borrowApr", state.columnActivation, props.tokenlist[0].type);
              }}>Borrow APR</p>
            </th>
          </tr>
        </thead>
        <tbody className="tokens__table-body">
          {props.tokenlist.map((_x, index) => {
            return (
              <TableListItem
                TokenName={_x.tokenName}
                Image={
                  _x.type === TokenTypes.ASSETS
                  ?
                  (_x.image === AssetTypes.COMMERCIAL
                    ?
                    Asset000
                    :
                    Asset001
                  )
                  :
                  (_x.image)
                }
                MarketSize={_x.marketSize}
                TotalBorrowed={_x.totalBorrowed}
                DepositApy={_x.depositApy}
                BorrowApr={_x.borrowApr}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TokenListing;