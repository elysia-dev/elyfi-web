import { useWeb3React } from '@web3-react/core';
import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Token from 'src/enums/Token';
import { formatDecimalFracionDigit, toCompact } from 'src/utiles/formatters';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import { utils } from 'ethers';
import StakedTokenProps from 'src/core/types/StakedTokenProps';
import Skeleton from 'react-loading-skeleton';
import CountUp from 'react-countup';
import { isEthElfiPoolAddress } from 'src/core/utils/getAddressesByPool';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import Guide from 'src/components/Guide';
import SelectWalletModal from 'src/components/Modal/SelectWalletModal';
import StakedLpItem from './StakedLpItem';

const StakedLp: FunctionComponent<StakedTokenProps> = (props) => {
  const {
    stakedPositions,
    setUnstakeTokenId,
    ethElfiStakedLiquidity,
    daiElfiStakedLiquidity,
    expectedReward,
    totalExpectedReward,
    isError,
    round,
    isLoading,
  } = props;
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
  const [selectWalletModalVisible, setSelectWalletModalVisible] =
    useState(false);

  return (
    <>
      <SelectWalletModal
        modalClose={() => {
          setSelectWalletModalVisible(false);
        }}
        selectWalletModalVisible={selectWalletModalVisible}
      />
      <div className="staking__lp__reward__header">
        <h2>{t('lpstaking.staked_lp_token')}</h2>
        <Guide content={t('guide.staked_lp_token')} />
      </div>
      <div
        className="staking__lp__staked__table"
        style={{
          paddingBottom: account && stakedPositions.length !== 0 ? 0 : 35,
          borderRadius: account ? '10px 10px 0px 0px' : 10,
        }}>
        {isError ? (
          <div>
            <div
              className="spoqa__bold"
              style={{
                textAlign: 'center',
                fontSize: 20,
                color: '#646464',
                paddingTop: 20,
                paddingBottom: 20,
              }}>
              {'Server error'}
            </div>
          </div>
        ) : account ? (
          <>
            <div className="staking__lp__staked__table__header">
              <div className="staking__lp__staked__table__header__container--left">
                <div>
                  <p>ID</p>
                </div>
                <div>
                  <p>{t('lpstaking.staked_lp_token_type')}</p>
                </div>
                <div>
                  <p>{t('lpstaking.liquidity')}</p>
                </div>
                <div />
              </div>
              <div className="staking__lp__staked__table__header__container--center" />
              <div className="staking__lp__staked__table__header__container--right">
                {t('lpstaking.expected_reward')}
              </div>
            </div>
            {!isLoading
              ? stakedPositions.map((position, idx) => {
                  return (
                    <StakedLpItem
                      key={idx}
                      position={position}
                      setUnstakeTokenId={setUnstakeTokenId}
                      expectedReward={expectedReward[idx]}
                      positionInfo={() => {
                        const isEthPoolAddress = isEthElfiPoolAddress(position);
                        return {
                          rewardToken: isEthPoolAddress
                            ? expectedReward[idx]?.ethReward
                            : expectedReward[idx]?.daiReward,
                          beforeRewardToken: isEthPoolAddress
                            ? expectedReward[idx]?.beforeEthReward
                            : expectedReward[idx]?.beforeDaiReward,
                          tokenImg: isEthPoolAddress ? eth : dai,
                          rewardTokenType: isEthPoolAddress
                            ? Token.ETH
                            : Token.DAI,
                          pricePerLiquidity: isEthPoolAddress
                            ? pricePerEthLiquidity
                            : pricePerDaiLiquidity,
                          lpTokenType: isEthPoolAddress
                            ? 'ELFI-ETH LP'
                            : 'ELFI-DAI LP',
                        };
                      }}
                      round={round}
                    />
                  );
                })
              : !(stakedPositions.length === 0) && (
                  <Skeleton width={'100%'} height={200} />
                )}
          </>
        ) : (
          <div className="staking__lp__reward__button__wrapper">
            <div
              className="staking__lp__reward__button"
              onClick={() => setSelectWalletModalVisible(true)}>
              <p>{t('dashboard.wallet_connect_content')}</p>
            </div>
          </div>
        )}
      </div>
      {account ? (
        stakedPositions.length > 0 || (!account && !isError) ? (
          <section className="staking__lp__staked__reward">
            <div className="staking__lp__staked__reward__total-liquidity">
              <h2>{t('lpstaking.staked_total_liquidity')}</h2>
              <h2 className="amount">
                {toCompact(
                  parseFloat(utils.formatEther(ethElfiStakedLiquidity)) *
                    pricePerEthLiquidity +
                    parseFloat(utils.formatEther(daiElfiStakedLiquidity)) *
                      pricePerDaiLiquidity,
                )}
              </h2>
            </div>
            <div className="staking__lp__staked__reward__amount">
              <h2>{t('lpstaking.staked_total_expected_reward')}</h2>
              <div>
                <div>
                  <CountUp
                    className="bold"
                    end={totalExpectedReward.totalElfi}
                    formattingFn={(number) => {
                      return formatDecimalFracionDigit(number, 2);
                    }}
                    duration={1}
                    decimals={4}
                  />
                  <h2 className="staking__lp__staked__reward__amount__unit">
                    {Token.ELFI}
                  </h2>
                </div>
                <div>
                  <CountUp
                    className="bold"
                    end={totalExpectedReward.totalEth}
                    formattingFn={(number) => {
                      return formatDecimalFracionDigit(number, 2);
                    }}
                    duration={1}
                    decimals={4}
                  />
                  <h2 className="staking__lp__staked__reward__amount__unit">
                    {Token.ETH}
                  </h2>
                </div>
                <div>
                  <CountUp
                    className="bold"
                    end={totalExpectedReward.totalDai}
                    formattingFn={(number) => {
                      return formatDecimalFracionDigit(number, 2);
                    }}
                    duration={1}
                    decimals={4}
                  />
                  <h2 className="staking__lp__staked__reward__amount__unit">
                    {Token.DAI}
                  </h2>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="staking__lp__staked__reward">
            <div className="staking__lp__staked__reward__total-liquidity">
              <h2>{t('lpstaking.staked_total_liquidity')}</h2>
              <h2 className="amount">-</h2>
            </div>
            <div className="staking__lp__staked__reward__amount">
              <h2>{t('lpstaking.staked_total_expected_reward')}</h2>
              <div>
                <div>
                  <span>-</span>
                  <h2 className="staking__lp__staked__reward__amount__unit">
                    {Token.ELFI}
                  </h2>
                </div>
                <div>
                  <span>-</span>
                  <h2 className="staking__lp__staked__reward__amount__unit">
                    {Token.ETH}
                  </h2>
                </div>
                <div>
                  <span>-</span>
                  <h2 className="staking__lp__staked__reward__amount__unit">
                    {Token.DAI}
                  </h2>
                </div>
              </div>
            </div>
          </section>
        )
      ) : (
        <></>
      )}
    </>
  );
};

export default StakedLp;
