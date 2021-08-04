import { CSSProperties, FunctionComponent } from 'react';

export const Title: FunctionComponent<{ label: string, style?: CSSProperties }> = ({ label, style }) => {
  return (
    <div className="text__title" style={style} >
      <p className="bold">{label}</p>
      <hr />
    </div>
  )
}