import { FunctionComponent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import ReserveData from 'src/core/data/reserves';
import ELFIIcon from 'src/assets/images/elfi--icon.png';
import { toCompactForBignumber, toPercent } from 'src/utiles/formatters';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import { BigNumber } from 'ethers';
import UniswapPoolContext from 'src/contexts/UniswapPoolContext';
import { moneyPoolEndedAt } from 'src/core/data/moneypoolTimes';
import RewardDetailInfo from './RewardDetailInfo';
import SmallProgressBar from './SmallProgressBar';

interface Props {
  index: number;
  reserve: GetAllReserves_reserves;
  startMoneyPool: string[];
  totalMiningValue: number[];
  beforeMintedMoneypool: number[];
  mintedMoneypool: number[];
}

const TokenDeposit: FunctionComponent<Props> = ({
  index,
  reserve,
  startMoneyPool,
  totalMiningValue,
  beforeMintedMoneypool,
  mintedMoneypool,
}) => {
  const { t } = useTranslation();
  const tokenInfo = ReserveData.find((datum) => datum.address === reserve.id);
  const { latestPrice } = useContext(UniswapPoolContext);
  const miningDescription = [
    [
      t('dashboard.mining_term'),
      `${startMoneyPool[index]} ~ ${moneyPoolEndedAt.format('yyyy.MM.DD')} KST`,
    ],
    [t('dashboard.daily_mining'), '16,666.6667 ELFI'],
  ];

  return (
    <>
      <div className="reward__token-deposit">
        <div className="reward__token-deposit__header">
          <img src={tokenInfo?.image} alt="Token image" />
          <div>
            <p className="bold">
              {t('dashboard.token_deposit', { Token: tokenInfo?.name })}
            </p>
            <p>
              {t('dashboard.token_deposit_content', { Token: tokenInfo?.name })}
            </p>
          </div>
        </div>
        <div className="reward__token-deposit__apy">
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
                    tokenInfo?.decimals,
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
                  tokenInfo?.decimals,
                )}
              </h2>
            </div>
          </div>
        </div>

        <div className="reward__token-deposit__data">
          <SmallProgressBar
            start={
              beforeMintedMoneypool[index] <= 0
                ? 0
                : beforeMintedMoneypool[index]
            }
            end={mintedMoneypool[index] <= 0 ? 0 : mintedMoneypool[index]}
            rewardOrMining={'mining'}
            totalMiningValue={totalMiningValue[index]
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            max={totalMiningValue[index]}
            unit={'ELFI'}
          />
          <RewardDetailInfo
            start={
              beforeMintedMoneypool[index] <= 0
                ? 0
                : beforeMintedMoneypool[index]
            }
            end={mintedMoneypool[index] <= 0 ? 0 : mintedMoneypool[index]}
            miningStart={
              beforeMintedMoneypool[index] <= 0
                ? 0
                : totalMiningValue[index] - beforeMintedMoneypool[index]
            }
            miningEnd={
              mintedMoneypool[index] <= 0
                ? totalMiningValue[index]
                : totalMiningValue[index] - mintedMoneypool[index]
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
