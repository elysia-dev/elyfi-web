import { useTranslation } from 'react-i18next';
import { formatSixFracionDigit, toCompactForBignumber, toPercent, toUsd } from 'src/utiles/formatters';
import { reserveTokenData } from 'src/core/data/reserves';
import { useWeb3React } from '@web3-react/core';
import CountUp from 'react-countup';
import { formatEther } from '@ethersproject/units';
import { BigNumber, constants } from 'ethers';
import AssetList from 'src/containers/AssetList';
import { Link, useHistory, useParams } from 'react-router-dom';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import TableBodyAmount from 'src/components/TableBodyAmount';
import { IReserveSubgraphData } from 'src/contexts/SubgraphContext';
import { useContext } from 'react';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import { daiMoneyPoolTime } from 'src/core/data/moneypoolTimes';
import { BalanceType } from 'src/hooks/useBalances';
import moment from 'moment';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import PriceContext from 'src/contexts/PriceContext';
import TableBodyEventReward from './TableBodyEventReward';

interface Props {
  balance: BalanceType
  onClick?: (e: any) => void;
  reserveData: IReserveSubgraphData;
  setIncentiveModalVisible: () => void;
  setModalNumber: () => void;
  modalview: () => void;
  setRound: (round: number) => void;
  id: string;
  loading: boolean;
}

const TokenTable: React.FC<Props> = ({
  balance,
  onClick,
  reserveData,
  setIncentiveModalVisible,
  setModalNumber,
  modalview,
  setRound,
  id,
  loading,
}) => {
  const { account } = useWeb3React();
  const { unsupportedChainid } = useContext(MainnetContext)
  const { t, i18n } = useTranslation();
  const tokenInfo = reserveTokenData[balance.tokenName];
  const history = useHistory();
  const { lng } = useParams<{ lng: string }>();
  const { value: mediaQuery } = useMediaQueryType();
  const { type: getMainnetType } = useContext(MainnetContext)
  const { elfiPrice } = useContext(PriceContext)

  const tableData = [
    [
      t('dashboard.total_deposit'),
      toUsd(reserveData.totalDeposit, tokenInfo?.decimals),
    ],
    [
      t('dashboard.total_borrowed'),
      toUsd(reserveData.totalBorrow, tokenInfo?.decimals),
    ],
    [t('dashboard.token_mining_apr'), toPercent(
      calcMiningAPR(
        elfiPrice,
        BigNumber.from(reserveData.totalDeposit),
        reserveTokenData[balance.tokenName].decimals,
      ) || '0',
    )|| 0],
    [t('dashboard.deposit_apy'), toPercent(reserveData.depositAPY)|| 0],
    [t('dashboard.borrow_apy'), toPercent(reserveData.borrowAPY)],
  ];

  return (
    <>
      <div className="deposit__table">
        <div className="deposit__table__ref" id={id} />
        <div
          className="deposit__table__header"
          style={{ cursor: 'pointer' }}
          onClick={() => {
            history.push({
              pathname: `/${lng}/deposits/${balance.tokenName}`,
            });
          }}>
          <div className="deposit__table__header__token-info">
            <img src={tokenInfo.image} alt="Token icon" />
            <p className="bold" style={{ cursor: 'pointer' }}>
              {balance.tokenName}
            </p>
          </div>
          {mediaQuery === MediaQuery.PC && (
            <div className="deposit__table__header__data-grid">
              <div />
              {tableData.map((data) => {
                return (
                  <div>
                    <p>{data[0]}</p>
                    <p className="bold">{data[1]}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="deposit__table__body">
          <div className="deposit__table__body__amount__container">
            {mediaQuery === MediaQuery.Mobile && (
              <div className="deposit__table__header__data-grid">
                <div />
                {tableData.map((data) => {
                  return (
                    <div>
                      <p>{data[0]}</p>
                      <p className="bold">{data[1]}</p>
                    </div>
                  )
                })}
              </div>
            )}
            <div className="deposit__table__body__amount__wrapper left">
              <TableBodyAmount
                header={t('dashboard.deposit_amount')}
                buttonEvent={reserveData ? onClick : undefined}
                buttonContent={t('dashboard.deposit_amount--button')}
                value={account && !unsupportedChainid ? toCompactForBignumber(
                  balance.deposit || constants.Zero,
                  tokenInfo?.decimals,
                )! : '-'}
                tokenName={tokenInfo?.name}
                walletBalance={account && !unsupportedChainid ? toCompactForBignumber(
                  balance.value || constants.Zero,
                  tokenInfo?.decimals,
                ) : undefined}
                loading={account ? loading : false}
              />
            </div>
            <div className="deposit__table__body__amount__wrapper right">
              <TableBodyAmount
                header={t('dashboard.reward_amount')}
                buttonEvent={(e) => {
                  e.preventDefault();
                  setIncentiveModalVisible();
                  setModalNumber();
                  modalview();
                  setRound(1);
                }}
                buttonContent={t('dashboard.claim_reward')}
                value={
                  (account && !unsupportedChainid) ? (
                    <CountUp
                      className="bold amounts"
                      start={parseFloat(formatEther(balance.expectedIncentiveBefore))}
                      end={parseFloat(formatEther(balance.expectedIncentiveAfter))}
                      formattingFn={(number) => {
                        return formatSixFracionDigit(number);
                      }}
                      decimals={6}
                      duration={1}
                    />
                  ) : (
                    '-'
                  )
                }
                moneyPoolTime={getMainnetType === MainnetType.Ethereum ? (
                  `${moment(daiMoneyPoolTime[0].startedAt).format(
                    'YYYY.MM.DD',
                  )} ~ ${moment(daiMoneyPoolTime[0].endedAt).format(
                    'YYYY.MM.DD',
                  )} KST`
                ) : undefined}
                tokenName={'ELFI'}
                loading={account ? loading : false}
              />
            </div>
          </div>
          {
            getMainnetType === MainnetType.BSC ? (
              <div className="deposit__table__body__strategy">
                <h2>
                  {t("dashboard.target_running_strategy")}
                </h2>
                <div>
                  <div style={{ flex: 30 }} >
                    <p>
                    {t("dashboard.real_estate_mortgage")} <span className="bold">30%</span>
                    </p>
                  </div>
                  <div style={{ flex: 70 }} >
                    <p>
                    {t("dashboard.auto_invest_defi__title")} <span className="bold">70%</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="deposit__table__body__event-box">
                <TableBodyEventReward
                  moneyPoolTime={`${moment(daiMoneyPoolTime[1].startedAt).format(
                    'YYYY.MM.DD',
                  )} KST ~ `}
                  expectedAdditionalIncentiveBefore={
                    balance.expectedAdditionalIncentiveBefore
                  }
                  expectedAdditionalIncentiveAfter={
                    balance.expectedAdditionalIncentiveAfter
                  }
                  buttonEvent={(e) => {
                    e.preventDefault();
                    setIncentiveModalVisible();
                    setModalNumber();
                    modalview();
                    setRound(2);
                  }}
                  tokenName={balance.tokenName}
                />
              </div>
            )
          }
          <div className="deposit__table__body__loan-list" style={{ display: reserveData.assetBondTokens.length === 0 ? "none" : "block" }}>
            <div>
              <div>
                <h2>{t('dashboard.recent_loan')}</h2>
                <Link to={`/${lng}/deposits/${balance.tokenName}`}>
                  <div className="deposit__table__body__loan-list__button">
                    <p>{t('main.governance.view-more')}</p>
                  </div>
                </Link>
              </div>
              <div>
                <AssetList
                  assetBondTokens={
                    // Tricky : javascript의 sort는 mutuable이라 아래와 같이 복사 후 진행해야한다.
                    [...(reserveData.assetBondTokens || [])]
                      .sort((a, b) => {
                        return b.loanStartTimestamp! -
                          a.loanStartTimestamp! >=
                          0
                          ? 1
                          : -1;
                      })
                      .slice(0, mediaQuery === MediaQuery.PC ? 3 : 2) || []
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenTable;
