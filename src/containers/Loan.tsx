import { FunctionComponent, useCallback, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GetAllAssetBonds } from 'src/queries/__generated__/GetAllAssetBonds';
import { useTranslation } from 'react-i18next';
import Footer from 'src/components/Footer';
import Skeleton from 'react-loading-skeleton';
import { GET_ALL_ASSET_BONDS } from 'src/queries/assetBondQueries';
import { BigNumber, constants, utils } from 'ethers';
import AssetList from './AssetList';

const usdFormatter = new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'USD',
});

const Loan: FunctionComponent<{ id: string }> = ({ id }) => {
  const { data, loading } = useQuery<GetAllAssetBonds>(GET_ALL_ASSET_BONDS);
  const [pageNumber, setPageNumber] = useState(1);
  const { t } = useTranslation();
  // true -> byLatest, false -> byLoanAmount
  const [sortMode, setSortMode] = useState(false);
  const totalBorrow = parseFloat(
    utils.formatEther(
      data?.assetBondTokens.reduce(
        (res, cur) => res.add(cur.principal),
        constants.Zero,
      ) || constants.Zero,
    ),
  );
  const list = data?.assetBondTokens.filter((product) => {
    return product.reserve.id === id;
  });

  const viewMoreHandler = useCallback(() => {
    setPageNumber((prev) => prev + 1);
  }, [setPageNumber]);

  return (
    <>
      <section className="loan">
        <div >
          <h2>{t('portfolio.portfolio_list')}</h2>
          <p>
            거버넌스(DAO)에서 통과하여 엘리파이에서 DAI로 실행된 대출 리스트입니다.
          </p>
        </div>
        
        {/* <div className="text__title" >
          <div
            className="loan__select-box"
            onClick={() => {
              setSortMode(!sortMode);
            }}>
            <p>
              {sortMode ? t('loan.order_by_loan') : t('loan.order_by_latest')}
            </p>
            <div
              className="loan__select-box__attribute"
              style={{ display: false ? 'block' : 'none' }}>
              <p onClick={() => setSortMode(true)}>
                {t('loan.order_by_latest')}
              </p>
              <p onClick={() => setSortMode(false)}>
                {t('loan.order_by_loan')}
              </p>
            </div>
          </div>
        </div> */}
        {loading ? (
          <div className="portfolio__asset-list__info__container">
            <Skeleton className="portfolio__asset-list__info" />
            <Skeleton className="portfolio__asset-list__info" />
            <Skeleton className="portfolio__asset-list__info" />
          </div>
        ) : (
          <>
            <AssetList
              assetBondTokens={
                /* Tricky : javascript의 sort는 mutuable이라 아래와 같이 복사 후 진행해야한다. */
                [...(list || [])].slice(0, pageNumber * 9).sort((a, b) => {
                  if (sortMode) {
                    return BigNumber.from(b.principal).gte(
                      BigNumber.from(a.principal),
                    )
                      ? 1
                      : -1;
                  } else {
                    return b.loanStartTimestamp! - a.loanStartTimestamp! >= 0
                      ? 1
                      : -1;
                  }
                }) || []
              }
            />
            {list?.length && list.length >= pageNumber * 9 && (
              <div>
                <button
                  style={{ width: '100px', height: '50px' }}
                  onClick={() => viewMoreHandler()}>
                  더보기
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default Loan;
