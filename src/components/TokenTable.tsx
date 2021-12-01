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
import { useParams } from 'react-router-dom';


interface Props {
  tokenImage: string;
  tokenName: Token.DAI | Token.USDT;
  index: number;
  onClick?: (e: any) => void;
  depositBalance?: string;
  depositBalanceDivValue?: string;
  depositAPY?: string;
  miningAPR?: string;
  walletBalance?: string;
  walletBalanceDivValue?: string;
  isDisable: boolean;
  skeletonLoading: boolean;
  reserveData: GetAllReserves_reserves;
  expectedIncentiveBefore: BigNumber;
  expectedIncentiveAfter: BigNumber;
  setIncentiveModalVisible: () => void;
  setModalNumber: () => void;
  modalview: () => void;
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
  depositBalanceDivValue,
  walletBalanceDivValue,
  reserveData,
  expectedIncentiveBefore,
  expectedIncentiveAfter,
  setIncentiveModalVisible,
  setModalNumber,
  modalview,
}) => {
  const { data, loading } = useQuery<GetAllAssetBonds>(GET_ALL_ASSET_BONDS);
  const { account } = useWeb3React();
  const { t } = useTranslation();
  const tokenInfo = reserveTokenData[tokenName];
  const list = data?.assetBondTokens.filter((product) => {
    return product.reserve.id === reserveData?.id;
  });

  const { lng } = useParams<{ lng: string }>();

  return (
    <>
      <div className="deposit__table">
        <div className="deposit__table__header">
          <div className="deposit__table__header__token-info">
            <img src={tokenImage} alt="Token icon" />
            <p className="bold">
              {tokenName}
            </p>
          </div>
          <div className="deposit__table__header__data-grid">
            <div />
            {
              [
                ["총 예치금", toUsd(reserveData.totalDeposit, tokenInfo?.decimals)],
                ["총 대출금", toUsd(reserveData.totalBorrow, tokenInfo?.decimals)],
                ["ELFI 채굴 APR", miningAPR || 0],
                ["대출 APY", toPercent(reserveData.borrowAPY)],
                ["예치 APY", depositAPY || 0]
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
                  예치 수량
                </h2>
              </div>
              <div className="deposit__table__body__amount">
                <div onClick={!isDisable ? onClick : undefined}>
                  <p>
                    예치 | 출금
                  </p>
                </div>
                <div>
                  <h2>
                    {account ? depositBalance : "-"}<span className="bold">&nbsp;{tokenInfo?.name}</span>
                  </h2>
                  <p>
                    {account ? (
                      "지갑 잔액 : " + walletBalance + " " + tokenInfo.name
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
                  보상 수량
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
                    수령하기
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
                <h2>최근 대출리스트</h2>
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
                      + 더보기
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
