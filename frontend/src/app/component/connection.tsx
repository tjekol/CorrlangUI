import { useAtomValue } from 'jotai';
import { useConnection } from '../hooks/useConnection';
import { IPendingAtrCon, IPendingCon } from '../interface/IStates';
import {
  atrConAtom,
  multiConAtom,
  nodeAtom,
  nodeConAtom,
} from '../GlobalValues';
import { useEffect, useState } from 'react';
import { usePositionCalculation } from '../hooks/usePositionCalculation';
import { INode } from '../interface/INode';
import { useAttributes } from '../hooks/useAttributes';
import { useAtrCon } from '../hooks/useAtrCon';
import { useMultiCon } from '../hooks/useMultiCon';

export default function Connection({
  pendingCon,
  pendingAtrCon,
  onEdgeClick,
  onMultiConClick,
}: {
  pendingCon: IPendingCon | null;
  pendingAtrCon: IPendingAtrCon | null;
  onEdgeClick: (nodeIDs: number[]) => void;
  onMultiConClick: (id: number, nodeID: number) => void;
  // onAttributeClick: (
  //   id: number,
  //   circlePosition: { x: number; y: number }
  // ) => void;
}) {
  const conHook = useConnection();
  const multiConHook = useMultiCon();
  const atrConHook = useAtrCon();
  const cons = useAtomValue(nodeConAtom);
  const nodes = useAtomValue(nodeAtom);
  const { attributes } = useAttributes();

  const atrConnection = useAtomValue(atrConAtom);
  const multiConnection = useAtomValue(multiConAtom);

  // midpoints for circle on edges
  const [midCircles, setMidCircles] = useState<
    Record<number, { x: number; y: number }>
  >({});
  const {
    getNodePosition,
    getPathData,
    getTempPathData,
    getAttributePosition,
    getMidpoint,
    getShortestPath,
  } = usePositionCalculation();

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

  const getAttributes = (
    atrConID: number,
  ): { srcAtrID: number; trgtAtrID: number } | undefined => {
    const atrCon = atrConnection.find((con) => con.id === atrConID);
    if (atrCon)
      return { srcAtrID: atrCon.srcAtrID, trgtAtrID: atrCon.trgtAtrID };
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

    if (pendingCon || pendingAtrCon) {
      document.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [pendingCon, pendingAtrCon]);

  return (
    <>
      {/* temporary */}
      {pendingCon && mousePosition.x !== 0 && mousePosition.y !== 0 && (
        <path
          key={pendingCon.connectID}
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

      {pendingAtrCon && mousePosition.x !== 0 && mousePosition.y !== 0 && (
        <path
          key={pendingAtrCon.attributeEdgeID}
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
                    d={getPathData(pos1, pos2)}
                    stroke='black'
                    strokeWidth={3.5}
                    // strokeDasharray={'10,10'}
                    fill='none'
                    onClick={() => {
                      const nodeAAtr = attributes.filter(
                        (attr) => attr.nodeID === srcNode.id,
                      );
                      const nodeBAtr = attributes.filter(
                        (attr) => attr.nodeID === trgtNode.id,
                      );
                      const nodeAAtrIDs = new Set(nodeAAtr.map((a) => a.id));
                      const nodeBAtrIDs = new Set(nodeBAtr.map((a) => a.id));

                      // attribute edges between nodes
                      const relevantAtrCons = atrConnection.filter(
                        (atrCon) =>
                          (nodeAAtrIDs.has(atrCon.srcAtrID) &&
                            nodeBAtrIDs.has(atrCon.trgtAtrID)) ||
                          (nodeAAtrIDs.has(atrCon.trgtAtrID) &&
                            nodeBAtrIDs.has(atrCon.srcAtrID)),
                      );

                      // delete the node edge and all complete attribute connections
                      conHook.deleteCon(conID);
                      relevantAtrCons.forEach((atrCon) => {
                        atrConHook.deleteAtrCon(atrCon.id);
                      });
                    }}
                    className='hover:cursor-pointer'
                    strokeOpacity={0.6}
                  />
                  {/* circle in the middle of edge */}
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
                          onEdgeClick([srcNode.id, trgtNode.id]);
                          conHook.deleteCon(conID);
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
                  d={getShortestPath(midpoint, position)}
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
        const attrs = getAttributes(atrConID);
        if (attrs && !conHook.loading) {
          const { srcAtrID, trgtAtrID } = attrs;
          const pos1 = getAttributePosition(srcAtrID);
          const pos2 = getAttributePosition(trgtAtrID);

          if (pos1 && pos2) {
            return (
              <path
                key={atrConID}
                d={getPathData(pos1, pos2)}
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
    </>
  );
}
