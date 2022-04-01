import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IAssetBond } from 'src/core/types/reserveSubgraph';
import { IReserve } from 'src/core/data/reserves';
import CollateralCategory from 'src/enums/CollateralCategory';
import LoanProduct from 'src/enums/LoanProduct';
import MediaQuery from 'src/enums/MediaQuery';
import { toPercent, toUsd } from 'src/utiles/formatters';
import maturityFormmater from 'src/utiles/maturityFormmater';
import { AssetBondIdData } from 'src/utiles/parseTokenId';
import Guide from 'src/components/Guide';
import locationMark from 'src/assets/images/locationMark.png';

interface Props {
  parsedTokenId: AssetBondIdData;
  abToken: IAssetBond;
  blockExplorerUrls: string;
  tokenInfo: IReserve;
  address: string;
  contractImage: {
    hash: string;
    link: string;
  }[];
  mediaQuery: MediaQuery;
  lat: number;
  lng: number;
}

const CollateralizedInfo: React.FC<Props> = ({
  abToken,
  blockExplorerUrls,
  tokenInfo,
  parsedTokenId,
  address,
  contractImage,
  mediaQuery,
  lat,
  lng,
}) => {
  const { t } = useTranslation();

  const divStyle = useMemo(
    () => ({
      color: '#888888',
      fontSize: mediaQuery === MediaQuery.PC ? '15px' : '12px',
      letterSpacing: -0.5,
    }),
    [mediaQuery],
  );

  return (
    <>
      {[
        [t('loan.collateral_nft__type'), 'ABToken', '', ''],
        [
          t('loan.collateral_nft__abtoken_id'),
          `${abToken?.id.slice(0, 8)} ... ${abToken?.id.slice(-8)}`,
          '',
          `${blockExplorerUrls}/token/${tokenInfo.tokenizer}?a=${abToken?.id}`,
        ],
        [t('loan.collateral_nft__borrower'), 'Elyloan Inc', '', ''],
        [
          t('loan.collateral_nft__loan_product'),
          t(`words.${LoanProduct[parsedTokenId.productNumber as LoanProduct]}`),
          '',
          '',
        ],
        [
          t('loan.loan__borrowed'),
          toUsd(abToken?.principal || '0', tokenInfo.decimals),
          '',
          '',
        ],
        [
          t('loan.loan__interest_rate'),
          toPercent(abToken?.couponRate || '0'),
          '',
          '',
        ],
        [
          t('loan.collateral_nft__overdue_interest_rate'),
          toPercent(abToken?.delinquencyRate || '0'),
          '',
          '',
        ],
        [t('loan.maturity_date'), maturityFormmater(abToken), '', ''],
        [
          t('loan.collateral_nft__maximum_amount'),
          toUsd(abToken?.debtCeiling || '0', tokenInfo.decimals),
          '',
          '',
        ],
        [
          t('loan.collateral_nft__loan_type'),
          t(
            `words.${
              CollateralCategory[
                parsedTokenId.collateralCategory as CollateralCategory
              ]
            }`,
          ),
          '',
          '',
        ],
        [t('loan.collateral_nft__address'), address, 'true', ''],
        [
          t('loan.collateral_nft__contract_image'),
          contractImage[1]?.hash
            ? `${contractImage[1].hash.slice(
                0,
                8,
              )} ... ${contractImage[1].hash.slice(-8)}`
            : '-',
          '',
          contractImage[1]?.link,
        ],
        [
          t('portfolio.Real_estate_registration_information'),
          contractImage[0]?.hash
            ? `${contractImage[0].hash.slice(
                0,
                8,
              )} ... ${contractImage[0].hash.slice(-8)}`
            : '-',
          '',
          contractImage[0]?.link,
        ],
        [
          t('portfolio.Certified_corporate_registration'),
          contractImage[2]?.hash
            ? `${contractImage[2]?.hash.slice(
                0,
                8,
              )} ... ${contractImage[2]?.hash.slice(-8)}`
            : '-',
          '',
          contractImage[2]?.link,
        ],
      ].map((data, index) => {
        return (
          <div key={`conten_${index}`}>
            <div style={divStyle}>
              {data[0] === t('loan.collateral_nft__loan_product') ? (
                <>
                  {data[0]}
                  <Guide content={t('portfolio.infomation_popup.8')} />
                </>
              ) : data[1] === 'ABToken' ? (
                <>
                  {data[0]}
                  <Guide content={'ABToken'} />
                </>
              ) : (
                data[0]
              )}
            </div>
            <div
              style={{
                fontFamily: 'SpoqaHanSansNeo',
                color: '#333333',
                fontSize: mediaQuery === MediaQuery.PC ? '15px' : '12px',
                letterSpacing: -0.8,
              }}
              onClick={() => {
                !!data[3] === true ? window.open(data[3], '_blank') : undefined;
              }}
              className={!!data[3] === true ? 'link' : ''}>
              {data[2] ? (
                <a
                  href={`https://www.google.com/maps/place/${address}/@${lat},${lng},18.12z`}
                  rel="noopener noreferer"
                  target="_blank"
                  style={{
                    cursor: 'pointer',
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <img
                      src={locationMark}
                      alt={locationMark}
                      style={{
                        width: 23.5,
                        height: 23.5,
                      }}
                    />
                    {data[1]}
                  </div>
                </a>
              ) : (
                data[1]
              )}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default CollateralizedInfo;
