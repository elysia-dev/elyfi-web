import { useState } from 'react';

type Props = {
  content: string;
};

function Guide(props: Props) {
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        border: '1px solid #4C4D72',
        width: 15,
        height: 15,
        borderRadius: 15,
        textAlign: 'center',
        lineHeight: 1.2,
        marginLeft: 11,
        fontSize: 15.5,
        color: '#4C4D72',
      }}
      onMouseEnter={(e) => {
        setIsBoxVisible(true);
      }}
      onMouseLeave={() => {
        setIsBoxVisible(false);
      }}>
      ?
      {isBoxVisible && (
        <div
          style={{
            position: 'absolute',
            width: 330,
            left: -10,
            padding: '5px 15px',
            background: '#fff',
            boxShadow: '0 0 6px rgb(0 0 0/16%)',
            zIndex: 99,
            textAlign: 'left',
          }}>
          {props.content}
        </div>
      )}
    </div>
  );
}

export default Guide;
