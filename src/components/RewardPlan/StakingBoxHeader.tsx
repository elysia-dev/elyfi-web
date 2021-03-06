import { BigNumber, constants, utils } from 'ethers';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import { IStakingPoolRound } from 'src/core/data/stakingRoundTimes';
import { formatComma, toCompact } from 'src/utiles/formatters';
import { Trans, useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';
import Token from 'src/enums/Token';
import elfi from 'src/assets/images/ELFI.png';
import el from 'src/assets/images/el.png';

type Props = {
  nth: string;
  loading: boolean;
  poolApr: BigNumber;
  poolPrincipal: BigNumber;
  stakedRound: number;
  unit: string;
  stakingRoundDate: IStakingPoolRound[];
};

const StakingBoxHeader: FunctionComponent<Props> = (props) => {
  const current = moment();
  const { t } = useTranslation();
  const tokenName = props.unit !== Token.ELFI ? 'ELFI' : 'EL';
  const currentNth = props.nth;

  return (
    <>
      <div className="reward__token__header">
        <img src={props.unit === Token.ELFI ? el : elfi} />
        <h2
          className={`reward__token__header__token ${
            props.unit === Token.ELFI ? 'el' : ''
          }`}>
          <Trans
            i18nKey={'reward.staking__nth'}
            values={{
              token: tokenName,
              nth: currentNth,
            }}
          />
        </h2>
      </div>
      <div className="reward__token__staking">
        <div>
          <p>{`${t('reward.staking__nth--apr', {
            nth: props.nth,
          })} `}</p>
          <div>
            <h2 className="percent">
              {props.loading ||
              props.stakingRoundDate.length - 1 < props.stakedRound ? (
                <Skeleton width={50} />
              ) : props.poolApr.eq(constants.MaxUint256) ||
                current.isAfter(
                  props.stakingRoundDate[props.stakedRound].endedAt,
                ) ? (
                '-'
              ) : (
                toCompact(parseFloat(utils.formatUnits(props.poolApr, 25)))
              )}
            </h2>
          </div>
        </div>
        <div>
          <p>{`${t('reward.staking__nth--amount', {
            nth: props.nth,
          })} `}</p>
          <div>
            <h2>
              {props.loading ? (
                <Skeleton width={50} />
              ) : (
                formatComma(props.poolPrincipal)
              )}
            </h2>
            <span className="bold">{tokenName}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StakingBoxHeader;
