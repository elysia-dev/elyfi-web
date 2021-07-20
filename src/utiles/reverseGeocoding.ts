import Geocode from 'react-geocode'
import LanguageType from 'src/enums/LanguageType'

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API_KEY!)

declare global {
	interface Window {
		kakao: any;
	}
}

interface IKakaoCord2AddressResult {
	road_address: {
		address_name: string;
	}
}

const reverseGeocoding = async (lat: number, lng: number, languageType: LanguageType): Promise<string> => {
	try {
		if (languageType === LanguageType.KO) {
			try {
				const geocoder = new window.kakao.maps.services.Geocoder();
				const coord = new window.kakao.maps.LatLng(lat, lng);

				return new Promise(
					(resolve, reject) => {
						geocoder.coord2Address(coord.getLng(), coord.getLat(), (result: IKakaoCord2AddressResult[], status: "OK" | "ZERO_RESULT" | "ERROR") => {
							if (status === 'OK') {
								return resolve(result[0].road_address.address_name);
							}

							reject();
						})
					}
				);
			} catch {
				return '-';
			}
		} else {
			const res = await Geocode.fromLatLng(
				lat.toString(),
				lng.toString(),
				process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
				languageType === LanguageType.ZHHANS ? "zh-CN" : languageType,
			)
			return res?.results[0]?.formatted_address
		}
	} catch (e) {
		return "-"
	}
}

export default reverseGeocoding;