'use client';

import { useLayoutEffect } from 'react';
import { INode } from '@/app/interface/INode';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  liveNodePositionsAtom,
  liveAtrPositionsAtom,
  nodeLengthAtom,
  nodeConAtom,
  atrConAtom,
  computingVal,
  height
} from '../GlobalValues';
import { useCalculation } from '../hooks/useCalculation';
import { useDraggable } from '../hooks/useDraggable';

interface NodeProps extends INode {
  color: string;
  onNodeClick: (id: number, circlePosition: { x: number; y: number }) => void;
  onAttributeClick: (
    id: number,
    circlePosition: { x: number; y: number },
  ) => void;
}

export default function Node({
  id,
  title,
  attributes,
  positionX,
  positionY,
  schemaID,
  color,
  onNodeClick,
  onAttributeClick,
}: NodeProps) {
  const setLiveNodePositions = useSetAtom(liveNodePositionsAtom);
  const setLiveAtrPosition = useSetAtom(liveAtrPositionsAtom);

  const handlePositionChange = (newX: number, newY: number) => {
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
        (atr) => !attributes.some((attr) => attr.id === atr.childID),
      );

      const newAtrPositions = attributes
        .map((attribute, i) => {
          const leftPos = {
            childID: attribute.id,
            parentID: id,
            positionX: newX,
            positionY: newY + height + (height / 2) * i,
          };

          return [leftPos];
        })
        .flat();

      return [...filteredPrev, ...newAtrPositions];
    });
  };

  const { position, setIsDragging, handleMouseDown, handleMouseMove } =
    useDraggable(positionX, positionY, handlePositionChange);
  const { calculateNodeLength } = useCalculation();
  const [nodeLengths, setNodeLengths] = useAtom(nodeLengthAtom);
  const nodeCons = useAtomValue(nodeConAtom);
  const atrCons = useAtomValue(atrConAtom);

  useLayoutEffect(() => {
    const width = calculateNodeLength(attributes, title);

    setNodeLengths((prevLengths) => {
      const existing = prevLengths.find((item) => item.id === id);
      if (existing) {
        return prevLengths;
      }
      return [...prevLengths, { id: id, length: width }];
    });
  }, [id]);

  const nodeLength = nodeLengths.find((item) => item.id === id)?.length || 0;

  const leftCirclePosition = { x: position.x, y: position.y + height / 2 };
  const rightCirclePosition = {
    x: position.x + nodeLength,
    y: position.y + height / 2,
  };

  const isConnected = nodeCons.some((con) =>
    con.nodes.find((n) => n.id === id),
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
          attributes.length === 1 ? height : (height * attributes.length) / computingVal
        }
        fill='#FFFFFF'
        stroke={color}
        strokeWidth={1}
        rx={5}
      />

      {attributes.map((attribute, i) => {
        const atrID = attribute.id;
        const leftCirclePosition = {
          x: position.x,
          y: position.y + height + (height / 2) * (i + 1),
        };
        const rightCirclePosition = {
          x: position.x + nodeLength,
          y: position.y + height + (height / 2) * (i + 1),
        };

        const isActive = atrCons.some((con) =>
          con.attributes.find((a) => a.id === atrID),
        );
        const alertMsg = 'Connect nodes before connecting attributes.';

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
              {attribute.text}: {attribute.type}
            </text>
          </g>
        );
      })}
    </>
  );
}
