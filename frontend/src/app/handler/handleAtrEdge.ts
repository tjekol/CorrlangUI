import { IAttributeEdge } from '../interface/IAttributeEdge';
import { IPendingAtrEdge } from '../interface/IStates';

export const handleAttributeEdge = (
  edges: IAttributeEdge[],
  createAttributeEdge: (srcAtrID: number, trgtAtrID: number) => void,
  pendingAtrEdge: IPendingAtrEdge | null,
  setPendingAtrEdge: (pendingEdge: IPendingAtrEdge | null) => void
) => {
  return (id: number, circlePosition: { x: number; y: number }) => {
    if (!pendingAtrEdge) {
      const newattributeEdgeID = Math.max(0, ...edges.map((e) => e.id)) + 1;

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
      if (pendingAtrEdge.attributeID !== id) {
        console.log(
          'Creating edge between attributes:',
          pendingAtrEdge.attributeID,
          'and',
          id
        );

        createAttributeEdge(
          pendingAtrEdge.attributeID,
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
