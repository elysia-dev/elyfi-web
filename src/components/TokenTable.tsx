import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { formatSixFracionDigit, toPercent, toUsd } from 'src/utiles/formatters';
import { reserveTokenData } from 'src/core/data/reserves';
import { useWeb3React } from '@web3-react/core';
import CountUp from 'react-countup';
import { formatEther } from '@ethersproject/units';
import { BigNumber, constants } from 'ethers';
import { GetAllAssetBonds } from 'src/queries/__generated__/GetAllAssetBonds';
import { GET_ALL_ASSET_BONDS } from 'src/queries/assetBondQueries';
import { useQuery } from '@apollo/client';
import AssetList from 'src/containers/AssetList';
import Token from 'src/enums/Token';
import { Link, useHistory, useParams } from 'react-router-dom';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import TableBodyAmount from 'src/components/TableBodyAmount';
import { IReserveSubgraphData } from 'src/contexts/SubgraphContext';
import { useContext } from 'react';
import MainnetContext from 'src/contexts/MainnetContext';
import MainnetType from 'src/enums/MainnetType';
import { daiMoneyPoolTime } from 'src/core/data/moneypoolTimes';
import moment from 'moment';
import ReservesContext from 'src/contexts/ReservesContext';
import TableBodyEventReward from './TableBodyEventReward';

interface Props {
  tokenImage: string;
  tokenName: Token.DAI | Token.USDT | Token.BUSD;
  index: number;
  onClick?: (e: any) => void;
  depositBalance?: string;
  depositAPY?: string;
  miningAPR?: string;
  walletBalance?: string;
  isDisable: boolean;
  skeletonLoading: boolean;
  reserveData: IReserveSubgraphData;
  expectedIncentiveBefore: BigNumber;
  expectedIncentiveAfter: BigNumber;
  expectedAdditionalIncentiveBefore: BigNumber;
  expectedAdditionalIncentiveAfter: BigNumber;
  setIncentiveModalVisible: () => void;
  setModalNumber: () => void;
  modalview: () => void;
  id: string;
}

const TokenTable: React.FC<Props> = ({
  tokenImage,
  tokenName,
  index,
  onClick,
  depositBalance,
  depositAPY,
  miningAPR,
  walletBalance,
  isDisable,
  skeletonLoading,
  reserveData,
  expectedIncentiveBefore,
  expectedIncentiveAfter,
  expectedAdditionalIncentiveBefore,
  expectedAdditionalIncentiveAfter,
  setIncentiveModalVisible,
  setModalNumber,
  modalview,
  id,
}) => {
  const { data, loading } = useQuery<GetAllAssetBonds>(GET_ALL_ASSET_BONDS);
  const { account } = useWeb3React();
  const { t, i18n } = useTranslation();
  const { setRound } = useContext(ReservesContext);
  const tokenInfo = reserveTokenData[tokenName];
  const list = data?.assetBondTokens.filter((product) => {
    return product.reserve.id === reserveData?.id;
  });
  const history = useHistory();
  const { lng } = useParams<{ lng: string }>();
  const { value: mediaQuery } = useMediaQueryType();
  const { type: getMainnetType } = useContext(MainnetContext)

  const tableData = [
    [
      t('dashboard.total_deposit'),
      toUsd(reserveData.totalDeposit, tokenInfo?.decimals),
    ],
    [
      t('dashboard.total_borrowed'),
      toUsd(reserveData.totalBorrow, tokenInfo?.decimals),
    ],
    [t('dashboard.token_mining_apr'), miningAPR || 0],
    [t('dashboard.deposit_apy'), depositAPY || 0],
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
              pathname: `/${lng}/deposits/${tokenName}`,
            });
          }}>
          <div className="deposit__table__header__token-info">
            <img src={tokenImage} alt="Token icon" />
            <p className="bold" style={{ cursor: 'pointer' }}>
              {tokenName}
            </p>
          </div>
          {mediaQuery === MediaQuery.PC && (
            <div className="deposit__table__header__data-grid">
              <div />
              {tableData.map((data) => {
                return skeletonLoading ? (
                  <Skeleton width={120} />
                ) : (
                  <div>
                    <p>{data[0]}</p>
                    <p className="bold">{data[1]}</p>
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
                {tableData.map((data) => {
                  return skeletonLoading ? (
                    <Skeleton width={120} />
                  ) : (
                    <div>
                      <p>{data[0]}</p>
                      <p className="bold">{data[1]}</p>
                    </div>
                  );
                })}
              </div>
            )}
            <div className="deposit__table__body__amount__wrapper left">
              <TableBodyAmount
                header={t('dashboard.deposit_amount')}
                buttonEvent={!isDisable ? onClick : undefined}
                buttonContent={t('dashboard.deposit_amount--button')}
                value={account ? depositBalance! : '-'}
                tokenName={tokenInfo?.name}
                walletBalance={account ? walletBalance : undefined}
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
                  account ? (
                    <CountUp
                      className="bold amounts"
                      start={parseFloat(formatEther(expectedIncentiveBefore))}
                      end={parseFloat(formatEther(expectedIncentiveAfter))}
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
                moneyPoolTime={`${moment(daiMoneyPoolTime[0].startedAt).format(
                  'YYYY.MM.DD',
                )} ~ ${moment(daiMoneyPoolTime[0].endedAt).format(
                  'YYYY.MM.DD',
                )} KST`}
                tokenName={'ELFI'}
              />
            </div>
          </div>
          {
            getMainnetType === MainnetType.BSC && (
              <div className="deposit__table__body__strategy">
                <h2>
                  Target running strategy
                </h2>
                <div>
                  <div style={{ flex: 30 }} >
                    <p>
                      Real estate mortgage <span className="bold">30%</span>
                    </p>
                  </div>
                  <div style={{ flex: 70 }} >
                    <p>
                      Auto investment to DeFi <span className="bold">70%</span>
                    </p>
                  </div>
                </div>
              </div>
            )
          }
          <div className="deposit__table__body__event-box">
            <TableBodyEventReward
              moneyPoolTime={`${moment(daiMoneyPoolTime[1].startedAt).format(
                'YYYY.MM.DD',
              )} KST ~ `}
              expectedAdditionalIncentiveBefore={
                expectedAdditionalIncentiveBefore
              }
              expectedAdditionalIncentiveAfter={
                expectedAdditionalIncentiveAfter
              }
              buttonEvent={(e) => {
                e.preventDefault();
                setIncentiveModalVisible();
                setModalNumber();
                modalview();
                setRound(2);
              }}
              tokenName={tokenName}
            />
          </div>

          <div className="deposit__table__body__loan-list" style={{ display: list?.length === 0 ? "none" : "block" }}>
            {loading ? (
              <Skeleton
                width={mediaQuery === MediaQuery.PC ? 1148 : 340}
                height={768}
              />
            ) : (
              <div>
                <div>
                  <h2>{t('dashboard.recent_loan')}</h2>
                  <Link to={`/${lng}/deposits/${tokenName}`}>
                    <div className="deposit__table__body__loan-list__button">
                      <p>{t('main.governance.view-more')}</p>
                    </div>
                  </Link>
                </div>
                <div>
                  <AssetList
                    assetBondTokens={
                      // Tricky : javascript의 sort는 mutuable이라 아래와 같이 복사 후 진행해야한다.
                      [...(list || [])]
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenTable;
