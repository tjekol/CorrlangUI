'use client';

import { useState, useLayoutEffect } from 'react';
import { INode } from '@/app/interface/INode';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  liveNodePositionsAtom,
  liveAtrPositionsAtom,
  nodeLengthAtom,
  atrConAtom,
  multiConAtom,
  nodeConAtom,
} from '../GlobalValues';
import { useCalculation } from '../hooks/useCalculation';

interface NodeProps extends INode {
  color: string;
  onHeaderClick: (id: number, circlePosition: { x: number; y: number }) => void;
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
  onHeaderClick,
  onAttributeClick,
}: NodeProps) {
  const [position, setPosition] = useState({ x: positionX, y: positionY });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const { calculateNodeLength } = useCalculation();
  const setLiveNodePositions = useSetAtom(liveNodePositionsAtom);
  const setLiveAtrPosition = useSetAtom(liveAtrPositionsAtom);
  const [nodeLengths, setNodeLengths] = useAtom(nodeLengthAtom);
  const cons = useAtomValue(nodeConAtom);
  const multiCons = useAtomValue(multiConAtom);
  const atrCons = useAtomValue(atrConAtom);
  const height = 40;

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

  const hasConnection =
    cons.some((con) => con.srcNodeID === id || con.trgtNodeID === id) ||
    multiCons.some((multiCon) => multiCon.nodes.some((node) => node.id === id));

  const moveNode = (newX: number, newY: number) => {
    setPosition({ x: newX, y: newY });

    setLiveNodePositions((prev) => {
      const existing = prev.find((pos) => pos.nodeID === id);
      if (existing) {
        return prev.map((pos) =>
          pos.nodeID === id
            ? { nodeID: id, positionX: newX, positionY: newY }
            : pos,
        );
      } else {
        return [...prev, { nodeID: id, positionX: newX, positionY: newY }];
      }
    });

    setLiveAtrPosition((prev) => {
      const filteredPrev = prev.filter(
        (atr) => !attributes.some((attr) => attr.id === atr.attributeID),
      );

      const newAtrPositions = attributes
        .map((attribute, i) => {
          const leftPos = {
            attributeID: attribute.id,
            nodeID: id,
            positionX: newX,
            positionY: newY + height + (height / 2) * (i + 1),
          };

          return [leftPos];
        })
        .flat();

      return [...filteredPrev, ...newAtrPositions];
    });
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
        className={`hover:cursor-pointer hover:opacity-100 ${
          hasConnection ? 'opacity-100' : 'opacity-40'
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
          hasConnection ? 'opacity-100' : 'opacity-40'
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
          attributes.length === 1 ? height : (height * attributes.length) / 1.4
        }
        fill='#FFFFFF'
        stroke={color}
        strokeWidth={1}
        rx={5}
      />

      {attributes.map((attribute, i) => {
        const leftCirclePosition = {
          x: position.x,
          y: position.y + height + (height / 2) * (i + 1),
        };
        const rightCirclePosition = {
          x: position.x + nodeLength,
          y: position.y + height + (height / 2) * (i + 1),
        };

        const isActive = atrCons.some(
          (atr) =>
            atr.srcAtrID === attribute.id || atr.trgtAtrID === attribute.id,
        );

        const alertMsg =
          'Node needs to be connected to node before connecting attributes.';

        return (
          <g key={i}>
            {/* Left circles */}
            <circle
              className={`hover:cursor-pointer ${
                hasConnection && 'hover:opacity-100'
              }  ${isActive ? 'opacity-100' : 'opacity-40'}`}
              cx={leftCirclePosition.x}
              cy={leftCirclePosition.y}
              r={5}
              fill={color}
              stroke='#818181'
              strokeWidth={1}
              onClick={() => {
                if (hasConnection) {
                  (console.log(
                    'Clicked on attribute: ',
                    attribute,
                    attribute.id,
                    leftCirclePosition,
                  ),
                    onAttributeClick(attribute.id, leftCirclePosition));
                } else {
                  alert(alertMsg);
                }
              }}
            />
            {/* Right circles */}
            <circle
              className={`hover:cursor-pointer ${
                hasConnection && 'hover:opacity-100'
              } ${isActive ? 'opacity-100' : 'opacity-40'}`}
              cx={rightCirclePosition.x}
              cy={rightCirclePosition.y}
              r={5}
              fill={color}
              stroke='#818181'
              strokeWidth={1}
              onClick={() => {
                if (hasConnection) {
                  (console.log(
                    'Clicked on attribute: ',
                    attribute,
                    attribute.id,
                    leftCirclePosition,
                  ),
                    onAttributeClick(attribute.id, rightCirclePosition));
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
              {attribute.text}:{' '}
              {attribute.isArray
                ? `[${attribute.type || ''}]`
                : `${attribute.type || ''}`}
            </text>
          </g>
        );
      })}
    </>
  );
}
