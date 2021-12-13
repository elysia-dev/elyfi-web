import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { lpUnixTimestamp } from 'src/core/data/lpStakingTime';
import styled from 'styled-components';

type Props = {
  round: number;
  setRound: () => void;
  idx: number;
};

const SelectedButton = styled.div`
  @media (max-width: 375px) {
    margin-right: ${({ theme }) =>
      theme.idx === lpUnixTimestamp.length ? undefined : '20px'};
    background-color: ${({ theme, color }) =>
      theme.round === theme.idx ? '#00BFFF' : color ? color : ''};
  }

  margin-right: ${({ theme }) =>
    theme.idx === lpUnixTimestamp.length ? undefined : '66px'};
  background-color: ${({ theme, color }) =>
    theme.round === theme.idx ? '#00BFFF' : color ? color : ''};
`;

const SelectRoundButton: FunctionComponent<Props> = ({
  round,
  setRound,
  idx,
}) => {
  const [color, setColor] = useState('');
  const { t } = useTranslation();

  return (
    <SelectedButton
      className="spoqa__bold selecte_button"
      theme={{
        idx,
        round,
      }}
      color={color}
      onClick={setRound}
      onMouseEnter={() => setColor('#00BFFF')}
      onMouseLeave={() => setColor('')}>
      {t('lpstaking.round_staking', { round: idx })}
    </SelectedButton>
  );
};

export default SelectRoundButton;
