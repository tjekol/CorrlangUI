import { IActionConnection } from '../interface/IConnections';
import { IPendingNodeCon } from '../interface/IStates';

export const handleActionConCreate = (
  cons: IActionConnection[],
  createActionCon: (ids: number[]) => void,
  pendingNodeCon: IPendingNodeCon | null,
  setPendingNodeCon: (pendingCon: IPendingNodeCon | null) => void
) => {
  return (id: number, circlePosition?: { x: number, y: number }) => {
    console.log('Action selected:', {
      actionID: id,
      position: circlePosition
    });

    if (!pendingNodeCon && circlePosition) {
      const newConID = Math.max(0, ...cons.map((e) => e.id)) + 1;
      setPendingNodeCon({
        conID: newConID,
        nodeID: id,
        positionX: circlePosition.x,
        positionY: circlePosition.y
      });
      return false
    } else {
      // check if node is already in connection
      if (pendingNodeCon && id !== pendingNodeCon.nodeID) {
        const allIDs = [id, pendingNodeCon.nodeID]
        createActionCon(allIDs);
        setPendingNodeCon(null);
        return true
      } else {
        console.log('Same action clicked or action alredy exists in connection.');
        setPendingNodeCon(null);
        return false
      }
    }
  };
};

export const handleActionConUpdate = (
  updateNodeCon: (conID: number, id: number) => void,
  pendingNodeCon: IPendingNodeCon | null,
  setPendingNodeCon: (pendingEdge: IPendingNodeCon | null) => void
) => {
  return (conID: number, id: number) => {
    if (!pendingNodeCon) {
      alert(`Click on an action first to add to connection.`)
      return false
    } else {
      updateNodeCon(conID, id);
      setPendingNodeCon(null);
      return true
    }
  }
};
