import { useTranslation } from 'react-i18next';
import { FunctionComponent, SetStateAction, useContext } from 'react';
import ReactGA from 'react-ga';
import { formatEther } from 'ethers/lib/utils';
import CountUp from 'react-countup';

import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import MediaQuery from 'src/enums/MediaQuery';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MainnetContext from 'src/contexts/MainnetContext';
import Token from 'src/enums/Token';
import { roundTimes } from 'src/core/data/stakingRoundTimes';
import { formatCommaSmall, formatSixFracionDigit } from 'src/utiles/formatters';
import RoundData from 'src/core/types/RoundData';
import moment from 'moment';
import StakingModalType from 'src/enums/StakingModalType';
import ModalViewType from 'src/enums/ModalViewType';
import { BigNumber } from 'ethers';
import MainnetType from 'src/enums/MainnetType';

type Props = {
  index: number;
  item: RoundData;
  stakedToken: Token.EL | Token.ELFI;
  rewardToken: Token.ELFI | Token.DAI | Token.BUSD;
  roundInProgress: number;
  setModalType: (value: SetStateAction<string>) => void;
  setRoundModal: (value: SetStateAction<number>) => void;
  setModalValue: (value: SetStateAction<BigNumber>) => void;
};

const FinishedStaking: FunctionComponent<Props> = (props) => {
  const {
    index,
    item,
    stakedToken,
    rewardToken,
    roundInProgress,
    setModalType,
    setRoundModal,
    setModalValue,
  } = props;
  const { t, i18n } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();
  const { type: getMainnetType } = useContext(MainnetContext);
  const stakingRoundDate = roundTimes(stakedToken, getMainnetType);
  const current = moment();

  const migratable = (staked: Token, round: number): boolean => {
    if (round >= roundInProgress) return false;
    if (staked === Token.ELFI && getMainnetType === MainnetType.Ethereum) {
      return (
        round >= 2 && moment().diff(stakingRoundDate[round + 1].startedAt) > 0
      );
    } else {
      return moment().diff(stakingRoundDate[round + 1].startedAt) > 0;
    }
  };

  return (
    <div className="staking__round__previous">
      <div>
        <div className="staking__round__previous__title">
          <h2>
            {t('staking.nth', {
              nth: toOrdinalNumber(i18n.language, index + 1),
            })}
          </h2>
          {mediaQuery === MediaQuery.PC ? (
            <p>
              {stakingRoundDate[index].startedAt.format('YYYY.MM.DD HH:mm:ss')}
              <br />
              ~&nbsp;
              {stakingRoundDate[index].endedAt.format('YYYY.MM.DD HH:mm:ss')}
              &nbsp;(KST)
            </p>
          ) : (
            <div>
              <p>
                {stakingRoundDate[index].startedAt.format(
                  'YYYY.MM.DD HH:mm:ss',
                )}
              </p>
              <p>
                <br />
                ~&nbsp;
              </p>
              <p>
                {stakingRoundDate[index].endedAt.format('YYYY.MM.DD HH:mm:ss')}
                &nbsp;(KST)
              </p>
            </div>
          )}
        </div>
        <div className="staking__round__previous__body">
          <div>
            <p>{t('staking.staking_amount')}</p>
            <h2>
              {`${formatCommaSmall(item.accountPrincipal) || '-'}`}
              <span className="token-amount bold">{stakedToken}</span>
            </h2>
          </div>
          <div>
            <p>{t('staking.reward_amount')}</p>
            <h2>
              {item.accountReward.isZero() ? (
                '-'
              ) : (
                <CountUp
                  start={parseFloat(formatEther(item.accountReward))}
                  end={parseFloat(formatEther(item.accountReward))}
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
      </div>

      <div className="staking__round__button__wrapper">
        <div
          className={`staking__round__button ${
            item.accountPrincipal.isZero() ? ' disable' : ''
          }`}
          onClick={(e) => {
            if (item.accountPrincipal.isZero()) {
              return;
            }

            if (migratable(stakedToken, index)) {
              if (stakedToken === Token.ELFI) {
                setModalType(StakingModalType.MigrationDisable);
              } else {
                ReactGA.modalview(
                  stakedToken + ModalViewType.MigrationOrUnstakingModal,
                );
                setRoundModal(index);
                setModalValue(item.accountPrincipal);
                setModalType(StakingModalType.Migration);
              }
              return;
            }
            if (current.diff(stakingRoundDate[index].startedAt) > 0) {
              ReactGA.modalview(
                stakedToken + ModalViewType.StakingOrUnstakingModal,
              );
              setRoundModal(index);
              setModalValue(item.accountPrincipal);
              if (stakedToken === Token.EL) {
                setModalType(StakingModalType.Staking);
              }
            }
          }}>
          <p>
            {stakedToken === Token.ELFI
              ? t('staking.unstaking')
              : migratable(stakedToken, index)
              ? t('staking.unstaking_migration')
              : t('staking.staking_btn')}
          </p>
        </div>
        <div
          className={`staking__round__button ${
            item.accountReward.isZero() ? ' disable' : ''
          }`}
          onClick={(e) => {
            if (item.accountReward.isZero()) {
              return;
            }
            ReactGA.modalview(
              stakedToken + ModalViewType.StakingIncentiveModal,
            );
            current.diff(stakingRoundDate[index].startedAt) > 0 &&
              setRoundModal(index);
            setModalValue(item.accountReward);
            setModalType(StakingModalType.Claim);
          }}>
          <p>{t('staking.claim_reward')}</p>
        </div>
      </div>
    </div>
  );
};

export default FinishedStaking;
