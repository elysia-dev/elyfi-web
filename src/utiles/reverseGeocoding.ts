import Geocode from 'react-geocode';
import LanguageType from 'src/enums/LanguageType';
import { cord2address } from 'src/clients/KakaoMap';

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API_KEY!);

// 카카오맵에서 정확한 도로명 주소를 구하지 못하는 경우도 발생할 수 있는 데,
// 이 경우 아래와 같이 하드코딩으로 처리합니다.
const getHardKorGeocoding = (lat: number, lng: number) => {
  if (lat === 37.51168 && lng === 126.84221) {
    return '서울 양천구 남부순환로 645';
  }
  if (lat === 37.38866 && lng === 126.97489) {
    return '경기 의왕시 포일로 17';
  } else {
    return '-';
  }
};

const reverseGeocoding = async (
  lat: number,
  lng: number,
  languageType: LanguageType,
): Promise<string> => {
  try {
    if (languageType === LanguageType.KO) {
      try {
        const data = await cord2address(lng, lat);

        return (
          data.documents[0].road_address?.address_name ||
          getHardKorGeocoding(lat, lng)
        );
      } catch (error) {
        console.error(error);
        return '-';
      }
    } else {
      const res = await Geocode.fromLatLng(
        lat.toString(),
        lng.toString(),
        process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
        languageType,
      );
      return res?.results[0]?.formatted_address;
    }
  } catch (error) {
    console.error(error);
    return '-';
  }
};

export default reverseGeocoding;
