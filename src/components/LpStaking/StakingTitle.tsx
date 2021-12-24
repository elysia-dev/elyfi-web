import { useTranslation } from 'react-i18next';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import Token from 'src/enums/Token';
import { tokenTypes } from 'src/core/types/LpStakingTypeProps';

const StakingTitle: React.FunctionComponent<tokenTypes> = (props) => {
  const { token0, token1 } = props;
  const { t } = useTranslation();
  const secondImg = token1 === Token.ETH ? eth : dai;

  return (
    <div className="staking__lp__detail-box__header">
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
          {t('lpstaking.lp_token_staking_title', { token0, token1 })}
        </div>
      </div>
    </div>
  );
};

export default StakingTitle;
