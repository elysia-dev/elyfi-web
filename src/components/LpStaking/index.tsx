import { BigNumber, constants } from 'ethers';
import { useState, useEffect } from 'react';
import { formatDecimalFracionDigit } from 'src/utiles/formatters';
import Position, { TokenInfo } from 'src/core/types/Position';
import Skeleton from 'react-loading-skeleton';
import Token from 'src/enums/Token';
import useLpApr from 'src/hooks/useLpApr';
import lpStakingTime from 'src/core/data/lpStakingTime';
import moment from 'moment';
import LpReceiveToken from './LpReceiveToken';
import LpStakingHeader from './LpStakingHeader';
import LpStakingModal from './LpStakingModal';
import LpStakeAndUnStake from './LpStakeAndUnStake';

type Props = {
  firstToken: string;
  secondToken: string;
  totalLiquidity: number;
  positions: Position[];
  totalStakedLiquidity: BigNumber;
  lpTokens: TokenInfo[];
  liquidityForApr: BigNumber;
  isLoading: boolean;
};
function LpStakingItem(props: Props) {
  const {
    firstToken,
    secondToken,
    totalLiquidity,
    positions,
    totalStakedLiquidity,
    lpTokens,
    liquidityForApr,
    isLoading,
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

        {!isLoading ? (
          <>
            <div className="lp_token_description">
              <LpStakingHeader
                TotalLiquidity={formatDecimalFracionDigit(totalLiquidity, 2)}
                secondToken={secondToken}
                liquidityForApr={liquidityForApr}
              />
              <LpReceiveToken
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
              {moment(lpStakingTime.startedAt).format('YYYY-MM-DD hh:mm:ss')} -{' '}
              {moment(lpStakingTime.endedAt).format('YYYY-MM-DD hh:mm:ss')}
            </div>
          </>
        ) : (
          <Skeleton width={'100%'} height={550} />
        )}
      </div>
    </>
  );
}

export default LpStakingItem;
