'use client';

import { useAtomValue } from 'jotai';
import { IPendingCon } from '../interface/IStates';
import { midEdgeConAtom, midEdgeAtom } from '../GlobalValues';
import React, { useEffect, useState } from 'react';
import { useCalculation } from '../hooks/useCalculation';
import { useEdgeCon } from '../hooks/connection/useEdgeCon';
import NodeConnection from './node-connection';
import ChildConnecton from './child-connection';
import {
  IActionConnection,
  IAtrConnection,
  IEdgeConnection,
  IMethodConnection,
  INodeConnection,
} from '../interface/IConnections';

export default function Connection({
  conType,
  cons,
  pendingCon,
  onConClick,
  deleteCon,
  midCon,
  childCons,
  pendingChildCon,
  onChildConClick,
  deleteChildCon,
  midChildCon,
  edgeCons,
  pendingEdgeCon,
  onEdgeConClick,
  svgRef,
}: {
  conType: number;
  cons: INodeConnection[] | IActionConnection[];
  onConClick: (nodeConID: number, nodeID: number) => boolean | void;
  deleteCon: (id: number) => void;
  pendingCon: IPendingCon | null;
  midCon: Record<number, { x: number; y: number }>;
  childCons: IAtrConnection[] | IMethodConnection[];
  onChildConClick: (conID: number, id: number) => boolean | void;
  deleteChildCon: (id: number) => void;
  pendingChildCon: IPendingCon | null;
  midChildCon: Record<number, { x: number; y: number }>;
  edgeCons?: IEdgeConnection[];
  onEdgeConClick?: (conID: number, id: number) => boolean | void;
  pendingEdgeCon?: IPendingCon | null;
  svgRef?: React.RefObject<SVGSVGElement | null>;
}) {
  const edgeConHook = useEdgeCon();
  const midEdgeCon = useAtomValue(midEdgeConAtom);
  const midEdge = useAtomValue(midEdgeAtom);

  const {
    getPathData,
    getTempPathData,
    getMidpoint,
    getShortestPath,
    calculateMidpoint,
  } = useCalculation();

  const strokeOpacity = 0.8;
  const edgeConColor = '#9A8C98';

  const getEdgeIDs = (edgeConID: number): number[] | undefined => {
    if (edgeCons) {
      const edgeCon = edgeCons.find((con) => con.id === edgeConID);
      if (edgeCon) return edgeCon.edges.map((e) => e.id);
    }
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const svg = svgRef?.current || document.querySelector('svg');
      if (svg) {
        const rect = svg.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    if (pendingCon || pendingChildCon || pendingEdgeCon) {
      document.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [pendingCon, pendingChildCon, pendingEdgeCon, svgRef]);

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
          strokeOpacity={strokeOpacity}
        />
      )}
      {pendingChildCon && hasMousePosition && (
        <path
          key={pendingChildCon.conID}
          d={getTempPathData(
            { x: pendingChildCon.positionX, y: pendingChildCon.positionY },
            mousePosition,
          )}
          stroke='grey'
          strokeWidth={3}
          strokeDasharray={'5,5'}
          fill='none'
          className='hover:cursor-pointer'
          strokeOpacity={strokeOpacity}
        />
      )}
      {pendingEdgeCon && hasMousePosition && (
        <path
          key={pendingEdgeCon.conID}
          d={getTempPathData(
            { x: pendingEdgeCon.positionX, y: pendingEdgeCon.positionY },
            mousePosition,
          )}
          stroke='grey'
          strokeWidth={3}
          strokeDasharray={'5,5'}
          fill='none'
          className='hover:cursor-pointer'
          strokeOpacity={strokeOpacity}
        />
      )}

      {/* CONNECTIONS */}
      {/* Node connection */}
      <NodeConnection
        cons={cons}
        childCons={childCons}
        deleteCon={deleteCon}
        deleteChildCon={deleteChildCon}
        midCon={midCon}
        pendingNodeCon={pendingCon}
        onConClick={onConClick}
        conType={conType}
      />

      {/* Attribute connection */}
      <ChildConnecton
        childCons={childCons}
        deleteChildCon={deleteChildCon}
        midChildCon={midChildCon}
        pendingChildCon={pendingChildCon}
        onChildConClick={onChildConClick}
        conType={conType}
      />

      {/* Edge connection */}
      {onEdgeConClick &&
        edgeCons &&
        edgeCons.map((edgeCon) => {
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
                    d={getPathData(conType, pos1, pos2)}
                    stroke={edgeConColor}
                    strokeWidth={3}
                    fill='none'
                    onClick={() => {
                      if (confirm(`Delete edge connection.`)) {
                        edgeConHook.deleteEdgeCon(edgeConID);
                      }
                    }}
                    className='hover:cursor-pointer'
                    strokeOpacity={strokeOpacity}
                  />
                  {/* circle in the middle of connection */}
                  {midEdgeCon[edgeConID] && (
                    <circle
                      cx={midEdgeCon[edgeConID].x}
                      cy={midEdgeCon[edgeConID].y}
                      r={5}
                      fill='white'
                      stroke={edgeConColor}
                      className='hover:opacity-100 opacity-70'
                      onClick={() => {
                        if (pendingEdgeCon) {
                          onEdgeConClick(edgeConID, pendingEdgeCon.id);
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
            const edgePositions = edgeIDs.map((edgeID) => midEdge[edgeID]);
            const midpoint = getMidpoint(edgePositions);
            if (midpoint && edgePositions.length > 0) {
              return edgePositions.map((position, index) => (
                <g key={index}>
                  <path
                    key={`${edgeConID}-${index}`}
                    stroke={edgeConColor}
                    strokeWidth={3}
                    strokeOpacity={strokeOpacity}
                    d={getShortestPath(conType, midpoint, position)}
                  ></path>
                  {/* diamond */}
                  <path
                    d={`M ${midpoint.x} ${midpoint.y - 8}
                  L ${midpoint.x + 6} ${midpoint.y}
                  L ${midpoint.x} ${midpoint.y + 8}
                  L ${midpoint.x - 6} ${midpoint.y} Z`}
                    onClick={() => {
                      if (pendingEdgeCon) {
                        onEdgeConClick(edgeConID, pendingEdgeCon.id);
                      } else {
                        if (confirm('Delete edge connection?')) {
                          edgeConHook.deleteEdgeCon(edgeConID);
                        }
                      }
                    }}
                  />
                </g>
              ));
            }
          }
        })}
    </>
  );
}
