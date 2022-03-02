import { FunctionComponent, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import MainnetContext from 'src/contexts/MainnetContext';
import { roundTimes } from 'src/core/data/stakingRoundTimes';
import MediaQuery from 'src/enums/MediaQuery';
import Token from 'src/enums/Token';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import toOrdinalNumber from 'src/utiles/toOrdinalNumber';

type Props = {
  index: number;
  stakedToken: Token.EL | Token.ELFI;
  rewardToken: Token.ELFI | Token.DAI | Token.BUSD;
};

const NextStaking: FunctionComponent<Props> = (props) => {
  const { index, stakedToken, rewardToken } = props;
  const { t, i18n } = useTranslation();
  const { value: mediaQuery } = useMediaQueryType();
  const { type: getMainnetType } = useContext(MainnetContext);

  const stakingRoundDate = roundTimes(stakedToken, getMainnetType);

  return (
    <section className="staking__round__remaining-data waiting">
      <div className="staking__round__remaining-data__title">
        <div>
          <h2>
            {t('staking.nth', {
              nth: toOrdinalNumber(i18n.language, index + 1),
            })}
          </h2>
          <p>
            {stakingRoundDate[index].startedAt.format('YYYY.MM.DD HH:mm:ss')}
            <br />
            ~&nbsp;
            {stakingRoundDate[index].endedAt.format('YYYY.MM.DD HH:mm:ss')}{' '}
            (KST)
          </p>
        </div>
        {mediaQuery === MediaQuery.PC && (
          <div>
            <h2 className="percent">-</h2>
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
                  -<span className="token-amount bold">{stakedToken}</span>
                </h2>
                <div className={`staking__round__button disable`}>
                  <p>{t('staking.staking_btn')}</p>
                </div>
              </div>
            </div>
            <div>
              <h2>{t('staking.reward_amount')}</h2>
              <div>
                <h2>
                  -<span className="token-amount bold">{rewardToken}</span>
                </h2>
                <div className={`staking__round__button disable`}>
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
                <h2 className="percent">-</h2>
              </div>
              <div>
                <p>{t('staking.staking_amount')}</p>
                <h2>
                  -<span className="token-amount bold">{stakedToken}</span>
                </h2>
              </div>
              <div>
                <p>{t('staking.reward_amount')}</p>
                <h2>
                  -<span className="token-amount bold">{rewardToken}</span>
                </h2>
              </div>
            </div>
            <div>
              <div className={`staking__round__button disable`}>
                <p>{t('staking.staking_btn')}</p>
              </div>
              <div className={`staking__round__button disable`}>
                <p>{t('staking.claim_reward')}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default NextStaking;
