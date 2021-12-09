import { FunctionComponent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import envs from 'src/core/envs';
import { tokenTypes } from 'src/core/types/LpStakingTypeProps';
import Guide from '../Guide';

const DetailBoxItemReceiveToken: FunctionComponent<tokenTypes> = (props) => {
  const { token0, token1 } = props;
  const { t } = useTranslation();

  return (
    <>
      <div className="staking__lp__detail-box__receive-token__header">
        <div>
          <p>
          {t('lpstaking.lp_token_staking_modal', {
            token0,
            token1,
          })}
          </p>
          <Guide content={t('guide.create_liquidity')} />
        </div>
        <a
          className="staking__lp__detail-box__receive-token__button"
          target="_blank"
          rel="noopener noreferrer"
          href={
            token1 === 'ETH'
              ? `https://app.uniswap.org/#/add/${envs.governanceAddress}/${envs.wEthAddress}`
              : `https://app.uniswap.org/#/add/${envs.governanceAddress}/${envs.daiAddress}`
          }>
          <p>
            {t('lpstaking.receive_lp_token')}
          </p>
        </a>
      </div>
      <div className="staking__lp__detail-box__receive-token__content">
        <p>
          <Trans
            i18nKey="lpstaking.receive_lp_token_content"
            values={{
              token0,
              token1,
            }}
          />
        </p>
        
      </div>
    </>
  );
};

export default DetailBoxItemReceiveToken;
