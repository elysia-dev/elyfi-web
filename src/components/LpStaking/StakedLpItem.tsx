import { FunctionComponent, Dispatch, SetStateAction } from 'react';
import { BigNumber, utils } from 'ethers';
import CountUp from 'react-countup';
import Position from 'src/core/types/Position';
import envs from 'src/core/envs';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import { formatDecimalFracionDigit, toCompact } from 'src/utiles/formatters';
import Token from 'src/enums/Token';
import { useTranslation } from 'react-i18next';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import useLpWithdraw from 'src/hooks/useLpWithdraw';
import { ExpectedRewardTypes } from 'src/core/types/RewardTypes';
import getAddressesByPool from 'src/core/utils/getAddressesByPool';
import Button from './Button';

type Props = {
  position: Position;
  setUnstakeTokenId: Dispatch<SetStateAction<number>>;
  expectedReward: ExpectedRewardTypes;
  positionInfo: () => {
    rewardToken: number;
    beforeRewardToken: number;
    tokenImg: string;
    rewardTokenType: Token.ETH | Token.DAI;
    pricePerLiquidity: number;
    lpTokenType: string;
  };
};

const StakedLpItem: FunctionComponent<Props> = (props) => {
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
          <div>{lpTokenType}</div>
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
            {rewardTokenType}
          </div>
          <div className="staked_lp_item_reward">
            {rewardToken > 0.0001 ? (
              <CountUp
                className="spoqa__bold staked_lp_item_reward"
                start={beforeRewardToken}
                end={rewardToken}
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
            <div className="staked_lp_item_tokenType">{rewardTokenType}</div>
          </div>
        </div>
        <div className="spoqa__bold">
          <div>
            <img src={elfi} />
            {Token.ELFI}
          </div>
          <div className="staked_lp_item_reward">
            {expectedReward?.elfiReward > 0.0001 ? (
              <CountUp
                className="spoqa__bold staked_lp_item_reward"
                start={expectedReward?.beforeElfiReward}
                end={expectedReward?.elfiReward}
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
