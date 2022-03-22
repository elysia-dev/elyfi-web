import { useTranslation } from 'react-i18next';
import useSWR from 'swr';
import envs from 'src/core/envs';
import {
  formatSixFracionDigit,
  toCompactForBignumber,
  toPercent,
  toUsd,
} from 'src/utiles/formatters';
import { reserveTokenData } from 'src/core/data/reserves';
import { useWeb3React } from '@web3-react/core';
import CountUp from 'react-countup';
import { formatEther } from '@ethersproject/units';
import Skeleton from 'react-loading-skeleton';
import { BigNumber, constants } from 'ethers';
import AssetList from 'src/components/AssetList';
import { Link, useHistory, useParams } from 'react-router-dom';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import TableBodyAmount from 'src/components/Deposit/TableBodyAmount';
import { lazy, useContext } from 'react';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import { daiMoneyPoolTime } from 'src/core/data/moneypoolTimes';
import { BalanceType } from 'src/hooks/useBalances';
import moment from 'moment';
import calcMiningAPR from 'src/utiles/calcMiningAPR';
import { parseTokenId } from 'src/utiles/parseTokenId';
import CollateralCategory from 'src/enums/CollateralCategory';
import useCurrentChain from 'src/hooks/useCurrentChain';
import { isWrongNetwork } from 'src/utiles/isWrongNetwork';
import { pricesFetcher } from 'src/clients/Coingecko';
import priceMiddleware from 'src/middleware/priceMiddleware';
import { IReserveSubgraphData } from 'src/core/types/reserveSubgraph';
import useReserveData from 'src/hooks/useReserveData';
import TableBodyEventReward from './TableBodyEventReward';

const LazyImage = lazy(() => import('src/utiles/lazyImage'));

interface Props {
  balance: BalanceType;
  onClick?: (e: any) => void;
  setIncentiveModalVisible: () => void;
  setModalNumber: () => void;
  modalview: () => void;
  setRound: (round: number) => void;
  id: string;
  loading: boolean;
  reserveData?: IReserveSubgraphData;
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
  const { unsupportedChainid, type: getMainnetType } =
    useContext(MainnetContext);
  const { t } = useTranslation();
  const tokenInfo = reserveTokenData[balance.tokenName];
  const history = useHistory();
  const { lng } = useParams<{ lng: string }>();
  const { value: mediaQuery } = useMediaQueryType();
  const currentChain = useCurrentChain();
  const { loading: subgraphLoading } = useReserveData();
  const { data: priceData } = useSWR(
    envs.externalApiEndpoint.coingackoURL,
    pricesFetcher,
    {
      use: [priceMiddleware],
    },
  );
  const assetBondTokensBackedByEstate = reserveData?.id
    ? reserveData.assetBondTokens.filter((ab) => {
        const parsedId = parseTokenId(ab.id);
        return CollateralCategory.Others !== parsedId.collateralCategory;
      })
    : undefined;

  const isWrongMainnet = isWrongNetwork(getMainnetType, currentChain?.name);

  const tableData = [
    [
      t('dashboard.total_deposit'),
      reserveData?.id && toUsd(reserveData.totalDeposit, tokenInfo?.decimals),
    ],
    [
      t('dashboard.total_borrowed'),
      reserveData?.id && toUsd(reserveData.totalBorrow, tokenInfo?.decimals),
    ],
    [
      t('dashboard.token_mining_apr'),
      (reserveData?.id &&
        toPercent(
          calcMiningAPR(
            priceData?.elfiPrice || 0,
            BigNumber.from(reserveData.totalDeposit),
            reserveTokenData[balance.tokenName].decimals,
          ) || '0',
        )) ||
        0,
    ],
    [
      t('dashboard.deposit_apy'),
      (reserveData?.id && toPercent(reserveData.depositAPY)) || 0,
    ],
    [
      t('dashboard.borrow_apy'),
      reserveData?.id && toPercent(reserveData.borrowAPY),
    ],
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
            <LazyImage src={tokenInfo.image} name="Token icon" />
            <p className="bold" style={{ cursor: 'pointer' }}>
              {balance.tokenName}
            </p>
          </div>
          {mediaQuery === MediaQuery.PC && (
            <div className="deposit__table__header__data-grid">
              <div />
              {tableData.map((data, index) => {
                return (
                  <div key={index}>
                    <p>{data[0]}</p>
                    {subgraphLoading || !reserveData?.id ? (
                      <Skeleton width={70} height={17.5} />
                    ) : (
                      <p className="bold">{data[1]}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="deposit__table__body">
          <div className="deposit__table__body__amount__container">
            {mediaQuery === MediaQuery.Mobile && (
              <div className="deposit__table__header__data-grid">
                <div />
                {tableData.map((data, index) => {
                  return (
                    <div key={index}>
                      <p>{data[0]}</p>
                      {subgraphLoading || !reserveData?.id ? (
                        <Skeleton width={50} height={10.5} />
                      ) : (
                        <p className="bold">{data[1]}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="deposit__table__body__amount__wrapper left">
              <TableBodyAmount
                header={t('dashboard.deposit_amount')}
                buttonEvent={reserveData ? onClick : undefined}
                buttonContent={t('dashboard.deposit_amount--button')}
                value={
                  account && !unsupportedChainid
                    ? isWrongMainnet
                      ? '-'
                      : toCompactForBignumber(
                          balance.deposit || constants.Zero,
                          tokenInfo?.decimals,
                        )!
                    : '-'
                }
                tokenName={tokenInfo?.name}
                walletBalance={
                  account && !unsupportedChainid
                    ? toCompactForBignumber(
                        balance.value || constants.Zero,
                        tokenInfo?.decimals,
                      )
                    : undefined
                }
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
                  account && !unsupportedChainid ? (
                    isWrongMainnet ? (
                      '-'
                    ) : (
                      <CountUp
                        className="bold amounts"
                        start={parseFloat(
                          formatEther(balance.expectedIncentiveBefore),
                        )}
                        end={parseFloat(
                          formatEther(balance.expectedIncentiveAfter),
                        )}
                        formattingFn={(number) => {
                          return formatSixFracionDigit(number);
                        }}
                        decimals={6}
                        duration={1}
                      />
                    )
                  ) : (
                    '-'
                  )
                }
                moneyPoolTime={
                  getMainnetType === MainnetType.Ethereum
                    ? `${moment(daiMoneyPoolTime[0].startedAt).format(
                        'YYYY.MM.DD',
                      )} ~ ${moment(daiMoneyPoolTime[0].endedAt).format(
                        'YYYY.MM.DD',
                      )} KST`
                    : undefined
                }
                tokenName={'ELFI'}
                loading={account ? loading : false}
              />
            </div>
          </div>
          {getMainnetType === MainnetType.BSC ? (
            mediaQuery === MediaQuery.PC ? (
              <div className="deposit__table__body__strategy">
                <h2>{t('dashboard.target_running_strategy')}</h2>
                <div>
                  <div style={{ flex: 30 }}>
                    <p>
                      {t('dashboard.real_estate_mortgage')}{' '}
                      <span className="bold">30%</span>
                    </p>
                  </div>
                  <div style={{ flex: 70 }}>
                    <p>
                      {t('dashboard.auto_invest_defi__title')}{' '}
                      <span className="bold">70%</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="deposit__table__body__strategy">
                <h2>{t('dashboard.target_running_strategy')}</h2>
                <div>
                  <div style={{ flex: 30 }}>
                    <p className="bold">30%</p>
                  </div>
                  <div style={{ flex: 70 }}>
                    <p className="bold">70%</p>
                  </div>
                </div>

                <div className="deposit__table__body__strategy__text-info">
                  <div />
                  <p>{t('dashboard.real_estate_mortgage')}</p>
                </div>
                <div className="deposit__table__body__strategy__text-info">
                  <div className="last" />
                  <p>{t('dashboard.auto_invest_defi__title')}</p>
                </div>
              </div>
            )
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
                isWrongMainnet={isWrongMainnet}
              />
            </div>
          )}
          <div className="deposit__table__body__loan-list">
            <div>
              <div>
                <h2>{t('dashboard.recent_loan')}</h2>
                {assetBondTokensBackedByEstate && (
                  <Link
                    to={`/${lng}/deposits/${balance.tokenName}`}
                    style={{
                      display:
                        assetBondTokensBackedByEstate?.length === 0
                          ? 'none'
                          : 'block',
                    }}>
                    <div className="deposit__table__body__loan-list__button">
                      <p>{t('main.governance.view-more')}</p>
                    </div>
                  </Link>
                )}
              </div>
              {assetBondTokensBackedByEstate?.length === 0 ? (
                <div className="loan__list--null" style={{ marginTop: 30 }}>
                  <p>{t('loan.loan_list--null')}</p>
                </div>
              ) : (
                <div>
                  <AssetList
                    assetBondTokens={
                      // Tricky : javascript의 sort는 mutuable이라 아래와 같이 복사 후 진행해야한다.
                      assetBondTokensBackedByEstate
                        ? [...assetBondTokensBackedByEstate]
                            .sort((a, b) => {
                              return b.loanStartTimestamp! -
                                a.loanStartTimestamp! >=
                                0
                                ? 1
                                : -1;
                            })
                            .slice(0, mediaQuery === MediaQuery.PC ? 3 : 2)
                        : undefined
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenTable;