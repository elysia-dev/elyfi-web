import { FunctionComponent, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BigNumber, constants, utils } from 'ethers';
import MainnetContext from 'src/contexts/MainnetContext';
import SubgraphContext from 'src/contexts/SubgraphContext';
import { parseTokenId } from 'src/utiles/parseTokenId';
import CollateralCategory from 'src/enums/CollateralCategory';
import AssetList from 'src/containers/AssetList';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';

const usdFormatter = new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'USD',
});

const Loan: FunctionComponent<{ id: string }> = ({ id }) => {
  const { getAssetBondsByNetwork } = useContext(SubgraphContext);
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

  const assetBondTokensBackedByEstate = assetBondTokens.filter((product) => {
    const parsedId = parseTokenId(product.id);
    return (
      CollateralCategory.Others !== parsedId.collateralCategory &&
      product.reserve.id === id
    );
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
              <>
                <AssetList
                  assetBondTokens={
                    /* Tricky : javascript의 sort는 mutuable이라 아래와 같이 복사 후 진행해야한다. */
                    [...(assetBondTokensBackedByEstate || [])].slice(0, pageNumber * defaultShowingLoanData).sort((a, b) => {
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
                {assetBondTokensBackedByEstate.length && assetBondTokensBackedByEstate.length >= pageNumber * defaultShowingLoanData && (
                  <div>
                    <button
                      className="portfolio__view-button"
                      onClick={() => viewMoreHandler()}>
                      {t('loan.view-more')}
                    </button>
                  </div>
                )}
              </>
            </>
          </>
        )}
      </section>
    </>
  );
};

export default Loan;
