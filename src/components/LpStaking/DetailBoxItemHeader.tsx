import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Guide from '../Guide';

type Props = {
  TotalLiquidity: string;
  apr: string;
};

const DetailBoxItemHeader: FunctionComponent<Props> = (props) => {
  const { TotalLiquidity, apr } = props;
  const { t } = useTranslation();

  return (
    <>
      <div
        style={{
          padding: '19px 25px 17px 29px',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #E6E6E6',
            paddingBottom: 12.5,
          }}>
          <div
            className="spoqa__bold"
            style={{
              fontSize: 17,
            }}>
            APR
            <Guide content={t('guide.apr')} />
          </div>
          <div
            className="spoqa__bold"
            style={{
              fontSize: 20,
            }}>
            {apr}
            <div
              className="spoqa__bold"
              style={{
                color: '#646464',
                display: 'inline-block',
                marginLeft: 2,
              }}>
              %
            </div>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 17.5,
          }}>
          <div
            className="spoqa__bold"
            style={{
              fontSize: 17,
            }}>
            {t('lpstaking.lp_token_total_liquidity')}
            <Guide content={t('guide.total_liquidity')} />
          </div>
          <div
            className="spoqa__bold"
            style={{
              fontSize: 20,
            }}>
            <div
              className="spoqa__bold"
              style={{
                color: '#646464',
                display: 'inline-block',
                marginRight: 2,
              }}>
              $
            </div>
            {TotalLiquidity}
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailBoxItemHeader;
