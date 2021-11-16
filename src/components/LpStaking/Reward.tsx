import { useTranslation } from 'react-i18next';
import { FunctionComponent } from 'react';
import elfi from 'src/assets/images/ELFI.png';
import eth from 'src/assets/images/eth-color.png';
import dai from 'src/assets/images/dai.png';
import { formatDecimalFracionDigit } from 'src/utiles/formatters';
import Token from 'src/enums/Token';
import RewardTypes from 'src/core/types/RewardTypes';
import Guide from '../Guide';
import Button from './Button';

type Props = {
  rewardToReceive: RewardTypes;
  onHandler: () => void;
};

const Reward: FunctionComponent<Props> = (props) => {
  const { rewardToReceive, onHandler } = props;
  const { t } = useTranslation();

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 110,
        }}>
        <div className="spoqa__bold">
          {t('lpstaking.reward_amount')}
          <Guide content={t('guide.receive_reward')} />
        </div>
        <div className="header_line" />
      </div>
      <div className="lp_reward_content_wrapper">
        <div className="spoqa__bold lp_reward_content">
          <div className="lp_token_wrapper">
            <div>
              <img src={elfi} alt={elfi} />
              {Token.ELFI}
            </div>
            <div
              style={{
                color: '#00BFFF',
              }}>
              {`${formatDecimalFracionDigit(rewardToReceive.elfiReward, 4)} `}
              <div>{Token.ELFI}</div>
            </div>
          </div>
          <div className="lp_token_wrapper">
            <div>
              <img src={eth} alt={eth} />
              {Token.ETH}
            </div>
            <div
              style={{
                color: '#627EEA',
              }}>
              {`${formatDecimalFracionDigit(rewardToReceive.ethReward, 4)} `}
              <div>{Token.ETH}</div>
            </div>
          </div>
          <div className="lp_token_wrapper">
            <div>
              <img src={dai} alt={dai} />
              {Token.DAI}
            </div>
            <div
              style={{
                color: '#FBC54E',
              }}>
              {`${formatDecimalFracionDigit(rewardToReceive.daiReward, 4)} `}
              <div>{Token.DAI}</div>
            </div>
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: 25,
          }}>
          <Button onHandler={onHandler} btnTitle={t('staking.claim_reward')} />
        </div>
      </div>
    </>
  );
};

export default Reward;
