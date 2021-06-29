import moment from 'moment';
import { FunctionComponent } from 'react'
import { GetAllAssetBonds_assetBondTokens } from 'src/queries/__generated__/GetAllAssetBonds';
import { daiToUsd, toPercent } from 'src/utiles/formatters';
import { parseTokenId } from 'src/utiles/parseTokenId';
import GoogleMapReact from 'google-map-react';

const abTokenStates = [
  'Empty',
  'Settled',
  'Confirmed',
  'Collateralized',
  'Matured',
  'Redeemed',
  'Not_performed',
]

const defaultLat = 37.5172;
const defaultLng = 127.0473;

const AssetList: FunctionComponent<{
  abToken: GetAllAssetBonds_assetBondTokens,
  onClick: () => void,
}> = ({ abToken, onClick }) => {
  const parsedTokenId = parseTokenId(abToken.id);

  return (
    <div className="portfolio__asset-list__info" onClick={onClick}>
      <p className="portfolio__asset-list__info__status">
        {abTokenStates[abToken.state || 0]}
      </p>
      <div style={{ width: "100%", height: 304, border: 0 }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY! }}
          defaultCenter={{
            lat: (parsedTokenId.collateralLatitude / 100000) || defaultLat,
            lng: (parsedTokenId.collateralLatitude / 100000) || defaultLng,
          }}
          defaultZoom={10}
        />
      </div>
      <div className="portfolio__asset-list__info__value__container">
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value bold" style={{ color: "#333333" }}>
            Loan #{parsedTokenId.nonce}
          </p>
        </div>
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value">
            대출금
          </p>
          <div>
            <span className="bold">{daiToUsd(abToken.principal || '0')}</span>
          </div>
        </div>
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value">
            이자율
          </p>
          <div>
            {toPercent(abToken.interestRate || '0')}
          </div>
        </div>
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value">
            만기일
          </p>
          <div>
            <p className="bold">
              {moment((abToken.maturityTimestamp || 0) * 1000).format('YYYY.MM.DD')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetList;