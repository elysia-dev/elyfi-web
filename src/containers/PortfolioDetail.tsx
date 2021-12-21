import { FunctionComponent, useMemo, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import GoogleMapReact from 'google-map-react';
import { GetAllAssetBonds } from 'src/queries/__generated__/GetAllAssetBonds';
import ErrorPage from 'src/components/ErrorPage';
import { useQuery } from '@apollo/client';
import { GET_ALL_ASSET_BONDS } from 'src/queries/assetBondQueries';
import { parseTokenId } from 'src/utiles/parseTokenId';
import { toUsd, toPercent } from 'src/utiles/formatters';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import Marker from 'src/components/Marker';
import LoanProduct from 'src/enums/LoanProduct';
import CollateralCategory from 'src/enums/CollateralCategory';
import LoanStatus from 'src/enums/LoanStatus';
import toLoanStatus from 'src/utiles/toLoanStatus';
import ABTokenState from 'src/enums/ABTokenState';
import isLng from 'src/utiles/isLng';
import isLat from 'src/utiles/isLat';
import reverseGeocoding from 'src/utiles/reverseGeocoding';
import LanguageType from 'src/enums/LanguageType';
import CollateralLogo from 'src/assets/images/ELYFI.png';
import Slate from 'src/clients/Slate';
import maturityFormmater from 'src/utiles/maturityFormmater';
import ReserveData from 'src/core/data/reserves';
import envs from 'src/core/envs';

const PortfolioDetail: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, data, error } =
    useQuery<GetAllAssetBonds>(GET_ALL_ASSET_BONDS);
  const { t } = useTranslation();
  const { lng: language } = useParams<{ lng: LanguageType }>();
  const abToken = data?.assetBondTokens.find((ab) => ab.id === id);
  const parsedTokenId = useMemo(() => {
    return parseTokenId(abToken?.id);
  }, [abToken]);
  const lat = parsedTokenId.collateralLatitude / 100000;
  const lng = parsedTokenId.collateralLongitude / 100000;
  const [address, setAddress] = useState('-');
  const [contractImage, setContractImage] = useState({
    hash: '',
    link: '',
  });
  const tokenInfo = ReserveData.find(
    (reserve) => reserve.address === abToken?.reserve.id,
  );
  const history = useHistory();

  const loadAddress = async (
    lat: number,
    lng: number,
    language: LanguageType,
  ) => {
    setAddress(await reverseGeocoding(lat, lng, language));
  };

  useEffect(() => {
    if (!isLat(lat) || !isLng(lng)) return;

    loadAddress(lat, lng, language);
  }, [lat, lng, language]);

  const loadContractImage = async (ipfs: string) => {
    try {
      const response = await Slate.fetctABTokenIpfs(ipfs);
      const contractDoc = response.data.documents.find((doc) => doc.type === 1);

      if (contractDoc) {
        setContractImage({
          hash: contractDoc.hash,
          link: contractDoc.link,
        });
      }
    } catch {
      setContractImage({
        hash: '',
        link: '',
      });
    }
  };

  useEffect(() => {
    if (abToken?.ipfsHash) {
      loadContractImage(abToken.ipfsHash);
    }
  }, [abToken]);

  if (error || !tokenInfo) return <ErrorPage />;

  const AddressCopy = (add: string | undefined) => {
    if (!document.queryCommandSupported('copy')) {
      return alert('This browser does not support the copy function.');
    }
    if (add === undefined) {
      return alert('There was a problem reading the ABToken.');
    } else {
      const area = document.createElement('textarea');
      area.value = add;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
      alert('Copied!!');
    }
  };

  return (
    <div className="portfolio">
      <div className="component__text-navigation">
        <p onClick={() => history.push(`/${lng}/dashboard`)} className="pointer">
          {t('dashboard.deposit')}
        </p>
        &nbsp;&gt;&nbsp;
        <p>
          {t("loan.loan__info")}
        </p>
      </div>
      <div className="detail__header">
        <h2>{t("loan.loan__info")}</h2>
      </div>
      {loading ? (
        <Skeleton height={900} />
      ) : (
        <>
          <div className="portfolio__borrower">
            <h2 className="portfolio__borrower__title">
              {t("loan.borrower__info")}
            </h2>
            <div className="portfolio__borrower__header">
              <img src={CollateralLogo} />
              <div>
                <p>{t("loan.borrower")}</p>
                <p>Elyloan Corp</p>
              </div>
              <div>
                <p>{t('loan.license_number')}</p>
                <p>220111-0189192</p>
              </div>
              <div>
                <p>{t('loan.wallet_address')}</p>
                <p onClick={() => AddressCopy("0x9FCdc09bF1e0f933e529325Ac9D24f56034d8eD7")} className="link">
                  {"0x9FCdc09bF1e0f933e529325Ac9D24f56034d8eD7".slice(0, 12)} ... {"0x9FCdc09bF1e0f933e529325Ac9D24f56034d8eD7".slice(-12)}
                </p>
              </div>
            </div>
            <div className="portfolio__borrower__data">
              <div className="portfolio__borrower__data--left">
                <div>
                  <p>{t('loan.loan__number')}</p>
                  <p>{parsedTokenId.nonce}</p>
                </div>
                <div>
                  <p>{t('loan.loan__status')}</p>
                  <p>
                  {t(
                    `words.${
                      LoanStatus[toLoanStatus(abToken?.state as ABTokenState)]
                    }`,
                  )}
                  </p>
                </div>
                <div>
                  <p>{t('loan.receiving_address')}</p>
                  <p 
                    onClick={() => abToken?.borrower?.id ? AddressCopy(abToken?.borrower?.id) : undefined} 
                    className={abToken?.borrower?.id ? "link" : ""} 
                  >
                    {!!abToken?.borrower?.id === true ? (`${abToken?.borrower?.id.slice(0, 12)} ... ${abToken?.borrower?.id.slice(-12)}`) : '-'}
                  </p>
                </div>
                <div>
                  <p>{t('loan.loan__borrowed')}</p>
                  <p>{toUsd(abToken?.principal || '0', tokenInfo.decimals)}</p>
                </div>
              </div>

              <div className="portfolio__borrower__data--right">
                <div>
                  <p>{t('loan.loan__interest_rate')}</p>
                  <p>{toPercent(abToken?.interestRate || '0')}</p>
                </div>
                <div>
                  <p>{t('loan.loan__date')}</p>
                  <p>
                    {abToken?.loanStartTimestamp
                        ? moment(abToken.loanStartTimestamp * 1000).format(
                            'YYYY.MM.DD',
                          )
                        : '-'}
                  </p>
                </div>
                <div>
                  <p>{t('loan.maturity_date')}</p>
                  <p>{maturityFormmater(abToken)}</p>
                </div>
                <div>
                  <p>{t('loan.collateral_nft')}</p>
                  <p
                    title={abToken?.id}
                    className="link"
                    onClick={() => {
                      window.open(
                        `${envs.etherscan}/token/${tokenInfo.tokeninzer}?a=${abToken?.id}`,
                        '_blank',
                      );
                    }}>
                    {abToken?.id.slice(0, 12)} ... {abToken?.id.slice(-12)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="portfolio__collateral">
        <h2>{t('loan.collateral_nft__details')}</h2>
        <div className="portfolio__collateral__data">
          <div className="portfolio__collateral__data--left">
          {loading ? (
              <Skeleton height={900} />
            ) : (
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
                }}
                defaultCenter={{
                  lat,
                  lng,
                }}
                defaultZoom={15}>
                <Marker lat={lat} lng={lng} />
              </GoogleMapReact>
            )}
          </div>
          <div className="portfolio__collateral__data--right">
          {loading ? (
            <Skeleton height={900} />
          ) : (
            <>
            {[
              [t("loan.collateral_nft__type"), "ABToken", "", ""],
              [t('loan.collateral_nft__abtoken_id'), `${abToken?.id.slice(0, 12)} ... ${abToken?.id.slice(-12)}`, "", `${envs.etherscan}/token/${tokenInfo.tokeninzer}?a=${abToken?.id}`],
              [t('loan.collateral_nft__borrower'), "Elyloan Corp", "", ""],
              [t('loan.collateral_nft__loan_product'), t(`words.${LoanProduct[parsedTokenId.productNumber as LoanProduct]}`), "", ""],
              [t('loan.loan__borrowed'), toUsd(abToken?.principal || '0', tokenInfo.decimals), "", ""],
              [t('loan.loan__interest_rate'), toPercent(abToken?.couponRate || '0'), "", ""],
              [t('loan.collateral_nft__overdue_interest_rate'), toPercent(abToken?.delinquencyRate || '0'), "", ""],
              [t('loan.maturity_date'), maturityFormmater(abToken), "", ""],
              [t('loan.collateral_nft__maximum_amount'), toUsd(abToken?.debtCeiling || '0', tokenInfo.decimals), "", ""],
              [t('loan.collateral_nft__loan_type'), t(`words.${CollateralCategory[parsedTokenId.collateralCategory as CollateralCategory]}`), "", ""],
              [t('loan.collateral_nft__address'), address, "", ""],
              [t('loan.collateral_nft__contract_image'), `${contractImage.hash.slice(0, 12)} ... ${contractImage.hash.slice(-12)}` || '-', "", contractImage.link]
            ].map((data) => {
              return (
                <div>
                  <p>{data[0]}</p>
                  <p 
                    onClick={() => {
                      !!data[3] === true ? 
                        window.open(data[3], '_blank'
                      ) : 
                      undefined
                    }}
                    className={!!data[3] === true ? "link" : ""}
                  >
                    {data[1]}
                  </p>
                </div>
              )
            })}
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetail;
