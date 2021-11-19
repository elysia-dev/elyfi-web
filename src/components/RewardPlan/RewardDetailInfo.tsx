import { BigNumber } from 'ethers';
import { FunctionComponent, ReactElement } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import { formatCommaSubSmall } from 'src/utiles/formatters';

type Props = {
  start: number;
  end: number;
  miningStart: number;
  miningEnd: number;
  miningDescription: string[][];
  unit: string;
};

const RewardDetailInfo: FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <div className="jreward__data-wrapper--right">
      {props.miningDescription.map((data, _index) => {
        return (
          <div
            key={`elfi_mining_terms_${_index}`}
            className={`reward__data__${_index}`}>
            <p>{data[0]}</p>
            <p className="spoqa data">{data[1]}</p>
          </div>
        );
      })}
      <div>
        <p>
          {props.unit === 'ELFI'
            ? t('reward.accumulated_mining')
            : t('reward.accumulated_reward')}
        </p>
        <p className="spoqa data">
          <CountUp
            className="spoqa data"
            start={props.start}
            end={props.end}
            decimals={4}
            duration={1}
            formattingFn={(number) => formatCommaSubSmall(number)}
          />
          {` ${props.unit}`}
        </p>
      </div>
      <div>
        <p>
          {props.unit === 'ELFI'
            ? t('reward.mining_limit')
            : t('reward.reward_limit')}
        </p>
        <p className="spoqa data">
          <CountUp
            className="spoqa data"
            start={props.miningStart}
            end={props.miningEnd}
            decimals={4}
            duration={1}
            formattingFn={(number) => formatCommaSubSmall(number)}
          />
          {` ${props.unit}`}
        </p>
      </div>
    </div>
  );
};

export default RewardDetailInfo;
