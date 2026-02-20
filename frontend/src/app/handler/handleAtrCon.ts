import { useAtomValue } from 'jotai';
import { IAtrConnection } from '../interface/IConnections';
import { IPendingAtrCon } from '../interface/IStates';
import { atrConAtom, nodeConAtom } from '../GlobalValues';
import { useCalculation } from '../hooks/useCalculation';

export const handleAtrConCreate = (
  atrCons: IAtrConnection[],
  createAtrCon: (atrIDs: number[]) => void,
  pendingAtrCon: IPendingAtrCon | null,
  setPendingAtrCon: (pendingAtrCon: IPendingAtrCon | null) => void
) => {
  const nodeCons = useAtomValue(nodeConAtom)
  const { getNode } = useCalculation();

  return (atrID: number, circlePosition?: { x: number; y: number }) => {
    console.log('Attribute clicked:', {
      attributeID: atrID,
      position: circlePosition,
    });

    if (!pendingAtrCon && circlePosition) {
      const newAtrConID = Math.max(0, ...atrCons.map((e) => e.id)) + 1;
      setPendingAtrCon({
        atrConID: newAtrConID,
        attributeID: atrID,
        positionX: circlePosition.x,
        positionY: circlePosition.y,
      });
      return false
    } else {
      // check if atr is already in connection
      if (pendingAtrCon && atrID !== pendingAtrCon.attributeID) {

        // check if attribute nodes are connected
        const allAtrIDs = [atrID, pendingAtrCon.attributeID]
        const nodeIDs = allAtrIDs.map(atrID => getNode(atrID)?.id).filter(id => id !== undefined)
        const isNodeConnected = nodeCons.some(nodeCon => nodeIDs.every(nodeID => nodeCon.nodes.some(node => node.id === nodeID)))

        if (isNodeConnected) {
          createAtrCon(allAtrIDs);
          setPendingAtrCon(null);
          return true
        } else {
          alert("Attribute nodes needs to be connected.")
          setPendingAtrCon(null);
          return false
        }
      } else {
        console.log('Same attribute clicked or attribute alredy exists in connection.');
        setPendingAtrCon(null);
        return false
      }
    }
  }
};

export const handleAtrConUpdate = (
  updateAtrMultiCon: (atrConID: number, atrID: number) => void,
  pendingAtrCon: IPendingAtrCon | null,
  setPendingAtrCon: (pendingAtrCon: IPendingAtrCon | null) => void
) => {
  const nodeCons = useAtomValue(nodeConAtom)
  const atrCons = useAtomValue(atrConAtom)
  const { getNode } = useCalculation();

  return (atrConID: number, atrID: number) => {
    if (!pendingAtrCon) {
      alert(`Click on attribute first to add to attribute connection.`)
    } else {

      // check if attribute nodes are connected
      const atrNodeID = getNode(atrID)?.id
      const filteredNodeCons = nodeCons.filter(con => con.nodes.find(node => node.id === atrNodeID))
      const filteredAtrCons = atrCons.filter(atrCon => atrCon.id === atrConID)
      const filteredNodeIDs = filteredNodeCons.map(con => con.nodes.map(n => n.id))
      const filteredAtrNodeIDs = filteredAtrCons.map(con => con.attributes.map(a => a.nodeID))
      const isNodeConnected = filteredNodeIDs.some(nodeIDs => filteredAtrNodeIDs.some(atrNodeIDs => atrNodeIDs.every(atrNodeID => nodeIDs.includes(atrNodeID))));

      if (isNodeConnected) {
        updateAtrMultiCon(atrConID, atrID);
        setPendingAtrCon(null);
        return true
      } else {
        alert("Attribute nodes needs to be connected.")
        setPendingAtrCon(null);
        return false
      }
    }
  }
};
