import { useTranslation } from 'react-i18next';
import { Circle } from 'src/components/Circle';
import MainnetType from 'src/enums/MainnetType';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import Defi001 from 'src/assets/images/defi_001.png';
import { useContext, useState } from 'react';
import MainnetContext from 'src/contexts/MainnetContext';

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
  const { type: getMainnetType } = useContext(MainnetContext);
  const [hover, setHover] = useState(false);

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
        <div style={{ height: getMainnetType === MainnetType.BSC ? 274 : 235 }}>
          <div>
            <p>{t('dashboard.deposit_apy')}</p>
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
          <div>
            <p>{t('dashboard.total_loans')}</p>
            <p>{totalLoans}</p>
          </div>
        </div>

        <div
          style={{
            height: getMainnetType === MainnetType.BSC ? 'auto' : 235,
          }}>
          <div className="detail__data-wrapper__info__deposit__wrapper">
            <div
              style={{
                marginBottom: getMainnetType === MainnetType.BSC ? 15 : 30,
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
            {getMainnetType === MainnetType.BSC && (
              <div className="detail__data-wrapper__info__deposit__strategy">
                <div>
                  <p>{t('dashboard.real_estate_mortgage')}</p>
                  <p>30%</p>
                </div>
                <div>
                  <div>
                    <p>{t('dashboard.auto_invest_defi__title')}</p>
                    <div
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}>
                      <p>?</p>
                    </div>
                  </div>
                  <p>70%</p>
                </div>
                <div
                  className="detail__data-wrapper__info__deposit__strategy__defi-wrapper"
                  style={{ display: hover ? 'block' : 'none' }}>
                  <div>
                    <img src={Defi001} />
                    <p>{t('dashboard.auto_invest_defi.0')}</p>
                  </div>
                </div>
              </div>
            )}
            <div
              style={{
                marginBottom: getMainnetType === MainnetType.BSC ? 15 : 30,
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
            <div className="detail__data-wrapper__info__deposit__utilization">
              <h2>{t('dashboard.utilization')}</h2>
              <h2>{`${utilization}%`}</h2>
            </div>
          </div>
          <div className="detail__data-wrapper__info__circle-wrapper">
            <Circle
              progress={Math.round(100 - utilization)}
              color={color || '#050303'}
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
          <p>{t('dashboard.deposit_apy')}</p>
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
            <Circle
              progress={Math.round(100 - utilization)}
              color={color || '#333333'}
              subColor={subColor || '#888888'}
            />
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
            {getMainnetType === MainnetType.BSC && (
              <div className="detail__data-wrapper__info__deposit__strategy">
                <div>
                  <p>{t('dashboard.real_estate_mortgage')}</p>
                  <p>30%</p>
                </div>
                <div>
                  <div>
                    <p>{t('dashboard.auto_invest_defi__title')}</p>
                    <div
                      onMouseEnter={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}>
                      <p>?</p>
                    </div>
                  </div>
                  <p>70%</p>
                </div>
                <div
                  className="detail__data-wrapper__info__deposit__strategy__defi-wrapper"
                  style={{ display: hover ? 'block' : 'none' }}>
                  <div>
                    <img src={Defi001} />
                    <p>{t('dashboard.auto_invest_defi.0')}</p>
                  </div>
                </div>
              </div>
            )}
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
        <div className="detail__data-wrapper__info__deposit__utilization">
          <h2>{t('dashboard.utilization')}</h2>
          <h2>{`${utilization}%`}</h2>
        </div>
      </div>
    </div>
  );
};

export default MarketDetailsBody;
