import { useTranslation } from 'react-i18next';
import { FunctionComponent, useContext } from 'react';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import { formatDecimalFracionDigit } from 'src/utiles/formatters';
import Token from 'src/enums/Token';
import RewardTypes from 'src/core/types/RewardTypes';
import { StakingTitleProps } from 'src/core/types/LpStakingTypeProps';
import { Web3Context } from 'src/providers/Web3Provider';
import Guide from '../Guide';
import Button from './Button';

const Reward: FunctionComponent<StakingTitleProps> = (props) => {
  const { account } = useContext(Web3Context);
  const { rewardToReceive, onHandler } = props;
  const { t } = useTranslation();

  return (
    <>
      <div className="staking__lp__reward__header">
        <h2>
          {t('lpstaking.reward_amount')}
        </h2>
        <Guide content={t('guide.receive_reward')} />
      </div>
      <div className="staking__lp__reward__content">
        <div className="staking__lp__reward__content__container">
          <div className="staking__lp__reward__content__wrapper">
            <div className="staking__lp__reward__image">
              <img src={elfi} alt={elfi} />
              <h2>{Token.ELFI}</h2>
            </div>
            <div className="staking__lp__reward__content__amount">
              <h2>
                {`${formatDecimalFracionDigit(rewardToReceive.elfiReward, 4)} `}
              </h2>
              <h2>
                {Token.ELFI}
              </h2>
            </div>
          </div>
          <div className="staking__lp__reward__content__wrapper">
            <div className="staking__lp__reward__image">
              <img src={eth} alt={eth} />
              <h2>{Token.ETH}</h2>
            </div>
            <div className="staking__lp__reward__content__amount">
              <h2>
                {`${formatDecimalFracionDigit(rewardToReceive.ethReward, 4)} `}
              </h2>
              <h2>{Token.ETH}</h2>
            </div>
          </div>
          <div className="staking__lp__reward__content__wrapper">
            <div className="staking__lp__reward__image">
              <img src={dai} alt={dai} />
              <h2>{Token.DAI}</h2>
            </div>
            <div className="staking__lp__reward__content__amount">
              <h2>
              {`${formatDecimalFracionDigit(rewardToReceive.daiReward, 4)} `}
              </h2>
              <h2>{Token.DAI}</h2>
            </div>
          </div>
        </div>
        <div className="staking__lp__reward__button__wrapper">
          <div onClick={() => account && onHandler()} className="staking__lp__reward__button">
            <p>
              {t('staking.claim_reward')}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reward;
