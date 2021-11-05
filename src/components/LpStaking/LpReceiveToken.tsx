import { Trans, useTranslation } from 'react-i18next';
import envs from 'src/core/envs';
import Guide from '../Guide';
import LpButton from './LpButton';

type Props = {
  firstToken: string;
  secondToken: string;
};

function LpReceiveToken(props: Props) {
  const { firstToken, secondToken } = props;
  const { t } = useTranslation();

  return (
    <div className="lp_receive_token_wrapper">
      <div>
        <div className="spoqa__bold">
          {t('lpstaking.lp_token_staking_modal', {
            firstToken,
            secondToken,
          })}
          <Guide content={t('guide.create_liquidity')} />
        </div>
        <div>
          <a
            className="spoqa__medium"
            target="_blank"
            rel="noopener noreferrer"
            href={
              secondToken === 'DAI'
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
            firstToken,
            secondToken,
          }}
        />
      </div>
    </div>
  );
}

export default LpReceiveToken;
