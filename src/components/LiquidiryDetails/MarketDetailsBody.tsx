import { useTranslation } from 'react-i18next';
import { Circle } from 'src/components/LiquidiryDetails/Circle';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';

const MarketDetailsBody: React.FunctionComponent<{
  depositReward: string;
  totalDeposit: string;
  depositAPY: string;
  miningAPRs: string;
  depositor: number;
  totalLoans: number;
  totalBorrowed: string;
  availableLiquidity: string;
  utilization: number;
  color?: string;
  subColor?: string;
}> = ({
  depositReward,
  totalDeposit,
  depositAPY,
  miningAPRs,
  depositor,
  totalLoans,
  totalBorrowed,
  availableLiquidity,
  utilization,
  color,
  subColor,
}) => {
  const { t } = useTranslation();
  const { value: mediaquery } = useMediaQueryType();

  return mediaquery === MediaQuery.PC ? (
    <div className="detail__data-wrapper">
      <div className="detail__data-wrapper__title">
        <h2>{t('dashboard.details')}</h2>
      </div>
      <div className="detail__data-wrapper__total">
        <div>
          <h2>{t('dashboard.total_deposit--reward')}</h2>
          <h2>{depositReward}</h2>
        </div>
        <div>
          <h2>{t('dashboard.total_deposit')}</h2>
          <h2>{totalDeposit}</h2>
        </div>
      </div>
      <div className="detail__data-wrapper__info">
        <div style={{ height: 235 }}>
          <div>
            <p>{t('dashboard.deposit--apy')}</p>
            <p>{depositAPY}</p>
          </div>
          <div>
            <p>{t('dashboard.token_mining_apr')}</p>
            <p>{miningAPRs}</p>
          </div>
          <div>
            <p>{t('dashboard.total_depositor')}</p>
            <p>{depositor}</p>
          </div>
          <div>
            <p>{t('dashboard.total_loans')}</p>
            <p>{totalLoans}</p>
          </div>
        </div>

        <div style={{ height: 235 }}>
          <div>
            <div className="detail__data-wrapper__info__deposit__wrapper">
              <div
                style={{
                  marginBottom: 30,
                }}>
                <div className="detail__data-wrapper__info__deposit">
                  <div
                    style={{
                      backgroundColor: color || '#333333',
                    }}
                  />
                  <p>{t('dashboard.total_borrowed')}</p>
                </div>
                <p>{totalBorrowed}</p>
              </div>
              <div
                style={{
                  marginBottom: 30,
                }}>
                <div className="detail__data-wrapper__info__deposit">
                  <div
                    style={{
                      backgroundColor: subColor || '#888888',
                    }}
                  />
                  <p>{t('dashboard.available_liquidity')}</p>
                </div>
                <p>{availableLiquidity}</p>
              </div>
            </div>

            <div className="detail__data-wrapper__info__deposit__utilization">
              <h2>{t('dashboard.utilization')}</h2>
              <h2>{`${utilization}%`}</h2>
            </div>
          </div>
          <div className="detail__data-wrapper__info__circle-wrapper">
            <Circle
              progress={Math.round(100 - utilization)}
              color={color || '#333333'}
              subColor={subColor || '#888888'}
            />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="detail__data-wrapper">
      <div className="detail__data-wrapper__title">
        <h2>{t('dashboard.details')}</h2>
      </div>
      <div className="detail__data-wrapper__total">
        <div>
          <h2>{t('dashboard.total_deposit--reward')}</h2>
          <h2>{depositReward}</h2>
        </div>
        <div>
          <p>{t('dashboard.deposit--apy')}</p>
          <p>{depositAPY}</p>
        </div>
        <div>
          <p>{t('dashboard.token_mining_apr')}</p>
          <p>{miningAPRs}</p>
        </div>
        <div>
          <p>{t('dashboard.total_depositor')}</p>
          <p>{depositor}</p>
        </div>
        <div>
          <p>{t('dashboard.total_loans')}</p>
          <p>{totalLoans}</p>
        </div>
      </div>

      <div className="detail__data-wrapper__info">
        <div className="detail__data-wrapper__info__deposit__wrapper">
          <div>
            <h2>{t('dashboard.total_deposit')}</h2>
            <h2>{totalDeposit}</h2>
          </div>
          <div className="detail__data-wrapper__info__circle-wrapper">
            <div className="detail__data-wrapper__info__circle--moblie">
              {utilization !== 0 && (
                <div
                  className="main-color"
                  style={{
                    backgroundColor: color || '#333',
                    flex: utilization,
                    borderRadius:
                      utilization !== 100 ? '15px 0px 0px 15px' : 15,
                  }}>
                  <p>{utilization}%</p>
                </div>
              )}
              {utilization !== 100 && (
                <div
                  className="sub-color"
                  style={{
                    backgroundColor: subColor || '#888',
                    flex: Math.round(100 - utilization),
                    borderRadius: utilization !== 0 ? '0px 15px 15px 0px' : 15,
                  }}>
                  <p>{Math.round(100 - utilization)}%</p>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="detail__data-wrapper__info__deposit">
              <div
                style={{
                  backgroundColor: color || '#333333',
                }}
              />
              <p>{t('dashboard.total_borrowed')}</p>
            </div>
            <p>{totalBorrowed}</p>
          </div>
          <div>
            <div className="detail__data-wrapper__info__deposit">
              <div
                style={{
                  backgroundColor: subColor || '#888888',
                }}
              />
              <p>{t('dashboard.available_liquidity')}</p>
            </div>
            <p>{availableLiquidity}</p>
          </div>
        </div>
        <div className="detail__data-wrapper__info__deposit__utilization">
          <h2>{t('dashboard.utilization')}</h2>
          <h2>{`${utilization}%`}</h2>
        </div>
      </div>
    </div>
  );
};

export default MarketDetailsBody;
