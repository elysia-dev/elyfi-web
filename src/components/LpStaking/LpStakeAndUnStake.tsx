import { BigNumber, utils } from 'ethers';
import moment from 'moment';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PriceContext from 'src/contexts/PriceContext';
import lpStakingTime from 'src/core/data/lpStakingTime';
import Token from 'src/enums/Token';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import { formatDecimalFracionDigit } from 'src/utiles/formatters';
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
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
  const { t } = useTranslation();
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
        {t('lpstaking.lp_token_staked', {
          firstToken,
          secondToken,
        })}
        <Guide content={t('guide.staked_total_amount')} />
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
          className="spoqa__bold"
          style={{
            fontSize: 25,
            marginLeft: 'auto',
            marginRight: 3,
          }}>
          {`$ `}
        </span>
        {formatDecimalFracionDigit(
          (secondToken === Token.ETH ? pricePerEthLiquidity : pricePerDaiLiquidity) *
          parseFloat(utils.formatEther(totalStakedLiquidity)),
          2,
        )}
      </div>
      <div
        style={{
          textAlign: 'center',
        }}>
        <LpButton
          btnTitle={t('staking.staking')}
          onHandler={() => setStakingModalVisible(true)}
        />
      </div>
    </div>
  );
}

export default LpStakeAndUnStake;
