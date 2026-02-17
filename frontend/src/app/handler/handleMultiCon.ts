import { IPendingCon } from '../interface/IStates';

export const handleMultiConCreate = (
  createMultiCon: (nodeIDs: number[]) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingCon: IPendingCon | null) => void
) => {
  return (nodeIDs: number[]) => {
    if (!pendingCon) {
      alert(`Click on node first to create a multiCon`)
      return false
    } else {
      // if nodeIDs does NOT include clicked nodeID
      if (!nodeIDs.includes(pendingCon.nodeID)) {
        const multiConNodes = [...nodeIDs, pendingCon.nodeID]
        console.log(`Creating a connection between nodes: ${multiConNodes}`)
        createMultiCon(multiConNodes);
        setPendingCon(null);
        return true
      } else {
        console.log('Same node clicked or node alredy exists in multi connection, canceling multi connection creation');
        setPendingCon(null);
        return false
      }
    }
  };
};

export const handleMultiConUpdate = (
  updateMultiCon: (id: number, nodeID: number) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingEdge: IPendingCon | null) => void
) => {
  return (id: number, nodeID: number) => {
    if (!pendingCon) {
      alert(`Click on node first to add to multi connection.`)
      return false
    } else {
      console.log(`Updating multi connection ${id} with node: ${nodeID}`)
      try {
        updateMultiCon(id, nodeID);
        setPendingCon(null);
        return true
      }
      catch (err) {
        console.error(err)
        console.log('Error, canceling multi connection update.');
        setPendingCon(null);
        return true
      }
    }
  }
};
