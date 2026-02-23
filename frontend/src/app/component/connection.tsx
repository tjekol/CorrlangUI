'use client';

import { useAtomValue } from 'jotai';
import {
  IPendingAtrCon,
  IPendingNodeCon,
  IPendingEdgeCon,
} from '../interface/IStates';
import {
  nodeConAtom,
  atrConAtom,
  edgeConAtom,
  midNodeConAtom,
  midAtrConAtom,
  midEdgeConAtom,
  midEdgeAtom,
} from '../GlobalValues';
import { useEffect, useState } from 'react';
import { useCalculation } from '../hooks/useCalculation';
import { useNodeCon } from '../hooks/useNodeCon';
import { useAtrCon } from '../hooks/useAtrCon';
import { useEdgeCon } from '../hooks/useEdgeCon';

export default function Connection({
  pendingNodeCon,
  pendingAtrCon,
  pendingEdgeCon,
  onConClick,
  onAtrConClick,
  onEdgeConClick,
}: {
  pendingNodeCon: IPendingNodeCon | null;
  pendingAtrCon: IPendingAtrCon | null;
  pendingEdgeCon: IPendingEdgeCon | null;
  onConClick: (nodeConID: number, nodeID: number) => boolean | void;
  onAtrConClick: (atrConID: number, atrID: number) => boolean | void;
  onEdgeConClick: (edgeConID: number, edgeID: number) => boolean | void;
}) {
  // Hooks
  const nodeConHook = useNodeCon();
  const atrConHook = useAtrCon();
  const edgeConHook = useEdgeCon();

  // Connections
  const nodeCons = useAtomValue(nodeConAtom);
  const atrCons = useAtomValue(atrConAtom);
  const edgeCons = useAtomValue(edgeConAtom);

  // Middle position of connections
  const midNodeCon = useAtomValue(midNodeConAtom);
  const midAtrCon = useAtomValue(midAtrConAtom);
  const midEdgeCon = useAtomValue(midEdgeConAtom);
  const midEdge = useAtomValue(midEdgeAtom);

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

  const getNodeIDs = (nodeConID: number): number[] | undefined => {
    const nodeCon = nodeCons.find((c) => c.id === nodeConID);
    if (nodeCon) {
      return nodeCon.nodes.map((n) => n.id);
    }
  };

  const getAtrIDs = (atrConID: number): number[] | undefined => {
    const atrCon = atrCons.find((con) => con.id === atrConID);
    if (atrCon) return atrCon.attributes.map((a) => a.id);
  };

  const getEdgeIDs = (edgeConID: number): number[] | undefined => {
    const edgeCon = edgeCons.find((con) => con.id === edgeConID);
    if (edgeCon) return edgeCon.edges.map((e) => e.id);
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

    if (pendingNodeCon || pendingAtrCon || pendingEdgeCon) {
      document.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [pendingNodeCon, pendingAtrCon, pendingEdgeCon]);

  let hasMousePosition = mousePosition.x !== 0 && mousePosition.y !== 0;

  return (
    <>
      {/* temporary */}
      {pendingNodeCon && hasMousePosition && (
        <path
          key={pendingNodeCon.conID}
          d={getTempPathData(
            { x: pendingNodeCon.positionX, y: pendingNodeCon.positionY },
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

      {/* CONNECTIONS */}

      {/* Node connection */}
      {nodeCons.map((c) => {
        const conID = c.id;
        const nodeIDs = getNodeIDs(conID);
        // attributes of nodes
        const relatedAtrCons = atrCons.filter(
          (atrCon) =>
            nodeIDs &&
            atrCon.attributes.every((atr) => nodeIDs.includes(atr.nodeID)),
        );

        if (nodeIDs && nodeIDs.length === 2) {
          const srcNodeID = nodeIDs[0];
          const trgtNodeID = nodeIDs[1];

          const pos1 = getNodePosition(srcNodeID);
          const pos2 = getNodePosition(trgtNodeID);
          if (pos1 && pos2) {
            return (
              <g key={conID}>
                <path
                  ref={(pathElement) => {
                    if (pathElement) {
                      setTimeout(
                        () => calculateMidpoint(pathElement, conID, 0),
                        0,
                      );
                    }
                  }}
                  d={getPathData(pos1, pos2, srcNodeID, trgtNodeID)}
                  stroke='black'
                  strokeWidth={3.5}
                  fill='none'
                  onClick={() => {
                    if (confirm('Delete connection?')) {
                      // delete the node connection and all related attribute connections
                      nodeConHook.deleteNodeCon(conID);
                      relatedAtrCons.forEach((atrCon) => {
                        atrConHook.deleteAtrCon(atrCon.id);
                      });
                    }
                  }}
                  className='hover:cursor-pointer'
                  strokeOpacity={0.6}
                />
                {/* circle in the middle of connection */}
                {midCon[conID] && (
                  <circle
                    cx={midCon[conID].x}
                    cy={midCon[conID].y}
                    r={6}
                    fill='white'
                    stroke='black'
                    className='hover:opacity-100 opacity-70'
                    onClick={() => {
                      if (pendingNodeCon) {
                        onConClick(conID, pendingNodeCon.nodeID);
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
        } else if (nodeIDs) {
          const nodePositions = nodeIDs
            .map((nodeID) => getNodePosition(nodeID))
            .filter((pos): pos is { x: number; y: number } => pos !== null);
          const midpoint = getMidpoint(nodePositions);
          if (midpoint && nodePositions.length > 0) {
            return nodePositions.map((position, index) => (
              <g key={index}>
                <path
                  key={conID}
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
                    if (pendingNodeCon) {
                      onConClick(conID, pendingNodeCon.nodeID);
                    } else {
                      if (confirm('Delete node connection?')) {
                        nodeConHook.deleteNodeCon(conID);
                        relatedAtrCons.map((atrCon) =>
                          atrConHook.deleteAtrCon(atrCon.id),
                        );
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

      {/* Attribute connection */}
      {atrCons.map((atrCon) => {
        const atrConID = atrCon.id;
        const atrIDs = getAtrIDs(atrConID);

        if (atrIDs && atrIDs.length === 2) {
          const srcAtrID = atrIDs[0];
          const trgtAtrID = atrIDs[1];
          const pos1 = getAttributePosition(srcAtrID);
          const pos2 = getAttributePosition(trgtAtrID);

          const srcNode = getNode(srcAtrID);
          const trgtNode = getNode(trgtAtrID);
          if (srcNode && trgtNode && pos1 && pos2) {
            return (
              <g key={atrConID}>
                <path
                  ref={(pathElement) => {
                    if (pathElement) {
                      setTimeout(
                        () => calculateMidpoint(pathElement, atrConID, 1),
                        0,
                      );
                    }
                  }}
                  key={atrConID}
                  d={getPathData(pos1, pos2, srcNode.id, trgtNode.id)}
                  stroke='#818181'
                  strokeWidth={3}
                  fill='none'
                  onClick={() => {
                    if (confirm('Delete attribute connection?')) {
                      atrConHook.deleteAtrCon(atrConID);
                    }
                  }}
                  className='hover:cursor-pointer'
                  strokeOpacity={0.6}
                />
                {/* circle in the middle of connection */}
                {midCon[atrConID] && (
                  <circle
                    cx={midCon[atrConID].x}
                    cy={midCon[atrConID].y}
                    r={5}
                    fill='white'
                    stroke='black'
                    className='hover:opacity-100 opacity-70'
                    onClick={() => {
                      if (pendingAtrCon) {
                        onAtrConClick(atrConID, pendingAtrCon.attributeID);
                      } else {
                        alert(
                          'Click an attribute first, then the circle to add to connection.',
                        );
                      }
                    }}
                  />
                )}
              </g>
            );
          }
        } else if (atrIDs) {
          const atrPositions = atrIDs
            .map((atrID) => getAttributePosition(atrID))
            .filter((pos): pos is { x: number; y: number } => pos !== null);
          const midpoint = getMidpoint(atrPositions);
          if (midpoint && atrPositions.length > 0) {
            return atrPositions.map((position, index) => (
              <g key={index}>
                <path
                  key={`${atrConID}-${index}`}
                  stroke='#818181'
                  strokeWidth={3}
                  strokeOpacity={0.6}
                  d={getShortestPath(
                    midpoint,
                    position,
                    undefined,
                    atrIDs[index],
                  )}
                />
                {/* diamond */}
                <path
                  d={`M ${midpoint.x} ${midpoint.y - 12}
                  L ${midpoint.x + 7} ${midpoint.y}
                  L ${midpoint.x} ${midpoint.y + 12}
                  L ${midpoint.x - 7} ${midpoint.y} Z`}
                  onClick={() => {
                    if (pendingAtrCon) {
                      onAtrConClick(atrConID, pendingAtrCon.attributeID);
                    } else {
                      if (confirm('Delete attribute connection?')) {
                        atrConHook.deleteAtrCon(atrConID);
                      }
                    }
                  }}
                />
              </g>
            ));
          }
        }
      })}

      {/* Edge connection */}
      {edgeCons.map((edgeCon) => {
        const edgeConID = edgeCon.id;
        const edgeIDs = getEdgeIDs(edgeConID);
        if (edgeIDs && edgeIDs.length === 2) {
          const srcEdgeID = edgeIDs[0];
          const trgtEdgeID = edgeIDs[1];
          const pos1 = midEdge[srcEdgeID];
          const pos2 = midEdge[trgtEdgeID];

          if (srcEdgeID && trgtEdgeID && pos1 && pos2) {
            return (
              <g key={edgeConID}>
                <path
                  ref={(pathElement) => {
                    if (pathElement) {
                      setTimeout(
                        () => calculateMidpoint(pathElement, edgeConID, 2),
                        0,
                      );
                    }
                  }}
                  d={getPathData(pos1, pos2)}
                  stroke='#818181'
                  strokeWidth={3}
                  fill='none'
                  onClick={() => {
                    if (confirm(`Delete edge connection.`)) {
                      edgeConHook.deleteEdgeCon(edgeConID);
                    }
                  }}
                  className='hover:cursor-pointer'
                  strokeOpacity={0.6}
                />
                {/* circle in the middle of connection */}
                {midEdgeCon[edgeConID] && (
                  <circle
                    cx={midEdgeCon[edgeConID].x}
                    cy={midEdgeCon[edgeConID].y}
                    r={5}
                    fill='white'
                    stroke='#818181'
                    className='hover:opacity-100 opacity-70'
                    onClick={() => {
                      if (pendingEdgeCon) {
                        onEdgeConClick(edgeConID, pendingEdgeCon.edgeID);
                      } else {
                        alert(
                          'Click an edge first, then the circle to add to connection.',
                        );
                      }
                    }}
                  />
                )}
              </g>
            );
          }
        } else if (edgeIDs) {
        }
      })}
    </>
  );
}
