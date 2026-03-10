import { IActionConnection } from '../interface/IConnections';
import { IPendingCon } from '../interface/IStates';

export const handleActionConCreate = (
  cons: IActionConnection[],
  createActionCon: (ids: number[]) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingCon: IPendingCon | null) => void
) => {
  return (id: number, circlePosition?: { x: number, y: number }) => {
    console.log('Action selected:', {
      actionID: id,
      position: circlePosition
    });

    if (!pendingCon && circlePosition) {
      const newConID = Math.max(0, ...cons.map((e) => e.id)) + 1;
      setPendingCon({
        conID: newConID,
        id: id,
        positionX: circlePosition.x,
        positionY: circlePosition.y
      });
      return false
    } else {
      // check if node is already in connection
      if (pendingCon && id !== pendingCon.id) {
        const allIDs = [id, pendingCon.id]
        createActionCon(allIDs);
        setPendingCon(null);
        return true
      } else {
        console.log('Same action clicked or action alredy exists in connection.');
        setPendingCon(null);
        return false
      }
    }
  };
};

export const handleActionConUpdate = (
  updateActionCon: (conID: number, id: number) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingEdge: IPendingCon | null) => void
) => {
  return (conID: number, id: number) => {
    if (!pendingCon) {
      alert(`Click on an action first to add to connection.`)
      return false
    } else {
      updateActionCon(conID, id);
      setPendingCon(null);
      return true
    }
  }
};
