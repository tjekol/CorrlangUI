import { IEdge } from '../interface/IEdge';
import { IPendingEdge } from '../interface/IStates';

export const handleEdge = (
  edges: IEdge[],
  createEdge: (edgeID: number, nodeID: number) => void,
  pendingEdge: IPendingEdge | null,
  setPendingEdge: (pendingEdge: IPendingEdge | null) => void
) => {
  return (id: number, circlePosition: { x: number; y: number }, id2?: number, circlePosition2?: { x: number; y: number }) => {
    if (!pendingEdge) {
      const newEdgeID = Math.max(0, ...edges.map((e) => e.edgeID)) + 1;

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
      if (pendingEdge.nodeID !== id) {

        if (id2) {
          console.log(`Creating edge connection between nodes: ${pendingEdge.nodeID}-${id}, ${pendingEdge.nodeID}-${id2}`
          );
          
          createEdge(
            pendingEdge.edgeID,
            pendingEdge.nodeID
          );
          createEdge(pendingEdge.edgeID, id);

          const edgeID = pendingEdge.edgeID === 0 ? 1 : pendingEdge.edgeID + 1
          createEdge(
            edgeID,
            pendingEdge.nodeID
          );
          createEdge(edgeID, id2);
          setPendingEdge(null);
        } else {
          // create both edges with the same edgeID (completing the connection)
          console.log(`Creating edge connection between nodes: ${pendingEdge.nodeID}-${id}`)

          // Create first edge (from pending data)
          createEdge(
            pendingEdge.edgeID,
            pendingEdge.nodeID
          );

          // create second edge (from current click)
          createEdge(pendingEdge.edgeID, id);
          setPendingEdge(null);
        }
      } else {
        console.log('Same node clicked, canceling edge creation');
        setPendingEdge(null);
      }
    }
  };
};
