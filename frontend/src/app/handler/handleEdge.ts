import { useSetAtom } from 'jotai';
import { IEdge } from '../interface/IEdge';
import { IPendingEdge } from '../interface/IStates';

export const handleEdge = (
  edges: IEdge[],
  createEdge: (edgeID: number, nodeID: number) => void,
  pendingEdge: IPendingEdge | null,
  setPendingEdge: (pendingEdge: IPendingEdge | null) => void
) => {
  return (id: number, circlePosition: { x: number; y: number }) => {
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
        // create both edges with the same edgeID (completing the connection)
        console.log(
          'Creating edge connection between nodes:',
          pendingEdge.nodeID,
          'and',
          id
        );

        // Create first edge (from pending data)
        createEdge(
          pendingEdge.edgeID,
          pendingEdge.nodeID
        );

        // create second edge (from current click)
        createEdge(pendingEdge.edgeID, id);
        setPendingEdge(null);
      } else {
        console.log('Same node clicked, canceling edge creation');
        setPendingEdge(null);
      }
    }
  };
};
