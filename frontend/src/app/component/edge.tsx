import { useAtom } from 'jotai';
import { edgeAtom } from '../GlobalValues';

export default function Edge() {
  const [edges, setEdges] = useAtom(edgeAtom);
  const uniqueEdgeIDs = [...new Set(edges.map((edge) => edge.edgeID))];
  const edgePosition = (index: number) =>
    edges.filter((edge) => edge.edgeID === index).slice(0, 2);

  const removeEdge = (id: number) => {
    setEdges((prevEdges) => {
      const filteredEdges = prevEdges.filter((edge) => edge.edgeID !== id);
      if (filteredEdges.length === prevEdges.length) {
        console.error(`Edge with ID ${id} not found.`);
      }
      console.log(`Removed edge: ${id}`);
      return filteredEdges;
    });
  };

  return (
    <>
      {uniqueEdgeIDs.map((edgeID) => {
        const positions = edgePosition(edgeID);

        // draw edge if exactly 2 positions have different nodeIDs
        if (
          positions.length === 2 &&
          positions[0].nodeID !== positions[1].nodeID
        ) {
          const pos1 = positions[0].position;
          const pos2 = positions[1].position;

          return (
            <line
              key={edgeID}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke='black'
              strokeWidth={3}
              onClick={() => removeEdge(edgeID)}
              className='hover:cursor-pointer'
            />
          );
        }
        return null;
      })}
    </>
  );
}
