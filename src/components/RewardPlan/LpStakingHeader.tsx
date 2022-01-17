import { toCompact } from 'src/utiles/formatters';
import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';
import eth from 'src/assets/images/eth-color.png';
import elfi from 'src/assets/images/ELFI.png';
import dai from 'src/assets/images/dai.png';

type Props = {
  token0: string;
  token1: string;
  tvl: number;
  apr: string;
};

const LpStakingHeader: FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();
  const { token0, token1 } = props;
  const token1Img = token1 === 'ETH' ? eth : dai;
  return (
    <>
      <div className="reward__token__lp__title">
        <img src={elfi} />
        <img className="last-token" src={token1Img} />
        <h2>{t('reward.lp_token_staking', { token0, token1 })}</h2>
      </div>
      <div className="reward__token__lp__content">
        <div className="reward__token__lp__content--left">
          <p>{t('reward.apr')}</p>
          <h2 className="percent">{props.apr}</h2>
        </div>
        <div className="reward__token__lp__content--right">
          <p>{t('reward.lp_token_total_liquidity')}</p>
          <h2 className="amount">{toCompact(props.tvl)}</h2>
        </div>
      </div>
    </>
  );
};

export default LpStakingHeader;
