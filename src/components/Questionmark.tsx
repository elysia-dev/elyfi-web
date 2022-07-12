import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import useMediaQueryType from 'src/hooks/useMediaQueryType';
import MediaQuery from 'src/enums/MediaQuery';

type Props = {
  content: string | React.ReactElement;
};

function Questionmark(props: Props): JSX.Element {
  const { t, i18n } = useTranslation();
  const [isBoxVisible, setIsBoxVisible] = useState(false);
  const { value } = useMediaQueryType();

  return (
    <div
      style={{
        display: 'inline-block',
        border: '1.5px solid #888888',
        position: 'relative',
        width: 15,
        height: 15,
        borderRadius: 15,
        textAlign: 'center',
        lineHeight: 1,
        fontSize: 13,
        color: '#888888',
      }}
      onMouseEnter={(e) => {
        setIsBoxVisible(true);
      }}
      onMouseLeave={() => {
        setIsBoxVisible(false);
      }}>
      ?
      {isBoxVisible && (
        <>
          <div
            style={{
              position: 'absolute',
              backgroundColor: '#333333',
              transform: 'translateX(-50%)',
              left: '50%',
              top: 23,
              color: '#ffffff',
              padding: '15px 20px',
              zIndex: 9999,
            }}>
            <p
              style={{
                color: '#ffffff',
                fontSize: value === MediaQuery.PC ? '15px' : '11px',
                lineHeight: 1.5,
                textAlign: 'left',
                width: value === MediaQuery.PC ? 200 : 120,
              }}>
              <Trans>{props.content}</Trans>
            </p>
          </div>
          <div
            style={{
              position: 'absolute',
              overflow: 'auto',
              transform: 'translateX(-50%)',
              left: '50%',
              top: 5,
              borderTop: '10px solid transparent',
              borderBottom: '10px solid #333333',
              borderRight: '10px solid transparent',
              borderLeft: '10px solid transparent',
            }}
          />
        </>
      )}
    </div>
  );
}

export default Questionmark;
