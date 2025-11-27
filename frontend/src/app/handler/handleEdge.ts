import { IEdge } from '../interface/IEdge';
import { IPendingEdge } from '../interface/IStates';

export const handleEdge = (
  edges: IEdge[],
  createEdge: (srcNodeID: number, trgtNodeID: number) => void,
  pendingEdge: IPendingEdge | null,
  setPendingEdge: (pendingEdge: IPendingEdge | null) => void
) => {
  return (id: number, circlePosition: { x: number; y: number }) => {
    if (!pendingEdge) {
      const newEdgeID = Math.max(0, ...edges.map((e) => e.id)) + 1;

      setPendingEdge({
        edgeID: newEdgeID,
        nodeID: id,
        positionX: circlePosition.x,
        positionY: circlePosition.y
      });

      console.log('First node selected:', {
        nodeID: id,
        position: circlePosition
      });
    } else {
      // TODO: restrict one edge between two nodes
      if (pendingEdge.nodeID !== id) {
        console.log(`Creating edge connection between nodes: ${pendingEdge.nodeID}-${id}`)
        createEdge(
          pendingEdge.nodeID,
          id
        );
        setPendingEdge(null);
      } else {
        console.log('Same node clicked, canceling edge creation');
        setPendingEdge(null);
      }
    }
  };
};
