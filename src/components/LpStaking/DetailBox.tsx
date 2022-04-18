import { FunctionComponent } from 'react';
import { utils } from 'ethers';
import { formatDecimalFracionDigit } from 'src/utiles/formatters';
import { lpUnixTimestamp } from 'src/core/data/lpStakingTime';
import moment from 'moment';
import Token from 'src/enums/Token';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import { DetailBoxProps } from 'src/core/types/LpStakingTypeProps';
import { useWeb3React } from '@web3-react/core';
import DetailBoxItemReceiveToken from 'src/components/LpStaking/DetailBoxItemReceiveToken';
import DetailBoxItemHeader from 'src/components/LpStaking/DetailBoxItemHeader';
import DetailBoxItemStaking from 'src/components/LpStaking/DetailBoxItemStaking';
import { useTranslation } from 'react-i18next';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';

const DetailBox: FunctionComponent<DetailBoxProps> = (props) => {
  const { tokens, totalStakedLiquidity, isLoading, round } = props;
  const { token0, token1 } = tokens;
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const secondImg = tokens.token1 === Token.ETH ? eth : dai;

  return (
    <section className="staking__lp__detail-box__container">
      <div className="staking__lp__detail-box__header">
        <img src={elfi} alt="Token Icon" />
        <img src={secondImg} alt="Token Icon" className="second-token" />
        <h2>{t('lpstaking.lp_token_staking_title', { token0, token1 })}</h2>
      </div>
      <>
        <div className="staking__lp__detail-box__body">
          <section className="staking__lp__detail-box__item-header">
            <DetailBoxItemHeader token1={token1} />
          </section>
          <section className="staking__lp__detail-box__receive-token">
            <DetailBoxItemReceiveToken token0={token0} token1={token1} />
          </section>
          <section className="staking__lp__detail-box__staking">
            <DetailBoxItemStaking
              tokens={tokens}
              totalStakedLiquidity={
                account
                  ? formatDecimalFracionDigit(
                      (tokens.token1 === Token.ETH
                        ? pricePerEthLiquidity
                        : pricePerDaiLiquidity) *
                        parseFloat(utils.formatEther(totalStakedLiquidity)),
                      2,
                    ) || '0'
                  : '0'
              }
              isLoading={isLoading}
            />
          </section>
        </div>
        <p className="staking__lp__detail-box__time-data">
          {moment
            .unix(lpUnixTimestamp[round - 1].startedAt)
            .format('YYYY-MM-DD HH:mm:ss')}{' '}
          -{' '}
          {moment
            .unix(lpUnixTimestamp[round - 1].endedAt)
            .format('YYYY-MM-DD HH:mm:ss')}
        </p>
      </>
    </section>
  );
};

export default DetailBox;
