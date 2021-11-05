import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, ethers, utils } from 'ethers';
import { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import calcCurrencyValueFromLiquidity from 'src/utiles/calcCurrencyValueFromLiquidity';
import PriceContext from 'src/contexts/PriceContext';
import Token from 'src/enums/Token';
import useExpectedReward from 'src/hooks/useExpectedReward';
import Position from 'src/core/types/Position';
import { formatDecimalFracionDigit, toCompact } from 'src/utiles/formatters';
import RecentActivityType from 'src/enums/RecentActivityType';
import TxContext from 'src/contexts/TxContext';
import Guide from '../Guide';
import StakedLpItem from './StakedLpItem';

type Props = {
  positions: Position[];
};
function StakedLp(props: Props) {
  const { positions } = props;
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const { totalExpectedReward, addTotalExpectedReward } = useExpectedReward();
  const { txType } = useContext(TxContext);
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (count === 1 && positions) {
      addTotalExpectedReward(positions);
      return;
    }
    let getTotalReward: NodeJS.Timeout;

    if (txType !== RecentActivityType.Withdraw && positions) {
      getTotalReward = setTimeout(() => {
        addTotalExpectedReward(positions);
        setCount((prev) => prev + 1);
      }, 5000);
    }
    return () => clearTimeout(getTotalReward);
  }, [positions, count]);

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 79,
        }}>
        <div className="spoqa__bold">
          {t('lpstaking.staked_lp_token')}
          <Guide content={t('guide.staked_lp_token')} />
        </div>
        <div className="header_line" />
      </div>
      <div
        style={{
          paddingLeft: 29,
          paddingRight: 30,
          paddingBottom: 32,
          paddingTop: 31,
          marginTop: 18,
          boxShadow: '0px 0px 6px #00000029',
          border: '1px solid #E6E6E6',
          borderRadius: 10,
        }}>
        {account ? (
          <>
            <div className="staked_lp_content">
              <div>
                <span>ID</span>
                <span>{t('lpstaking.staked_lp_token_type')}</span>
                <span>{t('lpstaking.liquidity')}</span>
                <div> </div>
              </div>
              <div className="staked_lp_content_pc">
                <div />
              </div>
              <span className="staked_lp_content_pc">
                {t('lpstaking.expected_reward')}
              </span>
            </div>
            {positions.map((position, idx) => {
              return <StakedLpItem key={idx} position={position} />;
            })}
          </>
        ) : (
          <div>
            <div
              className="spoqa__bold"
              style={{
                textAlign: 'center',
                fontSize: 25,
                color: '#646464',
                paddingTop: 20,
                paddingBottom: 20,
              }}>
              {t('dashboard.wallet_connect_content')}
            </div>
          </div>
        )}
        {positions.length > 0 ? (
          <div className="spoqa__bold total_expected_reward">
            <div>{t('lpstaking.staked_total_liquidity')}</div>
            <div className="total_expected_reward_amount">
              $ {toCompact(totalExpectedReward.totalliquidity)}
            </div>
            <div />
            <div>{t('lpstaking.staked_total_expected_reward')}</div>
            <div className="total_expected_reward_amount">
              {formatDecimalFracionDigit(
                totalExpectedReward.totalElfiReward,
                2,
              )}{' '}
              {Token.ELFI}
            </div>
            <div className="total_expected_reward_amount">
              {formatDecimalFracionDigit(totalExpectedReward.totalEthReward, 2)}{' '}
              {Token.ETH}
            </div>
            <div className="total_expected_reward_amount">
              {formatDecimalFracionDigit(totalExpectedReward.totalDaiReward, 2)}{' '}
              {Token.DAI}
            </div>
          </div>
        ) : (
          <div className="spoqa__bold total_expected_reward">
            <div>{t('lpstaking.staked_total_liquidity')}</div>
            <div>$ -</div>
            <div />
            <div>{t('lpstaking.staked_total_expected_reward')}</div>
            <div>- {Token.ELFI}</div>
            <div>- {Token.ETH}</div>
            <div>- {Token.DAI}</div>
          </div>
        )}
      </div>
    </>
  );
}

export default StakedLp;
