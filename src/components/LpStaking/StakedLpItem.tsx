import {
  useEffect,
  FunctionComponent,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react';
import { BigNumber, utils } from 'ethers';
import CountUp from 'react-countup';
import Position from 'src/core/types/Position';
import envs from 'src/core/envs';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import useExpectedReward from 'src/hooks/useExpectedReward';
import { formatDecimalFracionDigit, toCompact } from 'src/utiles/formatters';
import Token from 'src/enums/Token';
import { useTranslation } from 'react-i18next';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import useLpWithdraw from 'src/hooks/useLpWithdraw';
import calcLpExpectedReward from 'src/core/utils/calcLpExpectedReward';
import {
  DAIPerDayOnElfiDaiPool,
  ELFIPerDayOnLpStakingPool,
  ETHPerDayOnElfiEthPool,
} from 'src/core/data/stakings';
import TxContext from 'src/contexts/TxContext';
import RecentActivityType from 'src/enums/RecentActivityType';
import Button from './Button';

type Props = {
  position: Position;
  totalLiquidity: number;
  setUnstakeTokenId: Dispatch<SetStateAction<number>>;
  unstakeTokenId: number;
};

const StakedLpItem: FunctionComponent<Props> = (props) => {
  const { position, totalLiquidity, setUnstakeTokenId, unstakeTokenId } = props;
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
  const { txType, txWaiting } = useContext(TxContext);
  const { expectedReward, getExpectedReward } = useExpectedReward();
  const { t } = useTranslation();
  const isEthElfiPoolAddress =
    position.incentivePotisions[0].incentive.pool.toLowerCase() ===
    envs.ethElfiPoolAddress.toLowerCase();
  const poolAddress = isEthElfiPoolAddress
    ? envs.ethElfiPoolAddress
    : envs.daiElfiPoolAddress;
  const rewardTokenAddress = isEthElfiPoolAddress
    ? envs.wEthAddress
    : envs.daiAddress;
  const tokenImg = isEthElfiPoolAddress ? eth : dai;
  const rewardToken = isEthElfiPoolAddress ? Token.ETH : Token.DAI;
  const pricePerLiquidity = isEthElfiPoolAddress
    ? pricePerEthLiquidity
    : pricePerDaiLiquidity;
  const minedPerDay = isEthElfiPoolAddress
    ? ETHPerDayOnElfiEthPool
    : DAIPerDayOnElfiDaiPool;
  const stakedLiquidity =
    parseFloat(utils.formatEther(position.liquidity)) * pricePerLiquidity;
  const unstake = useLpWithdraw();
  const [expectedTokenReward, setExpectedTokenReward] = useState<{
    beforeRewardToken0: string;
    rewardToken0: string;
    beforeRewardToken1: string;
    rewardToken1: string;
  }>({
    beforeRewardToken0: '0',
    rewardToken0: '0',
    beforeRewardToken1: '0',
    rewardToken1: '0',
  });

  const unstakingHandler = async (position: {
    id: string;
    liquidity: BigNumber;
    owner: string;
    staked: boolean;
    tokenId: number;
  }) => {
    try {
      unstake(poolAddress, rewardTokenAddress, position.id);
      setUnstakeTokenId(position.tokenId);
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (
      txType === RecentActivityType.Withdraw &&
      !txWaiting &&
      unstakeTokenId !== position.tokenId
    ) {
      getExpectedReward(rewardTokenAddress, poolAddress, position.tokenId);
    }
  }, [txType, txWaiting, unstakeTokenId]);

  useEffect(() => {
    if (expectedTokenReward.rewardToken0 === '0') {
      getExpectedReward(rewardTokenAddress, poolAddress, position.tokenId);
    }
    const updateExpectedReward = setInterval(() => {
      setExpectedTokenReward({
        ...expectedTokenReward,
        beforeRewardToken0: expectedTokenReward.rewardToken0,
        rewardToken0: calcLpExpectedReward(
          Number(expectedTokenReward.beforeRewardToken0),
          stakedLiquidity,
          totalLiquidity,
          ELFIPerDayOnLpStakingPool,
        ),
        beforeRewardToken1: expectedTokenReward.rewardToken1,
        rewardToken1: calcLpExpectedReward(
          Number(expectedTokenReward.beforeRewardToken1),
          stakedLiquidity,
          totalLiquidity,
          minedPerDay,
        ),
      });
    }, 2000);
    return () => clearInterval(updateExpectedReward);
  }, [expectedTokenReward]);

  useEffect(() => {
    if (!expectedReward.rewardToken0) return;
    setExpectedTokenReward({
      ...expectedTokenReward,
      beforeRewardToken0: expectedReward.rewardToken0,
      rewardToken0: expectedReward.rewardToken0,
      beforeRewardToken1: expectedReward.rewardToken1,
      rewardToken1: expectedReward.rewardToken1,
    });
  }, [expectedReward]);

  return (
    <div className="staked_lp_item staked_lp_item_mobile ">
      <div>
        <div className="spoqa__bold">
          <div className="staked_lp_item_content_mobile">ID</div>
          <div>{position.tokenId}</div>
        </div>
        <div className="spoqa__bold">
          <div className="staked_lp_item_content_mobile">
            {t('lpstaking.staked_lp_token_type')}
          </div>
          <div>{isEthElfiPoolAddress ? 'ELFI-ETH LP' : 'ELFI-DAI LP'}</div>
        </div>
        <div className="spoqa__bold">
          <div className="staked_lp_item_content_mobile">
            {t('lpstaking.liquidity')}
          </div>
          <div>$ {toCompact(stakedLiquidity)}</div>
        </div>
        <div>
          <Button
            onHandler={() => unstakingHandler(position)}
            btnTitle={t('staking.unstaking')}
          />
        </div>
      </div>
      <div>
        <div />
      </div>
      <div>
        <div className="spoqa__bold">
          <div>
            <img src={tokenImg} />
            {rewardToken}
          </div>
          <div className="staked_lp_item_reward">
            {parseFloat(expectedTokenReward.rewardToken1) > 0.0001 ? (
              <CountUp
                className="spoqa__bold staked_lp_item_reward"
                start={Number(expectedTokenReward.beforeRewardToken1)}
                end={Number(expectedTokenReward.rewardToken1)}
                formattingFn={(number) => {
                  return formatDecimalFracionDigit(number, 4);
                }}
                duration={1}
                decimals={4}
              />
            ) : (
              '0.0000...'
            )}
            {` `}
            <div className="staked_lp_item_tokenType">{rewardToken}</div>
          </div>
        </div>
        <div className="spoqa__bold">
          <div>
            <img src={elfi} />
            {Token.ELFI}
          </div>
          <div className="staked_lp_item_reward">
            {parseFloat(expectedTokenReward.rewardToken0) > 0.0001 ? (
              <CountUp
                className="spoqa__bold staked_lp_item_reward"
                start={Number(expectedTokenReward.beforeRewardToken0)}
                end={Number(expectedTokenReward.rewardToken0)}
                formattingFn={(number) => {
                  return formatDecimalFracionDigit(number, 4);
                }}
                duration={1}
                decimals={4}
              />
            ) : (
              '0.0000...'
            )}
            {` `}
            <div className="staked_lp_item_tokenType">{Token.ELFI}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakedLpItem;
