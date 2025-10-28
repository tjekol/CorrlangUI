'use client';

import { useState } from 'react';
import { INode } from '@/app/interface/INode';
import { useAtom } from 'jotai';
import { attributeEdgeAtom, edgeAtom } from '../GlobalValues';

interface NodeProps extends INode {
  posX: number;
  posY: number;
  onHeaderClick: (id: number, circlePosition: { x: number; y: number }) => void;
  onAttributeClick: (
    id: number,
    circlePosition: { x: number; y: number }
  ) => void;
}

export default function Node({
  id,
  title,
  attributes,
  posX,
  posY,
  onHeaderClick,
  onAttributeClick,
}: NodeProps) {
  const [position, setPosition] = useState({ x: posX, y: posY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [edgePositions, setEdgePositions] = useAtom(edgeAtom);
  const [atrEdgePositions, setAtrEdgePositions] = useAtom(attributeEdgeAtom);

  const labels = attributes.map((label) => label.text);
  const strLenghts = labels.map((str) => str.length);
  const maxStringLength = Math.max(...strLenghts);
  const width = maxStringLength * 15;
  const height = 40;

  const leftCirclePosition = { x: position.x, y: position.y + height / 2 };
  const rightCirclePosition = {
    x: position.x + width,
    y: position.y + height / 2,
  };

  const isCircleActive = (posX: number, posY: number): boolean => {
    return edgePositions.some(
      (position) => position.positionX === posX && position.positionY === posY
    );
  };

  const isAttributeCircleActive = (posX: number, posY: number): boolean => {
    return atrEdgePositions.some(
      (position) => position.positionX === posX && position.positionY === posY
    );
  };

  const isLeftCircleActive = isCircleActive(
    leftCirclePosition.x,
    leftCirclePosition.y
  );
  const isRightCircleActive = isCircleActive(
    rightCirclePosition.x,
    rightCirclePosition.y
  );

  const moveNode = (newX: number, newY: number) => {
    setPosition({ x: newX, y: newY });

    setEdgePositions((prev) =>
      prev.map((edge) => {
        if (edge.nodeID !== id) return edge;

        // Helper function to get new position for any circle
        const getNewPosition = (currentX: number, currentY: number) => {
          const deltaX = newX - position.x;
          const deltaY = newY - position.y;
          return {
            positionX: currentX + deltaX,
            positionY: currentY + deltaY,
          };
        };

        return {
          ...edge,
          ...getNewPosition(edge.positionX, edge.positionY),
        };
      })
    );

    setAtrEdgePositions((prev) =>
      prev.map((edge) => {
        if (edge.attributeID !== id) return edge;

        // Helper function to get new position for any circle
        const getNewPosition = (currentX: number, currentY: number) => {
          const deltaX = newX - position.x;
          const deltaY = newY - position.y;
          return {
            positionX: currentX + deltaX,
            positionY: currentY + deltaY,
          };
        };

        return {
          ...edge,
          ...getNewPosition(edge.positionX, edge.positionY),
        };
      })
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
      {/* Left circle */}
      <circle
        className={`hover:cursor-pointer hover:opacity-100 ${
          isLeftCircleActive ? 'opacity-100' : 'opacity-40'
        }`}
        cx={leftCirclePosition.x}
        cy={leftCirclePosition.y}
        r={7}
        fill='#D9D9D9'
        stroke='black'
        strokeWidth={1}
        onClick={() => (
          console.log('Clicked on node: ', id),
          onHeaderClick(id, leftCirclePosition)
        )}
      />
      {/* Right circle */}
      <circle
        className={`hover:cursor-pointer hover:opacity-100 ${
          isRightCircleActive ? 'opacity-100' : 'opacity-40'
        }`}
        cx={rightCirclePosition.x}
        cy={rightCirclePosition.y}
        r={7}
        fill='#D9D9D9'
        stroke='black'
        strokeWidth={1}
        onClick={() => (
          console.log('Clicked on node: ', id),
          onHeaderClick(id, rightCirclePosition)
        )}
      />
      {/* Header text */}
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
        height={
          attributes.length === 1 ? height : (height * attributes.length) / 1.4
        }
        fill='#FFFFFF'
        stroke='black'
        strokeWidth={1}
        rx={5}
      />

      {attributes.map((attribute, i) => {
        const leftCirclePosition = {
          x: position.x,
          y: position.y + height + (height / 2) * (i + 1),
        };
        const rightCirclePosition = {
          x: position.x + width,
          y: position.y + height + (height / 2) * (i + 1),
        };
        const isLeftCircleActive = isAttributeCircleActive(
          leftCirclePosition.x,
          leftCirclePosition.y
        );
        const isRightCircleActive = isAttributeCircleActive(
          rightCirclePosition.x,
          rightCirclePosition.y
        );

        return (
          <g key={i}>
            {/* Left circles */}
            <circle
              className={`hover:cursor-pointer hover:opacity-100 ${
                isLeftCircleActive ? 'opacity-100' : 'opacity-40'
              }`}
              cx={leftCirclePosition.x}
              cy={leftCirclePosition.y}
              r={5}
              fill='#8BACC9'
              stroke='blue'
              strokeWidth={1}
              onClick={() => {
                console.log(
                  'Clicked on attribute: ',
                  attribute,
                  attribute.id,
                  leftCirclePosition
                ),
                  onAttributeClick(attribute.id, leftCirclePosition);
              }}
            />
            {/* Right circles */}
            <circle
              className={`hover:cursor-pointer hover:opacity-100 ${
                isRightCircleActive ? 'opacity-100' : 'opacity-40'
              }`}
              cx={rightCirclePosition.x}
              cy={rightCirclePosition.y}
              r={5}
              fill='#8BACC9'
              stroke='blue'
              strokeWidth={1}
              onClick={() => {
                console.log(
                  'Clicked on attribute: ',
                  attribute,
                  attribute.id,
                  leftCirclePosition
                ),
                  onAttributeClick(attribute.id, rightCirclePosition);
              }}
            />
            <text
              x={position.x + 10}
              y={position.y + height + (height / 2) * (i + 1)}
              textAnchor='start'
              dominantBaseline='middle'
            >
              {attribute.text}
            </text>
          </g>
        );
      })}
    </>
  );
}
