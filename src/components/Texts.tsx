import { CSSProperties, FunctionComponent } from 'react';

export const Title: FunctionComponent<{ label: string, style?: CSSProperties }> = ({ label, style }) => {
  return (
    <div className="text__title" style={style} >
      <p className="bold">{label}</p>
      <hr />
    </div>
  )
}

// export const MontText: FunctionComponent<{ 
//     label: string, 
//     style?: HTMLAttributes<HTMLDivElement>
//     bold?: boolean
//   }> = ({ label, style, bold = false }) => {
//   return (
//     <p className={`text__montserrat ${bold ? "bold" : ""}`} style={style}>{label}</p>
//   )
// }

// export const SpoqaText: FunctionComponent<{ 
//     label: string, 
//     style?: HTMLAttributes<HTMLDivElement>
//     bold?: boolean
//   }> = ({ label, style, bold = false }) => {
//   return (
//     <p className={`text__spoqa ${bold ? "bold" : ""}`} style={style}>{label}</p>
//   )
// }