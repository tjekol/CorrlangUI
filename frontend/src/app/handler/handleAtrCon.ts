import { useAtomValue } from 'jotai';
import { IAtrConnection } from '../interface/IConnections';
import { IPendingCon } from '../interface/IStates';
import { atrConAtom, nodeConAtom } from '../GlobalValues';
import { useCalculation } from '../hooks/useCalculation';

export const HandleAtrConCreate = (
  cons: IAtrConnection[],
  createAtrCon: (ids: number[]) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingCon: IPendingCon | null) => void
) => {
  const nodeCons = useAtomValue(nodeConAtom)
  const { getNode } = useCalculation();

  return (id: number, circlePosition?: { x: number; y: number }) => {
    console.log('Attribute clicked:', {
      attributeID: id,
      position: circlePosition,
    });

    if (!pendingCon && circlePosition) {
      const newAtrConID = Math.max(0, ...cons.map((e) => e.id)) + 1;
      setPendingCon({
        conID: newAtrConID,
        id: id,
        positionX: circlePosition.x,
        positionY: circlePosition.y,
      });
      return false
    } else {
      // check if atr is already in connection
      if (pendingCon && id !== pendingCon.id) {
        // check if attribute nodes are connected
        const allAtrIDs = [id, pendingCon.id]
        const nodeIDs = allAtrIDs.map(atrID => getNode(atrID)?.id).filter(id => id !== undefined)
        const isNodeConnected = nodeCons.some(nodeCon => nodeIDs.every(nodeID => nodeCon.nodes.some(node => node.id === nodeID)))

        if (isNodeConnected) {
          createAtrCon(allAtrIDs);
          setPendingCon(null);
          return true
        } else {
          alert("Attribute nodes needs to be connected.")
          setPendingCon(null);
          return false
        }
      } else {
        console.log('Same attribute clicked or attribute alredy exists in connection.');
        setPendingCon(null);
        return false
      }
    }
  }
};

export const HandleAtrConUpdate = (
  updateAtrMultiCon: (conID: number, id: number) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingCon: IPendingCon | null) => void
) => {
  const parentCons = useAtomValue(nodeConAtom)
  const cons = useAtomValue(atrConAtom)
  const { getNode } = useCalculation();

  return (conID: number, id: number) => {
    if (!pendingCon) {
      alert(`Click on attribute first to add to attribute connection.`)
    } else {
      // check if attribute nodes are connected
      const atrNodeID = getNode(id)?.id
      const filteredNodeCons = parentCons.filter(con => con.nodes.find(node => node.id === atrNodeID))
      const filteredAtrCons = cons.filter(atrCon => atrCon.id === conID)
      const filteredNodeIDs = filteredNodeCons.map(con => con.nodes.map(n => n.id))
      const filteredAtrNodeIDs = filteredAtrCons.map(con => con.attributes.map(a => a.nodeID))
      const isNodeConnected = filteredNodeIDs.some(nodeIDs => filteredAtrNodeIDs.some(atrNodeIDs => atrNodeIDs.every(atrNodeID => nodeIDs.includes(atrNodeID))));

      if (isNodeConnected) {
        updateAtrMultiCon(conID, id);
        setPendingCon(null);
        return true
      } else {
        alert("Attribute nodes needs to be connected.")
        setPendingCon(null);
        return false
      }
    }
  }
};
