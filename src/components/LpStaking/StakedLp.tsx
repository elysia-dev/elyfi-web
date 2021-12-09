import { useWeb3React } from '@web3-react/core';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import Token from 'src/enums/Token';
import { formatDecimalFracionDigit, toCompact } from 'src/utiles/formatters';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import { BigNumber, utils } from 'ethers';
import StakedTokenProps from 'src/core/types/StakedTokenProps';
import Skeleton from 'react-loading-skeleton';
import CountUp from 'react-countup';
import { isEthElfiPoolAddress } from 'src/core/utils/getAddressesByPool';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import Position from 'src/core/types/Position';
import Guide from '../Guide';
import StakedLpItem from './StakedLpItem';

const StakedLp: FunctionComponent<StakedTokenProps> = (props) => {
  const {
    stakedPositions,
    setUnstakeTokenId,
    ethElfiStakedLiquidity,
    daiElfiStakedLiquidity,
    expectedReward,
    totalExpectedReward,
  } = props;
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();

  const initialTestState: Position[] = [
    {
      id: "0x1f40",
      incentivePotisions: [
        {
          incentive: {
            pool: "0x8455b99b9e26a6fac1a6513b6912258932b5536b",
            rewardToken: "0x481cb45203a3c45ab54b3de8edac947b1309be7c"
          }
        }
      ],
      liquidity: BigNumber.from("2447255775056775169527927"),
      owner: "0x405bef2743379b356f2176c68ebe83de90811d01",
      staked: true,
      tokenId: 8000
    },
    {
      id: "0x1f40",
      incentivePotisions: [
        {
          incentive: {
            pool: "0x8455b99b9e26a6fac1a6513b6912258932b5536b",
            rewardToken: "0x481cb45203a3c45ab54b3de8edac947b1309be7c"
          }
        }
      ],
      liquidity: BigNumber.from("2447255775056775169527927"),
      owner: "0x405bef2743379b356f2176c68ebe83de90811d01",
      staked: true,
      tokenId: 8000
    }
  ]

  return (
    <>
      <div className="staking__lp__staked__header">
        <h2>
          {t('lpstaking.staked_lp_token')}
        </h2>
        <Guide content={t('guide.staked_lp_token')} />
      </div>
      <div className="staking__lp__staked__table">
        {account ? (
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
            {initialTestState.map((position, idx) => {
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
                />
              );
            })}
            
            {/* {expectedReward.length >= 1
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
                    />
                  );
                })
              : !(stakedPositions.length === 0) && (
                  <Skeleton width={'100%'} height={200} />
                )} */}
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
      </div>
    </>
  );
};

export default StakedLp;
