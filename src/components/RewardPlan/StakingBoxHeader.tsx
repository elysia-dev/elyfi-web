import { BigNumber, constants, utils } from 'ethers';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import { formatComma, toCompact } from 'src/utiles/formatters';
import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';
import Token from 'src/enums/Token';
import elfi from 'src/assets/images/ELFI.png';
import el from 'src/assets/images/el.png';

type Props = {
  nth: string;
  loading: boolean;
  poolApr: BigNumber;
  poolPrincipal: BigNumber;
  staking: number;
  unit: string;
};

const StakingBoxHeader: FunctionComponent<Props> = (props) => {
  const current = moment();
  const { t } = useTranslation();
  const tokenImg = props.unit === Token.DAI ? elfi : el;
  return (
    <>
      <div className="reward__token__header">
        <img src={tokenImg} />
        <h2>
          {props.unit === 'DAI' ? 'ELFI' : 'EL'} {props.nth}차 스테이킹
        </h2>
      </div>
      <div className="reward__token__staking">
        <div>
          <p>{`${t('reward.nth_staking', {
              nth: props.nth,
            })} `}</p>
          <div>
            <h2 className="percent">
              {props.loading ? (
                <Skeleton width={50} />
              ) : props.poolApr.eq(constants.MaxUint256) ||
                current.isAfter(stakingRoundTimes[props.staking].endedAt) ? (
                '-'
              ) : (
                toCompact(parseFloat(utils.formatUnits(props.poolApr, 25)))
              )}
            </h2>
          </div>
        </div>
        <div>
          <p>{`${t('reward.nth_staking_amount', {
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
            <span className="bold">
              {props.unit === 'DAI' ? 'ELFI' : 'EL'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StakingBoxHeader;
