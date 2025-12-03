'use client';

import { useAtomValue } from 'jotai';
import { useEdges } from '../hooks/useEdges';
import {
  attrEdgeAtom,
  edgeAtom,
  multiEdgeAtom,
  nodeAtom,
} from '../GlobalValues';
import { useEffect, useState } from 'react';
import { IPendingAtrEdge, IPendingEdge } from '../interface/IStates';
import { usePositionCalculation } from '../hooks/usePositionCalculation';
import { useAttributeEdges } from '../hooks/useAttributeEdges';
import { useAttributes } from '../hooks/useAttributes';
import { INode } from '../interface/INode';
import { EdgeType } from '../interface/IEdge';

export default function Edge({
  pendingEdge,
  pendingAtrEdge,
  onEdgeClick,
}: {
  pendingEdge: IPendingEdge | null;
  pendingAtrEdge: IPendingAtrEdge | null;
  onEdgeClick: (nodeIDs: number[]) => void;
  // onAttributeClick: (
  //   id: number,
  //   circlePosition: { x: number; y: number }
  // ) => void;
}) {
  const edgeHook = useEdges();
  const atrEdgeHook = useAttributeEdges();
  const nodes = useAtomValue(nodeAtom);
  const edges = useAtomValue(edgeAtom);
  const multiEdges = useAtomValue(multiEdgeAtom);
  const { attributes } = useAttributes();
  const attributeEdges = useAtomValue(attrEdgeAtom);
  const {
    getNodePosition,
    getAttributePosition,
    getPathData,
    getMidpoint,
    getShortestPath,
    getTempPathData,
    getArrowData,
  } = usePositionCalculation();
  // midpoints for circle on edges
  const [midCircles, setMidCircles] = useState<
    Record<number, { x: number; y: number }>
  >({});

  const getNodes = (
    edgeID: number
  ):
    | { srcNode: INode | undefined; trgtNode: INode | undefined }
    | undefined => {
    const edge = edges.find((edge) => edge.id === edgeID);
    if (edge)
      return {
        srcNode: nodes.find((n) => n.id === edge.srcNodeID),
        trgtNode: nodes.find((n) => n.id === edge.trgtNodeID),
      };
  };

  const getAttributes = (
    atrEdgeID: number
  ): { srcAtrID: number; trgtAtrID: number } | undefined => {
    const atrEdge = attributeEdges.find((atrEdge) => atrEdge.id === atrEdgeID);
    if (atrEdge)
      return { srcAtrID: atrEdge.srcAtrID, trgtAtrID: atrEdge.trgtAtrID };
  };

  // calculate midpoint for a path
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
          stroke='grey'
          strokeWidth={3}
          strokeDasharray={'5,5'}
          fill='none'
          className='hover:cursor-pointer'
          strokeOpacity={0.6}
        />
      )}

      {edges.map((edge) => {
        const edgeID = edge.id;
        const nodes = getNodes(edgeID);

        if (nodes && !edgeHook.loading) {
          const { srcNode, trgtNode } = nodes;
          if (srcNode && trgtNode) {
            const pos1 = getNodePosition(srcNode.id);
            const pos2 = getNodePosition(trgtNode.id);
            if (pos1 && pos2) {
              // nodes under same schema
              if (srcNode.schemaID === trgtNode.schemaID) {
                // offset for diamond
                const pos1Comp = { x: pos1.x, y: pos1.y + 8 };
                const compData = getArrowData(
                  pos1Comp,
                  pos2,
                  srcNode,
                  trgtNode
                );
                const arrowData = getArrowData(pos1, pos2, srcNode, trgtNode);
                const padding = 20;
                return (
                  <g key={edgeID}>
                    <path
                      d={
                        edge.type === EdgeType.comp
                          ? `M ${compData.pos1X} ${compData.pos1Y} L ${compData.pos2X} ${compData.pos2Y}`
                          : `M ${arrowData.pos1X} ${arrowData.pos1Y} L ${arrowData.pos2X} ${arrowData.pos2Y}`
                      }
                      strokeWidth={2}
                      stroke='black'
                      markerStart={
                        edge.type === EdgeType.comp ? 'url(#diamond)' : ''
                      }
                      markerEnd={`${
                        edge.type === EdgeType.assoc
                          ? 'url(#line)'
                          : edge.type === EdgeType.direct ||
                            edge.type === EdgeType.comp
                          ? 'url(#arrow-dir)'
                          : edge.type === EdgeType.inherit
                          ? 'url(#arrow-ih)'
                          : ''
                      }`}
                    />

                    {/* multiplicities */}
                    <text
                      x={
                        edge.type === EdgeType.comp
                          ? compData.pos1X + padding
                          : arrowData.pos1X + padding
                      }
                      y={arrowData.pos1Y + padding}
                      textAnchor='middle'
                      dominantBaseline='middle'
                      pointerEvents='none'
                    >
                      {edge.srcMul}
                    </text>
                    {/* TODO: Fix Y value accuracy */}
                    <text
                      x={arrowData.pos2X + padding}
                      y={
                        arrowData.pos1Y < arrowData.pos2Y
                          ? arrowData.pos2Y - padding
                          : arrowData.pos2Y + padding
                      }
                      textAnchor='middle'
                      dominantBaseline='middle'
                      pointerEvents='none'
                    >
                      {edge.trgtMul}
                    </text>
                  </g>
                );
              }
              // nodes under different schemas
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
                        (attr) => attr.nodeID === srcNode.id
                      );
                      const nodeBAtr = attributes.filter(
                        (attr) => attr.nodeID === trgtNode.id
                      );
                      const nodeAAtrIDs = new Set(nodeAAtr.map((a) => a.id));
                      const nodeBAtrIDs = new Set(nodeBAtr.map((a) => a.id));

                      // attribute edges between nodes
                      const relevantAttrEdges = attributeEdges.filter(
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
                  {/* circle in the middle of edge */}
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
                          onEdgeClick([srcNode.id, trgtNode.id]);
                          edgeHook.deleteEdges(edgeID);
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
        }
        return null;
      })}

      {multiEdges.map((multiEdge) => {
        const nodeIDs = multiEdge.nodes.map((n) => n.id);
        const nodePositions = nodeIDs
          .map((nodeID) => getNodePosition(nodeID))
          .filter((pos): pos is { x: number; y: number } => pos !== null);
        const midpoint = getMidpoint(nodePositions);

        if (midpoint && nodePositions.length > 0) {
          return nodePositions.map((position, index) => (
            <g key={index}>
              <path
                key={`${multiEdge.id}-${index}`}
                stroke='#818181'
                strokeWidth={3}
                d={getShortestPath(midpoint, position)}
              />
              {/* diamond */}
              <path
                d={`M ${midpoint.x} ${midpoint.y - 12} 
                  L ${midpoint.x + 7} ${midpoint.y} 
                  L ${midpoint.x} ${midpoint.y + 12} 
                  L ${midpoint.x - 7} ${midpoint.y} Z`}
                // TODO: able to click diamond to add node to multiEdge
              />
            </g>
          ));
        }
        return null;
      })}

      {attributeEdges.map((atrEdge) => {
        const atrEdgeID = atrEdge.id;
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
                stroke='#818181'
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
