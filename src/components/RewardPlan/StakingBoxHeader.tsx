import { BigNumber, constants, utils } from 'ethers';
import moment from 'moment';
import envs from 'src/core/envs';
import Skeleton from 'react-loading-skeleton';
import stakingRoundTimes from 'src/core/data/stakingRoundTimes';
import { formatComma, toCompact } from 'src/utiles/formatters';
import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';
import elfi from 'src/assets/images/ELFI.png';
import el from 'src/assets/images/el.png';
import Token from 'src/enums/Token';

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
      <div className="jreward__title">
        <div>
          <div>
            <img src={tokenImg} />
            <div className="spoqa__bold">
              {t(`reward.${props.unit === 'DAI' ? 'elfi' : 'el'}_staking`)}
            </div>
          </div>
          <p className="spoqa">{t('reward.elfi_staking_content')}</p>
        </div>
        {/* <a
          className="jreward__button"
          target="_blank"
          href={`${envs.appURI}/staking/ELFI`}>
          <p>{t('reward.staking')}</p>
        </a> */}
      </div>
      <div className="jreward__staking-wrapper">
        <div>
          <p className="spoqa__bold">{`${t('reward.nth_staking', {
            nth: props.nth,
          })} `}</p>
          <div>
            <p className="spoqa__bold data">
              {props.loading ? (
                <Skeleton width={50} />
              ) : props.poolApr.eq(constants.MaxUint256) ||
                current.isAfter(stakingRoundTimes[props.staking].endedAt) ? (
                '-'
              ) : (
                toCompact(parseFloat(utils.formatUnits(props.poolApr, 25)))
              )}
            </p>
            <span className="spoqa__bold">%</span>
          </div>
        </div>
        <div>
          <p className="spoqa__bold">{`${t('reward.nth_staking_amount', {
            nth: props.nth,
          })} `}</p>
          <div>
            <p className="spoqa__bold data">
              {props.loading ? (
                <Skeleton width={50} />
              ) : (
                formatComma(props.poolPrincipal)
              )}
            </p>
            <span className="spoqa__bold">
              {props.unit === 'DAI' ? 'ELFI' : 'EL'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default StakingBoxHeader;
