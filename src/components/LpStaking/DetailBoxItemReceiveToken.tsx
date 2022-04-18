import { FunctionComponent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { tokenTypes } from 'src/core/types/LpStakingTypeProps';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import Guide from '../Guide';

const DetailBoxItemReceiveToken: FunctionComponent<tokenTypes> = (props) => {
  const { token0, token1 } = props;
  const { t } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();

  return mediaQuery === MediaQuery.PC ? (
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
          className="staking__lp__detail-box__staking__button disable"
          rel="noopener noreferrer"
          href={undefined}>
          <p>{t('lpstaking.receive_lp_token')}</p>
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
  ) : (
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
      <a
        className="staking__lp__detail-box__staking__button disable"
        rel="noopener noreferrer"
        href={undefined}>
        <p>{t('lpstaking.receive_lp_token')}</p>
      </a>
    </>
  );
};

export default DetailBoxItemReceiveToken;
