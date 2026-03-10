import { useAtomValue } from 'jotai';
import { IMethodConnection } from '../interface/IConnections';
import { IPendingCon } from '../interface/IStates';
import { actionConAtom, methodConAtom } from '../GlobalValues';
import { useCalculation } from '../hooks/useCalculation';

export const handleMethodConCreate = (
  cons: IMethodConnection[],
  createCon: (ids: number[]) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingCon: IPendingCon | null) => void
) => {
  const parentCons = useAtomValue(actionConAtom)
  const { getAction } = useCalculation();

  return (id: number, circlePosition?: { x: number; y: number }) => {
    console.log('Method clicked:', {
      methodID: id,
      position: circlePosition,
    });

    if (!pendingCon && circlePosition) {
      const newConID = Math.max(0, ...cons.map((e) => e.id)) + 1;
      setPendingCon({
        conID: newConID,
        id: id,
        positionX: circlePosition.x,
        positionY: circlePosition.y,
      });
      return false
    } else {
      // check if atr is already in connection
      if (pendingCon && id !== pendingCon.id) {

        // check if attribute nodes are connected
        const allIDs = [id, pendingCon.id]
        const parentIDs = allIDs.map(atrID => getAction(atrID)?.id).filter(id => id !== undefined)
        const isParentConnected = parentCons.some(parentCon => parentIDs.every(parentID => parentCon.actions.some(a => a.id === parentID)))

        if (isParentConnected) {
          createCon(allIDs);
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

export const handleMethodConUpdate = (
  updateCon: (conID: number, id: number) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingCon: IPendingCon | null) => void
) => {
  const parentCons = useAtomValue(actionConAtom)
  const cons = useAtomValue(methodConAtom)
  const { getAction } = useCalculation();

  return (conID: number, id: number) => {
    if (!pendingCon) {
      alert(`Click on attribute first to add to attribute connection.`)
    } else {
      // check if method actions are connected
      const atrNodeID = getAction(id)?.id
      const filteredActionCons = parentCons.filter(con => con.actions.find(n => n.id === atrNodeID))
      const filteredAtrCons = cons.filter(atrCon => atrCon.id === conID)
      const filteredActionIDs = filteredActionCons.map(con => con.actions.map(n => n.id))
      const filteredMethodActionIDs = filteredAtrCons.map(con => con.methods.map(a => a.actionID))
      const isParentConnected = filteredActionIDs.some(nodeIDs => filteredMethodActionIDs.some(atrNodeIDs => atrNodeIDs.every(atrNodeID => nodeIDs.includes(atrNodeID))));

      if (isParentConnected) {
        updateCon(conID, id);
        setPendingCon(null);
        return true
      } else {
        alert("Method actions need to be connected.")
        setPendingCon(null);
        return false
      }
    }
  }
};
