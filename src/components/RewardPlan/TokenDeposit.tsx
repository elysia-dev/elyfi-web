import { Dispatch, FunctionComponent, SetStateAction, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import envs from 'src/core/envs';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { reserveTokenData } from 'src/core/data/reserves';
import { toCompactForBignumber, toPercent } from 'src/utiles/formatters';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import { BigNumber } from 'ethers';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';
import {
  daiMoneyPoolTime,
  moneyPoolEndedAt,
} from 'src/core/data/moneypoolTimes';
import Token from 'src/enums/Token';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import SwiperCore, { Pagination } from 'swiper';
import moment from 'moment';
import ReservesContext from 'src/contexts/ReservesContext';
import RewardDetailInfo from './RewardDetailInfo';
import SmallProgressBar from './SmallProgressBar';

interface Props {
  reserve: GetAllReserves_reserves;
  idx: number;
  moneyPoolInfo: {
    DAI: {
      totalMiningValue: number;
      startMoneyPool: string;
    };
    USDT: {
      totalMiningValue: number;
      startMoneyPool: string;
    };
  };
  beforeMintedMoneypool: number[];
  mintedMoneypool: number[];
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
  idx,
  reserve,
  moneyPoolInfo,
  beforeMintedMoneypool,
  mintedMoneypool,
  depositRound,
  setDepositRound,
}) => {
  const { t } = useTranslation();
  const token = reserve.id === envs.daiAddress ? Token.DAI : Token.USDT;
  const { latestPrice } = useContext(UniswapPoolContext);
  const totalMiningValue = moneyPoolInfo[token].totalMiningValue;
  const { value: mediaQuery } = useMediaQueryType();
  const { reserves } = useContext(ReservesContext);
  const moneyPoolInfo2st = reserves[idx];
  SwiperCore.use([Pagination]);
  const miningDescription = [
    [
      t('reward.mining_term'),
      `${moneyPoolInfo[token].startMoneyPool} ~ ${moneyPoolEndedAt.format(
        'yyyy.MM.DD',
      )} KST`,
    ],
    [t('reward.daily_mining'), '16,666.6667 ELFI'],
  ];

  return (
    <>
      <div className="reward__token-deposit">
        <Swiper
          className="component__swiper"
          spaceBetween={100}
          loop={false}
          slidesPerView={1}
          pagination={{ clickable: true }}
          onSlideChange={(slides) => {
            setDepositRound({
              ...depositRound,
              daiRound:
                token === Token.DAI
                  ? slides.activeIndex
                  : depositRound.daiRound,
              tetherRound:
                token === Token.DAI
                  ? depositRound.tetherRound
                  : slides.activeIndex,
            });
          }}
          initialSlide={0}
          style={{
            height: mediaQuery === 'PC' ? '335px' : undefined,
          }}>
          {daiMoneyPoolTime.map((date, index) => {
            return (
              <SwiperSlide>
                <div className="reward__token-deposit__header">
                  {mediaQuery === MediaQuery.PC ? (
                    <>
                      <img
                        src={reserveTokenData[token].image}
                        alt="Token image"
                      />
                      <div>
                        <p className="bold">
                          {t('dashboard.token_deposit', {
                            Token: reserveTokenData[token].name,
                          })}
                          ({`${index + 1} 차`})
                        </p>
                        <p>
                          {t('dashboard.token_deposit_content', {
                            Token: reserveTokenData[token].name,
                          })}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <img
                          src={reserveTokenData[token].image}
                          alt="Token image"
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
                </div>
                <div className="reward__token-deposit__apy">
                  {mediaQuery === MediaQuery.PC ? (
                    <>
                      <div className="reward__token-deposit__apy--left">
                        <div>
                          <p>{t('dashboard.deposit_apy')}</p>
                          <h2>
                            {toPercent(
                              index === 0
                                ? reserve.depositAPY
                                : moneyPoolInfo2st.depositAPY,
                            )}
                          </h2>
                        </div>
                        <div>
                          <p>{t('dashboard.token_mining_apr')}</p>
                          <h2>
                            {toPercent(
                              calcMiningAPR(
                                latestPrice,
                                BigNumber.from(
                                  (index === 0
                                    ? reserve.totalDeposit
                                    : moneyPoolInfo2st.totalDeposit) || 0,
                                ),
                                reserveTokenData[token].decimals,
                              ),
                            ) || 0}
                          </h2>
                        </div>
                      </div>
                      <div className="reward__token-deposit__apy--right">
                        <div>
                          <p>{t('dashboard.total_deposit')}</p>
                          <h2>
                            $&nbsp;
                            {toCompactForBignumber(
                              (index === 0
                                ? reserve.totalDeposit
                                : moneyPoolInfo2st.totalDeposit) || 0,
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
                        <h2>
                          {toPercent(
                            index === 0
                              ? reserve.depositAPY
                              : moneyPoolInfo2st.depositAPY,
                          )}
                        </h2>
                      </div>
                      <div>
                        <p>{t('dashboard.token_mining_apr')}</p>
                        <h2>
                          {toPercent(
                            calcMiningAPR(
                              latestPrice,
                              BigNumber.from(
                                (index === 0
                                  ? reserve.totalDeposit
                                  : moneyPoolInfo2st.totalDeposit) || 0,
                              ),
                              reserveTokenData[token].decimals,
                            ),
                          ) || 0}
                        </h2>
                      </div>
                      <div>
                        <p>{t('dashboard.total_deposit')}</p>
                        <h2>
                          $&nbsp;
                          {toCompactForBignumber(
                            (index === 0
                              ? reserve.totalDeposit
                              : moneyPoolInfo2st.totalDeposit) || 0,
                            reserveTokenData[token].decimals,
                          )}
                        </h2>
                      </div>
                    </>
                  )}
                </div>

                <div className="reward__token-deposit__data">
                  {index === 0 ? (
                    <SmallProgressBar
                      start={beforeMintedMoneypool[index]}
                      end={
                        mintedMoneypool[index] <= 0 ? 0 : mintedMoneypool[index]
                      }
                      rewardOrMining={'mining'}
                      totalMiningValue={totalMiningValue
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      max={totalMiningValue}
                      unit={'ELFI'}
                    />
                  ) : (
                    <div className="component__data-info">
                      <div>
                        <p>{t('reward.mining_term')}</p>
                        <p className="data">{`${moment(date.startedAt).format(
                          'YYYY.MM.DD',
                        )} KST ~`}</p>
                      </div>
                    </div>
                  )}

                  <RewardDetailInfo
                    start={beforeMintedMoneypool[index]}
                    end={
                      mintedMoneypool[index] <= 0 ? 0 : mintedMoneypool[index]
                    }
                    miningStart={
                      beforeMintedMoneypool[index] <= 0
                        ? 0
                        : totalMiningValue - beforeMintedMoneypool[index]
                    }
                    miningEnd={
                      mintedMoneypool[index] <= 0
                        ? totalMiningValue
                        : totalMiningValue - mintedMoneypool[index]
                    }
                    miningDescription={miningDescription}
                    unit={'ELFI'}
                    depositRound={depositRound}
                    token={token}
                    index={index}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
};

export default TokenDeposit;
