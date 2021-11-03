import {
  useEffect,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { useWeb3React } from '@web3-react/core';
import { BigNumber, ethers, utils } from 'ethers';
import stakerABI from 'src/core/abi/StakerABI.json';
import Position from 'src/core/types/Position';
import envs from 'src/core/envs';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import useExpectedReward from 'src/hooks/useExpectedReward';
import { formatSixFracionDigit, toCompact } from 'src/utiles/formatters';
import calcCurrencyValueFromLiquidity from 'src/utiles/calcCurrencyValueFromLiquidity';
import PriceContext from 'src/contexts/PriceContext';
import Token from 'src/enums/Token';
import LpButton from './LpButton';

type Props = {
  position: Position;
};

function StakedLpItem(props: Props) {
  const { position } = props;
  const { account, library } = useWeb3React();
  const { daiPrice, elfiPrice, ethPrice } = useContext(PriceContext);
  const { expectedReward, getExpectedReward } = useExpectedReward();
  const [reward, setReward] = useState<{
    elfiReward: string;
    ethOrDaiReward: string;
  }>({
    elfiReward: '0',
    ethOrDaiReward: '0',
  });
  const isEthToken =
    position.incentivePotisions[0].incentive.pool.toLowerCase() ===
    envs.ethElfiPoolAddress.toLowerCase();
  const poolAddress = isEthToken
    ? envs.ethElfiPoolAddress
    : envs.daiElfiPoolAddress;
  const rewardTokenAddress = isEthToken ? envs.wEth : envs.daiAddress;
  const tokenImg = isEthToken ? eth : dai;
  const rewardToken = isEthToken ? Token.ETH : Token.DAI;

  const unstakingHandler = async (position: {
    id: string;
    liquidity: BigNumber;
    owner: string;
    staked: boolean;
    tokenId: number;
  }) => {
    const staker = new ethers.Contract(
      envs.stakerAddress,
      stakerABI,
      library.getSigner(),
    );

    const iFace = new ethers.utils.Interface(stakerABI);
    const callOne = iFace.encodeFunctionData('unstakeToken', [
      [
        envs.governanceAddress, // 두 번 이더 / 다이
        poolAddress,
        1635751200,
        1638005456,
        account,
      ],
      position.tokenId,
    ]);
    const callTwo = iFace.encodeFunctionData('unstakeToken', [
      [
        rewardTokenAddress, // 두 번 이더 / 다이
        poolAddress,
        1635751200,
        1638005456,
        account,
      ],
      position.tokenId,
    ]);
    const callThree = iFace.encodeFunctionData('withdrawToken', [
      position.tokenId,
      account,
      '0x',
    ]);
    const res = await staker.multicall([callOne, callTwo, callThree]);
  };

  useEffect(() => {
    getExpectedReward(rewardTokenAddress, poolAddress, position.tokenId);
    const interval = setInterval(() => {
      getExpectedReward(rewardTokenAddress, poolAddress, position.tokenId);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="staked_lp_item staked_lp_item_mobile ">
      <div>
        <div className="spoqa__bold">
          <div className="staked_lp_item_content_mobile">ID</div>
          <div>{position.tokenId}</div>
        </div>
        <div className="spoqa__bold">
          <div className="staked_lp_item_content_mobile">LP Type</div>
          <div>{isEthToken ? 'ELFI-ETH LP' : 'ELFI-DAI LP'}</div>
        </div>
        <div className="spoqa__bold">
          <div className="staked_lp_item_content_mobile">유동성</div>
          <div>
            ${' '}
            {formatSixFracionDigit(
              calcCurrencyValueFromLiquidity(
                elfiPrice,
                isEthToken ? ethPrice : daiPrice,
                position.liquidity,
              ),
            )}
          </div>
        </div>
        <div>
          <LpButton
            onHandler={() => unstakingHandler(position)}
            btnTitle={'언스테이킹'}
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
            {`${formatSixFracionDigit(
              parseFloat(expectedReward.ethOrDaiReward),
            )} `}
            <div className="staked_lp_item_tokenType">{rewardToken}</div>
          </div>
        </div>
        <div className="spoqa__bold">
          <div>
            <img src={elfi} />
            {Token.ELFI}
          </div>
          <div className="staked_lp_item_reward">
            {`${formatSixFracionDigit(parseFloat(expectedReward.elfiReward))} `}
            <div className="staked_lp_item_tokenType">{Token.ELFI}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StakedLpItem;
