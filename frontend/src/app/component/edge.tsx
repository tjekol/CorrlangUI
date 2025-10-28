'use client';
import { useAtomValue } from 'jotai';
import { useEdges } from '../hooks/useEdges';
import { attributeEdgeAtom, edgeAtom } from '../GlobalValues';
import { useAttributeEdges } from '../hooks/useAttributeEdges';
import { useEffect, useState } from 'react';

export default function Edge({
  pendingEdge,
  pendingAtrEdge,
}: {
  pendingEdge: {
    edgeID: number;
    nodeID: number;
    positionX: number;
    positionY: number;
  } | null;
  pendingAtrEdge: {
    attributeEdgeID: number;
    attributeID: number;
    positionX: number;
    positionY: number;
  } | null;
}) {
  const edgeHook = useEdges();
  const attributeEdgeHook = useAttributeEdges();
  const edges = useAtomValue(edgeAtom);
  const atrributeEdges = useAtomValue(attributeEdgeAtom);

  // edges
  const uniqueEdgeIDs = [...new Set(edges.map((edge) => edge.edgeID))];
  const edgePosition = (index: number) =>
    edges.filter((edge) => edge.edgeID === index).slice(0, 2);

  // attribute edges
  const uniqueAttributeEdgeIDs = [
    ...new Set(atrributeEdges.map((edge) => edge.attributeEdgeID)),
  ];
  const attributeEdgePosition = (index: number) =>
    atrributeEdges.filter((edge) => edge.attributeEdgeID === index).slice(0, 2);

  const getPathData = (
    pos1: { x: number; y: number },
    pos2: { x: number; y: number }
  ): string => {
    const diffY = pos1.y - pos2.y;
    const diffX = pos1.x - pos2.x;
    // mid point of path
    const midX = (pos1.x + pos2.x) / 2;
    const midY = (pos1.y + pos2.y) / 2;
    let curve = 0.2;

    if (diffX >= 0) {
      curve = 0.8;
    }

    if (diffY === 0) {
      return `M ${pos1.x} ${pos1.y} , ${pos2.x} ${pos2.y}`;
    } else if (diffY <= 0) {
      const controlPoint1X = midX - (pos1.y - pos2.y) * curve;
      const controlPoint1Y = midY - (pos2.x - pos1.x) * curve;
      const controlPoint2X = midX + (pos1.y - pos2.y) * curve;
      const controlPoint2Y = midY + (pos2.x - pos1.x) * curve;
      return `M ${pos1.x} ${pos1.y} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${pos2.x} ${pos2.y}`;
    }
    const controlPoint1X = midX + (pos1.y - pos2.y) * curve;
    const controlPoint1Y = midY + (pos2.x - pos1.x) * curve;
    const controlPoint2X = midX - (pos1.y - pos2.y) * curve;
    const controlPoint2Y = midY - (pos2.x - pos1.x) * curve;
    return `M ${pos1.x} ${pos1.y} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${pos2.x} ${pos2.y}`;
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const svg = document.querySelector('svg');
      if (svg) {
        const rect = svg.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    if (pendingEdge || pendingAtrEdge) {
      document.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [pendingEdge, pendingAtrEdge]);

  return (
    <>
      {/* temporary */}
      {pendingEdge && mousePosition.x !== 0 && mousePosition.y !== 0 && (
        <path
          key={pendingEdge.edgeID}
          d={getPathData(
            { x: pendingEdge.positionX, y: pendingEdge.positionY },
            mousePosition
          )}
          stroke='black'
          strokeWidth={3}
          strokeDasharray={'5,5'}
          fill='none'
          className='hover:cursor-pointer'
          strokeOpacity={0.6}
        />
      )}

      {pendingAtrEdge && mousePosition.x !== 0 && mousePosition.y !== 0 && (
        <path
          key={pendingAtrEdge.attributeEdgeID}
          d={getPathData(
            { x: pendingAtrEdge.positionX, y: pendingAtrEdge.positionY },
            mousePosition
          )}
          stroke='blue'
          strokeWidth={3}
          strokeDasharray={'5,5'}
          fill='none'
          className='hover:cursor-pointer'
          strokeOpacity={0.6}
        />
      )}

      {/* edges */}
      {uniqueEdgeIDs.map((edgeID) => {
        const positions = edgePosition(edgeID);

        // draw edge if exactly 2 positions have different nodeIDs
        if (
          positions.length === 2 &&
          positions[0].nodeID !== positions[1].nodeID &&
          !edgeHook.loading
        ) {
          const pos1 = { x: positions[0].positionX, y: positions[0].positionY };
          const pos2 = { x: positions[1].positionX, y: positions[1].positionY };

          return (
            <path
              key={edgeID}
              d={getPathData(pos1, pos2)}
              stroke='black'
              strokeWidth={3}
              strokeDasharray={'5,5'}
              fill='none'
              onClick={() => edgeHook.deleteEdges(edgeID)}
              className='hover:cursor-pointer'
              strokeOpacity={0.6}
            />
          );
        }
        return null;
      })}
      {/* attribute edges */}
      {uniqueAttributeEdgeIDs.map((edgeID) => {
        const positions = attributeEdgePosition(edgeID);

        // draw edge if exactly 2 positions have different nodeIDs
        if (
          positions.length === 2 &&
          positions[0].attributeID !== positions[1].attributeID &&
          !attributeEdgeHook.loading
        ) {
          const pos1 = { x: positions[0].positionX, y: positions[0].positionY };
          const pos2 = { x: positions[1].positionX, y: positions[1].positionY };

          return (
            <path
              key={edgeID}
              d={getPathData(pos1, pos2)}
              stroke='blue'
              strokeWidth={3}
              strokeDasharray={'5,5'}
              fill='none'
              onClick={() => attributeEdgeHook.deleteAttributeEdges(edgeID)}
              className='hover:cursor-pointer'
              strokeOpacity={0.6}
            />
          );
        }
        return null;
      })}
    </>
  );
}
