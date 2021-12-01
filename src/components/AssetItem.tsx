import { FunctionComponent, useEffect, useMemo, useState } from 'react';
import { GetAllAssetBonds_assetBondTokens } from 'src/queries/__generated__/GetAllAssetBonds';
import { toCompactForBignumber, toPercent } from 'src/utiles/formatters';
import { parseTokenId } from 'src/utiles/parseTokenId';
import { useTranslation } from 'react-i18next';
import GoogleMapReact from 'google-map-react';

import isLat from 'src/utiles/isLat';
import isLng from 'src/utiles/isLng';
import CollateralCategory from 'src/enums/CollateralCategory';
import maturityFormmater from 'src/utiles/maturityFormmater';

import Slate from 'src/clients/Slate';
import ReserveData from 'src/core/data/reserves';
import Marker from './Marker';

const defaultLat = 37.5172;
const defaultLng = 127.0473;

const AssetItem: FunctionComponent<{
  abToken: GetAllAssetBonds_assetBondTokens;
  onClick: () => void;
  style?: React.CSSProperties;
}> = ({ abToken, onClick, style }) => {
  const parsedTokenId = useMemo(() => {
    return parseTokenId(abToken.id);
  }, [abToken]);
  const { t } = useTranslation();

  const lat = parsedTokenId.collateralLatitude / 100000;
  const lng = parsedTokenId.collateralLongitude / 100000;
  const [image, setImage] = useState('');
  const tokenInfo = ReserveData.find(
    (reserve) => reserve.address === abToken?.reserve.id,
  );

  const fetchImage = async () => {
    // hard coding!!!
    // 아래 아이디의 경우 이미지를 넣는 기획이 없을때 발행한 NFT라서 이미지가 없음
    // 통일 성을 위해, 해당 경우만 하드코딩으로 예외처리해서 이미지를 보여주도록 구현
    if (
      abToken.id ===
      '115792089237316195422007842550160057480242544124026915590235438085798243682305'
    ) {
      return setImage(
        'https://elysia-public.s3.ap-northeast-2.amazonaws.com/elyfi/borrow01.png',
      );
    }

    const response = await Slate.fetctABTokenIpfs(abToken.ipfsHash || '');
    setImage(response.data.images[0]?.link);
  };

  useEffect(() => {
    fetchImage();
  }, [abToken]);

  return (
    <div className="component__loan-list" style={style} onClick={onClick}>
      <div className="component__loan-list__image">
        {image ? (
          <img src={image} alt={`csp_image_${abToken.id}`} />
        ) : (
          <GoogleMapReact
            bootstrapURLKeys={{
              key: process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
            }}
            defaultCenter={{
              lat: isLat(lat) ? lat : defaultLat,
              lng: isLng(lng) ? lng : defaultLng,
            }}
            defaultZoom={15}>
            <Marker lat={lat} lng={lng} />
          </GoogleMapReact>
        )}
      </div>
      <div className="component__loan-list__data">
        <div>
          <p>
            {toPercent(abToken.interestRate || '0')}
          </p>
        </div>
        <div>
          <p className="bold">
            {'$ ' +
              toCompactForBignumber(
                abToken.principal || '0',
                tokenInfo?.decimals,
              )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetItem;
