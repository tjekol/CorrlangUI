'use client';
import Node from './node';
import Edge from './edge';
import { useNodes } from '../hooks/useNodes';
import { useEdges } from '../hooks/useEdges';
import { useAttributeEdges } from '../hooks/useAttributeEdges';
import { useEffect, useState } from 'react';
import { handleEdge } from '../handler/handleEdge';
import { handleAttributeEdge } from '../handler/handleAttribute';
import { IPendingAtrEdge, IPendingEdge } from '../interface/IStates';
import { useSetAtom } from 'jotai';
import { liveNodePositionsAtom } from '../GlobalValues';

export default function Diagram() {
  const { nodes, loading } = useNodes();
  const { edges, createEdge } = useEdges();
  const { attributeEdges, createAttributeEdge } = useAttributeEdges();

  // local state to store first click of node/attribute
  const [pendingEdge, setPendingEdge] = useState<IPendingEdge | null>(null);
  const [pendingAtrEdge, setPendingAtrEdge] = useState<IPendingAtrEdge | null>(
    null
  );
  const setLivePositions = useSetAtom(liveNodePositionsAtom);

  useEffect(() => {
    if (nodes.length > 0) {
      setLivePositions(
        nodes.map((node) => ({
          nodeID: node.id,
          x: node.positionX || 0,
          y: node.positionY || 0,
        }))
      );
    }
  }, [nodes, setLivePositions]);

  const handleHeaderClick = handleEdge(
    edges,
    createEdge,
    pendingEdge,
    setPendingEdge
  );

  const handleAttributeClick = handleAttributeEdge(
    attributeEdges,
    createAttributeEdge,
    pendingAtrEdge,
    setPendingAtrEdge
  );

  return (
    <div className='border-1 rounded-sm h-100 w-full bg-[#F9F9F9] overflow-hidden'>
      <svg width='100%' height='100%'>
        <Edge pendingEdge={pendingEdge} pendingAtrEdge={pendingAtrEdge} />
        {loading ? (
          <text x={50} y={50}>
            Loading…
          </text>
        ) : (
          nodes.map((n, i) => (
            <Node
              key={i}
              id={n.id}
              title={n.title}
              attributes={n.attributes}
              positionX={n.positionX}
              positionY={n.positionY}
              onHeaderClick={handleHeaderClick}
              onAttributeClick={handleAttributeClick}
            />
          ))
        )}
      </svg>
    </div>
  );
}
