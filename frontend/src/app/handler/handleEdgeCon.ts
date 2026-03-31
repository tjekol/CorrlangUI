import { IEdgeConnection } from '../interface/IConnections';
import { IPendingCon } from '../interface/IStates';

export const HandleEdgeConCreate = (
  cons: IEdgeConnection[],
  createEdgeCon: (ids: number[]) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingCon: IPendingCon | null) => void
) => {
  return (id: number, circlePosition?: { x: number; y: number }) => {
    console.log('Edge clicked:', {
      edgeID: id,
      position: circlePosition
    });

    if (!pendingCon && circlePosition) {
      const newEdgeConID = Math.max(0, ...cons.map((e) => e.id)) + 1;
      setPendingCon({
        conID: newEdgeConID,
        id: id,
        positionX: circlePosition.x,
        positionY: circlePosition.y
      });
      return false
    } else {
      if (pendingCon && id !== pendingCon.id) {
        const allEdgeIDs = [id, pendingCon.id]
        console.log(`Creating connection between edges: ${allEdgeIDs}`)
        createEdgeCon(allEdgeIDs);
        setPendingCon(null);
        return true
      } else {
        console.log('Same edge clicked, canceling connection creation');
        setPendingCon(null);
        return false
      }
    }
  };
};

export const HandleEdgeConUpdate = (
  updateEdgeCon: (conID: number, id: number) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingCon: IPendingCon | null) => void
) => {
  return (conID: number, id: number) => {
    if (!pendingCon) {
      alert(`Click on an edge first to add to connection.`)
      return false
    } else {
      updateEdgeCon(conID, id);
      setPendingCon(null);
      return true
    }
  };
};
