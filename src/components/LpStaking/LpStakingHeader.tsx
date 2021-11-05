import { BigNumber } from 'ethers';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import Token from 'src/enums/Token';
import useLpApr from 'src/hooks/useLpApr';
import Guide from '../Guide';

type Props = {
  TotalLiquidity: string;
  secondToken: string;
  liquidityForApr: BigNumber;
};

function LpStakingHeader(props: Props) {
  const { TotalLiquidity, secondToken, liquidityForApr } = props;
  const { t } = useTranslation();
  const token =
    secondToken === Token.ETH ? Token.ELFI_ETH_LP : Token.ELFI_DAI_LP;
  const apr = useLpApr(token, liquidityForApr);

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
}

export default LpStakingHeader;
