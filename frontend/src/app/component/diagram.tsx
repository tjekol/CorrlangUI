import { useSetAtom } from 'jotai';
import { edgeAtom } from '../GlobalValues';
import Node from './node';
import Edge from './edge';
import { useNodes } from '../hooks/useNodes';

export default function Diagram() {
  const { nodes, loading } = useNodes();
  const setEdgePosition = useSetAtom(edgeAtom);

  const handleCircleClick = (
    id: number,
    circlePosition: { x: number; y: number }
  ) => {
    setEdgePosition((prevEdges) => {
      // Find incomplete edge (only 1 position) from different node
      const incompleteEdge = prevEdges.find(
        (edge) =>
          prevEdges.filter((e) => e.edgeID === edge.edgeID).length === 1 &&
          edge.nodeID !== id
      );

      const edgeID =
        incompleteEdge?.edgeID ||
        Math.max(0, ...prevEdges.map((e) => e.edgeID)) + 1;

      console.log(`Created edge: ${edgeID} from node ${id}`);
      return [...prevEdges, { edgeID, nodeID: id, position: circlePosition }];
    });
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
              nodeLabels={n.nodeLabels}
              posX={50 + i * 180}
              posY={50 + i * 30}
              onCircleClick={handleCircleClick}
            />
          ))
        )}
      </svg>
    </div>
  );
}
