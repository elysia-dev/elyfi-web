import { FunctionComponent } from 'react'
import Assets from 'src/types/Assets';
import dateFillZero from 'src/utiles/dateFillZero';

interface Props {
  assets: Assets,
  onClick: () => void,
}
const AssetList: FunctionComponent<Props> = ({ assets, onClick }) => {
  const timestamp = new Date(
    assets.maturityDate
  );

  return (
    <div className="portfolio__asset-list__info" onClick={onClick}>
      <p className="portfolio__asset-list__info__status">
        {assets.status}
      </p>
      <iframe style={{
        width: "100%", height: 304, border: 0
      }}
        src={assets.map}
      />
      <div className="portfolio__asset-list__info__value__container">
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value bold" style={{ color: "#333333" }}>
            Loan #{assets.loanNumber}
          </p>
        </div>
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value">
            대출금
          </p>
          <div>
            <span className="bold">{assets.loan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span> <span>{assets.method}</span>
          </div>
        </div>
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value">
            이자율
          </p>
          <div>
            <span className="bold">{assets.interest / 100}</span> <span>%</span>
          </div>
        </div>
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value">
            만기일
          </p>
          <div>
            <p className="bold">
              {timestamp.getFullYear() + "." + dateFillZero(timestamp.getMonth() + 1) + "." + dateFillZero(timestamp.getDate())}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetList;