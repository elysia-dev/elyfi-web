import { useWeb3React } from '@web3-react/core';
import { constants } from 'ethers';
import moment from 'moment';
import ReactGA from 'react-ga';
import { FunctionComponent, SetStateAction, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BigNumber } from '@elysia-dev/contract-typechain/node_modules/ethers';

import RoundData from 'src/core/types/RoundData';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import {
  formatCommaSmall,
  formatSixFracionDigit,
  toPercentWithoutSign,
} from 'src/utiles/formatters';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import ModalViewType from 'src/enums/ModalViewType';
import Token from 'src/enums/Token';
import { roundTimes } from 'src/core/data/stakingRoundTimes';
import MainnetContext from 'src/contexts/MainnetContext';
import StakingModalType from 'src/enums/StakingModalType';
import CountUp from 'react-countup';
import { formatEther } from 'ethers/lib/utils';

type Props = {
  roundData: RoundData[];
  stakedToken: Token.EL | Token.ELFI;
  rewardToken: Token.ELFI | Token.DAI | Token.BUSD;
  setModalType: (value: SetStateAction<string>) => void;
  setRoundModal: (value: SetStateAction<number>) => void;
  setModalValue: (value: SetStateAction<BigNumber>) => void;
  currentRound: RoundData;
  expectedReward: {
    before: BigNumber;
    value: BigNumber;
  };
  isWrongMainnet: boolean;
  setIsUnstaking: () => void;
};
const current = moment();

const StakingProgress: FunctionComponent<Props> = (props) => {
  const {
    roundData,
    stakedToken,
    rewardToken,
    setModalType,
    setRoundModal,
    setModalValue,
    currentRound,
    expectedReward,
    isWrongMainnet,
    setIsUnstaking,
  } = props;
  const { t, i18n } = useTranslation();
  const { account } = useWeb3React();
  const { value: mediaQuery } = useMediaQueryType();
  const { type: getMainnetType } = useContext(MainnetContext);

  const stakingRoundDate = roundTimes(stakedToken, getMainnetType);

  const roundInProgress = stakingRoundDate.findIndex((date) => {
    return moment().isBetween(date.startedAt, date.endedAt);
  });

  const currentPhase = useMemo(() => {
    const pastRoundCount = stakingRoundDate.filter(
      (round) => current.diff(round.startedAt) >= 0,
    ).length;
    return pastRoundCount === 0 ? 1 : pastRoundCount;
  }, [current]);

  const round = roundInProgress === -1 ? currentPhase : roundInProgress;
  const startedAt = stakingRoundDate[round].startedAt;
  const endedAt = stakingRoundDate[round].endedAt;

  return (
    <section className="staking__round__remaining-data current">
      <div className="staking__round__remaining-data__title">
        <div>
          <h2>
            {t('staking.nth', {
              nth: toOrdinalNumber(i18n.language, roundInProgress + 1),
            })}
          </h2>
          <p>
            {startedAt.format('YYYY.MM.DD HH:mm:ss')}
            <br />
            ~&nbsp;
            {endedAt.format('YYYY.MM.DD HH:mm:ss')} (KST)
          </p>
        </div>
        {mediaQuery === MediaQuery.PC && (
          <div>
            <p>APR</p>
            <h2 className="percent">
              {current.diff(startedAt) <= 0 ||
              roundData[round]?.apr.eq(constants.MaxUint256) ||
              current.diff(endedAt) >= 0
                ? '-'
                : toPercentWithoutSign(roundData[round].apr || 0)}
            </h2>
          </div>
        )}
      </div>
      <div className="staking__round__remaining-data__body">
        {mediaQuery === MediaQuery.PC ? (
          <>
            <div>
              <h2>{t('staking.staking_amount')}</h2>
              <div>
                <h2>
                  {`${
                    current.diff(startedAt) > 0
                      ? formatCommaSmall(
                          roundData[round]?.accountPrincipal || '0',
                        )
                      : '-'
                  }`}
                  <span className="token-amount bold">{stakedToken}</span>
                </h2>
                <div
                  className={`staking__round__button ${
                    current.diff(startedAt) <= 0 || !account || isWrongMainnet
                      ? ' disable'
                      : ''
                  }`}
                  onClick={(e) => {
                    if (
                      current.diff(startedAt) < 0 ||
                      current.diff(endedAt) > 0 ||
                      !account ||
                      isWrongMainnet
                    ) {
                      return;
                    }
                    ReactGA.modalview(
                      stakedToken + ModalViewType.StakingOrUnstakingModal,
                    );
                    setRoundModal(round);
                    setModalValue(currentRound.accountPrincipal);
                    setModalType(StakingModalType.Staking);
                    setIsUnstaking();
                  }}>
                  <p>{t('staking.staking_btn')}</p>
                </div>
              </div>
            </div>
            <div>
              <h2>{t('staking.reward_amount')}</h2>
              <div>
                <h2>
                  {expectedReward.before.isZero() || !account ? (
                    '-'
                  ) : (
                    <CountUp
                      start={parseFloat(formatEther(expectedReward.before))}
                      end={parseFloat(
                        formatEther(
                          expectedReward.before.isZero()
                            ? currentRound.accountReward
                            : expectedReward.value,
                        ),
                      )}
                      formattingFn={(number) => {
                        return formatSixFracionDigit(number);
                      }}
                      decimals={6}
                      duration={1}
                    />
                  )}
                  <span className="token-amount bold">{rewardToken}</span>
                </h2>
                <div
                  className={`staking__round__button ${
                    expectedReward.value.isZero() || !account ? ' disable' : ''
                  }`}
                  onClick={(e) => {
                    if (expectedReward.value.isZero() || !account) {
                      return;
                    }

                    ReactGA.modalview(
                      stakedToken + ModalViewType.StakingIncentiveModal,
                    );
                    current.diff(startedAt) > 0 && setRoundModal(round);
                    setModalValue(expectedReward.value);
                    setModalType(StakingModalType.Claim);
                  }}>
                  <p>{t('staking.claim_reward')}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <div>
                <p>APR</p>
                <h2 className="percent">
                  {current.diff(startedAt) <= 0 ||
                  roundData[roundInProgress]?.apr.eq(constants.MaxUint256) ||
                  current.diff(endedAt) >= 0
                    ? '-'
                    : toPercentWithoutSign(roundData[round].apr || 0)}
                </h2>
              </div>
              <div>
                <p>{t('staking.staking_amount')}</p>
                <h2>
                  {`${
                    current.diff(startedAt) > 0
                      ? formatCommaSmall(
                          roundData[round]?.accountPrincipal || '0',
                        )
                      : '-'
                  }`}
                  <span className="token-amount bold">{stakedToken}</span>
                </h2>
              </div>
              <div>
                <p>{t('staking.reward_amount')}</p>
                <h2>
                  {expectedReward.before.isZero() || !account ? (
                    '-'
                  ) : (
                    <CountUp
                      start={parseFloat(formatEther(expectedReward.before))}
                      end={parseFloat(
                        formatEther(
                          expectedReward.before.isZero()
                            ? currentRound.accountReward
                            : expectedReward.value,
                        ),
                      )}
                      formattingFn={(number) => {
                        return formatSixFracionDigit(number);
                      }}
                      decimals={6}
                      duration={1}
                    />
                  )}
                  <span className="token-amount bold">{rewardToken}</span>
                </h2>
              </div>
            </div>
            <div>
              <div
                className={`staking__round__button ${
                  current.diff(startedAt) <= 0 || !account || isWrongMainnet
                    ? ' disable'
                    : ''
                }`}
                onClick={(e) => {
                  if (
                    current.diff(startedAt) < 0 ||
                    current.diff(endedAt) > 0 ||
                    !account ||
                    isWrongMainnet
                  ) {
                    return;
                  }
                  ReactGA.modalview(
                    stakedToken + ModalViewType.StakingOrUnstakingModal,
                  );
                  setRoundModal(round);
                  setModalValue(currentRound.accountPrincipal);
                  setModalType(StakingModalType.Staking);
                  setIsUnstaking();
                }}>
                <p>{t('staking.staking_btn')}</p>
              </div>
              <div
                className={`staking__round__button ${
                  expectedReward.before.isZero() || !account ? ' disable' : ''
                }`}
                onClick={(e) => {
                  if (expectedReward.before.isZero() || !account) {
                    return;
                  }
                  ReactGA.modalview(
                    stakedToken + ModalViewType.StakingIncentiveModal,
                  );
                  current.diff(startedAt) > 0 && setRoundModal(round);
                  setModalValue(expectedReward.value);
                  setModalType(StakingModalType.Claim);
                }}>
                <p>{t('staking.claim_reward')}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default StakingProgress;