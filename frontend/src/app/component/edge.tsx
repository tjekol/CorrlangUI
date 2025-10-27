import { useAtomValue } from 'jotai';
import { useEdges } from '../hooks/useEdges';
import { attributeEdgeAtom, edgeAtom } from '../GlobalValues';
import { useAttributeEdges } from '../hooks/useAttributeEdges';

export default function Edge() {
  const edgeHook = useEdges();
  const attributeEdgeHook = useAttributeEdges();
  const edges = useAtomValue(edgeAtom);
  const atrributeEdges = useAtomValue(attributeEdgeAtom);

  // edges
  const uniqueEdgeIDs = [...new Set(edges.map((edge) => edge.edgeID))];
  const edgePosition = (index: number) =>
    edges.filter((edge) => edge.edgeID === index).slice(0, 2);

  // attribute edges
  const uniqueAttributeEdgeIDs = [
    ...new Set(atrributeEdges.map((edge) => edge.attributeEdgeID)),
  ];
  const attributeEdgePosition = (index: number) =>
    atrributeEdges.filter((edge) => edge.attributeEdgeID === index).slice(0, 2);

  return (
    <>
      {/* edges */}
      {uniqueEdgeIDs.map((edgeID) => {
        const positions = edgePosition(edgeID);

        // draw edge if exactly 2 positions have different nodeIDs
        if (
          positions.length === 2 &&
          positions[0].nodeID !== positions[1].nodeID &&
          !edgeHook.loading
        ) {
          const pos1 = { x: positions[0].positionX, y: positions[0].positionY };
          const pos2 = { x: positions[1].positionX, y: positions[1].positionY };

          return (
            <line
              key={edgeID}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke='black'
              strokeWidth={3}
              onClick={() => edgeHook.deleteEdges(edgeID)}
              className='hover:cursor-pointer'
            />
          );
        }
        return null;
      })}
      {/* attribute edges */}
      {uniqueAttributeEdgeIDs.map((edgeID) => {
        const positions = attributeEdgePosition(edgeID);

        // draw edge if exactly 2 positions have different nodeIDs
        if (
          positions.length === 2 &&
          positions[0].attributeID !== positions[1].attributeID &&
          !attributeEdgeHook.loading
        ) {
          const pos1 = { x: positions[0].positionX, y: positions[0].positionY };
          const pos2 = { x: positions[1].positionX, y: positions[1].positionY };

          return (
            <line
              key={edgeID}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke='blue'
              strokeWidth={3}
              onClick={() => attributeEdgeHook.deleteAttributeEdges(edgeID)}
              className='hover:cursor-pointer'
            />
          );
        }
        return null;
      })}
    </>
  );
}
