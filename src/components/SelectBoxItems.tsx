import { utils } from 'ethers';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';
import envs from 'src/core/envs';
import { Position as IPosition } from 'src/hooks/usePositions';
import usePricePerLiquidity from 'src/hooks/usePricePerLiquidity';
import { formatDecimalFracionDigit } from 'src/utiles/formatters';

type Props = {
  position: IPosition;
  index: number;
  setSelectedToken: React.Dispatch<
    React.SetStateAction<{
      id: string;
      liquidity: string;
      selectBoxTitle: string;
    }>
  >;
  selectBoxHandler: () => void;
};

const SelectBoxItems: FunctionComponent<Props> = (props) => {
  const { setSelectedToken, selectBoxHandler, position } = props;
  const { pricePerDaiLiquidity, pricePerEthLiquidity } = usePricePerLiquidity();
  const { t } = useTranslation();
  const poolPrice =
    position.token1.toLowerCase() === envs.token.wEthAddress.toLowerCase()
      ? pricePerEthLiquidity
      : pricePerDaiLiquidity;
  const liquidity =
    formatDecimalFracionDigit(
      parseFloat(utils.formatEther(position.liquidity)) * poolPrice,
      2,
    ) || 0;

  return (
    <div
      className="select_box_Item"
      style={{
        width: '100%',
        borderBottom: '1px solid black',
        borderRight: '1px solid black',
        borderLeft: '1px solid black',
        cursor: 'pointer',
      }}
      onClick={() => {
        setSelectedToken({
          id: position.tokenId.toString(),
          liquidity: formatDecimalFracionDigit(
            parseFloat(utils.formatEther(position.liquidity)) * poolPrice,
            2,
          ),
          selectBoxTitle: '',
        });
        selectBoxHandler();
      }}>
      <div>
        <div
          className="spoqa"
          style={{
            paddingLeft: 20.5,
            display: 'flex',
            alignItems: 'center',
            fontSize: 13,
            height: 47,
          }}>
          <div style={{ marginRight: 25 }}>ID : {position.tokenId}</div>
          <div className="spoqa__bold" style={{ color: '#B7B7B7' }}>
            |
          </div>
          <div style={{ marginLeft: 23 }}>
            {t('lpstaking.liquidity')} : $ {liquidity}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectBoxItems;
