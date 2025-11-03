'use client';
import { useAtomValue } from 'jotai';
import { useEdges } from '../hooks/useEdges';
import {
  attributeEdgeAtom,
  edgeAtom,
  liveNodePositionsAtom,
  nodeAtom,
  nodeLengthAtom,
} from '../GlobalValues';
import { useEffect, useState } from 'react';
import { IPendingAtrEdge, IPendingEdge } from '../interface/IStates';

export default function Edge({
  pendingEdge,
  pendingAtrEdge,
}: {
  pendingEdge: IPendingEdge | null;
  pendingAtrEdge: IPendingAtrEdge | null;
}) {
  const edgeHook = useEdges();
  const edges = useAtomValue(edgeAtom);
  const nodes = useAtomValue(nodeAtom);
  const atrributeEdges = useAtomValue(attributeEdgeAtom);
  const livePositions = useAtomValue(liveNodePositionsAtom);
  const nodeLength = useAtomValue(nodeLengthAtom);
  const height = 40;

  const getNodePosition = (nodeID: number) => {
    const livePos = livePositions.find((pos) => pos.nodeID === nodeID);
    if (livePos) {
      return {
        x: livePos.x,
        y: livePos.y + height / 2,
      };
    }
    const node = nodes.find((n) => n.id === nodeID);
    if (node) {
      const position = { x: node.positionX || 0, y: node.positionY || 0 };
      return {
        x: position.x,
        y: position.y + height / 2,
      };
    }

    return null;
  };

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
    // calculate shortest paths for pos1 and pos2
    const diff1X = pos2.x - pos1.x;
    const diff1XWidth = pos2.x - (pos1.x + nodeLength);
    const pos1X =
      Math.abs(diff1X) < Math.abs(diff1XWidth) ? pos1.x : pos1.x + nodeLength;

    const diff2X = pos1X - pos2.x;
    const diff2XWidth = pos1X - (pos2.x + nodeLength);
    const pos2X =
      Math.abs(diff2X) < Math.abs(diff2XWidth) ? pos2.x : pos2.x + nodeLength;

    const actualDiffY = pos1.y - pos2.y;

    if (actualDiffY === 0) {
      return `M ${pos1X} ${pos1.y} L ${pos2X} ${pos2.y}`;
    }

    const distance = Math.abs(pos2X - pos1X);
    const curveStrength = Math.min(distance * 0.8, 100);

    const controlPoint1X =
      pos1X + (pos1X === pos1.x ? -curveStrength : curveStrength);
    const controlPoint1Y = pos1.y;
    const controlPoint2X =
      pos2X + (pos2X === pos2.x ? -curveStrength : curveStrength);
    const controlPoint2Y = pos2.y;

    return `M ${pos1X} ${pos1.y} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${pos2X} ${pos2.y}`;
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
          const pos1 = getNodePosition(positions[0].nodeID);
          const pos2 = getNodePosition(positions[1].nodeID);

          if (pos1 && pos2) {
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
        }
        return null;
      })}

      {/* attribute edges */}
    </>
  );
}
