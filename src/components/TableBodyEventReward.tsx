import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import moment from 'moment';
import { FunctionComponent } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { formatSixFracionDigit } from 'src/utiles/formatters';

type Props = {
  moneyPoolTime: string;
  expectedAddIncentiveBefore: BigNumber;
  expectedAddIncentiveAfter: BigNumber;
};

const TableBodyEventReward: FunctionComponent<Props> = ({
  moneyPoolTime,
  expectedAddIncentiveAfter,
  expectedAddIncentiveBefore,
}) => {
  const { i18n } = useTranslation();
  const { account } = useWeb3React();
  return (
    <div className="deposit__table__body__event-box">
      <div className="deposit__table__body__event-box__title">EVENT</div>
      <div className="deposit__table__body__event-box__content">
        <div>
          <div className="bold">
            <span>*</span> 추가 보상 이벤트
          </div>
          <Link to={`rewardplan/deposit`}>
            <div className="deposit__table__body__amount__button event-button">
              <p>자세히 보기</p>
            </div>
          </Link>
        </div>
        <div>
          <div className="bold">
            {' '}
            {account ? (
              <CountUp
                className="bold amounts"
                start={parseFloat(formatEther(expectedAddIncentiveBefore))}
                end={parseFloat(formatEther(expectedAddIncentiveBefore))}
                formattingFn={(number) => {
                  return formatSixFracionDigit(number);
                }}
                decimals={6}
                duration={1}
              />
            ) : (
              '-'
            )}
            <span>{' ELFI'}</span>
          </div>
          <p>{moneyPoolTime}</p>
        </div>
      </div>
    </div>
  );
};
export default TableBodyEventReward;
