import { INodeConnection } from '../interface/IConnections';
import { IPosition } from '../interface/IPosition';
import { IPendingCon } from '../interface/IStates';

export const HandleNodeConCreate = (
  cons: INodeConnection[],
  createNodeCon: (ids: number[]) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingCon: IPendingCon | null) => void
) => {
  return (id: number, circlePosition?: IPosition) => {
    console.log('Node selected:', {
      nodeID: id,
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
        const allNodeIDs = [id, pendingCon.id]
        createNodeCon(allNodeIDs);
        setPendingCon(null);
        return true
      } else {
        console.log('Same node clicked or node alredy exists in connection.');
        setPendingCon(null);
        return false
      }
    }
  };
};

export const HandleNodeConUpdate = (
  updateNodeCon: (conID: number, id: number) => void,
  pendingNodeCon: IPendingCon | null,
  setPendingNodeCon: (pendingEdge: IPendingCon | null) => void
) => {
  return (conID: number, id: number) => {
    if (!pendingNodeCon) {
      alert(`Click on a node first to add to connection.`)
      return false
    } else {
      updateNodeCon(conID, id);
      setPendingNodeCon(null);
      return true
    }
  }
};
