import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import MediaQuery from 'src/enums/MediaQuery';
import TokenColors from 'src/enums/TokenColors';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import useNavigator from 'src/hooks/useNavigator';
import DrawWave from 'src/utiles/drawWave';
import Header from 'src/components/NFTDetails/Header';
import Purchase from 'src/components/NFTDetails/Purchase';
import NFTInfo from 'src/components/NFTDetails/NFTInfo';
import BondNFT from 'src/components/NFTDetails/BondNFT';
import Borrower from 'src/components/NFTDetails/Borrower';
import RealEstateInfo from 'src/components/NFTDetails/RealEstateInfo';
import moment from 'moment';

const NFTDetails = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { value: mediaQuery } = useMediaQueryType();
  const { t } = useTranslation();
  const navigate = useNavigator();
  const { lng } = useParams<{ lng: string }>();

  const draw = () => {
    const dpr = window.devicePixelRatio;
    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (!headerRef.current) return;
    const headerY = headerRef.current.offsetTop + 80;
    if (!canvas) return;
    canvas.width = document.body.clientWidth * dpr;
    canvas.height = document.body.clientHeight * dpr;
    const browserWidth = canvas.width / dpr + 40;
    const browserHeight = canvas.height / dpr;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;
    ctx.scale(dpr, dpr);
    if (mediaQuery === MediaQuery.Mobile) return;
    new DrawWave(ctx, browserWidth).drawOnPages(
      headerY,
      TokenColors.ELFI,
      browserHeight,
      true,
    );
  };

  useEffect(() => {
    draw();
    window.addEventListener('scroll', () => draw());
    window.addEventListener('resize', () => draw());

    return () => {
      window.removeEventListener('scroll', () => draw());
      window.removeEventListener('resize', () => draw());
    };
  }, [document.body.clientHeight]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          width: '100%',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
      <main className="nft-details">
        <div className="component__text-navigation">
          <p onClick={() => navigate(`/${lng}/market`)} className="pointer">
            {t('navigation.market')}
          </p>
          &nbsp;&gt;&nbsp;
          <p>{t('nftMarket.title')}</p>
        </div>
        <article className="nft-details__header">
          <Header onButtonClick={() => {}} />
        </article>
        <article className="nft-details__content">
          <article className="nft-details__purchase">
            <Purchase
              userTotalPurchase={500}
              totalPurchase={54000}
              startTime={moment(
                '2022.07.18 19:00:00 +9:00',
                'YYYY.MM.DD hh:mm:ss Z',
              )}
              endedTime={moment(
                '2022.08.01 19:00:00 +9:00',
                'YYYY.MM.DD hh:mm:ss Z',
              )}
            />
          </article>
          <article className="nft-details__nft-info">
            <NFTInfo />
          </article>
          <article className="nft-details__bond-nft">
            <BondNFT />
          </article>
          <article className="nft-details__borrower">
            <Borrower />
          </article>
          <article className="nft-details__real-estate-info">
            <RealEstateInfo />
          </article>
        </article>
        <article className="nft-details__terms">
          <b>{t('nftMarket.termsTitle')}</b>
          <ul>
            <li>{t('nftMarket.terms.0')}</li>
            <li>{t('nftMarket.terms.1')}</li>
            <li>{t('nftMarket.terms.2')}</li>
            <li>{t('nftMarket.terms.3')}</li>
            <li>{t('nftMarket.terms.4')}</li>
            <li>{t('nftMarket.terms.5')}</li>
            <li>{t('nftMarket.terms.6')}</li>
            <li>{t('nftMarket.terms.7')}</li>
          </ul>
        </article>
      </main>
    </>
  );
};

export default NFTDetails;
