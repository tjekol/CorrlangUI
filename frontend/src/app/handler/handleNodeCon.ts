import { INodeConnection } from '../interface/IConnections';
import { IPendingNodeCon } from '../interface/IStates';

export const handleNodeConCreate = (
  nodeCons: INodeConnection[],
  createNodeCon: (nodeIDs: number[]) => void,
  pendingNodeCon: IPendingNodeCon | null,
  setPendingNodeCon: (pendingCon: IPendingNodeCon | null) => void
) => {
  return (nodeID: number, circlePosition?: { x: number, y: number }) => {
    console.log('Node selected:', {
      nodeID: nodeID,
      position: circlePosition
    });

    if (!pendingNodeCon && circlePosition) {
      const newConID = Math.max(0, ...nodeCons.map((e) => e.id)) + 1;
      setPendingNodeCon({
        conID: newConID,
        nodeID: nodeID,
        positionX: circlePosition.x,
        positionY: circlePosition.y
      });
      return false
    } else {
      // check if node is already in connection
      if (pendingNodeCon && nodeID !== pendingNodeCon.nodeID) {
        const allNodeIDs = [nodeID, pendingNodeCon.nodeID]
        createNodeCon(allNodeIDs);
        setPendingNodeCon(null);
        return true
      } else {
        console.log('Same node clicked or node alredy exists in connection.');
        setPendingNodeCon(null);
        return false
      }
    }
  };
};

export const handleNodeConUpdate = (
  updateNodeCon: (conID: number, nodeID: number) => void,
  pendingNodeCon: IPendingNodeCon | null,
  setPendingNodeCon: (pendingEdge: IPendingNodeCon | null) => void
) => {
  return (conID: number, nodeID: number) => {
    if (!pendingNodeCon) {
      alert(`Click on a node first to add to connection.`)
      return false
    } else {
      updateNodeCon(conID, nodeID);
      setPendingNodeCon(null);
      return true
    }
  }
};
