import { FunctionComponent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Position as IPosition } from 'src/hooks/usePositions';
import SelectBoxItems from './SelectBoxItems';

type Props = {
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
  unstakedPositions: IPosition[];
};

const SelectBox: FunctionComponent<Props> = (props) => {
  const { selectedToken, setSelectedToken, unstakedPositions } = props;
  const [isItemsVisible, setIsItemsVisible] = useState(false);
  const { t } = useTranslation();
  const selectBoxHandler = () => {
    setIsItemsVisible((prev) => !prev);
  };

  return (
    <div
      style={{
        height: 137,
        background: '#FFFFFF',
      }}>
      <div
        className="spoqa__bold"
        style={{
          paddingTop: 28.5,
          marginLeft: 27,
        }}>
        {t('lpstaking.lp_tokens_held')}
      </div>
      {unstakedPositions.length > 0 ? (
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
            cursor: 'pointer',
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
                  {t('lpstaking.liquidity')} : $ {selectedToken.liquidity}
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
              {unstakedPositions.map((position, idx) => {
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
          {t('lpstaking.no_lp_token')}
        </div>
      )}
    </div>
  );
};

export default SelectBox;
