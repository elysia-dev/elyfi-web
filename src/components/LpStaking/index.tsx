import { BigNumber } from 'ethers';
import { useState } from 'react';
import { formatDecimalFracionDigit } from 'src/utiles/formatters';
import Position, { TokenInfo } from 'src/core/types/Position';
import Skeleton from 'react-loading-skeleton';
import lpStakingTime from 'src/core/data/lpStakingTime';
import moment from 'moment';
import LpReceiveToken from './LpReceiveToken';
import LpStakingHeader from './LpStakingHeader';
import LpStakingModal from './LpStakingModal';
import LpStakeAndUnStake from './LpStakeAndUnStake';

type Props = {
  token0: string;
  token1: string;
  totalLiquidity: number;
  positions: Position[];
  totalStakedLiquidity: BigNumber;
  lpTokens: TokenInfo[];
  apr: string;
  isLoading: boolean;
};
function LpStakingItem(props: Props) {
  const {
    token0,
    token1,
    totalLiquidity,
    positions,
    totalStakedLiquidity,
    lpTokens,
    apr,
    isLoading,
  } = props;
  const [stakingModalVisible, setStakingModalVisible] = useState(false);

  return (
    <>
      <div>
        <LpStakingModal
          visible={stakingModalVisible}
          closeHandler={() => setStakingModalVisible(false)}
          token0={token0}
          token1={token1}
          positions={positions}
          lpTokens={lpTokens}
        />

        {!isLoading ? (
          <>
            <div className="lp_token_description">
              <LpStakingHeader
                TotalLiquidity={formatDecimalFracionDigit(totalLiquidity, 2)}
                token1={token1}
                apr={apr}
              />
              <LpReceiveToken token0={token0} token1={token1} />
              <LpStakeAndUnStake
                token0={token0}
                token1={token1}
                setStakingModalVisible={setStakingModalVisible}
                totalStakedLiquidity={totalStakedLiquidity}
              />
            </div>
            <div className="spoqa lp_token_date">
              {moment(lpStakingTime.startedAt).format('YYYY-MM-DD HH:mm:ss')} -{' '}
              {moment(lpStakingTime.endedAt).format('YYYY-MM-DD HH:mm:ss')}
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
