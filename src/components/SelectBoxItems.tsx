import { BigNumber, utils } from 'ethers';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import PriceContext from 'src/contexts/PriceContext';
import envs from 'src/core/envs';
import { TokenInfo } from 'src/core/types/Position';
import { formatDecimalFracionDigit } from 'src/utiles/formatters';

type Props = {
  position: TokenInfo;
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

function SelectBoxItems(props: Props) {
  const { index, setSelectedToken, selectBoxHandler, position } = props;
  const { elfiEthPool, elfiDaiPool } = useContext(PriceContext);
  const { t } = useTranslation();
  const poolPrice =
    position.pool.id.toLowerCase() === envs.ethElfiPoolAddress.toLowerCase()
      ? elfiEthPool.price
      : elfiDaiPool.price;

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
          id: position.id.toString(),
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
          <div style={{ marginRight: 25 }}>ID : {position.id}</div>
          <div className="spoqa__bold" style={{ color: '#B7B7B7' }}>
            |
          </div>
          <div style={{ marginLeft: 23 }}>
            {t('lpstaking.liquidity')} : ${' '}
            {formatDecimalFracionDigit(
              parseFloat(utils.formatEther(position.liquidity)) * poolPrice,
              2,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectBoxItems;
