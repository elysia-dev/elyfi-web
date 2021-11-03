import { useState } from 'react';

function Guide() {
  const [isBoxVisible, setIsBoxVisible] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        border: '1px solid black',
        width: 12,
        height: 12,
        borderRadius: 12,
        textAlign: 'center',
        lineHeight: 0.8,
        marginLeft: 11,
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
            width: 100,
            height: 100,
            border: '1px solid black',
          }}>
          가이드 박스
        </div>
      )}
    </div>
  );
}

export default Guide;
