import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ELFIIcon from 'src/assets/images/elfi--icon.png';
import Skeleton from 'react-loading-skeleton';
import { GetAllReserves_reserves } from 'src/queries/__generated__/GetAllReserves';
import { formatSixFracionDigit, toPercent, toUsd } from 'src/utiles/formatters';
import { reserveTokenData } from 'src/core/data/reserves';
import { useWeb3React } from '@web3-react/core';
import CountUp from 'react-countup';
import { formatEther } from '@ethersproject/units';
import { BigNumber } from 'ethers';
import { GetAllAssetBonds } from 'src/queries/__generated__/GetAllAssetBonds';
import { GET_ALL_ASSET_BONDS } from 'src/queries/assetBondQueries';
import { useQuery } from '@apollo/client';
import AssetList from 'src/containers/AssetList';
import Token from 'src/enums/Token';
import { useHistory, useParams } from 'react-router-dom';


interface Props {
  tokenImage: string;
  tokenName: Token.DAI | Token.USDT;
  index: number;
  onClick?: (e: any) => void;
  depositBalance?: string;
  depositAPY?: string;
  miningAPR?: string;
  walletBalance?: string;
  isDisable: boolean;
  skeletonLoading: boolean;
  reserveData: GetAllReserves_reserves;
  expectedIncentiveBefore: BigNumber;
  expectedIncentiveAfter: BigNumber;
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
  setIncentiveModalVisible,
  setModalNumber,
  modalview,
  id
}) => {
  const { data, loading } = useQuery<GetAllAssetBonds>(GET_ALL_ASSET_BONDS);
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const tokenInfo = reserveTokenData[tokenName];
  const list = data?.assetBondTokens.filter((product) => {
    return product.reserve.id === reserveData?.id;
  });
  const history = useHistory();

  const { lng } = useParams<{ lng: string }>();

  return (
    <>
      <div className="deposit__table">
        <div className="deposit__table__ref" id={id} />
        <div className="deposit__table__header">
          <div 
            className="deposit__table__header__token-info" 
            style={{ cursor: 'pointer' }}
            onClick={() => {
              history.push({
                pathname: `/${lng}/deposits/${tokenName}`,
              });
            }}>
            <img src={tokenImage} alt="Token icon" />
            <p className="bold"
              style={{ cursor: 'pointer' }}>
              {tokenName}
            </p>
          </div>
          <div className="deposit__table__header__data-grid">
            <div />
            {
              [
                [t("dashboard.total_deposit"), toUsd(reserveData.totalDeposit, tokenInfo?.decimals)],
                [t("dashboard.total_borrowed"), toUsd(reserveData.totalBorrow, tokenInfo?.decimals)],
                [t("dashboard.token_mining_apr"), miningAPR || 0],
                [t("dashboard.borrow_apy"), toPercent(reserveData.borrowAPY)],
                [t("dashboard.deposit_apy"), depositAPY || 0]
              ].map((data) => {
                return (
                  skeletonLoading ? (
                    <Skeleton width={120} />
                  ) : (
                    <div>
                      <p>
                        {data[0]}
                      </p>
                      <p className="bold">
                        {data[1]}
                      </p>
                    </div>
                  )
                )
              })
            }
          </div>
        </div>

        <div className="deposit__table__body">
          <div className="deposit__table__body__amount__container">
            <div className="deposit__table__body__amount__wrapper left">
              <div>
                <h2>
                  {t("dashboard.deposit_amount")}
                </h2>
              </div>
              <div className="deposit__table__body__amount">
                <div onClick={!isDisable ? onClick : undefined}>
                  <p>
                    {t("dashboard.deposit_amount--button")}
                  </p>
                </div>
                <div>
                  <h2>
                    {account ? depositBalance : "-"}<span className="bold">&nbsp;{tokenInfo?.name}</span>
                  </h2>
                  <p>
                    {account ? (
                      `${t("dashboard.wallet_balance")} : ` + walletBalance + " " + tokenInfo.name
                      ) : 
                      ""
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="deposit__table__body__amount__wrapper right">
              <div>
                <h2>
                  {t("dashboard.reward_amount")}
                </h2>
              </div>
              <div className="deposit__table__body__amount">
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setIncentiveModalVisible();
                    setModalNumber();
                    modalview();
                  }}
                >
                  <p>
                    {t("dashboard.claim_reward")}
                  </p>
                </div>
                <div>
                  <h2>
                  {account ? (
                    <CountUp
                      className="bold amount"
                      start={parseFloat(formatEther(expectedIncentiveBefore))}
                      end={parseFloat(formatEther(expectedIncentiveAfter))}
                      formattingFn={(number) => {
                        return formatSixFracionDigit(number);
                      }}
                      decimals={6}
                      duration={1}
                    />
                  ) : "-"
                  }<span className="bold">&nbsp;ELFI</span>
                  </h2>
                </div>
              </div>
            </div>
          </div>
          
          <div className="deposit__table__body__loan-list">
          {
            loading ? (
              <Skeleton width={1148} height={768} />
            ) : (
              <div>
                <h2>{t("dashboard.recent_loan")}</h2>
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
                        .slice(0, 3) || []
                    }
                  />
                </div>
                <div
                  className="deposit__table__body__loan-list__more-button"
                  style={{ display: (!!list && list?.length > 3) ? "block" : "none" }}>
                  <a href={`/${lng}/deposits/${tokenName}`}>
                    <p>
                      {t("main.governance.view-more")}
                    </p>
                  </a>
                </div>
              </div>
            )
          }
          </div>
        </div>
      </div>
    </>
  );
};

export default TokenTable;
