import { BigNumber } from 'ethers';
import { FunctionComponent, ReactElement } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import { formatCommaSmallFourDisits } from 'src/utiles/formatters';

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
    <div className="component__data-info">
      {props.miningDescription.map((data, _index) => {
        return (
          <div>
            <p>{data[0]}</p>
            <p className="data">{data[1]}</p>
          </div>
        );
      })}
      <div>
        <p>
          {props.unit === 'ELFI'
            ? t('reward.accumulated_mining')
            : t('reward.accumulated_reward')}
        </p>
        <p>
          <CountUp
            start={props.start}
            end={props.end}
            decimals={4}
            duration={1}
            formattingFn={(number) => formatCommaSmallFourDisits(number)}
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
        <p>
          <CountUp
            start={props.miningStart}
            end={props.miningEnd}
            decimals={4}
            duration={1}
            formattingFn={(number) => formatCommaSmallFourDisits(number)}
          />
          {` ${props.unit}`}
        </p>
      </div>
    </div>
  );
};

export default RewardDetailInfo;
