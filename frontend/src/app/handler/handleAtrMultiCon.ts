import { useAtomValue } from 'jotai';
import { IPendingAtrCon } from '../interface/IStates';
import { useCalculation } from '../hooks/useCalculation';
import { multiConAtom } from '../GlobalValues';

export const handleAtrMultiConCreate = (
  createAtrMultiCon: (atrIDs: number[]) => void,
  pendingAtrCon: IPendingAtrCon | null,
  setPendingAtrCon: (pendingAtrCon: IPendingAtrCon | null) => void
) => {
  const multiCon = useAtomValue(multiConAtom)
  const { getNode } = useCalculation();

  return (atrIDs: number[]) => {
    if (!pendingAtrCon) {
      alert(`Click on attribute first to create a multiCon`)
      return false
    } else {
      const allAtrIDs = [...atrIDs, pendingAtrCon.attributeID]
      const nodeIDs = allAtrIDs.map(atrID => getNode(atrID)?.id).filter(id => id !== undefined)
      console.log(nodeIDs)
      let isMultiConnected = multiCon.some(con => nodeIDs.every(nodeID => con.nodes.some(node => node.id === nodeID)))

      // if atrIDs does NOT include clicked atrID
      if (!atrIDs.includes(pendingAtrCon.attributeID) && isMultiConnected) {
        const multiConAtrs = [...atrIDs, pendingAtrCon.attributeID]
        console.log(`Creating a connection between attributes: ${multiConAtrs}`)
        createAtrMultiCon(multiConAtrs);

        setPendingAtrCon(null);
        return true
      } else if (!isMultiConnected) {
        alert("Attribute node needs to be connected in multi connection.")
        setPendingAtrCon(null);
        return false
      }
      else {
        console.log('Same attribute clicked or attribute alredy exists in multi connection, canceling multi connection creation');
        setPendingAtrCon(null);
        return false
      }
    }
  };
};

export const handleAtrMultiConUpdate = (
  updateAtrMultiCon: (id: number, atrID: number) => void,
  pendingAtrCon: IPendingAtrCon | null,
  setPendingAtrCon: (pendingAtrCon: IPendingAtrCon | null) => void
) => {
  return (id: number, atrID: number) => {
    if (!pendingAtrCon) {
      alert(`Click on attribute first to add to attribute multi connection.`)
    } else {
      console.log(`Updating attribute multi connection ${id} with node: ${atrID}`)
      try {
        updateAtrMultiCon(id, atrID);
        setPendingAtrCon(null);
        return true
      }
      catch (err) {
        console.error(err)
        console.log('Error, canceling attribute multi connection update.');
        setPendingAtrCon(null);
        return false
      }
    }
  }
};
