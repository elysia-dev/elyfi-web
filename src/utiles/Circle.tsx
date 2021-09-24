import { CSSProperties } from 'react';
import { FunctionComponent, useState, useEffect } from 'react';

interface CircleProps {
  progress: number;
  progressColor?: string;
  style?: CSSProperties;
}

export const Circle: FunctionComponent<CircleProps> = (props: CircleProps) => {
  const [state, setState] = useState<CircleProps>({
    progress: 0,
  })
  useEffect(() => {
    setState(props);
    if (props.progress > 94 && props.progress < 100) {
      setState({
        ...state,
        progress: 94
      })
    }
    if (props.progress > 0 && props.progress < 6) {
      setState({
        ...state,
        progress: 6
      })
    }
  }, [props])

  const radius = 175;
  const diameter = Math.round(Math.PI * radius * 2);
  const getOffset = (val = 0) => Math.round((100 - Math.min(val, 100)) / 100 * diameter);
  const strokeDashoffset = getOffset(state.progress);

  return (
    <>
      <svg style={props.style} viewBox="-25 -25 400 400">
        {state.progress !== 0 && (
          <>
            <circle
              stroke={"#1C5E9A"}
              transform={`rotate(${state.progress === 100 ? -90 : -85} 175 175)`}
              cx="175"
              cy="175"
              r="175"
              strokeDasharray="1100"
              strokeWidth={18}
              strokeDashoffset="1100"
              strokeLinecap={'round'}
              fill="none"
              style={{
                strokeDashoffset: state.progress !== 100 ? strokeDashoffset + 30 : strokeDashoffset,
                transition: `stroke-dashoffset ${props.progress < 50 ? "1.5s" : "2s"} ease-out`,
                position: "relative"
              }}
            />
            {props.progress === 100 ? (
              <>
                <text style={{ font: 'bold 4rem Helvetica, Arial, sans-serif' }} fill={"#1C5E9A"} x={175} y={175} textAnchor="middle" dominantBaseline="central">
                  <tspan dx={0} fontSize="70"> 100%</tspan>
                </text>
              </>
            ) : (
              <>
                <circle
                  cx={(Math.round((175 + 175 * Math.cos((Math.PI / 180) * ((state.progress - 50) / 2 * 3.6))) * 100) / 100)}
                  cy={(Math.round((175 + 175 * Math.sin((Math.PI / 180) * ((state.progress - 50) / 2 * 3.6))) * 100) / 100)}
                  r="25"
                  fill={"#FFF"}
                  style={{
                    filter: "drop-shadow(0px 0px 6px #00000029)"
                  }}
                />
                <text
                  x={(Math.round((175 + 175 * Math.cos((Math.PI / 180) * ((state.progress - 50) / 2 * 3.6))) * 100) / 100)}
                  y={(Math.round((175 + 175 * Math.sin((Math.PI / 180) * ((state.progress - 50) / 2 * 3.6))) * 100) / 100) + 5}
                >
                  <tspan dx={-20} dy={3} fontSize="20">{props.progress}%</tspan>
                </text>
              </>
            )}
          </>
        )}
        {state.progress !== 100 && (
          <>
            <circle
              stroke={"#00A7FF"}
              transform={`rotate(${state.progress === 0 ? -90 : -95} 175 175)`}
              cx="175"
              cy="175"
              r="175"
              strokeDasharray="1100"
              strokeDashoffset="1100"
              strokeWidth={18}
              strokeLinecap={'round'}
              fill="none"
              style={{
                strokeDashoffset: state.progress !== 0 ? (1100 - strokeDashoffset + 30) * -1 : 0,
                transition: `stroke-dashoffset ${props.progress > 50 ? "1.5s" : "2s"} ease-out`
              }}
            />
            {props.progress === 0 ? (
              <>
                <text style={{ font: 'bold 4rem Helvetica, Arial, sans-serif' }} fill={"#00A7FF"} x={175} y={175} textAnchor="middle" dominantBaseline="central">
                  <tspan dx={0} fontSize="70"> 100%</tspan>
                </text>
              </>
            ) : (
              <>
                <circle
                  cx={(Math.round((175 + 175 * Math.cos((Math.PI / 180) * (((100 + state.progress) - 50) / 2 * 3.6))) * 100) / 100)}
                  cy={(Math.round((175 + 175 * Math.sin((Math.PI / 180) * (((100 + state.progress) - 50) / 2 * 3.6))) * 100) / 100)}
                  r="25"
                  fill={"#FFF"}
                  style={{
                    filter: "drop-shadow(0px 0px 6px #00000029)"
                  }}
                />
                <text
                  x={(Math.round((175 + 175 * Math.cos((Math.PI / 180) * (((100 + state.progress) - 50) / 2 * 3.6))) * 100) / 100)}
                  y={(Math.round((175 + 175 * Math.sin((Math.PI / 180) * (((100 + state.progress) - 50) / 2 * 3.6))) * 100) / 100) + 5}
                >
                  <tspan dx={-20} dy={3} fontSize="20">{100 - props.progress}%</tspan>
                </text>
              </>
            )}

          </>
        )}
      </svg>
    </>
  );
}
