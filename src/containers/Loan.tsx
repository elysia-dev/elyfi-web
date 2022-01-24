import { FunctionComponent, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BigNumber, constants, utils } from 'ethers';
import MainnetContext from 'src/contexts/MainnetContext';
import SubgraphContext from 'src/contexts/SubgraphContext';
import MainnetType from 'src/enums/MainnetType';
import AssetList from './AssetList';

const usdFormatter = new Intl.NumberFormat('en', {
  style: 'currency',
  currency: 'USD',
});

const Loan: FunctionComponent<{ id: string }> = ({ id }) => {
  const { getAssetBondsByNetwork } = useContext(SubgraphContext);
  const { type: mainnetType } = useContext(MainnetContext)
  const assetBondTokens = getAssetBondsByNetwork(mainnetType)
  const [pageNumber, setPageNumber] = useState(1);
  const { t } = useTranslation();
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
  const list = assetBondTokens.filter((product) => {
    return product.reserve.id === id;
  });

  const viewMoreHandler = useCallback(() => {
    setPageNumber((prev) => prev + 1);
  }, [setPageNumber]);

  return (
    <>
      <section className="loan">
        <div>
          <h2>{t('governance.loan_list', { count: list?.length })}</h2>
          <p>{t('loan.loan__content')}</p>
        </div>
        {
          (list?.length === 0) ? (
            <div className="loan__list--null">
              <p>
                {t("loan.loan_list--null")}
              </p>
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
                        className="portfolio__view-button"
                        onClick={() => viewMoreHandler()}>
                        {t('loan.view-more')}
                      </button>
                    </div>
                  )}
                </>
            </>
          )
        }
      </section>
    </>
  );
};

export default Loan;
