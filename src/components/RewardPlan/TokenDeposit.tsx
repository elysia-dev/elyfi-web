import { FunctionComponent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import envs from 'src/core/envs';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { reserveTokenData } from 'src/core/data/reserves';
import { toCompactForBignumber, toPercent } from 'src/utiles/formatters';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import { BigNumber } from 'ethers';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';
import { moneyPoolEndedAt } from 'src/core/data/moneypoolTimes';
import Token from 'src/enums/Token';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import RewardDetailInfo from './RewardDetailInfo';
import SmallProgressBar from './SmallProgressBar';

interface Props {
  reserve: GetAllReserves_reserves;
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
  beforeMintedMoneypool: number;
  mintedMoneypool: number;
}

const TokenDeposit: FunctionComponent<Props> = ({
  reserve,
  moneyPoolInfo,
  beforeMintedMoneypool,
  mintedMoneypool,
}) => {
  const { t } = useTranslation();
  const token = reserve.id === envs.daiAddress ? Token.DAI : Token.USDT;
  const { latestPrice } = useContext(UniswapPoolContext);
  const totalMiningValue = moneyPoolInfo[token].totalMiningValue;
  const { value: mediaQuery } = useMediaQueryType();
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
        <div className="reward__token-deposit__header">
          {
            mediaQuery === MediaQuery.PC ? (
              <>
                <img src={reserveTokenData[token].image} alt="Token image" />
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
              </>
            ) : (
              <>
                <div>
                  <img src={reserveTokenData[token].image} alt="Token image" />
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
            )
          }
        </div>
        <div className="reward__token-deposit__apy">
          {
            mediaQuery === MediaQuery.PC ? (
              <>
                <div className="reward__token-deposit__apy--left">
                  <div>
                    <p>{t('dashboard.deposit_apy')}</p>
                    <h2>{toPercent(reserve.depositAPY)}</h2>
                  </div>
                  <div>
                    <p>{t('dashboard.token_mining_apr')}</p>
                    <h2>
                      {toPercent(
                        calcMiningAPR(
                          latestPrice,
                          BigNumber.from(reserve.totalDeposit || 0),
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
                    {toPercent(
                      calcMiningAPR(
                        latestPrice,
                        BigNumber.from(reserve.totalDeposit || 0),
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
                      reserve.totalDeposit || 0,
                      reserveTokenData[token].decimals,
                    )}
                  </h2>
                </div>
              </>
            )
          }
          
        </div>

        <div className="reward__token-deposit__data">
          <SmallProgressBar
            start={beforeMintedMoneypool}
            end={mintedMoneypool <= 0 ? 0 : mintedMoneypool}
            rewardOrMining={'mining'}
            totalMiningValue={totalMiningValue
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            max={totalMiningValue}
            unit={'ELFI'}
          />
          <RewardDetailInfo
            start={beforeMintedMoneypool}
            end={mintedMoneypool <= 0 ? 0 : mintedMoneypool}
            miningStart={
              beforeMintedMoneypool <= 0
                ? 0
                : totalMiningValue - beforeMintedMoneypool
            }
            miningEnd={
              mintedMoneypool <= 0
                ? totalMiningValue
                : totalMiningValue - mintedMoneypool
            }
            miningDescription={miningDescription}
            unit={'ELFI'}
          />
        </div>
      </div>
    </>
  );
};

export default TokenDeposit;
