import { FunctionComponent, Dispatch, SetStateAction } from 'react';
import { BigNumber, utils } from 'ethers';
import CountUp from 'react-countup';
import elfi from 'src/assets/images/ELFI.png';
import { formatDecimalFracionDigit, toCompact } from 'src/utiles/formatters';
import Token from 'src/enums/Token';
import { useTranslation } from 'react-i18next';
import useLpWithdraw from 'src/hooks/useLpWithdraw';
import getAddressesByPool from 'src/core/utils/getAddressesByPool';
import { StakedLpItemProps } from 'src/core/types/LpStakingTypeProps';
import Button from './Button';

const StakedLpItem: FunctionComponent<StakedLpItemProps> = (props) => {
  const { position, setUnstakeTokenId, expectedReward, positionInfo } = props;
  const { t } = useTranslation();
  const { poolAddress, rewardTokenAddress } = getAddressesByPool(position);
  const {
    rewardToken,
    beforeRewardToken,
    tokenImg,
    rewardTokenType,
    pricePerLiquidity,
    lpTokenType,
  } = positionInfo();
  const stakedLiquidity =
    parseFloat(utils.formatEther(position.liquidity)) * pricePerLiquidity;
  const unstake = useLpWithdraw();
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

  return (
    <div className="staking__lp__staked__table__content">
      <div className="staking__lp__staked__table__content--left">
        <div>
          <h2>{position.tokenId}</h2>
        </div>
        <div>
          <h2>{lpTokenType}</h2>
        </div>
        <div>
          <h2>$ {toCompact(stakedLiquidity)}</h2>
        </div>
        <div>
          <div 
            onClick={() => unstakingHandler(position)}
            className="staking__lp__staked__table__content__button"
          >
            <p>
              {t('staking.unstaking')}
            </p>
          </div>
          <div 
            onClick={() => unstakingHandler(position)}
            className="staking__lp__staked__table__content__button"
          >
            <p>
              {t("staking.migration")}
            </p>
          </div>
        </div>
      </div>

      <div className="staking__lp__staked__table__content--center" >
        <div />
      </div>
      <div className="staking__lp__staked__table__content--right">
        <div>
          <div className="staking__lp__staked__table__content--right__image">
            <img src={tokenImg} />
            <h2>{rewardTokenType}</h2>
          </div>
          <div className="staking__lp__staked__table__content--right__reward">
            {rewardToken > 0.0001 ? (
              <CountUp
                className="staking__lp__staked__table__content--right__reward__amount"
                start={beforeRewardToken}
                end={rewardToken}
                formattingFn={(number) => {
                  return formatDecimalFracionDigit(number, 4);
                }}
                duration={1}
                decimals={4}
              />
            ) : (
              <h2 className="staking__lp__staked__table__content--right__reward__amount">0.0000...</h2>
            )}
            <h2 className="staking__lp__staked__table__content--right__reward__unit">&nbsp;{rewardTokenType}</h2>
          </div>
        </div>
        <div>
          <div className="staking__lp__staked__table__content--right__image">
            <img src={elfi} />
            <h2>{Token.ELFI}</h2>
          </div>
          <div className="staking__lp__staked__table__content--right__reward">
            {expectedReward?.elfiReward > 0.0001 ? (
              <CountUp
                className="staking__lp__staked__table__content--right__reward__amount"
                start={expectedReward?.beforeElfiReward}
                end={expectedReward?.elfiReward}
                formattingFn={(number) => {
                  return formatDecimalFracionDigit(number, 4);
                }}
                duration={1}
                decimals={4}
              />
            ) : (
              <h2 className="staking__lp__staked__table__content--right__reward__amount">0.0000...</h2>
            )}
            <h2 className="staking__lp__staked__table__content--right__reward__unit">&nbsp;{rewardTokenType}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakedLpItem;
