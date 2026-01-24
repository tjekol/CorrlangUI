import { IPendingCon } from '../interface/IStates';

export const handleMultiConUpd = (
  updateMultiCon: (id: number, nodeID: number) => void,
  pendingEdge: IPendingCon | null,
  setPendingEdge: (pendingEdge: IPendingCon | null) => void
) => {
  return (id: number, nodeID: number) => {
    if (!pendingEdge) {
      alert(`Click on node first to create a multiEdge`)
    } else {
      console.log(`Updating multi connection ${id} with node: ${nodeID}`)
      try {
        updateMultiCon(id, nodeID);
        setPendingEdge(null);
      }
      catch (err) {
        console.error(err)
        console.log('Error, canceling multi edge update.');
        setPendingEdge(null);
      }
    }
  }
};
