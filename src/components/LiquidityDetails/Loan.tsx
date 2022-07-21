import { FunctionComponent, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BigNumber, constants, utils } from 'ethers';
import MainnetContext from 'src/contexts/MainnetContext';
import { parseTokenId } from 'src/utiles/parseTokenId';
import CollateralCategory from 'src/enums/CollateralCategory';
import AssetList from 'src/components/AssetList';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';
import useReserveData from 'src/hooks/useReserveData';

const usdFormatter = new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'USD',
});

const Loan: FunctionComponent<{ id: string }> = ({ id }) => {
  const { getAssetBondsByNetwork } = useReserveData();
  const { type: mainnetType } = useContext(MainnetContext);
  const assetBondTokens = getAssetBondsByNetwork(mainnetType);
  const [pageNumber, setPageNumber] = useState(1);
  const { t } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();
  const defaultShowingLoanData = mediaQuery === MediaQuery.Mobile ? 8 : 9;
  // true -> byLatest, false -> byLoanAmount
  const [sortMode, setSortMode] = useState(false);
  const totalBorrow = parseFloat(
    utils.formatEther(
      assetBondTokens.reduce(
        (res, cur) => res.add(cur.principal),
        constants.Zero,
      ) || constants.Zero,
    ),
  );

  const assetBondTokensBackedByEstate = assetBondTokens
    .filter((product) => {
      const parsedId = parseTokenId(product.id);
      return (
        CollateralCategory.Others !== parsedId.collateralCategory &&
        product.reserve.id === id
      );
    })
    .sort((a, b) => {
      return b.loanStartTimestamp! - a.loanStartTimestamp! >= 0 ? 1 : -1;
    });

  const viewMoreHandler = useCallback(() => {
    setPageNumber((prev) => prev + 1);
  }, [setPageNumber]);

  return (
    <>
      <section className="loan">
        <div>
          <h2>
            {t('governance.loan_list', {
              count: assetBondTokensBackedByEstate.length,
            })}
          </h2>
          <p>{t('loan.loan__content')}</p>
        </div>
        {assetBondTokensBackedByEstate.length === 0 ? (
          <div className="loan__list--null">
            <p>{t('loan.loan_list--null')}</p>
          </div>
        ) : (
          <>
            <AssetList
              assetBondTokens={
                /* Tricky : javascript의 sort는 mutuable이라 아래와 같이 복사 후 진행해야한다. */
                [...(assetBondTokensBackedByEstate || [])].slice(
                  0,
                  pageNumber * defaultShowingLoanData,
                ) || []
              }
            />
            {assetBondTokensBackedByEstate.length &&
              assetBondTokensBackedByEstate.length >=
                pageNumber * defaultShowingLoanData && (
                <div>
                  <button
                    className="portfolio__view-button"
                    onClick={() => viewMoreHandler()}>
                    {t('loan.view-more')}
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
