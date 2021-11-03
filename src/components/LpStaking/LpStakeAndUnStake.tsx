import { BigNumber } from 'ethers';
import { useContext } from 'react';
import PriceContext from 'src/contexts/PriceContext';
import calcCurrencyValueFromLiquidity from 'src/utiles/calcCurrencyValueFromLiquidity';
import { formatSixFracionDigit, toCompact } from 'src/utiles/formatters';
import Guide from '../Guide';
import LpButton from './LpButton';

type Props = {
  firstToken: string;
  secondToken: string;
  setStakingModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  totalStakedLiquidity: BigNumber;
};

function LpStakeAndUnStake(props: Props) {
  const {
    firstToken,
    secondToken,
    setStakingModalVisible,
    totalStakedLiquidity,
  } = props;
  const { elfiPrice, daiPrice } = useContext(PriceContext);
  return (
    <div
      style={{
        padding: '19px 25px 22px 29px',
      }}>
      <div
        className="spoqa__bold"
        style={{
          paddingBottom: 7,
          fontSize: 17,
        }}>
        ELFI-DAI LP 스테이킹
        <Guide />
      </div>
      <div
        className="spoqa__bold"
        style={{
          textAlign: 'right',
          paddingTop: 19,
          paddingBottom: 30,
          fontSize: 30,
          display: 'flex',
          alignItems: 'center',
        }}>
        <span
          style={{
            fontSize: 25,
            marginLeft: 'auto',
          }}>
          {`$ `}
        </span>
        {formatSixFracionDigit(
          calcCurrencyValueFromLiquidity(
            elfiPrice,
            daiPrice,
            totalStakedLiquidity,
          ),
        )}
      </div>
      <div
        style={{
          textAlign: 'center',
        }}>
        <LpButton
          btnTitle={'스테이킹'}
          onHandler={() => setStakingModalVisible(true)}
        />
      </div>
    </div>
  );
}

export default LpStakeAndUnStake;
