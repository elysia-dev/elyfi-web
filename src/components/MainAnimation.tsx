import Pit from 'src/assets/images/main/pit.png';
import TokenLow from 'src/assets/images/main/token__low.png';
import TokenMany from 'src/assets/images/main/token__many.png';
import Bottom from 'src/assets/images/main/bottom.png';

import SlimPit from 'src/assets/images/main/slim-pit.png';
import Asset from 'src/assets/images/main/asset.png';
import Coin from 'src/assets/images/main/coin.png';

import Governance from 'src/assets/images/main/governance.png';
import Governance00 from 'src/assets/images/main/governance00.png';
import Governance01 from 'src/assets/images/main/governance01.png';

const MainAnimation = (index: number): (() => JSX.Element) => {
  function MainAnimation00() {
    return (
      <div className="main__content__image-container--01">
        <img src={TokenLow} className="token-low" />
        <div className="main__content__image-container--01--01">
          <img src={Pit} className="pit" />
          <img src={Bottom} className="bottom" />
        </div>
        <img src={TokenMany} className="token-many" />
      </div>
    );
  }
  function MainAnimation01() {
    return (
      <div className="main__content__image-container--02">
        <img src={Asset} className="asset-image" />
        <img src={Coin} className="coin" />
        <img src={SlimPit} className="pit" />
      </div>
    );
  }
  function MainAnimation02() {
    return (
      <div className="main__content__image-container--03">
        <div>
          <img src={Governance00} className="paper--o" />
          <img src={Governance01} className="paper--x" />
        </div>
        <img src={SlimPit} className="pit" />
        <img src={Governance} className="governance--image" />
      </div>
    );
  }

  return index === 0
    ? MainAnimation00
    : index === 1
    ? MainAnimation01
    : MainAnimation02;
};

export default MainAnimation;
