type AssetBondIdData = {
  nonce: number;
  countryCode: number;
  collateralServiceProviderIdentificationNumber: number;
  collateralLatitude: number;
  collateralLatitudeSign: number;
  collateralLongitude: number;
  collateralLongitudeSign: number;
  collateralDetail: number;
  collateralCategory: number;
  productNumber: number;
};

type AssetBondIdDataDigits = {
  nonce: number;
  countryCode: number;
  collateralServiceProviderIdentificationNumber: number;
  collateralLatitude: number;
  collateralLatitudeSign: number;
  collateralLongitude: number;
  collateralLongitudeSign: number;
  collateralDetail: number;
  collateralCategory: number;
  productNumber: number;
};

const assetBondIdDataDigits = {
  nonce: 10,
  countryCode: 12,
  collateralServiceProviderIdentificationNumber: 50,
  collateralLatitude: 28,
  collateralLatitudeSign: 1,
  collateralLongitude: 28,
  collateralLongitudeSign: 1,
  collateralDetail: 40,
  collateralCategory: 10,
  productNumber: 10,
};

const wholeNumber = "1".repeat(256);

export const parseTokenId = (tokenId: string) => {
  const parsedTokenId = {} as AssetBondIdData;

  let end = wholeNumber.length;
  (Object.keys(
    assetBondIdDataDigits
  ) as (keyof AssetBondIdDataDigits)[]).forEach((key) => {
    let start = end - assetBondIdDataDigits[key] + 1;
    start = start !== end ? start : start - 1;
    parsedTokenId[key] = parseInt(tokenId.slice(start, end), 2) || 0;
    end -= assetBondIdDataDigits[key];
  });

  return parsedTokenId;
};
