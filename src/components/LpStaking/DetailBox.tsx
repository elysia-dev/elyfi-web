import { FunctionComponent } from 'react';
import { utils } from 'ethers';
import { formatDecimalFracionDigit } from 'src/utiles/formatters';
import Skeleton from 'react-loading-skeleton';
import lpStakingTime, { lpUnixTimestamp } from 'src/core/data/lpStakingTime';
import moment from 'moment';
import Token from 'src/enums/Token';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import { DetailBoxProps } from 'src/core/types/LpStakingTypeProps';
import DetailBoxItemReceiveToken from './DetailBoxItemReceiveToken';
import DetailBoxItemHeader from './DetailBoxItemHeader';
import DetailBoxItemStaking from './DetailBoxItemStaking';

const DetailBox: FunctionComponent<DetailBoxProps> = (props) => {
  const {
    tokens,
    totalLiquidity,
    totalStakedLiquidity,
    apr,
    isLoading,
    setModalAndSetStakeToken,
    round,
  } = props;
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();

  return (
    <>
      <div>
        {!isLoading ? (
          <>
            <div className="lp_token_description">
              <DetailBoxItemHeader
                totalLiquidity={formatDecimalFracionDigit(totalLiquidity, 2)}
                apr={apr}
              />
              <DetailBoxItemReceiveToken
                token0={tokens.token0}
                token1={tokens.token1}
              />
              <DetailBoxItemStaking
                tokens={tokens}
                totalStakedLiquidity={
                  formatDecimalFracionDigit(
                    (tokens.token1 === Token.ETH
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
              {moment
                .unix(lpUnixTimestamp[round - 1].startedAt)
                .format('YYYY-MM-DD HH:mm:ss')}{' '}
              -{' '}
              {moment
                .unix(lpUnixTimestamp[round - 1].endedAt)
                .format('YYYY-MM-DD HH:mm:ss')}
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
