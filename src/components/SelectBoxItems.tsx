type Props = {
  lpToken: {
    id: string;
    liquidity: string;
  };
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
  const { lpToken, index, setSelectedToken, selectBoxHandler } = props;
  return (
    <div
      style={{
        width: '100%',
        borderBottom: '1px solid black',
      }}
      onClick={() => {
        setSelectedToken({
          id: lpToken.id,
          liquidity: lpToken.liquidity,
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
          <div style={{ marginRight: 25 }}>ID : {lpToken.id}</div>
          <div className="spoqa__bold" style={{ color: '#B7B7B7' }}>
            |
          </div>
          <div style={{ marginLeft: 23 }}>유동성 : $ {lpToken.liquidity}</div>
        </div>
      </div>
    </div>
  );
}

export default SelectBoxItems;
