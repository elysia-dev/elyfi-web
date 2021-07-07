import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/assets/images/service-background.png';
import { BigNumber, constants, utils } from 'ethers';
import { useHistory } from 'react-router-dom';
import ReserveData from 'src/core/data/reserves';
import { toCompactForBignumber, toPercent } from 'src/utiles/formatters';
import { useWeb3React } from '@web3-react/core';
import { useContext } from 'react';
import ReservesContext from 'src/contexts/ReservesContext';
import { useTranslation } from 'react-i18next';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import { Title } from 'src/components/Texts';

const usdFormatter = new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' })

const Market: React.FunctionComponent = () => {
  const history = useHistory();
  const { account } = useWeb3React();
  const { reserves } = useContext(ReservesContext);
  const { t } = useTranslation();

  return (
    <>
      <section className="dashboard main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h4 className="main__title-text--market">{t("market.total_size")}</h4>
          <h2 className="main__title-text--blue">
            {
              usdFormatter.format(
                parseInt(
                  utils.formatEther(
                    reserves.reduce((res, cur) => res.add(BigNumber.from(cur.totalDeposit)), constants.Zero) || constants.Zero
                  )
                )
              )
            }
          </h2>
        </div>
      </section>
      <section className="tokens">
        <Title style={{ marginTop: 100 }} label={t("market.token--header")} />
        <table className="tokens__table">
          <thead className="tokens__table__header">
            <tr>
              {[t("market.asset"), t("market.total_deposit"), t("market.deposit_apy"), t("market.total_borrowed"), t("market.borrow_apy")].map((name, index) => {
                return (
                  <th key={index}>
                    <p className={`tokens__table__header__column`}>{name}</p>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="tokens__table-body">
            {
              ReserveData.map((reserve, index) => {
                if (index === 0) {
                  return (
                    <tr
                      className="tokens__table__row"
                      key={index}
                      style={{ cursor: 'pointer' }}
                      onClick={() => { index === 0 && history.push(`markets/${reserves[0].id}`) }}
                    >
                      <th>
                        <div>
                          <img src={reserve.image} alt='token' style={{ width: 40 }} />
                          <p>{reserve.name}</p>
                        </div>
                      </th>
                      <th><p>$ {toCompactForBignumber(reserves[0].totalDeposit)}</p></th>
                      <th>
                        <p>{toPercent(reserves[0].depositAPY)}</p>
                        <p>{toPercent(calcMiningAPR(BigNumber.from(reserves[0].totalDeposit)))}</p>
                      </th>
                      <th><p>$ {toCompactForBignumber(reserves[0].totalBorrow)}</p></th>
                      <th><p>{toPercent(reserves[0].borrowAPY)}</p></th>
                      {
                        account &&
                        <th>
                          <div className="tokens__table__button" onClick={(e) => { e.stopPropagation(); history.push(`dashboard?reserveId=${reserves[0].id}`) }}>
                            <p>
                              {t("market.button")}
                            </p>
                          </div>
                        </th>
                      }
                    </tr>
                  )
                }
                return (
                  <tr
                    className="tokens__table__row--disable"
                    key={index}
                  >
                    <th>
                      <div>
                        <div
                          className="tokens__table__image--disable"
                          style={{
                            backgroundColor: "#1C1C1CA2",
                            width: 40,
                            height: 40,
                            borderRadius: 40,
                            position: "absolute"
                          }}
                        />
                        <img src={reserve.image} alt='token' style={{ width: 40 }} />
                        <p>{reserve.name}</p>
                      </div>
                    </th>
                    <th><p>-</p></th>
                    <th><p>-</p></th>
                    <th><p>-</p></th>
                    <th><p>-</p></th>
                    {
                      account &&
                      <th>
                        <div
                          className="tokens__table__button--disable"
                        >
                          <p>{t("market.coming_soon")}</p>
                        </div>
                      </th>
                    }
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </section>
    </>
  );
}

export default Market;