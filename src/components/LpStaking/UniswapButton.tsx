import { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import elfi from 'src/assets/images/ELFI.png';
import dai from 'src/assets/images/dai.png';
import eth from 'src/assets/images/eth-color.png';
import Token from 'src/enums/Token';

type Props = {
  linkLocation: string;
  token0: string;
  token1: string;
};

function UniswapButton(props: Props): ReactElement {
  const { token0, token1 } = props;
  const { t } = useTranslation();

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={
        token1 === 'eth'
          ? `https://app.uniswap.org/#/add/0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/3000`
          : 'https://app.uniswap.org/#/add/0x4da34f8264cb33a5c9f17081b9ef5ff6091116f4/0x6B175474E89094C44Da98b954EedeAC495271d0F/3000'
      }
      style={{
        cursor: 'pointer',
      }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: 10,
          border: '1px solid black',
        }}>
        <img
          src={elfi}
          alt="elyfi"
          style={{
            width: 40,
            height: 40,
          }}
        />
        <img
          // className="market_img_mobile"
          src={token1 === Token.ETH ? eth : dai}
          alt="ethOrDai"
          style={{
            width: 40,
            height: 40,
            marginLeft: -15,
          }}
        />
        <p
          className="spoqa__bold"
          style={{
            cursor: 'pointer',
          }}>
          {t('reward.receive_lp_token', { token0, token1 })}
          {' >'}
        </p>
      </div>
    </a>
  );
}

export default UniswapButton;
