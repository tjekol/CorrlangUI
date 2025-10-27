import Node from './node';
import Edge from './edge';
import { useNodes } from '../hooks/useNodes';
import { useEdges } from '../hooks/useEdges';
import { useAttributeEdges } from '../hooks/useAttributeEdges';

export default function Diagram() {
  const { nodes, loading } = useNodes();
  const { edges, createEdge } = useEdges();
  const { attributeEdges, createAttributeEdge } = useAttributeEdges();

  const handleHeaderClick = (
    id: number,
    circlePosition: { x: number; y: number }
  ) => {
    const incompleteEdge = edges.find(
      (edge) =>
        edges.filter((e) => e.edgeID === edge.edgeID).length === 1 &&
        edge.nodeID !== id
    );

    const edgeID =
      incompleteEdge?.edgeID || Math.max(0, ...edges.map((e) => e.edgeID)) + 1;
    createEdge(edgeID, id, circlePosition.x, circlePosition.y);
  };

  const handleAttributeClick = (
    id: number,
    circlePosition: { x: number; y: number }
  ) => {
    const incompleteEdge = attributeEdges.find(
      (edge) =>
        attributeEdges.filter((e) => e.attributeEdgeID === edge.attributeEdgeID)
          .length === 1 && edge.attributeID !== id
    );

    const attributeEdgeID =
      incompleteEdge?.attributeEdgeID ||
      Math.max(0, ...attributeEdges.map((e) => e.attributeEdgeID)) + 1;
    createAttributeEdge(
      attributeEdgeID,
      id,
      circlePosition.x,
      circlePosition.y
    );
  };

  return (
    <div className='border-1 rounded-sm h-100 w-full bg-[#F9F9F9] overflow-hidden'>
      <svg width='100%' height='100%'>
        <Edge />
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
