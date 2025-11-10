'use client';

import { useAtomValue } from 'jotai';
import { useEdges } from '../hooks/useEdges';
import { attrEdgeAtom, edgeAtom, nodeLengthAtom } from '../GlobalValues';
import { useEffect, useState } from 'react';
import { IPendingAtrEdge, IPendingEdge } from '../interface/IStates';
import { usePositionCalculators } from '../hooks/useCalulatePosition';
import { useAttributeEdges } from '../hooks/useAttributeEdges';
import { useAttributes } from '../hooks/useAttributes';

export default function Edge({
  pendingEdge,
  pendingAtrEdge,
  onHeaderClick,
}: {
  pendingEdge: IPendingEdge | null;
  pendingAtrEdge: IPendingAtrEdge | null;
  onHeaderClick: (
    id1: number,
    circlePosition1: { x: number; y: number },
    id2: number,
    circlePosition2: { x: number; y: number }
  ) => void;
  // onAttributeClick: (
  //   id: number,
  //   circlePosition: { x: number; y: number }
  // ) => void;
}) {
  const edgeHook = useEdges();
  const atrEdgeHook = useAttributeEdges();
  const edges = useAtomValue(edgeAtom);
  const { attributes } = useAttributes();
  const atrributeEdges = useAtomValue(attrEdgeAtom);
  const nodeLength = useAtomValue(nodeLengthAtom);
  const { getNodePosition, getAttributePosition } = usePositionCalculators();
  // midpoints for circle on edges
  const [midCircles, setMidCircles] = useState<
    Record<number, { x: number; y: number }>
  >({});

  // edges
  const edgeIDs = edges.map((edge) => edge.id);
  const getNodes = (
    edgeID: number
  ): { srcNodeID: number; trgtNodeID: number } | undefined => {
    const edge = edges.find((edge) => edge.id === edgeID);
    if (edge) return { srcNodeID: edge.srcNodeID, trgtNodeID: edge.trgtNodeID };
  };

  // attribute edges
  const attributeEdgeIDs = atrributeEdges.map((atrEdge) => atrEdge.id);
  const getAttributes = (
    atrEdgeID: number
  ): { srcAtrID: number; trgtAtrID: number } | undefined => {
    const atrEdge = atrributeEdges.find((atrEdge) => atrEdge.id === atrEdgeID);
    if (atrEdge)
      return { srcAtrID: atrEdge.srcAtrID, trgtAtrID: atrEdge.trgtAtrID };
  };

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

  const getTempPathData = (
    pos1: { x: number; y: number },
    pos2: { x: number; y: number }
  ): string => {
    return `M ${pos1.x} ${pos1.y} L ${pos2.x} ${pos2.y}`;
  };

  // Function to calculate midpoint for a path
  const calculateMidpoint = (pathElement: SVGPathElement, edgeID: number) => {
    const totalLength = pathElement.getTotalLength();
    if (!isFinite(totalLength) || totalLength === 0) return;

    const pt = pathElement.getPointAtLength(totalLength / 2);
    setMidCircles((prev) => ({
      ...prev,
      [edgeID]: { x: pt.x, y: pt.y },
    }));
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
          d={getTempPathData(
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
          d={getTempPathData(
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
      {edgeIDs.map((edgeID) => {
        const nodes = getNodes(edgeID);

        if (nodes && !edgeHook.loading) {
          const { srcNodeID, trgtNodeID } = nodes;
          const pos1 = getNodePosition(srcNodeID);
          const pos2 = getNodePosition(trgtNodeID);

          if (pos1 && pos2) {
            return (
              <g key={edgeID}>
                <path
                  ref={(pathElement) => {
                    if (pathElement) {
                      setTimeout(
                        () => calculateMidpoint(pathElement, edgeID),
                        0
                      );
                    }
                  }}
                  d={getPathData(pos1, pos2)}
                  stroke='black'
                  strokeWidth={3.5}
                  // strokeDasharray={'10,10'}
                  fill='none'
                  onClick={() => {
                    const nodeAAtr = attributes.filter(
                      (attr) => attr.nodeID === srcNodeID
                    );
                    const nodeBAtr = attributes.filter(
                      (attr) => attr.nodeID === trgtNodeID
                    );
                    const nodeAAtrIDs = new Set(nodeAAtr.map((a) => a.id));
                    const nodeBAtrIDs = new Set(nodeBAtr.map((a) => a.id));

                    // attribute edges between nodes
                    const relevantAttrEdges = atrributeEdges.filter(
                      (atrEdge) =>
                        (nodeAAtrIDs.has(atrEdge.srcAtrID) &&
                          nodeBAtrIDs.has(atrEdge.trgtAtrID)) ||
                        (nodeAAtrIDs.has(atrEdge.trgtAtrID) &&
                          nodeBAtrIDs.has(atrEdge.srcAtrID))
                    );

                    // delete the node edge and all complete attribute connections
                    edgeHook.deleteEdges(edgeID);
                    relevantAttrEdges.forEach((atrEdge) => {
                      atrEdgeHook.deleteAttributeEdges(atrEdge.id);
                    });
                  }}
                  className='hover:cursor-pointer'
                  strokeOpacity={0.6}
                />
                {midCircles[edgeID] && (
                  <circle
                    cx={midCircles[edgeID].x}
                    cy={midCircles[edgeID].y}
                    r={6}
                    fill='white'
                    stroke='black'
                    className='hover:opacity-100 opacity-70'
                    onClick={() => {
                      if (pendingEdge) {
                        onHeaderClick(srcNodeID, pos1, trgtNodeID, pos2);
                      } else {
                        alert('Click a node first.');
                      }
                    }}
                  />
                )}
              </g>
            );
          }
        }
        return null;
      })}

      {/* attribute edges */}
      {attributeEdgeIDs.map((atrEdgeID) => {
        const attrs = getAttributes(atrEdgeID);
        if (attrs && !edgeHook.loading) {
          const { srcAtrID, trgtAtrID } = attrs;
          const pos1 = getAttributePosition(srcAtrID);
          const pos2 = getAttributePosition(trgtAtrID);

          if (pos1 && pos2) {
            return (
              <path
                key={atrEdgeID}
                d={getPathData(pos1, pos2)}
                stroke='blue'
                strokeWidth={3}
                // strokeDasharray={'5,5'}
                fill='none'
                onClick={() => atrEdgeHook.deleteAttributeEdges(atrEdgeID)}
                className='hover:cursor-pointer'
                strokeOpacity={0.6}
              />
            );
          }
        }
        return null;
      })}
    </>
  );
}
