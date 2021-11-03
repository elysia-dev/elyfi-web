import { ERC20__factory } from '@elysia-dev/contract-typechain';
import { BigNumber, constants, Contract, ethers, utils } from 'ethers';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { formatComma, formatCommaWithDigits } from 'src/utiles/formatters';
import positionABI from 'src/core/abi/NonfungiblePositionManager.json';
import { useWeb3React } from '@web3-react/core';
import StakingModal from 'src/containers/StakingModal';
import Position, { TokenInfo } from 'src/core/types/Position';
import Token from 'src/enums/Token';
import Header from '../Header';
import LpReceiveToken from './LpReceiveToken';
import LpReward from './LpReward';
import LpStakeAndUnStake from './LpStakeAndUnStake';
import LpStakingHeader from './LpStakingHeader';
import LpStakingTitle from './LpStakingTitle';
import LpStakingModal from './LpStakingModal';

type Props = {
  firstToken: string;
  secondToken: string;
  totalLiquidity: number;
  positions: Position[];
  totalStakedLiquidity: BigNumber;
  lpTokens: TokenInfo[];
};
function LpStakingItem(props: Props) {
  const {
    firstToken,
    secondToken,
    totalLiquidity,
    positions,
    totalStakedLiquidity,
    lpTokens,
  } = props;
  const [stakingModalVisible, setStakingModalVisible] = useState(false);

  return (
    <>
      <div>
        <LpStakingModal
          visible={stakingModalVisible}
          closeHandler={() => setStakingModalVisible(false)}
          stakedToken={Token.ELFI}
          stakedBalance={constants.Zero}
          round={1}
          afterTx={() => {}}
          endedModal={() => {}}
          setTxStatus={() => {}}
          setTxWaiting={() => {}}
          transactionModal={() => {}}
          firstToken={firstToken}
          secondToken={secondToken}
          positions={positions}
          lpTokens={lpTokens}
        />
        <div className="lp_token_description">
          <LpStakingHeader
            TotalLiquidity={formatComma(
              utils.parseEther(totalLiquidity.toString()),
            )}
            apr={200.0}
          />
          <LpReceiveToken
            stakedToken={`${firstToken}-${secondToken} LP 토큰`}
            firstToken={firstToken}
            secondToken={secondToken}
          />
          <LpStakeAndUnStake
            firstToken={firstToken}
            secondToken={secondToken}
            setStakingModalVisible={setStakingModalVisible}
            totalStakedLiquidity={totalStakedLiquidity}
          />
        </div>
        <div className="spoqa lp_token_date">
          2021-11-21 00:00:00 - 2021-11-24 00:00:00
        </div>
      </div>
    </>
  );
}

export default LpStakingItem;
