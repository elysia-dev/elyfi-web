import 'src/stylesheets/style.scss';
import React, { FunctionComponent, useEffect, useState } from 'react';
import TableListItem from './TableListItem';
import TableType from 'src/enums/TableType';
import { DepositTokenType } from 'src/types/DepositTokenType';
import { MintedTokenType } from 'src/types/MintedTokenType';
import DepositModal from './DepositModal';
import MintedModal from './MintedModal';


interface Props {
  header: string;
  type: TableType;
  token: DepositTokenType[] | MintedTokenType[];
}


const TokenListing: FunctionComponent<Props> = (props: Props) => {
  const [state, setState] = useState({
    selectColumn: 0,
    columnActivation: false,
    isModalOpened: false,
    selectModal: ""
  })
  const [array, setArray] = useState([""])
  const [deposit, setDeposit] = useState<DepositTokenType>()
  const [minted, setMinted] = useState<MintedTokenType>()

  useEffect(() => {
    const tempDeposit: string[] = ["Assets", "Deposit Balance", "Deposit Rates", "Wallet Balance"]
    const tempMinted: string[] = ["Assets", "ELFI Balance", "Wallet Balance"]
    const tempCollateral: string[] = ["Assets", "Available Liquidity", "Borrow Rate", "Borrow Balance", "Wallet Balance"]

    setArray(
      props.type === TableType.Deposit ?
        tempDeposit
        :
        props.type === TableType.Minted ?
          tempMinted
          :
          tempCollateral
    )
  }, [props.type])

  const Deposit = React.memo(DepositModal)
  const Minted = React.memo(MintedModal)

  return (
    <div className="tokens__container">
      {(deposit !== undefined && state.isModalOpened) ?
        <Deposit
          visible={(state.isModalOpened && state.selectModal === TableType.Deposit)}
          tokenlist={deposit}
          onClose={() => setState({ ...state, isModalOpened: false })}
        />
        : null}
      {(minted !== undefined && state.isModalOpened) ?
        <Minted
          visible={(state.isModalOpened && state.selectModal === TableType.Minted)}
          tokenlist={minted}
          onClose={() => setState({ ...state, isModalOpened: false })}
        />
        : null}
      <div className="tokens__header-wrapper">
        <h1 className="tokens__header-text">
          {props.header}
        </h1>
        <hr className="tokens__header-line" />
      </div>
      <table className="tokens__table">
        <thead className="tokens__table__header">
          <tr>
            {array.map((name, index) => {
              return (
                <th>
                  <p className={`tokens__table__header__column${state.selectColumn === index + 1 && state.columnActivation ? "--selected" : ""}`}
                    onClick={() => {
                      state.selectColumn === index + 1
                        ?
                        (setState({ ...state, columnActivation: !state.columnActivation }))
                        :
                        (setState({ ...state, selectColumn: index + 1, columnActivation: true }))
                    }}>{name}</p>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="tokens__table-body">
          {props.type === TableType.Deposit ? (
            props.token.map((_x: DepositTokenType) => {
              return (
                <TableListItem
                  tokenProps={_x}
                  tableType={TableType.Deposit}
                  handler={() => {
                    setDeposit(_x);
                    setState({ ...state, isModalOpened: true, selectModal: TableType.Deposit })
                  }}
                />
              )
            })
          ) : (
            props.token.map((_x: MintedTokenType) => {
              return (
                <TableListItem
                  tokenProps={_x}
                  tableType={TableType.Minted}
                  handler={() => {
                    setMinted(_x);
                    setState({ ...state, isModalOpened: true, selectModal: TableType.Minted })
                  }}
                />
              )
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TokenListing;