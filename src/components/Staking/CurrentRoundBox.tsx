import moment from 'moment';
import { useTranslation, Trans } from 'react-i18next';
import { IStakingPoolRound } from 'src/core/data/stakingRoundTimes';
import RoundData from 'src/core/types/RoundData';
import MediaQuery from 'src/enums/MediaQuery';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';
import { constants } from 'ethers';
import { toPercentWithoutSign } from 'src/utiles/formatters';

interface Props {
  currentPhase: number;
  mediaQuery: MediaQuery;
  stakingRoundDate: IStakingPoolRound[];
  currentRound: RoundData;
}

const CurrentRoundBox: React.FC<Props> = ({
  currentPhase,
  mediaQuery,
  stakingRoundDate,
  currentRound,
}) => {
  const { t, i18n } = useTranslation();
  const current = moment();

  return (
    <>
      {!current.isBetween(
        stakingRoundDate[currentPhase - 1].startedAt,
        stakingRoundDate[currentPhase - 1].endedAt,
      ) ? (
        <p>{t('staking.current_round_null')}</p>
      ) : (
        <>
          <div>
            <div>
              <p>
                <Trans
                  i18nKey="staking.staking__in_progress"
                  values={{
                    nth: toOrdinalNumber(i18n.language, currentPhase),
                  }}
                />
              </p>
            </div>
            {mediaQuery === MediaQuery.PC ? (
              <h2>
                {stakingRoundDate[currentPhase - 1].startedAt.format(
                  'YYYY.MM.DD HH:mm:ss',
                )}
                &nbsp;~&nbsp;
                {stakingRoundDate[currentPhase - 1].endedAt.format(
                  'YYYY.MM.DD HH:mm:ss',
                )}
                &nbsp;(KST)
              </h2>
            ) : (
              <div>
                <h2>
                  {stakingRoundDate[currentPhase - 1].startedAt.format(
                    'YYYY.MM.DD HH:mm:ss',
                  )}
                </h2>
                <h2>&nbsp;~&nbsp;</h2>
                <h2>
                  {stakingRoundDate[currentPhase - 1].endedAt.format(
                    'YYYY.MM.DD HH:mm:ss',
                  )}
                  &nbsp;(KST)
                </h2>
              </div>
            )}
          </div>
          <div>
            <p>APR</p>
            <h2 className="percent">
              {current.diff(stakingRoundDate[currentPhase - 1].startedAt) <=
                0 ||
              currentRound?.apr.eq(constants.MaxUint256) ||
              current.diff(stakingRoundDate[currentPhase - 1].endedAt) >= 0
                ? '-'
                : toPercentWithoutSign(currentRound?.apr || '0')}
            </h2>
          </div>
        </>
      )}
    </>
  );
};

export default CurrentRoundBox;
