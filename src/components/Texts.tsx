import { CSSProperties, FunctionComponent } from 'react';
import elfi from 'src/assets/images/ELFI.png';
import el from 'src/assets/images/el.png';
import Token from 'src/enums/Token';

export const Title: FunctionComponent<{
  stakedToken: Token.EL | Token.ELFI;
  label: string;
  style?: CSSProperties;
}> = ({ label, style, stakedToken }) => {
  const tokenImg = stakedToken === Token.EL ? el : elfi;
  return (
    <div className="text__title" style={style}>
      <img
        src={tokenImg}
        alt={stakedToken}
        style={{
          marginRight: 10,
          width: 40,
          height: 40,
        }}
      />
      <p className="bold">{label}</p>
      <hr />
    </div>
  );
};
