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
      t('reward.mining_term'),
      `${startMoneyPool[index]} ~ ${moneyPoolEndedAt.format('yyyy.MM.DD')} KST`,
    ],
    [t('reward.daily_mining'), '16,666.6667 ELFI'],
  ];

  return (
    <>
      <div className="jreward__dai-deposit jcontainer">
        <div className="jreward__title">
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 40,
              }}>
              <img
                src={tokenInfo?.image}
                width={40}
                height={40}
                style={{
                  marginRight: 10,
                }}
              />
              <p className="spoqa__bold">
                {t('reward.token_deposit', { Token: tokenInfo?.name })}
              </p>
            </div>
            <p className="spoqa">
              {t('reward.token_deposit_content', { Token: tokenInfo?.name })}
            </p>
          </div>
          {/* <a
            className="jreward__button"
            target="_blank"
            href={`${envs.appURI}/?reserveId=${reserve.id}`}>
            <p>{t('reward.deposit')}</p>
          </a> */}
        </div>
        <div className="jreward__apy-wrapper">
          <div className="jreward__apy-wrapper--left">
            <p className="spoqa__bold">{t('market.deposit_apy')}</p>
            <div>
              {
                <>
                  <p className="spoqa__bold">{toPercent(reserve.depositAPY)}</p>
                  <div>
                    <img src={ELFIIcon} alt="elysia" />
                    <p className="spoqa">
                      {toPercent(
                        calcMiningAPR(
                          latestPrice,
                          BigNumber.from(reserve.totalDeposit || 0),
                          tokenInfo?.decimals,
                        ),
                      ) || 0}
                    </p>
                  </div>
                </>
              }
            </div>
          </div>
          <div className="jreward__apy-wrapper--right">
            <p className="spoqa__bold">{t('market.total_deposit')}</p>
            <p className="spoqa__bold">
              $&nbsp;
              {toCompactForBignumber(
                reserve.totalDeposit || 0,
                tokenInfo?.decimals,
              )}
            </p>
          </div>
        </div>
        <div className="jreward__data-wrapper">
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
