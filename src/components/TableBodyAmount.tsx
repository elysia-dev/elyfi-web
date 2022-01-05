import moment from 'moment';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import ReservesContext from 'src/contexts/ReservesContext';
import { daiMoneyPoolTime } from 'src/core/data/moneypoolTimes';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';

const TableBodyAmount: React.FunctionComponent<{
  header: string;
  buttonEvent: ((e: any) => void) | undefined;
  buttonContent: string;
  value: string | JSX.Element;
  tokenName: string;
  walletBalance?: string;
}> = ({
  header,
  buttonEvent,
  buttonContent,
  value,
  tokenName,
  walletBalance,
}) => {
  const { t } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();
  const { round } = useContext(ReservesContext);
  const isStartedRound = moment().isAfter(
    daiMoneyPoolTime[round - 1].startedAt,
  );

  return mediaQuery === MediaQuery.PC ? (
    <>
      <div>
        <h2>{header}</h2>
      </div>
      <div className="deposit__table__body__amount">
        <div
          onClick={buttonEvent}
          className={`deposit__table__body__amount__button ${
            isStartedRound ? '' : 'disable'
          }`}>
          <p>{buttonContent}</p>
        </div>
        <div>
          <h2>
            {value}
            <span className="bold">&nbsp;{tokenName}</span>
          </h2>
          <p>
            {walletBalance
              ? `${t('dashboard.wallet_balance')} : ` +
                walletBalance +
                ' ' +
                tokenName
              : ''}
          </p>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="deposit__table__body__amount">
        <div>
          <h2>{header}</h2>
        </div>
        <div>
          <h2>
            {value}
            <span className="bold">&nbsp;{tokenName}</span>
          </h2>
          <p>
            {walletBalance
              ? `${t('dashboard.wallet_balance')} : ` +
                walletBalance +
                ' ' +
                tokenName
              : ''}
          </p>
        </div>
      </div>
      <div
        onClick={buttonEvent}
        className={`deposit__table__body__amount__button ${
          isStartedRound ? '' : 'disable'
        }`}>
        <p>{buttonContent}</p>
      </div>
    </>
  );
};

export default TableBodyAmount;
