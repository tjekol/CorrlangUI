'use client';

import { useState } from 'react';
import { INode } from '@/app/interface/INode';
import { useSetAtom } from 'jotai';
import { edgeAtom } from '../GlobalValues';

interface NodeProps extends INode {
  posX: number;
  posY: number;
  onCircleClick: (id: number, circlePosition: { x: number; y: number }) => void;
}

export default function Node({
  id,
  title,
  nodeLabels,
  posX,
  posY,
  onCircleClick,
}: NodeProps) {
  const [position, setPosition] = useState({ x: posX, y: posY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const setEdgePosition = useSetAtom(edgeAtom);

  const labels = nodeLabels.map((label) => label.text);
  const strLenghts = labels.map((str) => str.length);
  const maxStringLength = Math.max(...strLenghts);
  const width = maxStringLength * 15;
  const height = 40;
  const circlePosition = { x: position.x + width, y: position.y + height / 2 };

  const moveNode = (newX: number, newY: number) => {
    setPosition({ x: newX, y: newY });

    setEdgePosition((prev) =>
      prev.map((edge) =>
        edge.nodeID === id
          ? {
              ...edge,
              position: { x: circlePosition.x, y: circlePosition.y },
            }
          : edge
      )
    );
  };

  const handleMouseDown = (clientX: number, clientY: number) => {
    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  const handleMouseMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      const x = clientX - dragOffset.x;
      const y = clientY - dragOffset.y;
      moveNode(x, y);
    }
  };

  return (
    <>
      {/* Header */}
      <rect
        x={position.x}
        y={position.y}
        width={width}
        height={height}
        fill='#FFFFFF'
        stroke='black'
        strokeWidth={1}
        rx={5}
        onMouseDown={(e) => (
          setIsDragging(true), handleMouseDown(e.clientX, e.clientY)
        )}
        onMouseMove={(e) => handleMouseMove(e.clientX, e.clientY)}
        onMouseUp={() => (setIsDragging(false), console.log(isDragging))}
        className='hover:cursor-move'
      />
      <circle
        className='hover:cursor-pointer hover:fill-black/80'
        cx={position.x + width}
        cy={position.y + height / 2}
        r={7}
        fill='#D9D9D9'
        stroke='black'
        strokeWidth={1}
        onClick={() => onCircleClick(id, circlePosition)}
      />
      <text
        x={position.x + width / 2}
        y={position.y + height / 2}
        textAnchor='middle'
        dominantBaseline='middle'
      >
        {title}
      </text>

      {/* Body */}
      <rect
        x={position.x}
        y={position.y + height}
        width={width}
        height={labels.length === 1 ? height : (height * labels.length) / 1.4}
        fill='#FFFFFF'
        stroke='black'
        strokeWidth={1}
        rx={5}
      />

      {labels.map((t, i) => (
        <g key={i}>
          <circle
            className='hover:cursor-pointer hover:fill-black/80 hidden'
            cx={position.x + width}
            cy={position.y + height + (height / 2) * (i + 1)}
            r={5}
            fill='#D9D9D9'
            stroke='black'
            strokeWidth={1}
            onClick={() => console.log('clicked: ', t, i)}
          />
          <text
            x={position.x + 10}
            y={position.y + height + (height / 2) * (i + 1)}
            textAnchor='start'
            dominantBaseline='middle'
          >
            {t}
          </text>
        </g>
      ))}
    </>
  );
}
