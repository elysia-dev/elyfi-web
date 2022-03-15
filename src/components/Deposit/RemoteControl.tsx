
import { useContext } from 'react';
import scrollToOffeset from 'src/core/utils/scrollToOffeset';
import { useTranslation } from 'react-i18next';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import { toPercent } from 'src/utiles/formatters';
import PriceContext from 'src/contexts/PriceContext';
import { BalanceType } from 'src/hooks/useBalances';
import { IReserveSubgraphData } from 'src/contexts/SubgraphContext';
import { reserveTokenData } from 'src/core/data/reserves';
import { BigNumber } from 'ethers';


interface Props {
  supportedBalances: BalanceType[];
  data: {
    reserves: IReserveSubgraphData[];
  }
}

const RemoteControl: React.FC<Props> = ({
  supportedBalances,
  data
}) => {
  const { t } = useTranslation();
  const { elfiPrice } = useContext(PriceContext);
  
  return (
    <div className="deposit__remote-control">
      {supportedBalances.map((balance, index) => {
        const reserve = data.reserves.find(
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
                {toPercent(reserve.depositAPY)}
              </p>
              <div className="deposit__remote-control__mining">
                <p>{t('dashboard.token_mining_apr')}</p>
                <p>
                  {toPercent(
                    calcMiningAPR(
                      elfiPrice,
                      BigNumber.from(reserve.totalDeposit),
                      reserveTokenData[balance.tokenName].decimals,
                    ) || '0',
                  )}
                </p>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  )
}

export default RemoteControl;