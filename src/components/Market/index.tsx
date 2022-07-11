import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import MediaQuery from 'src/enums/MediaQuery';
import TokenColors from 'src/enums/TokenColors';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import DrawWave from 'src/utiles/drawWave';
import Header from 'src/components/Market/Header';
import NFTCard from 'src/components/Market/NFTCard';

import BondAsset from 'src/assets/images/market/bondAssets.png';

export enum PFType {
  BOND,
  SHARE,
}

export interface ICardType {
  PFType: PFType;
  Location: string;
  APY: number;
  currentSoldNFTs: number;
  totalNFTs: number;
  cardImage: string | undefined;
  onClickLink: string;
}

const tempCardArray: ICardType[] = [
  {
    PFType: PFType.BOND,
    Location: '2046 Norwalk Ave LA, CA 90041',
    APY: 12,
    currentSoldNFTs: 12000,
    totalNFTs: 54000,
    cardImage: BondAsset,
    onClickLink: 'a1',
  },
  {
    PFType: PFType.SHARE,
    Location: '',
    APY: 0,
    currentSoldNFTs: 0,
    totalNFTs: 0,
    cardImage: undefined,
    onClickLink: 'b2',
  },
  {
    PFType: PFType.SHARE,
    Location: '',
    APY: 0,
    currentSoldNFTs: 0,
    totalNFTs: 0,
    cardImage: undefined,
    onClickLink: 'c3',
  },
];

const Market = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { value: mediaQuery } = useMediaQueryType();
  const { t } = useTranslation();

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
      <main className="market">
        <Header headerRef={headerRef} />
        <article className="market__content">
          <h2>미국 부동산 상품</h2>
          <article className="market__nft-container">
            {tempCardArray.map((data, index) => {
              return <NFTCard data={data} key={index} />;
            })}
          </article>
        </article>
      </main>
    </>
  );
};

export default Market;
