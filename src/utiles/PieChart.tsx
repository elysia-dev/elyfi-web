import { FunctionComponent } from "react";

interface Props {
  num1: number,
  num2: number,
  num3: number
}
const PieChart: FunctionComponent<Props> = (props: Props) => {
  const num1 = props.num1;
  const num2 = props.num1 + props.num2;
  const num3 = props.num1 + props.num2 + props.num3;

  return (
    <div className="pie-chart"
      style={{ background: `conic-gradient(#00BFFF 0% ${num1}%, #7D17D6 ${num1}% ${num2}%, #244DC4 ${num2}% ${num3}%)`}}
    >
      <span className="pie-chart__round" />
    </div>
  )
}

export default PieChart;