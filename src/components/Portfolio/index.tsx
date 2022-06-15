import {
  FunctionComponent,
  useMemo,
  useEffect,
  useState,
  useRef,
  lazy,
  Suspense,
} from 'react';
import { useParams } from 'react-router-dom';
import TempAssets from 'src/assets/images/temp_assets.png';
import wave from 'src/assets/images/wave_elyfi.png';
import { parseTokenId } from 'src/utiles/parseTokenId';
import { useTranslation } from 'react-i18next';
import isLng from 'src/utiles/isLng';
import isLat from 'src/utiles/isLat';
import reverseGeocoding from 'src/utiles/reverseGeocoding';
import LanguageType from 'src/enums/LanguageType';
import CollateralLogo from 'src/assets/images/ELYFI.png';
import Slate, { baseUrl } from 'src/clients/Slate';
import ReserveData from 'src/core/data/reserves';
import envs from 'src/core/envs';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import useReserveData from 'src/hooks/useReserveData';
import { IAssetBond } from 'src/core/types/reserveSubgraph';
import Skeleton from 'react-loading-skeleton';
import useNavigator from 'src/hooks/useNavigator';
import UnKnownImage from 'src/assets/images/undefined_image.svg';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

const BorrowInfo = lazy(() => import('src/components/Portfolio/BorrowerInfo'));
const CollateralizedInfo = lazy(
  () => import('src/components/Portfolio/CollateralizedInfo'),
);

const PortfolioDetail: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const { reserveState } = useReserveData();
  const { t } = useTranslation();
  const { lng: language } = useParams<{ lng: LanguageType }>();

  const assetBondTokens = reserveState.reserves.reduce((arr, reserve) => {
    return [...arr, ...reserve.assetBondTokens];
  }, [] as IAssetBond[]);

  const abToken = assetBondTokens.find((ab) => ab.id === id);
  const depositRef = useRef<HTMLParagraphElement>(null);
  const { value: mediaQuery } = useMediaQueryType();
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
  const navigate = useNavigator();

  const blockExplorerUrls =
    tokenInfo?.tokenizer === envs.tokenizer.busdTokenizerAddress
      ? envs.externalApiEndpoint.bscscanURI
      : envs.externalApiEndpoint.etherscanURI;

  const loadAddress = async (
    lat: number,
    lng: number,
    language: LanguageType,
  ) => {
    setAddress(await reverseGeocoding(lat, lng, language));
  };
  useEffect(() => {
    if (!isLat(lat) || !isLng(lng)) return;

    loadAddress(lat, lng, language || LanguageType.EN);
  }, [lat, lng, language]);

  const loadContractImage = async (ipfs: string) => {
    try {
      const response = await Slate.fetctABTokenIpfs(ipfs);
      const contractDoc = response.data;
      if (contractDoc) {
        setContractImage([
          {
            hash: contractDoc.documents[0].hash,
            link: contractDoc.documents[0].link.replace(
              'https://slate.textile.io',
              'https://ipfs.io',
            ),
          },
          {
            hash: contractDoc.documents[1].hash,
            link: contractDoc.documents[1].link.replace(
              'https://slate.textile.io',
              'https://ipfs.io',
            ),
          },
          {
            hash: contractDoc.documents[2].hash,
            link: contractDoc.documents[2].link.replace(
              'https://slate.textile.io',
              'https://ipfs.io',
            ),
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
            onClick={() => navigate(`/${language}/deposit`)}
            className="pointer">
            {t('dashboard.deposit')}
          </p>
          &nbsp;&gt;&nbsp;
          <p>{t('loan.loan__info')}</p>
        </div>
        <div className="detail__header">
          <h2 ref={depositRef}>{t('loan.loan__info')}</h2>
        </div>

        {!(!tokenInfo || !abToken) ? (
          <>
            <div className="portfolio__borrower">
              <h2 className="portfolio__borrower__title">
                {t('loan.borrower__info')}
              </h2>
              <Suspense
                fallback={
                  <div
                    style={{ height: mediaQuery === MediaQuery.PC ? 280 : 450 }}
                  />
                }>
                <BorrowInfo
                  collateralLogo={CollateralLogo}
                  parsedTokenId={parsedTokenId}
                  abToken={abToken}
                  blockExplorerUrls={blockExplorerUrls}
                  tokenInfo={tokenInfo}
                  mediaQuery={mediaQuery}
                />
              </Suspense>
            </div>
            <div className="portfolio__collateral">
              <h2>{t('loan.collateral_nft__details')}</h2>
              <div className="portfolio__collateral__data">
                <div className="portfolio__collateral__data--left">
                  <Suspense fallback={<Skeleton width="538" height="526" />}>
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
                        src={`${baseUrl}/${contractImage[3]?.hash}`}
                        alt="Asset Image"
                        onError={(e: any) => {
                          e.target.src = UnKnownImage;
                        }}
                      />
                    </a>
                  </Suspense>
                </div>
                <div className="portfolio__collateral__data--right">
                  <Suspense fallback={null}>
                    <CollateralizedInfo
                      abToken={abToken}
                      blockExplorerUrls={blockExplorerUrls}
                      tokenInfo={tokenInfo}
                      parsedTokenId={parsedTokenId}
                      address={address}
                      contractImage={contractImage}
                      mediaQuery={mediaQuery}
                      lat={lat}
                      lng={lng}
                    />
                  </Suspense>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Skeleton width={'100%'} height={1000} />
        )}
      </div>
    </>
  );
};

export default PortfolioDetail;
