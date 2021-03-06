import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { formatEther } from 'ethers/lib/utils';
import { FunctionComponent, useContext } from 'react';
import CountUp from 'react-countup';
import { Trans, useTranslation } from 'react-i18next';
import ReserveToken from 'src/core/types/ReserveToken';
import MainnetContext from 'src/contexts/MainnetContext';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import { formatSixFracionDigit } from 'src/utiles/formatters';

type Props = {
  moneyPoolTime: string;
  expectedAdditionalIncentiveBefore: BigNumber;
  expectedAdditionalIncentiveAfter: BigNumber;
  buttonEvent: ((e: any) => void) | undefined;
  tokenName: ReserveToken;
  isWrongMainnet: boolean;
};

const TableBodyEventReward: FunctionComponent<Props> = ({
  moneyPoolTime,
  expectedAdditionalIncentiveAfter,
  expectedAdditionalIncentiveBefore,
  buttonEvent,
  tokenName,
  isWrongMainnet,
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
              <h2 className={`bold ${tokenName}`}>
                {t('dashboard.deposit_add_reward_event')}
              </h2>
              <div
                onClick={buttonEvent}
                className="deposit__table__body__amount__button event-button">
                <p>{t('dashboard.claim_reward')}</p>
              </div>
            </div>
            <div>
              <div className="bold">
                {' '}
                {account && !unsupportedChainid ? (
                  isWrongMainnet ? (
                    '-'
                  ) : (
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
                  )
                ) : (
                  '-'
                )}
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
              <h2 className={`bold ${tokenName}`}>
                {t('dashboard.deposit_add_reward_event')}
              </h2>
              <div>
                <div className="bold">
                  {' '}
                  {account && !unsupportedChainid ? (
                    isWrongMainnet ? (
                      '-'
                    ) : (
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
                    )
                  ) : (
                    '-'
                  )}
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
