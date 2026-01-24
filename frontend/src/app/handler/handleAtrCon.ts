import { IAtrConnection } from '../interface/Connection/IAtrConnection';
import { IPendingAtrCon } from '../interface/IStates';

export const handleAtrCon = (
  cons: IAtrConnection[],
  createAtrCon: (srcAtrID: number, trgtAtrID: number) => void,
  pendingAtrCon: IPendingAtrCon | null,
  setPendingAtrEdge: (pendingEdge: IPendingAtrCon | null) => void
) => {
  return (id: number, circlePosition: { x: number; y: number }) => {
    if (!pendingAtrCon) {
      const newattributeEdgeID = Math.max(0, ...cons.map((e) => e.id)) + 1;

      setPendingAtrEdge({
        attributeEdgeID: newattributeEdgeID,
        attributeID: id,
        positionX: circlePosition.x,
        positionY: circlePosition.y,
      });

      console.log('First attribute selected:', {
        attributeID: id,
        position: circlePosition,
      });
    } else {
      if (pendingAtrCon.attributeID !== id) {
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
        setPendingAtrEdge(null);
      } else {
        console.log('Same node clicked, canceling edge creation');
        setPendingAtrEdge(null);
      }
    }
  };
};
