import { IAttribute } from '@/app/interface/IAttribute';
import { IMethod } from '@/app/interface/IMethod';
import { height } from '@/app/GlobalValues';
import { IPosition } from '@/app/interface/IPosition';

export default function DrawChild({
  i,
  child,
  childID,
  isConnected,
  isActive,
  leftCirclePosition,
  rightCirclePosition,
  onChildClick: onAttributeClick,
  color,
  alertMsg,
  childText,
  position,
}: {
  i: number;
  child: IAttribute | IMethod;
  childID: number;
  isConnected: boolean;
  isActive: boolean;
  leftCirclePosition: IPosition;
  rightCirclePosition: IPosition;
  onChildClick: (id: number, circlePosition: IPosition) => void;
  color: string;
  alertMsg: string;
  childText: string;
  position: IPosition;
}) {
  return (
    <g key={i}>
      {/* Left circles */}
      <circle
        className={`hover:cursor-pointer ${
          isConnected && 'hover:opacity-100'
        }  ${isActive ? 'opacity-100' : 'opacity-40'}`}
        cx={leftCirclePosition.x}
        cy={leftCirclePosition.y}
        r={5}
        fill={color}
        stroke='#818181'
        strokeWidth={1}
        onClick={() => {
          if (isConnected) {
            onAttributeClick(childID, leftCirclePosition);
          } else {
            alert(alertMsg);
          }
        }}
      />
      {/* Right circles */}
      <circle
        className={`hover:cursor-pointer ${
          isConnected && 'hover:opacity-100'
        } ${isActive ? 'opacity-100' : 'opacity-40'}`}
        cx={rightCirclePosition.x}
        cy={rightCirclePosition.y}
        r={5}
        fill={color}
        stroke='#818181'
        strokeWidth={1}
        onClick={() => {
          if (isConnected) {
            onAttributeClick(childID, rightCirclePosition);
          } else {
            alert(alertMsg);
          }
        }}
      />
      <text
        x={position.x + 10}
        y={position.y + height + (height / 2) * (i + 1)}
        textAnchor='start'
        dominantBaseline='middle'
        pointerEvents='none'
      >
        {childText}
      </text>
    </g>
  );
}
