'use client';

import { useAtomValue } from 'jotai';
import { useConnection } from '../hooks/useConnection';
import {
  IPendingAtrCon,
  IPendingCon,
  IPendingEdgeCon,
} from '../interface/IStates';
import {
  atrAtom,
  atrConAtom,
  edgeConAtom,
  midCircleAtom,
  midEdgeAtom,
  multiConAtom,
  nodeAtom,
  nodeConAtom,
} from '../GlobalValues';
import { useEffect, useState } from 'react';
import { useCalculation } from '../hooks/useCalculation';
import { INode } from '../interface/INode';
import { useAtrCon } from '../hooks/useAtrCon';
import { useMultiCon } from '../hooks/useMultiCon';
import { useEdgeCon } from '../hooks/useEdgeCon';

export default function Connection({
  pendingCon,
  pendingAtrCon,
  pendingEdgeCon,
  onConClick,
  onMultiConClick,
}: {
  pendingCon: IPendingCon | null;
  pendingAtrCon: IPendingAtrCon | null;
  pendingEdgeCon: IPendingEdgeCon | null;
  onConClick: (nodeIDs: number[]) => void;
  onMultiConClick: (id: number, nodeID: number) => void;
  // onAttributeClick: (
  //   id: number,
  //   circlePosition: { x: number; y: number }
  // ) => void;
}) {
  const conHook = useConnection();
  const multiConHook = useMultiCon();
  const atrConHook = useAtrCon();
  const edgeConHook = useEdgeCon();
  const nodes = useAtomValue(nodeAtom);
  const attributes = useAtomValue(atrAtom);

  const midCircles = useAtomValue(midCircleAtom);
  const midEdge = useAtomValue(midEdgeAtom);
  const cons = useAtomValue(nodeConAtom);
  const multiConnection = useAtomValue(multiConAtom);
  const atrConnection = useAtomValue(atrConAtom);
  const edgeConnection = useAtomValue(edgeConAtom);

  const {
    getNodePosition,
    getPathData,
    getTempPathData,
    getNode,
    getAttributePosition,
    getMidpoint,
    getShortestPath,
    calculateMidpoint,
  } = useCalculation();

  const getNodes = (
    conID: number,
  ):
    | { srcNode: INode | undefined; trgtNode: INode | undefined }
    | undefined => {
    const con = cons.find((c) => c.id === conID);
    if (con) {
      return {
        srcNode: nodes.find((n) => n.id === con.srcNodeID),
        trgtNode: nodes.find((n) => n.id === con.trgtNodeID),
      };
    }
  };

  const getAtrIDs = (
    atrConID: number,
  ): { srcAtrID: number; trgtAtrID: number } | undefined => {
    const atrCon = atrConnection.find((con) => con.id === atrConID);
    if (atrCon)
      return { srcAtrID: atrCon.srcAtrID, trgtAtrID: atrCon.trgtAtrID };
  };

  const getEdgeIDs = (
    edgeConID: number,
  ): { srcEdgeID: number; trgtEdgeID: number } | undefined => {
    const edgeCon = edgeConnection.find((con) => con.id === edgeConID);
    if (edgeCon)
      return { srcEdgeID: edgeCon.srcEdgeID, trgtEdgeID: edgeCon.trgtEdgeID };
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

    if (pendingCon || pendingAtrCon || pendingEdgeCon) {
      document.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [pendingCon, pendingAtrCon, pendingEdgeCon]);

  let hasMousePosition = mousePosition.x !== 0 && mousePosition.y !== 0;

  return (
    <>
      {/* temporary */}
      {pendingCon && hasMousePosition && (
        <path
          key={pendingCon.conID}
          d={getTempPathData(
            { x: pendingCon.positionX, y: pendingCon.positionY },
            mousePosition,
          )}
          stroke='black'
          strokeWidth={3}
          strokeDasharray={'5,5'}
          fill='none'
          className='hover:cursor-pointer'
          strokeOpacity={0.6}
        />
      )}

      {pendingAtrCon && hasMousePosition && (
        <path
          key={pendingAtrCon.atrConID}
          d={getTempPathData(
            { x: pendingAtrCon.positionX, y: pendingAtrCon.positionY },
            mousePosition,
          )}
          stroke='grey'
          strokeWidth={3}
          strokeDasharray={'5,5'}
          fill='none'
          className='hover:cursor-pointer'
          strokeOpacity={0.6}
        />
      )}

      {pendingEdgeCon && hasMousePosition && (
        <path
          key={pendingEdgeCon.edgeConID}
          d={getTempPathData(
            { x: pendingEdgeCon.positionX, y: pendingEdgeCon.positionY },
            mousePosition,
          )}
          stroke='grey'
          strokeWidth={3}
          strokeDasharray={'5,5'}
          fill='none'
          className='hover:cursor-pointer'
          strokeOpacity={0.6}
        />
      )}

      {/* connections */}
      {cons.map((c) => {
        const conID = c.id;
        const nodes = getNodes(conID);

        if (nodes) {
          const { srcNode, trgtNode } = nodes;
          if (srcNode && trgtNode) {
            const pos1 = getNodePosition(srcNode.id);
            const pos2 = getNodePosition(trgtNode.id);
            if (pos1 && pos2) {
              // attributes of nodes
              const nodeAAtr = attributes.filter(
                (attr) => attr.nodeID === srcNode.id,
              );
              const nodeBAtr = attributes.filter(
                (attr) => attr.nodeID === trgtNode.id,
              );
              const nodeAAtrIDs = new Set(nodeAAtr.map((a) => a.id));
              const nodeBAtrIDs = new Set(nodeBAtr.map((a) => a.id));

              // attribute connections between nodes
              const relevantAtrCons = atrConnection.filter(
                (atrCon) =>
                  (nodeAAtrIDs.has(atrCon.srcAtrID) &&
                    nodeBAtrIDs.has(atrCon.trgtAtrID)) ||
                  (nodeAAtrIDs.has(atrCon.trgtAtrID) &&
                    nodeBAtrIDs.has(atrCon.srcAtrID)),
              );

              return (
                <g key={conID}>
                  <path
                    ref={(pathElement) => {
                      if (pathElement) {
                        setTimeout(
                          () => calculateMidpoint(pathElement, c.id),
                          0,
                        );
                      }
                    }}
                    d={getPathData(pos1, pos2, srcNode.id, trgtNode.id)}
                    stroke='black'
                    strokeWidth={3.5}
                    // strokeDasharray={'10,10'}
                    fill='none'
                    onClick={() => {
                      if (confirm('Delete connection?')) {
                        // delete the node connection and all related attribute connections
                        conHook.deleteCon(conID);
                        relevantAtrCons.forEach((atrCon) => {
                          atrConHook.deleteAtrCon(atrCon.id);
                        });
                      }
                    }}
                    className='hover:cursor-pointer'
                    strokeOpacity={0.6}
                  />
                  {/* circle in the middle of connection */}
                  {midCircles[conID] && (
                    <circle
                      cx={midCircles[conID].x}
                      cy={midCircles[conID].y}
                      r={6}
                      fill='white'
                      stroke='black'
                      className='hover:opacity-100 opacity-70'
                      onClick={() => {
                        if (pendingCon) {
                          onConClick([srcNode.id, trgtNode.id]);
                          conHook.deleteCon(conID);
                          relevantAtrCons.forEach((atrCon) => {
                            atrConHook.deleteAtrCon(atrCon.id);
                          });
                        } else {
                          alert(
                            'Click a node first, then the circle to create a multi-connection.',
                          );
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

      {multiConnection.map((multiCon) => {
        if (multiCon.nodes) {
          const multiConID = multiCon.id;
          const nodeIDs = multiCon.nodes.map((n) => n.id);
          const nodePositions = nodeIDs
            .map((nodeID) => getNodePosition(nodeID))
            .filter((pos): pos is { x: number; y: number } => pos !== null);
          const midpoint = getMidpoint(nodePositions);

          if (midpoint && nodePositions.length > 0) {
            return nodePositions.map((position, index) => (
              <g key={index}>
                <path
                  key={`${multiConID}-${index}`}
                  stroke='#818181'
                  strokeWidth={3}
                  d={getShortestPath(midpoint, position, nodeIDs[index])}
                />
                {/* diamond */}
                <path
                  d={`M ${midpoint.x} ${midpoint.y - 12} 
                  L ${midpoint.x + 7} ${midpoint.y} 
                  L ${midpoint.x} ${midpoint.y + 12} 
                  L ${midpoint.x - 7} ${midpoint.y} Z`}
                  onClick={() => {
                    if (pendingCon) {
                      onMultiConClick(multiConID, pendingCon.nodeID);
                    } else {
                      if (
                        confirm(
                          'Delete multi connection? (To add node to multi connection click node first, then diamond).',
                        )
                      ) {
                        multiConHook.deleteMultiCon(multiConID);
                      }
                    }
                  }}
                />
              </g>
            ));
          }
        }
        return null;
      })}

      {atrConnection.map((atrCon) => {
        const atrConID = atrCon.id;
        const atrIDs = getAtrIDs(atrConID);
        if (atrIDs) {
          const { srcAtrID, trgtAtrID } = atrIDs;
          const pos1 = getAttributePosition(srcAtrID);
          const pos2 = getAttributePosition(trgtAtrID);

          const srcNode = getNode(srcAtrID);
          const trgtNode = getNode(trgtAtrID);

          if (pos1 && pos2 && srcNode && trgtNode) {
            return (
              <path
                key={atrConID}
                d={getPathData(pos1, pos2, srcNode.id, trgtNode.id)}
                stroke='#818181'
                strokeWidth={3}
                // strokeDasharray={'5,5'}
                fill='none'
                onClick={() => atrConHook.deleteAtrCon(atrConID)}
                className='hover:cursor-pointer'
                strokeOpacity={0.6}
              />
            );
          }
        }
        return null;
      })}

      {edgeConnection.map((edgeCon) => {
        const edgeConID = edgeCon.id;
        const edgeIDs = getEdgeIDs(edgeConID);
        if (edgeIDs) {
          const { srcEdgeID, trgtEdgeID } = edgeIDs;
          const pos1 = midEdge[srcEdgeID];
          const pos2 = midEdge[trgtEdgeID];

          if (pos1 && pos2) {
            return (
              <path
                key={edgeConID}
                d={getPathData(pos1, pos2)}
                stroke='#818181'
                strokeWidth={3}
                fill='none'
                onClick={() => {
                  if (
                    confirm(
                      `Delete edge connection from edge ${srcEdgeID} to edge ${trgtEdgeID}`,
                    )
                  ) {
                    edgeConHook.deleteEdgeCon(edgeConID);
                  }
                }}
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
