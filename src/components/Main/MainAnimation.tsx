import Pit from 'src/assets/images/main/pit.svg';
import TokenLow from 'src/assets/images/main/token__low.svg';
import TokenMany from 'src/assets/images/main/token__many.svg';
import Bottom from 'src/assets/images/main/bottom.svg';

import SlimPit from 'src/assets/images/main/slim-pit.svg';
import Asset from 'src/assets/images/main/asset.svg';
import Coin from 'src/assets/images/main/coin.svg';

import Governance from 'src/assets/images/main/governance.svg';
import Governance00 from 'src/assets/images/main/governance00.svg';
import Governance01 from 'src/assets/images/main/governance01.svg';
import { lazy, Suspense } from 'react';
import FallbackSkeleton from 'src/utiles/FallbackSkeleton';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

const MainAnimation = (index: number): (() => JSX.Element) => {
  function MainAnimation00() {
    return (
      <Suspense fallback={<div style={{ height: 600 }} />}>
        <div className="main__content__image-container--01">
          <LazyImage src={TokenLow} name="token-low" />
          <div className="main__content__image-container--01--01">
            <LazyImage src={Pit} name="pit" />
            <LazyImage src={Bottom} name="bottom" />
          </div>
          <LazyImage src={TokenMany} name="token-many" />
        </div>
      </Suspense>
    );
  }
  function MainAnimation01() {
    return (
      <Suspense fallback={<div style={{ height: 600 }} />}>
        <div className="main__content__image-container--02">
          <LazyImage src={Asset} name="asset-image" />
          <LazyImage src={Coin} name="coin" />
          <LazyImage src={SlimPit} name="pit" />
        </div>
      </Suspense>
    );
  }
  function MainAnimation02() {
    return (
      <Suspense fallback={<div style={{ height: 600 }} />}>
        <div className="main__content__image-container--03">
          <div>
            <LazyImage src={Governance00} name="paper--o" />
            <LazyImage src={Governance01} name="paper--x" />
          </div>
          <LazyImage src={SlimPit} name="pit" />
          <LazyImage src={Governance} name="governance--image" />
        </div>
      </Suspense>
    );
  }

  return index === 0
    ? MainAnimation00
    : index === 1
    ? MainAnimation01
    : MainAnimation02;
};

export default MainAnimation;