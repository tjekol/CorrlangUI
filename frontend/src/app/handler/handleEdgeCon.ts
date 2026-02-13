import { IConnection } from '../interface/Connection/IConnection';
import { IEdgeConnection } from '../interface/Connection/IEdgeConnection';
import { IPendingEdgeCon } from '../interface/IStates';

export const handleEdgeCon = (
  edgeCons: IEdgeConnection[],
  createEdgeCon: (srcEdgeID: number, trgtEdgeID: number) => void,
  pendingEdgeCon: IPendingEdgeCon | null,
  setPendingEdgeCon: (pendingEdge: IPendingEdgeCon | null) => void
) => {
  return (id: number, circlePosition: { x: number; y: number }) => {
    if (!pendingEdgeCon) {
      const newEdgeConID = Math.max(0, ...edgeCons.map((e) => e.id)) + 1;

      setPendingEdgeCon({
        edgeConID: newEdgeConID,
        edgeID: id,
        positionX: circlePosition.x,
        positionY: circlePosition.y
      });

      console.log('First edge selected:', {
        nodeID: id,
        position: circlePosition
      });
    } else {
      if (pendingEdgeCon.edgeID !== id) {
        console.log(`Creating connection between edges: ${pendingEdgeCon.edgeID}-${id}`)
        createEdgeCon(
          pendingEdgeCon.edgeID,
          id
        );
        setPendingEdgeCon(null);
      } else {
        console.log('Same edge clicked, canceling connection creation');
        setPendingEdgeCon(null);
      }
    }
  };
};
