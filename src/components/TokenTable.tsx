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
import { GET_ALL_ASSET_BONDS } from 'src/queries/__generated__/assetBondQueries';
import { useQuery } from '@apollo/client';
import AssetList from 'src/containers/AssetList';
import Token from 'src/enums/Token';

const DetailInfoDiv = styled.div`
  width: 200px;
  display: flex;
  justify-content: space-between;
`;

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

  return (
    <>
      {window.sessionStorage.getItem('@MediaQuery') === 'PC' ? (
        <div
          style={{
            border: '1px solid black',
            marginTop: '30px',
          }}>
          <div
            // className={`tokens__table__row${!isDisable ? '' : '--disable'}`}
            key={index}
            style={{
              height: 100,
              border: '1px solid black',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingRight: '20px',
            }}>
            <div
              className={`tokens__table__image`}
              style={{
                width: 110,
                border: '1px solid black',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <div>
                {/* {isDisable && <div className="tokens__table__image--disable" />} */}
                <img src={tokenImage} alt="token" />
                <p className="spoqa__bold">{tokenName}</p>
              </div>
            </div>
            <div>
              {skeletonLoading ? (
                <Skeleton width={120} />
              ) : (
                <>
                  {/* {!isDisable ? toCompactForBignumber(depositBalance[index] || constants.Zero) : "-"} <span className="token-name spoqa__bold">{tokenName}</span> */}
                  {!isDisable ? (
                    <>
                      <DetailInfoDiv
                        style={{
                          marginBottom: 15,
                        }}>
                        <div>ELFI 채굴 APY</div>
                        <div>{miningAPR || 0}</div>
                      </DetailInfoDiv>
                      <DetailInfoDiv>
                        <div>ELFI 채굴 APY</div>
                        <div>{miningAPR || 0}</div>
                      </DetailInfoDiv>
                      {/* <span className="token-name spoqa__bold">
                        {tokenName}
                      </span> */}
                    </>
                  ) : (
                    '-'
                  )}
                </>
              )}
            </div>
            <div>
              {!isDisable ? (
                skeletonLoading ? (
                  <Skeleton width={120} />
                ) : (
                  <div>
                    <DetailInfoDiv
                      style={{
                        marginBottom: 15,
                      }}>
                      <div>총 예치금</div>
                      <div>
                        {toUsd(reserveData.totalDeposit, tokenInfo?.decimals)}
                      </div>
                    </DetailInfoDiv>
                    <DetailInfoDiv>
                      <div>예치 APY</div>
                      <div>{depositAPY || 0}</div>
                    </DetailInfoDiv>
                  </div>
                )
              ) : (
                <p>-</p>
              )}
            </div>
            <div>
              {skeletonLoading ? (
                <Skeleton width={120} />
              ) : (
                <>
                  {!isDisable ? (
                    <div>
                      <DetailInfoDiv
                        style={{
                          marginBottom: 15,
                        }}>
                        <div>총 대출금</div>
                        <div>
                          {toUsd(reserveData.totalBorrow, tokenInfo?.decimals)}
                        </div>
                      </DetailInfoDiv>
                      <DetailInfoDiv>
                        <div>대출 APY</div>
                        <div>{toPercent(reserveData.borrowAPY)}</div>
                      </DetailInfoDiv>
                    </div>
                  ) : (
                    '-'
                  )}
                </>
              )}
            </div>
            {/* <div>
            {!isDisable ? (
              skeletonLoading ? (
                <Skeleton width={120} />
              ) : (
                <>
                  <p className={`spoqa`}>{depositAPY || 0}</p>
                  <div className={`tokens__table__apr`}>
                    <img src={ELFIIcon} />
                    <p className="spoqa__bold">{miningAPR || 0}</p>
                  </div>
                </>
              )
            ) : (
              <p>-</p>
            )}
          </div>
          <div>
            {skeletonLoading ? (
              <Skeleton width={120} />
            ) : (
              <>
                <p className="spoqa__bold">
                  {!isDisable ? (
                    <>
                      {walletBalance}{' '}
                      <span className="token-name spoqa__bold">
                        {tokenName}
                      </span>
                    </>
                  ) : (
                    '-'
                  )}
                </p>
                <p className="spoqa div-balance">
                  {!isDisable ? '$ ' + walletBalanceDivValue : '-'}
                </p>
              </>
            )}
          </div> */}
          </div>
          <div
            style={{
              padding: 20,
            }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                border: '1px solid black',
              }}>
              <div
                style={{
                  width: '50%',
                  borderRight: '1px solid black',
                  padding: 10,
                }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <div>예치</div>
                  <div
                    onClick={!isDisable ? onClick : undefined}
                    style={{
                      border: '1px solid black',
                      width: 100,
                      height: 30,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '20px',
                    }}>
                    <div>예치 | 출금</div>
                  </div>
                </div>
                {account ? (
                  <div
                    style={{
                      textAlign: 'right',
                    }}>
                    {depositBalance} {tokenInfo?.name}
                    <p
                      style={{
                        fontSize: 11,
                        margin: 0,
                        marginTop: 5,
                      }}>
                      지갑잔액: {walletBalance} {tokenInfo?.name}
                    </p>
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                    }}>
                    지갑을 연결해주세요.
                  </div>
                )}
              </div>
              <div
                style={{
                  width: '50%',
                  padding: 10,
                }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}>
                  <div>보상 수량</div>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      setIncentiveModalVisible();
                      setModalNumber();
                      modalview();
                    }}
                    style={{
                      border: '1px solid black',
                      width: 100,
                      height: 30,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '20px',
                    }}>
                    수령하기
                  </div>
                </div>
                {account ? (
                  <div
                    style={{
                      textAlign: 'right',
                    }}>
                    <CountUp
                      className="spoqa__bold"
                      start={parseFloat(formatEther(expectedIncentiveBefore))}
                      end={parseFloat(formatEther(expectedIncentiveAfter))}
                      formattingFn={(number) => {
                        return formatSixFracionDigit(number);
                      }}
                      decimals={6}
                      duration={1}
                    />{' '}
                    ELFI
                  </div>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                    }}>
                    지갑을 연결해주세요.
                  </div>
                )}
              </div>
            </div>
            {loading ? (
              <Skeleton width={1148} height={768} />
            ) : (
              <div>
                <div>대출리스트</div>
                <div>
                  <AssetList
                    assetBondTokens={
                      /* Tricky : javascript의 sort는 mutuable이라 아래와 같이 복사 후 진행해야한다. */
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
                  style={{
                    textAlign: 'center',
                    border: '1px solid black',
                  }}>
                  <a href={`/deposits/${tokenName}`}>더보기</a>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`tokens__table__row${!isDisable ? '' : '--disable'}`}
          key={index}
          onClick={!isDisable ? onClick : undefined}>
          <div className="tokens__table__image">
            {isDisable && <div className="tokens__table__image--disable" />}
            <div>
              <img src={tokenImage} alt="token" />
              <p className="spoqa__bold">{tokenName}</p>
            </div>
          </div>
          <div className="tokens__table__content">
            <div className="tokens__table__content__data">
              <p className="spoqa">{t('dashboard.deposit_balance')}</p>
              {skeletonLoading ? (
                <Skeleton width={120} />
              ) : (
                <>
                  <p className="spoqa__bold">
                    {!isDisable ? (
                      <>
                        {depositBalance}{' '}
                        <span className="token-name spoqa__bold">
                          {tokenName}
                        </span>
                      </>
                    ) : (
                      '-'
                    )}
                  </p>
                  <p className="spoqa div-balance">
                    {!isDisable ? '$ ' + depositBalanceDivValue : '-'}
                  </p>
                </>
              )}
            </div>
            <div className="tokens__table__content__data">
              <p className="spoqa">{t('dashboard.deposit_apy')}</p>
              {skeletonLoading ? (
                <Skeleton width={120} />
              ) : (
                <>
                  <p className="spoqa__bold">
                    {!isDisable ? depositAPY || 0 : '-'}
                  </p>
                  {!isDisable && (
                    <div className="tokens__table__apr">
                      <img src={ELFIIcon} />
                      <p className="spoqa">{miningAPR || 0}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="tokens__table__content__data">
              <p className="spoqa">{t('dashboard.wallet_balance')}</p>
              {skeletonLoading ? (
                <Skeleton width={120} />
              ) : (
                <>
                  <p className="spoqa__bold">
                    {!isDisable ? (
                      <>
                        {walletBalance}{' '}
                        <span className="token-name spoqa__bold">
                          {tokenName}
                        </span>
                      </>
                    ) : (
                      '-'
                    )}
                  </p>
                  <p className="spoqa div-balance">
                    {!isDisable ? '$ ' + walletBalanceDivValue : '-'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TokenTable;
