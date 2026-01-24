import { IPendingCon } from '../interface/IStates';

export const handleMultiConUpd = (
  updateMultiCon: (id: number, nodeID: number) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingEdge: IPendingCon | null) => void
) => {
  return (id: number, nodeID: number) => {
    if (!pendingCon) {
      alert(`Click on node first to add to multi connection.`)
    } else {
      console.log(`Updating multi connection ${id} with node: ${nodeID}`)
      try {
        updateMultiCon(id, nodeID);
        setPendingCon(null);
      }
      catch (err) {
        console.error(err)
        console.log('Error, canceling multi connection update.');
        setPendingCon(null);
      }
    }
  }
};
