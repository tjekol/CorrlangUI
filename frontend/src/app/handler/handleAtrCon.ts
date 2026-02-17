import { useAtomValue } from 'jotai';
import { IAtrConnection } from '../interface/IConnections';
import { IPendingAtrCon } from '../interface/IStates';
import { multiConAtom, nodeConAtom } from '../GlobalValues';
import { useCalculation } from '../hooks/useCalculation';

export const handleAtrCon = (
  cons: IAtrConnection[],
  createAtrCon: (srcAtrID: number, trgtAtrID: number) => void,
  pendingAtrCon: IPendingAtrCon | null,
  setPendingAtrCon: (pendingEdge: IPendingAtrCon | null) => void
) => {
  const nodeCons = useAtomValue(nodeConAtom);
  const multiCons = useAtomValue(multiConAtom);
  const { getNode } = useCalculation();

  return (id: number, circlePosition: { x: number; y: number }) => {
    if (!pendingAtrCon) {
      const newAtrConID = Math.max(0, ...cons.map((e) => e.id)) + 1;

      setPendingAtrCon({
        atrConID: newAtrConID,
        attributeID: id,
        positionX: circlePosition.x,
        positionY: circlePosition.y,
      });

      console.log('First attribute selected:', {
        attributeID: id,
        position: circlePosition,
      });
      return false
    } else {
      // checks if attribute nodes are connected before connecting attributes
      const nodeID = getNode(id)?.id
      const pendingNodeID = getNode(pendingAtrCon.attributeID)?.id

      let isNodesConnected = nodeID && pendingNodeID && nodeCons.some(con => (
        con.srcNodeID === nodeID && con.trgtNodeID === pendingNodeID) ||
        (con.trgtNodeID === nodeID && con.srcNodeID === pendingNodeID)
      );

      let isMultiConnected = nodeID && pendingNodeID && multiCons.some(con => (
        con.nodes.map(n => n.id).includes(nodeID) &&
        con.nodes.map(n => n.id).includes(pendingNodeID)
      ))

      if (pendingAtrCon.attributeID !== id && (isNodesConnected || isMultiConnected)) {
        console.log(
          'Creating connection between attributes:',
          pendingAtrCon.attributeID,
          'and',
          id
        );

        createAtrCon(
          pendingAtrCon.attributeID,
          id
        );
        setPendingAtrCon(null);
        return true
      } else if (pendingAtrCon.attributeID !== id && !isNodesConnected) {
        alert("The nodes of the clicked attributes need to be connected first.")
        setPendingAtrCon(null);
        return false
      } else {
        console.log('Same node clicked, canceling attribute connection creation');
        setPendingAtrCon(null);
        return false
      }
    }
  };
};
