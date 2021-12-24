import Geocode from 'react-geocode';
import LanguageType from 'src/enums/LanguageType';

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

declare global {
  interface Window {
    kakao: any;
  }
}

interface IKakaoCord2AddressResult {
  road_address: {
    address_name: string;
  };
}

const reverseGeocoding = async (
  lat: number,
  lng: number,
  languageType: LanguageType,
): Promise<string> => {
  try {
    if (languageType === LanguageType.KO) {
      try {
        const geocoder = new window.kakao.maps.services.Geocoder();
        const coord = new window.kakao.maps.LatLng(lat, lng);

        return new Promise((resolve, reject) => {
          geocoder.coord2Address(
            coord.getLng(),
            coord.getLat(),
            (
              result: IKakaoCord2AddressResult[],
              status: 'OK' | 'ZERO_RESULT' | 'ERROR',
            ) => {
              if (status === 'OK') {
                return resolve(
                  result[0].road_address?.address_name ||
                    getHardKorGeocoding(lat, lng),
                );
              }

              reject();
            },
          );
        });
      } catch (error) {
        console.error(error);
        return '-';
      }
    } else {
      const res = await Geocode.fromLatLng(
        lat.toString(),
        lng.toString(),
        process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
        languageType === LanguageType.ZHHANS ? 'zh-CN' : languageType,
      );
      return res?.results[0]?.formatted_address;
    }
  } catch (error) {
    console.error(error);
    return '-';
  }
};

export default reverseGeocoding;
