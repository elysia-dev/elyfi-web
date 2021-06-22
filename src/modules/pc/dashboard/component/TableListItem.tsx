import { FunctionComponent, useEffect, useState } from 'react';
import "../../css/style.scss";
import numberFormat from 'src/utiles/numberFormat';
import { DepositTokenType } from 'src/types/DepositTokenType';
import { MintedTokenType } from 'src/types/MintedTokenType';
import TableType from 'src/enums/TableType';

interface Props {
  tokenProps: any;
  tableType: TableType;
  handler: () => void;
}

const TableListItem: FunctionComponent<Props> = (props: Props) => {
  const [deposit, setDeposit] = useState<DepositTokenType>()
  const [minted, setMinted] = useState<MintedTokenType>()

  const initialState = () => {
    props.tableType === TableType.Deposit ?
      setDeposit(props.tokenProps) :
      setMinted(props.tokenProps)
  }

  useEffect(() => {
    initialState();
  }, [])

  return (
    <>
      <tr onClick={props.handler}>
        <th>
          <div style={{ justifyContent: 'left', gap: 10 }}>
            <img src={props.tokenProps.image} />
            <p>{props.tokenProps.tokenName}</p>
          </div>
        </th>
        {props.tableType === TableType.Deposit ? (
          <>
            <th>
              <p>
                {deposit?.deposit?.balance === undefined ? "-" : numberFormat(deposit?.deposit?.balance!) + " " + props.tokenProps.tokenName}
              </p>
            </th>
            <th>
              <p>
                {deposit?.deposit?.apyRate === undefined ? "-" : (deposit?.deposit?.apyRate! as number).toFixed(2) + " %"}
              </p>
            </th>
            <th>
              <p>
                {deposit?.deposit?.balance === undefined ? "-" : numberFormat(deposit?.deposit?.balance!) + " " + props.tokenProps.tokenName}
              </p>
            </th>
          </>
        ) : (
          <>
            <th>
              <p>
                {minted?.minted?.elfi === undefined ? "-" : numberFormat(minted?.minted?.elfi!) + " " + props.tokenProps.tokenName}
              </p>
            </th>
            <th>
              <p>
                {minted?.minted?.walletBalance === undefined ? "-" : numberFormat(minted?.minted?.walletBalance!) + props.tokenProps.tokenName}
              </p>
            </th>
          </>
        )}
      </tr>
    </>
  );
}


export default TableListItem;
