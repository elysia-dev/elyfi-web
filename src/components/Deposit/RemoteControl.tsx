import scrollToOffeset from 'src/core/utils/scrollToOffeset';
import { useTranslation } from 'react-i18next';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import { toPercent } from 'src/utiles/formatters';
import { BalanceType } from 'src/hooks/useBalances';
import { reserveTokenData } from 'src/core/data/reserves';
import { BigNumber } from 'ethers';
import Skeleton from 'react-loading-skeleton';
import { IReserveSubgraph } from 'src/core/types/reserveSubgraph';
import { PriceType } from 'src/clients/Coingecko';


interface Props {
  supportedBalances: BalanceType[];
  reserveState: IReserveSubgraph;
  priceData: PriceType | undefined
}

const RemoteControl: React.FC<Props> = ({
  supportedBalances,
  reserveState,
  priceData
}) => {
  const { t } = useTranslation();
  
  return (
    <div className="deposit__remote-control">
      {supportedBalances.map((balance, index) => {
        const reserve = reserveState.reserves.find(
          (d) => d.id === balance.id,
        );

        if (!reserve) return <></>;

        return (
          <a onClick={() => scrollToOffeset(`table-${index}`, 678)}>
            <div>
              <div className="deposit__remote-control__images">
                <img
                  src={reserveTokenData[balance.tokenName].image}
                />
              </div>
              <div className="deposit__remote-control__name">
                <p className="montserrat">{balance.tokenName}</p>
              </div>
              <p className="deposit__remote-control__apy bold">
                {reserve.depositAPY ? (
                  toPercent(reserve.depositAPY)
                ) : (
                  <Skeleton width={50} height={20} />
                )}
              </p>
              <div className="deposit__remote-control__mining">
                <p>{t('dashboard.token_mining_apr')}</p>
                {priceData && reserve.totalDeposit ? (
                  <p>
                    {toPercent(
                      calcMiningAPR(
                        priceData.elfiPrice,
                        BigNumber.from(reserve.totalDeposit || 0),
                        reserveTokenData[balance.tokenName].decimals,
                      ) || '0',
                    )}
                  </p>
                ) : (
                  <Skeleton width={50} height={13} />
                )}
              </div>
            </div>
          </a>
        );
      })}
    </div>
  )
}

export default RemoteControl;