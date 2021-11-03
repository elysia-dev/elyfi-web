import { BigNumber } from 'ethers';
import { useState } from 'react';
import Position, { TokenInfo } from 'src/core/types/Position';
import SelectBoxItems from './SelectBoxItems';

type Props = {
  positions: Position[];
  selectedToken: {
    id: string;
    liquidity: string;
    selectBoxTitle: string;
  };
  setSelectedToken: React.Dispatch<
    React.SetStateAction<{
      id: string;
      liquidity: string;
      selectBoxTitle: string;
    }>
  >;
  lpTokens: TokenInfo[];
};

function SelectBox(props: Props) {
  const { selectedToken, setSelectedToken, positions, lpTokens } = props;
  const [isItemsVisible, setIsItemsVisible] = useState(false);

  const selectBoxHandler = () => {
    setIsItemsVisible((prev) => !prev);
  };

  return (
    <div
      style={{
        height: 137,
        // border: '1px solid none',
        background: '#FFFFFF',
      }}>
      <div
        className="spoqa__bold"
        style={{
          paddingTop: 28.5,
          marginLeft: 27,
        }}>
        보유한 LP 토큰
      </div>
      {true ? (
        <div
          style={{
            border: '1px solid black',
            background: '#FFFFFF',
            marginRight: 26,
            marginLeft: 27,
            marginTop: 17.5,
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}>
          <div
            style={{
              paddingLeft: 20.5,
              paddingBottom: 12,
              paddingTop: 12,
              paddingRight: 12.5,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: selectedToken.selectBoxTitle
                ? 'space-between'
                : undefined,
            }}
            onClick={() => selectBoxHandler()}>
            {selectedToken.selectBoxTitle ? (
              <div
                className="spoqa__bold"
                style={{
                  color: '#B7B7B7',
                }}>
                {selectedToken.selectBoxTitle}
              </div>
            ) : (
              <>
                {' '}
                <div
                  style={{
                    marginRight: 25,
                    color: '#333333',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 13,
                  }}>
                  ID : {selectedToken.id}
                </div>
                <div className="spoqa__bold" style={{ color: '#B7B7B7' }}>
                  |
                </div>
                <div
                  style={{
                    marginLeft: 23,
                    color: '#333333',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 13,
                    marginRight: 'auto',
                  }}>
                  유동성 : $ {selectedToken.liquidity}
                </div>
              </>
            )}
            <div
              style={{
                borderTop: '9px solid black',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                transform: isItemsVisible ? 'rotate(180deg)' : undefined,
                color: '#333333',
              }}
            />
          </div>
          {isItemsVisible && (
            <div
              style={{
                width: '100%',
                left: -1,
                height: 95,
                overflowX: 'visible',
                bottom: '-214%',
                position: 'absolute',
              }}>
              {lpTokens.map((position, idx) => {
                return (
                  <SelectBoxItems
                    key={idx}
                    position={position}
                    index={idx}
                    setSelectedToken={setSelectedToken}
                    selectBoxHandler={selectBoxHandler}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            textAlign: 'center',
            marginTop: 17.5,
          }}>
          스테이킹 가능한 LP토큰이 없습니다.
        </div>
      )}
    </div>
  );
}

export default SelectBox;
