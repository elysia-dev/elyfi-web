import {
  useEffect,
  useContext,
  useState,
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
import {
  formatDecimalFracionDigit,
  toCompact,
} from 'src/utiles/formatters';
import Token from 'src/enums/Token';
import { useTranslation } from 'react-i18next';
import TxContext from 'src/contexts/TxContext';
import useTxTracking from 'src/hooks/useTxTracking';
import RecentActivityType from 'src/enums/RecentActivityType';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import LpButton from './LpButton';

type Props = {
  position: Position;
};

function StakedLpItem(props: Props) {
  const { position } = props;
  const { account, library } = useWeb3React();
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
  const { expectedReward, getExpectedReward } = useExpectedReward();
  const { t } = useTranslation();
  const isEthToken =
    position.incentivePotisions[0].incentive.pool.toLowerCase() ===
    envs.ethElfiPoolAddress.toLowerCase();
  const poolAddress = isEthToken
    ? envs.ethElfiPoolAddress
    : envs.daiElfiPoolAddress;
  const rewardTokenAddress = isEthToken ? envs.wEth : envs.daiAddress;
  const tokenImg = isEthToken ? eth : dai;
  const rewardToken = isEthToken ? Token.ETH : Token.DAI;
  const { setTransaction } = useContext(TxContext);
  const initTxTracker = useTxTracking();
  const { txType } = useContext(TxContext);
  const [count, setCount] = useState(1);

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
    const tracker = initTxTracker('LpUnstaking', 'unstaking', ``);
    setTransaction(
      res,
      tracker,
      'Withdraw' as RecentActivityType,
      () => { },
      () => { },
    );
  };

  useEffect(() => {
    if (count === 1) {
      getExpectedReward(rewardTokenAddress, poolAddress, position.tokenId);
    }

    let getReward: NodeJS.Timeout;

    if (txType !== RecentActivityType.Withdraw) {
      getReward = setTimeout(() => {
        getExpectedReward(rewardTokenAddress, poolAddress, position.tokenId);
        setCount((prev) => prev + 1);
      }, 5000);
    }

    return () => clearTimeout(getReward);
  }, [count]);

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
          <div>{isEthToken ? 'ELFI-ETH LP' : 'ELFI-DAI LP'}</div>
        </div>
        <div className="spoqa__bold">
          <div className="staked_lp_item_content_mobile">
            {t('lpstaking.liquidity')}
          </div>
          <div>
            ${' '}
            {toCompact(
              (isEthToken ? pricePerEthLiquidity : pricePerDaiLiquidity) *
              parseFloat(utils.formatEther(position.liquidity)),
            )}
          </div>
        </div>
        <div>
          <LpButton
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
            {parseFloat(expectedReward.ethOrDaiReward) > 0.0001
              ? `${formatDecimalFracionDigit(
                parseFloat(expectedReward.ethOrDaiReward),
                4,
              )} `
              : '0.0000...'}
            <div className="staked_lp_item_tokenType">{rewardToken}</div>
          </div>
        </div>
        <div className="spoqa__bold">
          <div>
            <img src={elfi} />
            {Token.ELFI}
          </div>
          <div className="staked_lp_item_reward">
            {`${formatDecimalFracionDigit(
              parseFloat(expectedReward.elfiReward),
              4,
            )} `}
            <div className="staked_lp_item_tokenType">{Token.ELFI}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StakedLpItem;
