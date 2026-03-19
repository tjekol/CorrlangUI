import { computingVal, height } from '@/app/GlobalValues';
import { useDraggable } from '@/app/hooks/useDraggable';
import { IAttribute } from '@/app/interface/IAttribute';
import { IMethod } from '@/app/interface/IMethod';
import { IPosition } from '@/app/interface/IPosition';

export default function DrawParent({
  id,
  title,
  children,
  positionX,
  positionY,
  nodeLength,
  color,
  leftCirclePosition,
  rightCirclePosition,
  isConnected,
  onParentClick,
  handlePositionChange,
}: {
  id: number;
  title: string;
  children: IAttribute[] | IMethod[];
  positionX: number;
  positionY: number;
  nodeLength: number;
  color: string;
  leftCirclePosition: IPosition;
  rightCirclePosition: IPosition;
  isConnected: boolean;
  onParentClick: (id: number, circlePosition: IPosition) => void;
  handlePositionChange: (newX: number, newY: number) => void;
}) {
  const { position, setIsDragging, handleMouseDown, handleMouseMove } =
    useDraggable(positionX, positionY, handlePositionChange);

  return (
    <>
      <rect
        x={position.x}
        y={position.y}
        width={nodeLength}
        height={height}
        fill='#FFFFFF'
        stroke={color}
        strokeWidth={1}
        rx={5}
        onMouseDown={(e) => (
          setIsDragging(true),
          handleMouseDown(e.clientX, e.clientY)
        )}
        onMouseMove={(e) => handleMouseMove(e.clientX, e.clientY)}
        onMouseUp={() => setIsDragging(false)}
        className='hover:cursor-move'
      />
      {/* Left circle */}
      <circle
        className={`hover:cursor-pointer hover:opacity-100 
              ${isConnected ? 'opacity-100' : 'opacity-40'}
              `}
        cx={leftCirclePosition.x}
        cy={leftCirclePosition.y}
        r={7}
        fill='#D9D9D9'
        stroke='black'
        strokeWidth={1}
        onClick={() => {
          onParentClick(id, leftCirclePosition);
        }}
      />
      {/* Right circle */}
      <circle
        className={`hover:cursor-pointer hover:opacity-100 ${
          isConnected ? 'opacity-100' : 'opacity-40'
        }`}
        cx={rightCirclePosition.x}
        cy={rightCirclePosition.y}
        r={7}
        fill='#D9D9D9'
        stroke='black'
        strokeWidth={1}
        onClick={() => {
          onParentClick(id, rightCirclePosition);
        }}
      />
      {/* Header text */}
      <text
        x={position.x + nodeLength / 2}
        y={position.y + height / 2}
        textAnchor='middle'
        dominantBaseline='middle'
        pointerEvents='none'
      >
        {title}
      </text>

      {/* Body */}
      <rect
        x={position.x}
        y={position.y + height}
        width={nodeLength}
        height={
          children.length === 1
            ? height
            : (height * children.length) / computingVal
        }
        fill='#FFFFFF'
        stroke={color}
        strokeWidth={1}
        rx={5}
      />
    </>
  );
}
