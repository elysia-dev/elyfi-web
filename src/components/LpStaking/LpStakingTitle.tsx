import { useTranslation } from 'react-i18next';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import Token from 'src/enums/Token';

type Props = {
  firstToken: string;
  secondToken: string;
};

function LpStakingTitle(props: Props) {
  const { firstToken, secondToken } = props;
  const { t } = useTranslation();
  const secondImg = secondToken === Token.ETH ? eth : dai;
  return (
    <div>
      <div
        style={{
          width: 584,
          display: 'flex',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <img
          src={elfi}
          alt={elfi}
          style={{
            width: 42,
            height: 42,
          }}
        />
        <img
          src={secondImg}
          alt={secondImg}
          style={{
            width: 42,
            height: 42,
            marginLeft: -7,
            marginRight: 6,
          }}
        />
        <div
          className="spoqa__bold"
          style={{
            fontSize: 20,
          }}>
          {t('lpstaking.lp_token_staking_title', { firstToken, secondToken })}
        </div>
      </div>
    </div>
  );
}

export default LpStakingTitle;
