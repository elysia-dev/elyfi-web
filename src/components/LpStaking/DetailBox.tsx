import { FunctionComponent } from 'react';
import { BigNumber, utils } from 'ethers';
import { formatDecimalFracionDigit } from 'src/utiles/formatters';
import Skeleton from 'react-loading-skeleton';
import lpStakingTime from 'src/core/data/lpStakingTime';
import moment from 'moment';
import Token from 'src/enums/Token';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import DetailBoxItemReceiveToken from './DetailBoxItemReceiveToken';
import DetailBoxItemHeader from './DetailBoxItemHeader';
import DetailBoxItemStaking from './DetailBoxItemStaking';

type Props = {
  token0: string;
  token1: string;
  totalLiquidity: number;
  totalStakedLiquidity: BigNumber;
  apr: string;
  isLoading: boolean;
  setModalAndSetStakeToken: () => void;
};
const DetailBox: FunctionComponent<Props> = (props) => {
  const {
    token0,
    token1,
    totalLiquidity,
    totalStakedLiquidity,
    apr,
    isLoading,
    setModalAndSetStakeToken,
  } = props;
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();

  return (
    <>
      <div>
        {!isLoading ? (
          <>
            <div className="lp_token_description">
              <DetailBoxItemHeader
                TotalLiquidity={formatDecimalFracionDigit(totalLiquidity, 2)}
                apr={apr}
              />
              <DetailBoxItemReceiveToken token0={token0} token1={token1} />
              <DetailBoxItemStaking
                token0={token0}
                token1={token1}
                totalStakedLiquidity={
                  formatDecimalFracionDigit(
                    (token1 === Token.ETH
                      ? pricePerEthLiquidity
                      : pricePerDaiLiquidity) *
                      parseFloat(utils.formatEther(totalStakedLiquidity)),
                    2,
                  ) || '0'
                }
                setModalAndSetStakeToken={setModalAndSetStakeToken}
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
};

export default DetailBox;
