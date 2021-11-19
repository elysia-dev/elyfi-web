import { toCompact } from 'src/utiles/formatters';
import envs from 'src/core/envs';
import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';

type Props = {
  token0: string;
  token1: string;
  tvl: number;
  apr: string;
};

const LpStakingHeader: FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();
  const { token0, token1 } = props;
  return (
    <>
      <div className="jreward__title">
        <div>
          <p className="spoqa__bold">
            {t('reward.lp_token_staking', { token0, token1 })}
          </p>
          <p className="spoqa">
            {t('reward.lp_token_staking_description', {
              token0,
              token1,
            })}
          </p>
        </div>
        <a
          className="jreward__button"
          target="_blank"
          href={`${envs.appURI}/staking/LP`}>
          <p>{t('reward.staking')}</p>
        </a>
      </div>
      <div className="jreward__apy-wrapper">
        <div className="jreward__apy-wrapper--left">
          <p className="spoqa__bold">{t('reward.apr')}</p>
          <div>
            {
              <>
                <p className="spoqa__bold">{`${props.apr}%`}</p>
              </>
            }
          </div>
        </div>
        <div className="jreward__apy-wrapper--right">
          <p className="spoqa__bold">{t('reward.lp_token_total_liquidity')}</p>
          <p className="spoqa__bold">
            $&nbsp;
            {toCompact(props.tvl)}
          </p>
        </div>
      </div>
    </>
  );
};

export default LpStakingHeader;
