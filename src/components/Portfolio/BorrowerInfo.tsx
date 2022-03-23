import { lazy, useMemo } from "react";
import { useTranslation } from "react-i18next";
import moment from 'moment';
import MediaQuery from "src/enums/MediaQuery";
import Guide from 'src/components/Guide';
import { AssetBondIdData } from 'src/utiles/parseTokenId';
import LoanStatus from 'src/enums/LoanStatus';
import toLoanStatus from 'src/utiles/toLoanStatus';
import { IReserve } from "src/core/data/reserves";
import { toUsd, toPercent } from 'src/utiles/formatters';
import maturityFormmater from 'src/utiles/maturityFormmater';
import { IAssetBond } from 'src/core/types/reserveSubgraph';

const LazyImage = lazy(() => import("src/utiles/lazyImage"));

interface Props {
  collateralLogo: string,
  parsedTokenId: AssetBondIdData,
  abToken: IAssetBond,
  blockExplorerUrls: string,
  tokenInfo: IReserve,
  mediaQuery: MediaQuery
}

const BorrowInfo: React.FC<Props> = ({
  collateralLogo,
  parsedTokenId,
  abToken,
  blockExplorerUrls,
  tokenInfo,
  mediaQuery
}) => {
  const { t } = useTranslation();

  const divStyle = useMemo(
    () => ({
      color: '#888888',
      fontSize: mediaQuery === MediaQuery.PC ? '15px' : '12px',
      letterSpacing: -0.5
    }),
    [mediaQuery],
  );

  return (
    <>
      <div className="portfolio__borrower__header">
        <LazyImage src={collateralLogo} name="collateral logo" />
        <div>
          <p>{t('loan.borrower')}</p>
          <p>Elyloan Inc</p>
        </div>
        <div>
          <p>{t('loan.license_number')}</p>
          <p>220111-0189192</p>
        </div>
        <div>
          <p>{t('loan.wallet_address')}</p>
          <a
            href="https://etherscan.io/address/0x9FCdc09bF1e0f933e529325Ac9D24f56034d8eD7"
            target="_blank"
            rel="noopener noreferer">
            <p className="link">
              {'0x9FCdc09bF1e0f933e529325Ac9D24f56034d8eD7'.slice(
                0,
                8,
              )}{' '}
              ...{' '}
              {'0x9FCdc09bF1e0f933e529325Ac9D24f56034d8eD7'.slice(-8)}
            </p>
          </a>
        </div>
      </div>
      <div className="portfolio__borrower__data">
        <div className="portfolio__borrower__data--left">
          <div>
            <div style={divStyle}>
              {t('loan.loan__number')}{' '}
              <Guide content={t('portfolio.infomation_popup.0')} />
            </div>
            <p>{parsedTokenId.nonce}</p>
          </div>
          <div>
            <div style={divStyle}>
              {t('loan.loan__status')}
              <Guide
                content={`${t('portfolio.infomation_popup.1')} \n ${t(
                  'portfolio.infomation_popup.3',
                )} \n ${t('portfolio.infomation_popup.5')}`}
              />
            </div>
            <p>
              {t(`words.${LoanStatus[toLoanStatus(abToken.state)]}`)}
            </p>
          </div>
          <div>
            <p>{t('loan.receiving_address')}</p>
            <a
              href={`${blockExplorerUrls}/address/${abToken?.borrower?.id}`}
              target="_blank"
              rel="noopener noreferer">
              <p className={abToken?.borrower?.id ? 'link' : ''}>
                {!!abToken?.borrower?.id === true
                  ? `${abToken?.borrower?.id.slice(
                      0,
                      8,
                    )} ... ${abToken?.borrower?.id.slice(-8)}`
                  : '-'}
              </p>
            </a>
          </div>
          <div>
            <p>{t('loan.loan__borrowed')}</p>
            <p>
              {toUsd(abToken?.principal || '0', tokenInfo.decimals)}
            </p>
          </div>
        </div>

        <div className="portfolio__borrower__data--right">
          <div>
            <p>{t('loan.loan__interest_rate')}</p>
            <p>{toPercent(abToken?.interestRate || '0')}</p>
          </div>
          <div>
            <p>{t('loan.loan__date')}</p>
            <p>
              {abToken?.loanStartTimestamp
                ? moment(abToken.loanStartTimestamp * 1000).format(
                    'YYYY.MM.DD',
                  )
                : '-'}
            </p>
          </div>
          <div>
            <p>{t('loan.maturity_date')}</p>
            <p>{maturityFormmater(abToken)}</p>
          </div>
          <div>
            <div style={divStyle}>
              {t('loan.collateral_nft')}{' '}
              <Guide content={t('portfolio.infomation_popup.7')} />
            </div>
            <p
              title={abToken?.id}
              className="link"
              onClick={() => {
                window.open(
                  `${blockExplorerUrls}/token/${tokenInfo.tokenizer}?a=${abToken?.id}`,
                  '_blank',
                );
              }}>
              {abToken?.id.slice(0, 8)} ... {abToken?.id.slice(-8)}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default BorrowInfo;
