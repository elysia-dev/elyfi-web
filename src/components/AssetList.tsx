import moment from 'moment';
import { FunctionComponent } from 'react'
import { GetAllAssetBonds_assetBondTokens } from 'src/queries/__generated__/GetAllAssetBonds';
import { toCompactForBignumber, toPercent } from 'src/utiles/formatters';
import { parseTokenId } from 'src/utiles/parseTokenId';
import GoogleMapReact from 'google-map-react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import isLat from 'src/utiles/isLat';
import isLng from 'src/utiles/isLng';
import Marker from './Marker';

const abTokenStates = [
  'Empty',
  'Settled',
  'Confirmed',
  'Collateralized',
  'Matured',
  'Redeemed',
  'Not performed',
]

const defaultLat = 37.5172;
const defaultLng = 127.0473;

const AssetList: FunctionComponent<{
  abToken: GetAllAssetBonds_assetBondTokens,
  onClick: () => void,
}> = ({ abToken, onClick }) => {
  const parsedTokenId = useMemo(() => {
    return parseTokenId(abToken.id)
  }, [abToken]);
  const { t } = useTranslation();

  const lat = parsedTokenId.collateralLatitude / 100000;
  const lng = parsedTokenId.collateralLongitude / 100000;

  return (
    <div className="portfolio__asset-list__info">
      <p className="portfolio__asset-list__info__status spoqa" onClick={onClick}>
        {abTokenStates[abToken.state || 0]}
      </p>
      <div style={{ width: "100%", height: 304, border: 0 }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY! }}
          defaultCenter={{
            lat: isLat(lat) ? lat : defaultLat,
            lng: isLng(lng) ? lng : defaultLng,
          }}
          defaultZoom={15}
        >
          <Marker lat={lat} lng={lng} />
        </GoogleMapReact>
      </div>
      <div className="portfolio__asset-list__info__value__container" onClick={onClick}>
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value spoqa__bold" style={{ color: "#333333" }}>
            {t("portfolio.loan_number", { nonce: parsedTokenId.nonce })}
          </p>
        </div>
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value spoqa">
            {t("portfolio.borrowed")}
          </p>
          <div>
            <span className="bold">{"$ " + toCompactForBignumber(abToken.principal || '0')}</span>
          </div>
        </div>
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value spoqa">
            {t("portfolio.borrow_apy")}
          </p>
          <div>
            {toPercent(abToken.interestRate || '0')}
          </div>
        </div>
        <div className="portfolio__asset-list__info__value__wrapper">
          <p className="portfolio__asset-list__info__value spoqa">
            {t("portfolio.maturity_date")}
          </p>
          <div>
            <p className="bold">
              {abToken.maturityTimestamp ? moment(abToken.maturityTimestamp * 1000).format('YYYY.MM.DD') : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetList;