import { FunctionComponent, useContext, useState } from 'react';
import '../../css/style.scss';

import Asset000 from '../../../../shared/images/assets/elysia-asset00.png';
import Token000 from '../../../../shared/images/tokens/bnb.png';

import numberFormat from '../../../../utiles/numberFormat';


interface Props {
  header: string;
}
const DepositToken: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState({
    selectColumn: 0,
    columnActivation: false
  })
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
                }}>Deposit Balance</p>
            </th>
            <th>
              <p className={`tokens__table-header-column${state.selectColumn === 3 && state.columnActivation ? "--selected" : ""}`}
                onClick={() => {
                  state.selectColumn === 3
                  ?
                  (setState({ ...state, columnActivation: !state.columnActivation }))
                  :
                  (setState({ ...state, selectColumn: 3, columnActivation: true }))
                }}>Deposit Rates</p>
            </th>
            <th>
              <p className={`tokens__table-header-column${state.selectColumn === 4 && state.columnActivation ? "--selected" : ""}`}
                onClick={() => {
                  state.selectColumn === 4
                  ?
                  (setState({ ...state, columnActivation: !state.columnActivation }))
                  :
                  (setState({ ...state, selectColumn: 4, columnActivation: true }))
                }}>Wallet Balance</p>
            </th>
          </tr>
        </thead>
        <tbody className="tokens__table-body">
          <tr>
            <th>
              <div style={{ justifyContent: 'left', gap: 10 }}>
                <img src={Token000} />
                <p>BUSD</p>
              </div>
            </th>
            <th>
              <p>
                {"$ " + numberFormat(1231231213)}
              </p>
            </th>
            <th>
              <p>
                {(21.389).toFixed(2) + " %"}
              </p>
            </th>
            <th>
              <p>
                {"$ " + numberFormat(1232213)}
              </p>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default DepositToken;