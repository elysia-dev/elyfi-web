import { useState } from "react";

const Popupinfo: React.FunctionComponent<{
  content: string;
  fontStyle?: React.CSSProperties;
}> = ({ content, fontStyle }) => {
  const [hover, setHover] = useState(false);

  return (
    <div className="component__popup-info">
      <p
        className="component__popup-info__hover-mark"
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}>
        ?
      </p>
      <div
        className="component__popup-info__content"
        style={{ display: hover ? 'block' : 'none' }}>
        <p style={fontStyle}>
          {content}
        </p>
      </div>
    </div>
  )
}

export default Popupinfo;