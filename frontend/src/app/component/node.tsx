'use client';

import { useState } from 'react';

interface INode {
  id: number;
  title: string;
  posX: number;
  posY: number;
  labels: string[];
}

export default function Node({ id, title, posX, posY, labels }: INode) {
  const [position, setPosition] = useState({ x: posX, y: posY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const strLenghts = labels.map((str) => str.length);
  const maxStringLength = Math.max(...strLenghts);
  const width = maxStringLength * 15;
  const height = 40;

  const moveNode = (newX: number, newY: number) => {
    setPosition({ x: newX, y: newY });
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
        r={6}
        fill='#D9D9D9'
        stroke='black'
        strokeWidth={1}
        onClick={() => console.log('clicked: ', id)}
      />
      <text
        x={position.x + width / 2}
        y={position.y + height / 2}
        textAnchor='middle'
        dominantBaseline='middle'
      >
        {title}
      </text>

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
            className='hover:cursor-pointer hover:fill-black/80'
            cx={position.x + width}
            cy={position.y + height + (height / 2) * (i + 1)}
            r={6}
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
