import { IPendingCon } from '../interface/IStates';

export const handleMultiCon = (
  createMultiCon: (nodeIDs: number[]) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingCon: IPendingCon | null) => void
) => {
  return (nodeIDs: number[]) => {
    if (!pendingCon) {
      alert(`Click on node first to create a multiCon`)
    } else {
      // if nodeIDs does NOT include clicked nodeID
      if (!nodeIDs.includes(pendingCon.nodeID)) {
        const multiConNodes = [...nodeIDs, pendingCon.nodeID]
        console.log(`Creating a connection between nodes: ${multiConNodes}`)
        createMultiCon(multiConNodes);

        setPendingCon(null);
      } else {
        console.log('Same node clicked or node alredy exists in multi connection, canceling multi connection creation');
        setPendingCon(null);
      }
    }
  };
};
