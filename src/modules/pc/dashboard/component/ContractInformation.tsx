import { FunctionComponent, useEffect, useState } from "react";
import dateFillZero from 'src/utiles/dateFillZero'

interface Props {
  id: number,
  ABToken: string,
  borrowDate: number,
  maturityDate: number,
  isLiquidation: boolean,
  onClick: () => void
}

const ContractInformation: FunctionComponent<Props> = ({ id, ABToken, borrowDate, maturityDate, isLiquidation, onClick }) => {
  const borrowTimeStamp = new Date(borrowDate);
  const maturityTimeStamp = new Date(maturityDate);
  const timestamp = new Date();
  const [disable, setDisable] = useState(false)
  let DDay = timestamp.getTime() - maturityTimeStamp.getTime();
  DDay = Math.floor(DDay / 1000);
  let Days = Math.floor(DDay / 86400);

  useEffect(() => {
    if (Days < 0 && !isLiquidation) setDisable(true)
  }, [Days, isLiquidation])

  return (
    <tr>
      <th>
        <p>
          {id}
        </p>
      </th>
      <th>
        <p>
          {`{${ABToken.slice(0, 6)}....${ABToken.slice(-4)}}`}
        </p>
      </th>
      <th>
        <p>
          {borrowTimeStamp.getFullYear() + "-" + dateFillZero(borrowTimeStamp.getMonth() + 1) + "-" + dateFillZero(borrowTimeStamp.getDate())}
        </p>
      </th>
      <th>
        <p>
          {maturityTimeStamp.getFullYear() + "-" + dateFillZero(maturityTimeStamp.getMonth() + 1) + "-" + dateFillZero(maturityTimeStamp.getDate())}
        </p>
      </th>
      <th>
        <div
          className={`borrowers__repay__table__button${disable ? "--disable" : ""}`}
          onClick={disable ?
            () => { }
            :
            onClick
          }>
          <p style={{ fontSize: isLiquidation ? 13 : 15 }}>
            {isLiquidation ?
              "Liquidation in progress"
              :
              (Days > 0) ?
                `D+${Days}`
                :
                (Days < 0) ?
                  `D${Days}`
                  :
                  "NOW"}
          </p>
        </div>
      </th>
    </tr>
  )
}

export default ContractInformation;