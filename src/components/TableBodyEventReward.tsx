import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { FunctionComponent, useContext } from 'react';
import CountUp from 'react-countup';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ReserveToken from 'src/core/types/ReserveToken';
import MainnetContext from 'src/contexts/MainnetContext';
// import ReservesContext from 'src/contexts/ReservesContext';
import MediaQuery from 'src/enums/MediaQuery';
import Token from 'src/enums/Token';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import { formatSixFracionDigit } from 'src/utiles/formatters';

type Props = {
  moneyPoolTime: string;
  buttonEvent: ((e: any) => void) | undefined;
  rewardCountUp: string | JSX.Element;
  tokenName: ReserveToken;
};

const TableBodyEventReward: FunctionComponent<Props> = ({
  moneyPoolTime,
  buttonEvent,
  tokenName,
  rewardCountUp,
}) => {
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const { value: mediaQuery } = useMediaQueryType();
  const { unsupportedChainid } = useContext(MainnetContext);

  return (
    <>
      {mediaQuery === MediaQuery.PC ? (
        <div className="deposit__table__body__event-box">
          <div className="deposit__table__body__event-box__content">
            <div>
              <div className={`bold ${tokenName}`}>
                <Trans>{t('dashboard.deposit_add_reward_event')}</Trans>
              </div>
              <div
                onClick={buttonEvent}
                className="deposit__table__body__amount__button event-button">
                <p>{t('dashboard.claim_reward')}</p>
              </div>
            </div>
            <div>
              <div className="bold">
                {' '}
                {/* {(account && !unsupportedChainid) ? (
                  <CountUp
                    className="bold amounts"
                    start={parseFloat(
                      formatEther(expectedAdditionalIncentiveBefore),
                    )}
                    end={parseFloat(
                      formatEther(expectedAdditionalIncentiveAfter),
                    )}
                    formattingFn={(number) => {
                      return formatSixFracionDigit(number);
                    }}
                    decimals={6}
                    duration={1}
                  />
                ) : (
                  '-'
                )} */}
                <span>{' ELFI'}</span>
              </div>
              <p>{moneyPoolTime}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="deposit__table__body__event-box">
          <div className="deposit__table__body__event-box__content">
            <div>
              <div className={`bold ${tokenName}`}>
                <Trans>{t('dashboard.deposit_add_reward_event')}</Trans>
              </div>
              <div>
                <div className="bold">
                  {' '}
                  {account ? rewardCountUp : '-'}
                  {/* {(account && !unsupportedChainid) ? (
                    <CountUp
                      className="bold amounts"
                      start={parseFloat(
                        formatEther(expectedAdditionalIncentiveBefore),
                      )}
                      end={parseFloat(
                        formatEther(expectedAdditionalIncentiveAfter),
                      )}
                      formattingFn={(number) => {
                        return formatSixFracionDigit(number);
                      }}
                      decimals={6}
                      duration={1}
                    />
                  ) : (
                    '-'
                  )} */}
                  <span>{' ELFI'}</span>
                </div>
                <p>{moneyPoolTime}</p>
              </div>
            </div>
            <div
              onClick={buttonEvent}
              className="deposit__table__body__amount__button event-button">
              <p>{t('dashboard.claim_reward')}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default TableBodyEventReward;
