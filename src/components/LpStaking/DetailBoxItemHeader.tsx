import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { DetailBoxItemHeaderProps } from 'src/core/types/LpStakingTypeProps';
import Guide from '../Guide';

const DetailBoxItemHeader: FunctionComponent<DetailBoxItemHeaderProps> = (
  props,
) => {
  const { token1 } = props;
  const { t } = useTranslation();

  return (
    <>
      <div>
        <div>
          <p>APR</p>
          <Guide content={t('guide.apr')} />
        </div>
        <h2 className="percent">{'-'}</h2>
      </div>
      <div>
        <div>
          <p>{t('lpstaking.lp_token_total_liquidity')}</p>
          <Guide content={t('guide.total_liquidity', { token: token1 })} />
        </div>
        <h2 className="amount">{'-'}</h2>
      </div>
    </>
  );
};

export default DetailBoxItemHeader;
