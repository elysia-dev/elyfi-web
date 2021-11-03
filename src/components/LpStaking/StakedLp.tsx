import { useWeb3React } from '@web3-react/core';
import { BigNumber, constants, ethers, utils } from 'ethers';
import { useState, useEffect, useRef } from 'react';
import { IPosition } from 'src/clients/StakerSubgraph';
import stakerABI from 'src/core/abi/StakerABI.json';
import envs from 'src/core/envs';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import Token from 'src/enums/Token';
import useExpectedReward from 'src/hooks/useExpectedReward';
import Position from 'src/core/types/Position';
import { formatSixFracionDigit } from 'src/utiles/formatters';
import Guide from '../Guide';
import StakedLpItem from './StakedLpItem';

type Props = {
  positions: Position[];
};
function StakedLp(props: Props) {
  const { positions } = props;
  const { account } = useWeb3React();
  const { expectedReward, getExpectedReward } = useExpectedReward();
  const count = useRef(0);
  const [isWEth, setIsWEth] = useState(false);
  const [totalExpectedReward, setTotalExpectedReward] = useState<{
    totalElfiReward: number;
    totalEthReward: number;
    totalDaiReward: number;
  }>({
    totalElfiReward: 0,
    totalEthReward: 0,
    totalDaiReward: 0,
  });

  useEffect(() => {
    if (
      expectedReward.elfiReward === '0' &&
      expectedReward.ethOrDaiReward === '0'
    )
      return;
    setTotalExpectedReward({
      ...totalExpectedReward,
      totalElfiReward:
        totalExpectedReward.totalElfiReward +
        parseFloat(expectedReward.elfiReward),
      totalDaiReward: isWEth
        ? totalExpectedReward.totalDaiReward
        : totalExpectedReward.totalDaiReward +
          parseFloat(expectedReward.ethOrDaiReward),
      totalEthReward: isWEth
        ? totalExpectedReward.totalEthReward +
          parseFloat(expectedReward.ethOrDaiReward)
        : totalExpectedReward.totalEthReward,
    });
  }, [expectedReward]);

  useEffect(() => {
    if (positions.length === 0 || count.current === 1) return;
    count.current += 1;
    positions.forEach(async (position) => {
      const isEthToken =
        position.incentivePotisions[0].incentive.pool.toLowerCase() ===
        envs.ethElfiPoolAddress.toLowerCase();
      setIsWEth(isEthToken);
      const poolAddress = isEthToken
        ? envs.ethElfiPoolAddress
        : envs.daiElfiPoolAddress;
      const rewardTokenAddress = isEthToken ? envs.wEth : envs.daiAddress;
      await getExpectedReward(
        rewardTokenAddress,
        poolAddress,
        position.tokenId,
      );
    });
  }, [positions]);

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
          Staked LP
          <Guide />
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
                <span>LP Type</span>
                <span>유동성</span>
                <div> </div>
              </div>
              <div className="staked_lp_content_pc">
                <div />
              </div>
              <span className="staked_lp_content_pc">예상 보상</span>
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
              지갑을 연결해주세요.
            </div>
          </div>
        )}
        {positions.length > 0 ? (
          <div className="spoqa__bold total_expected_reward">
            <div>유동성 합계</div>
            <div className="total_expected_reward_amount">$ 500.15K</div>
            <div />
            <div>총 예상 보상</div>
            <div className="total_expected_reward_amount">
              {formatSixFracionDigit(totalExpectedReward.totalElfiReward)}{' '}
              {Token.ELFI}
            </div>
            <div className="total_expected_reward_amount">
              {formatSixFracionDigit(totalExpectedReward.totalEthReward)}{' '}
              {Token.ETH}
            </div>
            <div className="total_expected_reward_amount">
              {formatSixFracionDigit(totalExpectedReward.totalDaiReward)}{' '}
              {Token.DAI}
            </div>
          </div>
        ) : (
          <div className="spoqa__bold total_expected_reward">
            <div>유동성 합계</div>
            <div>$ -</div>
            <div />
            <div>총 예상 보상</div>
            <div>- ELFI</div>
            <div>- ETH</div>
            <div>- DAI</div>
          </div>
        )}
      </div>
    </>
  );
}

export default StakedLp;
