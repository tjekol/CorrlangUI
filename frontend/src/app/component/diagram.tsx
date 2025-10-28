import Node from './node';
import Edge from './edge';
import { useNodes } from '../hooks/useNodes';
import { useEdges } from '../hooks/useEdges';
import { useAttributeEdges } from '../hooks/useAttributeEdges';
import { useState } from 'react';
import { handleEdge } from '../handler/handleEdge';
import { handleAttributeEdge } from '../handler/handleAttribute';

export default function Diagram() {
  const { nodes, loading } = useNodes();
  const { edges, createEdge } = useEdges();
  const { attributeEdges, createAttributeEdge } = useAttributeEdges();

  // local state to store the first click data
  const [pendingEdge, setPendingEdge] = useState<{
    edgeID: number;
    nodeID: number;
    positionX: number;
    positionY: number;
  } | null>(null);

  // local state for attribute edge
  const [pendingAtrEdge, setPendingAtrEdge] = useState<{
    attributeEdgeID: number;
    attributeID: number;
    positionX: number;
    positionY: number;
  } | null>(null);

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
              posX={50 + i * 180}
              posY={50 + i * 30}
              onHeaderClick={handleHeaderClick}
              onAttributeClick={handleAttributeClick}
            />
          ))
        )}
      </svg>
    </div>
  );
}
