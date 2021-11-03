import { BigNumber, utils } from 'ethers';
import Position, { TokenInfo } from 'src/core/types/Position';

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
  return (
    <div
      style={{
        width: '100%',
        borderBottom: '1px solid black',
        borderRight: '1px solid black',
        borderLeft: '1px solid black',
        background: '#FFFFFF',
      }}
      onClick={() => {
        setSelectedToken({
          id: position.id.toString(),
          liquidity: utils.formatEther(position.liquidity),
          selectBoxTitle: '',
        });
        selectBoxHandler();
      }}>
      <div>
        <div
          className="spoqa"
          style={{
            color: '#333333',
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
            유동성 : $ {utils.formatEther(position.liquidity)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectBoxItems;
