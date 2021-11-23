import { FunctionComponent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import envs from 'src/core/envs';
import { tokenTypes } from 'src/core/types/LpStakingTypeProps';
import Guide from '../Guide';

const DetailBoxItemReceiveToken: FunctionComponent<tokenTypes> = (props) => {
  const { token0, token1 } = props;
  const { t } = useTranslation();

  return (
    <div className="lp_receive_token_wrapper">
      <div>
        <div className="spoqa__bold">
          {t('lpstaking.lp_token_staking_modal', {
            token0,
            token1,
          })}
          <Guide content={t('guide.create_liquidity')} />
        </div>
        <div>
          <a
            className="spoqa__medium"
            target="_blank"
            rel="noopener noreferrer"
            href={
              token1 === 'ETH'
                ? `https://app.uniswap.org/#/add/${envs.governanceAddress}/${envs.wEthAddress}`
                : `https://app.uniswap.org/#/add/${envs.governanceAddress}/${envs.daiAddress}`
            }>
            <button>{t('lpstaking.receive_lp_token')}</button>
          </a>
        </div>
      </div>
      <div className="spoqa i18n">
        <Trans
          i18nKey="lpstaking.receive_lp_token_content"
          values={{
            token0,
            token1,
          }}
        />
      </div>
    </div>
  );
};

export default DetailBoxItemReceiveToken;
