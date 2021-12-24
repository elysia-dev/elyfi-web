import ServiceBackground from 'src/assets/images/service-background.png';
import { Dispatch, FunctionComponent, SetStateAction } from 'react';
import { lpUnixTimestamp } from 'src/core/data/lpStakingTime';
import SelectRoundButton from './LpStaking/SelectRoundButton';

interface Props {
  title: string;
  round?: number;
  setRound?: Dispatch<SetStateAction<number>>;
  stakingType?: string;
}

const Header: FunctionComponent<Props> = ({
  title,
  round,
  setRound,
  stakingType,
}) => {
  return (
    <section
      className="header"
      style={{ backgroundImage: `url(${ServiceBackground})` }}>
      <div className="header__title__wrapper">
        <h2 className="header__title">{title}</h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}>
          {stakingType === 'LP' &&
            lpUnixTimestamp.map((date, idx) => {
              return (
                <SelectRoundButton
                  key={idx}
                  round={round!}
                  setRound={() => setRound!(idx + 1)}
                  idx={idx + 1}
                />
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Header;
