'use client';

import { useLayoutEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { IAction } from '../interface/IAction';
import {
  liveActionPositionsAtom,
  liveMethodPositionsAtom,
  actionLengthAtom,
  actionConAtom,
  methodConAtom,
  computingVal,
  height
} from '../GlobalValues';
import { useCalculation } from '../hooks/useCalculation';
import { useDraggable } from '../hooks/useDraggable';

interface ActionProps extends IAction {
  color: string;
  onNodeClick: (id: number, circlePosition: { x: number; y: number }) => void;
  onAttributeClick: (
    id: number,
    circlePosition: { x: number; y: number },
  ) => void;
}

export default function Action({
  id,
  name: title,
  methods,
  positionX,
  positionY,
  schemaID,
  color,
  onNodeClick,
  onAttributeClick,
}: ActionProps) {
  const setLiveNodePositions = useSetAtom(liveActionPositionsAtom);
  const setLiveAtrPosition = useSetAtom(liveMethodPositionsAtom);

  const handlePositionChange = (newX: number, newY: number) => {
    setPosition({ x: newX, y: newY });

    setLiveNodePositions((prev) => {
      const existing = prev.find((pos) => pos.id === id);
      if (existing) {
        return prev.map((pos) =>
          pos.id === id ? { id: id, positionX: newX, positionY: newY } : pos,
        );
      } else {
        return [...prev, { id: id, positionX: newX, positionY: newY }];
      }
    });

    setLiveAtrPosition((prev) => {
      const filteredPrev = prev.filter(
        (atr) => !methods.some((attr) => attr.id === atr.childID),
      );

      const newAtrPositions = methods
        .map((attribute, i) => {
          const leftPos = {
            parentID: id,
            childID: attribute.id,
            positionX: newX,
            positionY: newY + height + (height / 2) * i,
          };

          return [leftPos];
        })
        .flat();

      return [...filteredPrev, ...newAtrPositions];
    });
  };

  const {
    position,
    setPosition,
    setIsDragging,
    handleMouseDown,
    handleMouseMove,
  } = useDraggable(positionX, positionY, handlePositionChange);
  const { calculateNodeLength } = useCalculation();
  const [actionLengths, setActionLengths] = useAtom(actionLengthAtom);
  const nodeCons = useAtomValue(actionConAtom);
  const atrCons = useAtomValue(methodConAtom);

  useLayoutEffect(() => {
    const width = calculateNodeLength(methods, title);

    setActionLengths((prevLengths) => {
      const existing = prevLengths.find((item) => item.id === id);
      if (existing) {
        return prevLengths;
      }
      return [...prevLengths, { id: id, length: width }];
    });
  }, [id]);

  const nodeLength = actionLengths.find((item) => item.id === id)?.length || 0;

  const leftCirclePosition = { x: position.x, y: position.y + height / 2 };
  const rightCirclePosition = {
    x: position.x + nodeLength,
    y: position.y + height / 2,
  };

  const isConnected = nodeCons.some((con) =>
    con.actions.find((n) => n.id === id),
  );

  return (
    <>
      {/* Header */}
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
          onNodeClick(id, leftCirclePosition);
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
          onNodeClick(id, rightCirclePosition);
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
          methods.length === 1
            ? height
            : (height * methods.length) / computingVal
        }
        fill='#FFFFFF'
        stroke={color}
        strokeWidth={1}
        rx={5}
      />

      {methods.map((method, i) => {
        const atrID = method.id;
        const leftCirclePosition = {
          x: position.x,
          y: position.y + height + (height / 2) * (i + 1),
        };
        const rightCirclePosition = {
          x: position.x + nodeLength,
          y: position.y + height + (height / 2) * (i + 1),
        };

        const isActive = atrCons.some((con) =>
          con.methods.find((a) => a.id === atrID),
        );
        const alertMsg = 'Connect nodes before connecting attributes.';

        const methodInput = method.input
          .replaceAll(',', ', ')
          .trim()
          .slice(0, -1);

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
                  onAttributeClick(atrID, leftCirclePosition);
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
                  onAttributeClick(atrID, rightCirclePosition);
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
              {method.input
                ? `${method.name}(${methodInput}): ${method.output}`
                : `${method.name}: ${method.output}`}
            </text>
          </g>
        );
      })}
    </>
  );
}
