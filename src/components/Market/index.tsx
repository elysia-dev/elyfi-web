import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MediaQuery from 'src/enums/MediaQuery';
import TokenColors from 'src/enums/TokenColors';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import DrawWave from 'src/utiles/drawWave';
import Header from 'src/components/Market/Header';
import NFTCard from 'src/components/Market/NFTCard';

import BondAsset from 'src/assets/images/market/bondAssets.png';
import useSWR from 'swr';
import { nftTotalSupplyFetcher } from 'src/clients/BalancesFetcher';
import Skeleton from 'react-loading-skeleton';

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
  onClickLink: string | undefined;
}

const tempCardArray: ICardType[] = [
  // {
  //   PFType: PFType.BOND,
  //   Location: '2046 Norwalk Ave, LA, CA 90041',
  //   APY: 12,
  //   currentSoldNFTs: 0,
  //   totalNFTs: 54000,
  //   cardImage: BondAsset,
  //   onClickLink: 'a1',
  // },
  {
    PFType: PFType.SHARE,
    Location: '',
    APY: 0,
    currentSoldNFTs: 0,
    totalNFTs: 0,
    cardImage: undefined,
    onClickLink: undefined,
  },
  {
    PFType: PFType.SHARE,
    Location: '',
    APY: 0,
    currentSoldNFTs: 0,
    totalNFTs: 0,
    cardImage: undefined,
    onClickLink: undefined,
  },
];

const Market = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { value: mediaQuery } = useMediaQueryType();
  const [tempCards, setTempCards] = useState<ICardType[] | undefined>();
  const { t } = useTranslation();

  const { data: nftTotalSupply } = useSWR(['nftTotalSupply'], {
    fetcher: nftTotalSupplyFetcher(),
  });

  useEffect(() => {
    if (nftTotalSupply === undefined) return;
    const nft = {
      PFType: PFType.BOND,
      Location: '2046 Norwalk Ave, LA, CA 90041',
      APY: 12,
      currentSoldNFTs: nftTotalSupply,
      totalNFTs: 54000,
      cardImage: BondAsset,
      onClickLink: 'bondnft/0',
    };
    setTempCards([nft, ...tempCardArray]);
  }, [nftTotalSupply]);

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
          <h2>{t('market.useRealEstateInfo')}</h2>
          <article className="market__nft-container">
            {/* {tempCardArray.map((data, index) => {
              return <NFTCard data={data} key={index} />;
            })} */}
            {tempCards
              ? tempCards.map((data, index) => {
                  return <NFTCard data={data} key={index} />;
                })
              : Array(3)
                  .fill(0)
                  .map(() => {
                    return <Skeleton width={345} height={300} />;
                  })}
          </article>
        </article>
      </main>
    </>
  );
};

export default Market;
