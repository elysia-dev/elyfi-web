import { BigNumber, utils } from 'ethers';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import lpStakingTime from 'src/core/data/lpStakingTime';
import Token from 'src/enums/Token';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import { formatDecimalFracionDigit } from 'src/utiles/formatters';
import Guide from '../Guide';
import LpButton from './LpButton';

type Props = {
  token0: string;
  token1: string;
  setStakingModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  totalStakedLiquidity: BigNumber;
};

function LpStakeAndUnStake(props: Props) {
  const { token0, token1, setStakingModalVisible, totalStakedLiquidity } =
    props;
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
  const { t } = useTranslation();
  const isStakingDate = moment().isBetween(
    lpStakingTime.startedAt,
    lpStakingTime.endedAt,
  );

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
          token0,
          token1,
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
          (token1 === Token.ETH ? pricePerEthLiquidity : pricePerDaiLiquidity) *
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
          onHandler={() => (isStakingDate ? setStakingModalVisible(true) : '')}
          disableBtn={
            isStakingDate
              ? undefined
              : { background: '#f8f8f8', color: '#949494' }
          }
        />
      </div>
    </div>
  );
}

export default LpStakeAndUnStake;
