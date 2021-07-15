import Geocode from 'react-geocode'
import LanguageType from 'src/enums/LanguageType'

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAP_API_KEY!)

const reverseGeocoding = async (lat: number, lng: number, languageType: LanguageType): Promise<string> => {
	try {
		const res = await Geocode.fromLatLng(
			lat.toString(),
			lng.toString(),
			process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
			languageType === LanguageType.ZHHANS ? "zh-CN" : languageType,
		)

		return res?.results[0]?.formatted_address
	} catch (e) {
		console.log(e)
		return "-"
	}
}

export default reverseGeocoding;