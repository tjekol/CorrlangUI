import { IEdgeConnection } from '../interface/IConnections';
import { IPendingEdgeCon } from '../interface/IStates';

export const handleEdgeCon = (
  edgeCons: IEdgeConnection[],
  createEdgeCon: (edgeIDs: number[]) => void,
  pendingEdgeCon: IPendingEdgeCon | null,
  setPendingEdgeCon: (pendingEdge: IPendingEdgeCon | null) => void
) => {
  return (edgeID: number, circlePosition?: { x: number; y: number }) => {
    console.log('Edge clicked:', {
      nodeID: edgeID,
      position: circlePosition
    });

    if (!pendingEdgeCon && circlePosition) {
      const newEdgeConID = Math.max(0, ...edgeCons.map((e) => e.id)) + 1;
      setPendingEdgeCon({
        edgeConID: newEdgeConID,
        edgeID: edgeID,
        positionX: circlePosition.x,
        positionY: circlePosition.y
      });
      return false
    } else {
      if (pendingEdgeCon && edgeID !== pendingEdgeCon.edgeID) {
        const allEdgeIDs = [edgeID, pendingEdgeCon.edgeID]
        console.log(`Creating connection between edges: ${allEdgeIDs}`)
        createEdgeCon(allEdgeIDs);
        setPendingEdgeCon(null);
        return true
      } else {
        console.log('Same edge clicked, canceling connection creation');
        setPendingEdgeCon(null);
        return false
      }
    }
  };
};
