import axios from 'axios';

export const cord2address = (x: number, y: number): Promise<{
  meta: { total_count: number },
  documents: {
    road_address: {
      address_name: string,
      region_1depth_name: string,
    }
  }[]
}> =>
  axios.get(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${x}&y=${y}`,
    {
      headers: {
        "Authorization": `KakaoAK ${process.env.REACT_APP_KAKAO_MAP_KEY}`,
        "KA": "sdk/4.4.3 os/javascript lang/ko-KR device/MacIntel origin/https%3A%2F%2Fwww.elyfi.world"
      }
    }).then((res) => res.data);