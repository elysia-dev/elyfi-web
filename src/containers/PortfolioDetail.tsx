import { FunctionComponent, useMemo, useEffect, useState, useRef, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import TempAssets from 'src/assets/images/temp_assets.png';
import wave from 'src/assets/images/wave_elyfi.png';
import { parseTokenId } from 'src/utiles/parseTokenId';
import { toUsd, toPercent } from 'src/utiles/formatters';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import LoanProduct from 'src/enums/LoanProduct';
import CollateralCategory from 'src/enums/CollateralCategory';
import LoanStatus from 'src/enums/LoanStatus';
import toLoanStatus from 'src/utiles/toLoanStatus';
import isLng from 'src/utiles/isLng';
import isLat from 'src/utiles/isLat';
import reverseGeocoding from 'src/utiles/reverseGeocoding';
import LanguageType from 'src/enums/LanguageType';
import CollateralLogo from 'src/assets/images/ELYFI.png';
import locationMark from 'src/assets/images/locationMark.png';
import Slate from 'src/clients/Slate';
import maturityFormmater from 'src/utiles/maturityFormmater';
import ReserveData from 'src/core/data/reserves';
import envs from 'src/core/envs';
import Guide from 'src/components/Guide';
import Loading from 'src/components/Loading';
import SubgraphContext, { IAssetBond } from 'src/contexts/SubgraphContext';

const PortfolioDetail: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { data: tokenData } = useContext(SubgraphContext);
  const { t } = useTranslation();
  const { lng: language } = useParams<{ lng: LanguageType }>();

  const assetBondTokens = tokenData.reserves.reduce((arr, reserve) => {
    return [...arr, ...reserve.assetBondTokens]
  }, [] as IAssetBond[])

  const abToken = assetBondTokens.find((ab) => ab.id === id);
  const depositRef = useRef<HTMLParagraphElement>(null);
  const parsedTokenId = useMemo(() => {
    return parseTokenId(abToken?.id);
  }, [abToken]);
  const lat = parsedTokenId.collateralLatitude / 100000;
  const lng = parsedTokenId.collateralLongitude / 100000;
  const [address, setAddress] = useState('-');
  const [contractImage, setContractImage] = useState<
    {
      hash: string;
      link: string;
    }[]
  >([
    {
      hash: '',
      link: '',
    },
  ]);
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
      const contractDoc = response.data;
      if (contractDoc) {
        setContractImage([
          {
            hash: contractDoc.documents[0].hash,
            link: contractDoc.documents[0].link,
          },
          {
            hash: contractDoc.documents[1].hash,
            link: contractDoc.documents[1].link,
          },
          {
            hash: contractDoc.documents[2].hash,
            link: contractDoc.documents[2].link,
          },
          {
            hash: contractDoc.images[0]?.hash,
            link: contractDoc.images[0]?.link,
          },
        ]);
      }
    } catch (error) {
      console.error(error);
      setContractImage([
        {
          hash: '',
          link: '',
        },
      ]);
    }
  };

  useEffect(() => {
    if (abToken?.ipfsHash) {
      loadContractImage(abToken.ipfsHash);
    }
  }, [abToken]);

  if (!tokenInfo || !abToken)
    return (
      <div
        style={{
          height: '100vh',
        }}>
        {' '}
        <Loading />
      </div>
    );

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
    <>
      <img
        style={{
          position: 'absolute',
          left: 0,
          top: depositRef.current?.offsetTop,
          width: '100%',
        }}
        src={wave}
        alt={wave}
      />
      <div className="portfolio">
        <div className="component__text-navigation">
          <p
            onClick={() => history.push(`/${language}/deposit`)}
            className="pointer">
            {t('dashboard.deposit')}
          </p>
          &nbsp;&gt;&nbsp;
          <p>{t('loan.loan__info')}</p>
        </div>
        <div className="detail__header">
          <h2 ref={depositRef}>{t('loan.loan__info')}</h2>
        </div>
        <div className="portfolio__borrower">
          <h2 className="portfolio__borrower__title">
            {t('loan.borrower__info')}
          </h2>
          <div className="portfolio__borrower__header">
            <img src={CollateralLogo} />
            <div>
              <p>{t('loan.borrower')}</p>
              <p>Elyloan Inc</p>
            </div>
            <div>
              <p>{t('loan.license_number')}</p>
              <p>220111-0189192</p>
            </div>
            <div>
              <p>{t('loan.wallet_address')}</p>
              <a
                href="https://etherscan.io/address/0x9FCdc09bF1e0f933e529325Ac9D24f56034d8eD7"
                target="_blank"
                rel="noopener noreferer">
                <p className="link">
                  {'0x9FCdc09bF1e0f933e529325Ac9D24f56034d8eD7'.slice(
                    0,
                    12,
                  )}{' '}
                  ...{' '}
                  {'0x9FCdc09bF1e0f933e529325Ac9D24f56034d8eD7'.slice(-12)}
                </p>
              </a>
            </div>
          </div>
          <div className="portfolio__borrower__data">
            <div className="portfolio__borrower__data--left">
              <div>
                <p>
                  {t('loan.loan__number')}{' '}
                  <Guide content={t('portfolio.infomation_popup.0')} />
                </p>
                <p>{parsedTokenId.nonce}</p>
              </div>
              <div>
                <p>
                  {t('loan.loan__status')}
                  <Guide
                    content={`${t('portfolio.infomation_popup.1')} \n ${t(
                      'portfolio.infomation_popup.3',
                    )} \n ${t('portfolio.infomation_popup.5')}`}
                  />
                </p>
                <p>
                  {t(
                    `words.${LoanStatus[
                    toLoanStatus(abToken.state)
                    ]
                    }`,
                  )}
                </p>
              </div>
              <div>
                <p>{t('loan.receiving_address')}</p>
                <a
                  href="https://etherscan.io/address/0x9FCdc09bF1e0f933e529325Ac9D24f56034d8eD7"
                  target="_blank"
                  rel="noopener noreferer">
                  <p className={abToken?.borrower?.id ? 'link' : ''}>
                    {!!abToken?.borrower?.id === true
                      ? `${abToken?.borrower?.id.slice(
                        0,
                        12,
                      )} ... ${abToken?.borrower?.id.slice(-12)}`
                      : '-'}
                  </p>
                </a>
              </div>
              <div>
                <p>{t('loan.loan__borrowed')}</p>
                <p>
                  {toUsd(abToken?.principal || '0', tokenInfo.decimals)}
                </p>
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
                <p>
                  {t('loan.collateral_nft')}{' '}
                  <Guide content={t('portfolio.infomation_popup.7')} />
                </p>
                <p
                  title={abToken?.id}
                  className="link"
                  onClick={() => {
                    window.open(
                      `${envs.etherscanURI}/token/${tokenInfo.tokeninzer}?a=${abToken?.id}`,
                      '_blank',
                    );
                  }}>
                  {abToken?.id.slice(0, 12)} ... {abToken?.id.slice(-12)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="portfolio__collateral">
          <h2>{t('loan.collateral_nft__details')}</h2>
          <div className="portfolio__collateral__data">
            <div className="portfolio__collateral__data--left">
              <a
                href={`https://www.google.com/maps/place/${address}/@${lat},${lng},18.12z`}
                rel="noopener noreferer"
                target="_blank"
                style={{
                  cursor: 'pointer',
                }}>
                <img
                  style={{
                    width: 538.5,
                    height: 526,
                  }}
                  src={contractImage[3]?.link || TempAssets}
                  alt={contractImage[3]?.link || TempAssets}
                />
              </a>
              {/* <GoogleMapReact
                  bootstrapURLKeys={{
                    key: process.env.REACT_APP_GOOGLE_MAP_API_KEY!,
                  }}
                  defaultCenter={{
                    lat,
                    lng,
                  }}
                  defaultZoom={15}>
                  <Marker lat={lat} lng={lng} />
                </GoogleMapReact> */}
            </div>
            <div className="portfolio__collateral__data--right">
              {[
                [t('loan.collateral_nft__type'), 'ABToken', '', ''],
                [
                  t('loan.collateral_nft__abtoken_id'),
                  `${abToken?.id.slice(0, 12)} ... ${abToken?.id.slice(
                    -12,
                  )}`,
                  '',
                  `${envs.etherscanURI}/token/${tokenInfo.tokeninzer}?a=${abToken?.id}`,
                ],
                [t('loan.collateral_nft__borrower'), 'Elyloan Inc', '', ''],
                [
                  t('loan.collateral_nft__loan_product'),
                  t(
                    `words.${LoanProduct[
                    parsedTokenId.productNumber as LoanProduct
                    ]
                    }`,
                  ),
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
                [
                  t('loan.maturity_date'),
                  maturityFormmater(abToken),
                  '',
                  '',
                ],
                [
                  t('loan.collateral_nft__maximum_amount'),
                  toUsd(abToken?.debtCeiling || '0', tokenInfo.decimals),
                  '',
                  '',
                ],
                [
                  t('loan.collateral_nft__loan_type'),
                  t(
                    `words.${CollateralCategory[
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
                      12,
                    )} ... ${contractImage[1].hash.slice(-12)}`
                    : '-',
                  '',
                  contractImage[1]?.link,
                ],
                [
                  t('portfolio.Real_estate_registration_information'),
                  contractImage[0]?.hash
                    ? `${contractImage[0].hash.slice(
                      0,
                      12,
                    )} ... ${contractImage[0].hash.slice(-12)}`
                    : '-',
                  '',
                  contractImage[0]?.link,
                ],
                [
                  t('portfolio.Certified_corporate_registration'),
                  contractImage[2]?.hash
                    ? `${contractImage[2]?.hash.slice(
                      0,
                      12,
                    )} ... ${contractImage[2]?.hash.slice(-12)}`
                    : '-',
                  '',
                  contractImage[2]?.link,
                ],
              ].map((data) => {
                return (
                  <div>
                    <p>
                      {data[0] ===
                        t('loan.collateral_nft__loan_product') ? (
                        <>
                          {data[0]}
                          <Guide
                            content={t('portfolio.infomation_popup.8')}
                          />
                        </>
                      ) : data[1] === 'ABToken' ? (
                        <>
                          {data[0]}
                          <Guide content={'ABToken'} />
                        </>
                      ) : (
                        data[0]
                      )}
                    </p>
                    <p
                      onClick={() => {
                        !!data[3] === true
                          ? window.open(data[3], '_blank')
                          : undefined;
                      }}
                      className={!!data[3] === true ? 'link' : ''}>
                      {data[2] ? (
                        <>
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
                        </>
                      ) : (
                        data[1]
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioDetail;
