import { useWeb3React } from '@web3-react/core';
import envs from 'src/core/envs';
import { useEffect, Dispatch, SetStateAction, FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Token from 'src/enums/Token';
import useExpectedReward from 'src/hooks/useExpectedReward';
import { formatDecimalFracionDigit, toCompact } from 'src/utiles/formatters';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import { utils } from 'ethers';
import StakedTokenProps from 'src/core/types/StakedTokenProps';
import Guide from '../Guide';
import StakedLpItem from './StakedLpItem';

type Props = StakedTokenProps;

const StakedLp: FunctionComponent<Props> = (props) => {
  const {
    stakedPositions,
    unstakeTokenId,
    setUnstakeTokenId,
    ethElfiStakedLiquidity,
    daiElfiStakedLiquidity,
    daiPoolTotalLiquidity,
    ethPoolTotalLiquidity,
  } = props;
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
  const { totalExpectedReward, addTotalExpectedReward } = useExpectedReward();

  useEffect(() => {
    if (stakedPositions.length === 0) return;
    addTotalExpectedReward(
      stakedPositions.filter((position) => position.tokenId !== unstakeTokenId),
    );
  }, [stakedPositions]);

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
            {stakedPositions.map((position, idx) => {
              return (
                <StakedLpItem
                  key={idx}
                  position={position}
                  totalLiquidity={
                    position.incentivePotisions[0].incentive.pool ===
                    envs.ethElfiPoolAddress
                      ? ethPoolTotalLiquidity
                      : daiPoolTotalLiquidity
                  }
                  setUnstakeTokenId={setUnstakeTokenId}
                  unstakeTokenId={unstakeTokenId}
                />
              );
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
        {stakedPositions.length > 0 ? (
          <div className="spoqa__bold total_expected_reward">
            <div>{t('lpstaking.staked_total_liquidity')}</div>
            <div className="total_expected_reward_amount">
              ${' '}
              {toCompact(
                parseFloat(utils.formatEther(ethElfiStakedLiquidity)) *
                  pricePerEthLiquidity +
                  parseFloat(utils.formatEther(daiElfiStakedLiquidity)) *
                    pricePerDaiLiquidity,
              )}
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
};

export default StakedLp;
