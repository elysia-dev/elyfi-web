import { BigNumber, constants } from 'ethers';
import { useState, useEffect } from 'react';
import { formatDecimalFracionDigit } from 'src/utiles/formatters';
import Position, { TokenInfo } from 'src/core/types/Position';
import Skeleton from 'react-loading-skeleton';
import Token from 'src/enums/Token';
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
  apr: string;
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
                apr={apr}
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
