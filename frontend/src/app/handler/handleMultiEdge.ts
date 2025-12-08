import { IPendingCon } from '../interface/IStates';

export const handleMultiEdge = (
  createMultiEdge: (nodeIDs: number[]) => void,
  pendingEdge: IPendingCon | null,
  setPendingEdge: (pendingEdge: IPendingCon | null) => void
) => {
  return (nodeIDs: number[]) => {
    if (!pendingEdge) {
      alert(`Click on node first to create a multiEdge`)
    } else {
      // if nodeIDs does NOT include clicked nodeID
      if (!nodeIDs.includes(pendingEdge.nodeID)) {
        const multiEdgeNodes = [...nodeIDs, pendingEdge.nodeID]
        console.log(`Creating edge connection between nodes: ${multiEdgeNodes}`)
        createMultiEdge(multiEdgeNodes);

        setPendingEdge(null);
      } else {
        console.log('Same node clicked or node alredy exists in multiEdge, canceling multi edge creation');
        setPendingEdge(null);
      }
    }
  };
};
