import {
  Dispatch,
  FunctionComponent,
  lazy,
  SetStateAction,
  Suspense,
  useContext,
} from 'react';
import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import envs from 'src/core/envs';
import { reserveTokenData } from 'src/core/data/reserves';
import {
  formatCommaSmallFourDisits,
  toCompactForBignumber,
  toPercent,
} from 'src/utiles/formatters';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import { BigNumber } from 'ethers';
import Token from 'src/enums/Token';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import CountUp from 'react-countup';
import Skeleton from 'react-loading-skeleton';
import { IReserveSubgraphData } from 'src/core/types/reserveSubgraph';
import FallbackSkeleton from 'src/utiles/FallbackSkeleton';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

interface Props {
  reserve: IReserveSubgraphData;
  idx: number;
  moneyPoolInfo: {
    USDC: {
      startedMoneyPool: string;
      endedMoneyPool: string;
    };
    DAI: {
      startedMoneyPool: string;
      endedMoneyPool: string;
    };
    USDT: {
      startedMoneyPool: string;
      endedMoneyPool: string;
    };
    BUSD: {
      startedMoneyPool: string;
      endedMoneyPool: string;
    };
  };
  beforeMintedMoneypool: number;
  mintedMoneypool: number;
  depositRound: {
    daiRound: number;
    tetherRound: number;
  };
  setDepositRound: Dispatch<
    SetStateAction<{
      daiRound: number;
      tetherRound: number;
    }>
  >;
}

const TokenDeposit: FunctionComponent<Props> = ({
  reserve,
  moneyPoolInfo,
  beforeMintedMoneypool,
  mintedMoneypool,
}) => {
  const { t } = useTranslation();
  const token =
    reserve.id === envs.token.daiAddress
      ? Token.DAI
      : reserve.id === envs.token.usdtAddress
      ? Token.USDT
      : reserve.id === envs.token.usdcAddress
      ? Token.USDC
      : reserve.id === envs.token.usdcAddress
      ? Token.USDC
      : Token.BUSD;

  const { data: priceData, isValidating: loading } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );

  const { value: mediaQuery } = useMediaQueryType();

  return (
    <>
      <div className="reward__token-deposit">
        <div className="reward__token-deposit__header">
          <Suspense fallback={<FallbackSkeleton />}>
            {mediaQuery === MediaQuery.PC ? (
              <>
                <LazyImage
                  src={reserveTokenData[token].image}
                  name="Token image"
                />
                <div>
                  <div>
                    <p className="bold">
                      {t('dashboard.token_deposit', {
                        Token: reserveTokenData[token].name,
                      })}
                    </p>
                    <p>
                      {t('dashboard.token_deposit_content', {
                        Token: reserveTokenData[token].name,
                      })}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <LazyImage
                    src={reserveTokenData[token].image}
                    name="Token image"
                  />
                  <h2>
                    {t('dashboard.token_deposit', {
                      Token: reserveTokenData[token].name,
                    })}
                  </h2>
                </div>
                <p>
                  {t('dashboard.token_deposit_content', {
                    Token: reserveTokenData[token].name,
                  })}
                </p>
              </>
            )}
          </Suspense>
        </div>
        <div className="reward__token-deposit__apy">
          {mediaQuery === MediaQuery.PC ? (
            <>
              <div className="reward__token-deposit__apy--left">
                <div>
                  <p>{t('dashboard.deposit_apy')}</p>
                  <h2>{toPercent(reserve.depositAPY)}</h2>
                </div>
                <div>
                  <p>{t('dashboard.token_mining_apr')}</p>
                  {!loading && priceData ? (
                    <h2>
                      {toPercent(
                        calcMiningAPR(
                          priceData.elfiPrice,
                          BigNumber.from(reserve.totalDeposit || 0),
                          reserveTokenData[token].decimals,
                        ),
                      ) || 0}
                    </h2>
                  ) : (
                    <Skeleton width={100} height={40} />
                  )}
                </div>
              </div>
              <div className="reward__token-deposit__apy--right">
                <div>
                  <p>{t('dashboard.total_deposit')}</p>
                  <h2>
                    $&nbsp;
                    {toCompactForBignumber(
                      reserve.totalDeposit || 0,
                      reserveTokenData[token].decimals,
                    )}
                  </h2>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <p>{t('dashboard.deposit_apy')}</p>
                <h2>{toPercent(reserve.depositAPY)}</h2>
              </div>
              <div>
                <p>{t('dashboard.token_mining_apr')}</p>
                <h2>
                  {!loading && priceData ? (
                    <h2>
                      {toPercent(
                        calcMiningAPR(
                          priceData?.elfiPrice,
                          BigNumber.from(reserve.totalDeposit || 0),
                          reserveTokenData[token].decimals,
                        ),
                      ) || 0}
                    </h2>
                  ) : (
                    <Skeleton width={70} height={30} />
                  )}
                </h2>
              </div>
              <div>
                <p>{t('dashboard.total_deposit')}</p>
                <h2>
                  $&nbsp;
                  {toCompactForBignumber(
                    reserve.totalDeposit || 0,
                    reserveTokenData[token].decimals,
                  )}
                </h2>
              </div>
            </>
          )}
        </div>
        <div className="reward__token-deposit__data">
          <div className="component__data-info">
            <div>
              <p>{t('reward.mining_term')}</p>
              <p className="data">{`${moneyPoolInfo[token].startedMoneyPool} KST ~ `}</p>
            </div>
          </div>
          <div className="component__data-info">
            <div>
              <p>{t('reward.daily_mining')}</p>
              <p className="data">16,666.6667 ELFI</p>
            </div>
            <div>
              <p>{t('reward.accumulated_mining')}</p>
              <p>
                <CountUp
                  start={beforeMintedMoneypool}
                  end={mintedMoneypool <= 0 ? 0 : mintedMoneypool}
                  decimals={4}
                  duration={1}
                  formattingFn={(number) => formatCommaSmallFourDisits(number)}
                />
                {` ELFI`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenDeposit;
