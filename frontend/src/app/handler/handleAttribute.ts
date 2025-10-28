import { IAttributeEdge } from '../interface/IAttributeEdge';

export const handleAttributeEdge = (
  edges: IAttributeEdge[],
  createAttributeEdge: (attributeEdgeID: number, attributeID: number, positionX: number, positionY: number) => void,
  pendingAtrEdge: {
    attributeEdgeID: number;
    attributeID: number;
    positionX: number;
    positionY: number;
  } | null,
  setPendingAtrEdge: (pendingEdge: {
    attributeEdgeID: number;
    attributeID: number;
    positionX: number;
    positionY: number;
  } | null) => void
) => {
  return (id: number, circlePosition: { x: number; y: number }) => {
    if (!pendingAtrEdge) {
      const newattributeEdgeID = Math.max(0, ...edges.map((e) => e.attributeEdgeID)) + 1;

      setPendingAtrEdge({
        attributeEdgeID: newattributeEdgeID,
        attributeID: id,
        positionX: circlePosition.x,
        positionY: circlePosition.y,
      });

      console.log('First node selected:', {
        attributeID: id,
        position: circlePosition,
      });
    } else {
      if (pendingAtrEdge.attributeID !== id) {
        // create both edges with the same attributeEdgeID (completing the connection)
        console.log(
          'Creating edge connection between nodes:',
          pendingAtrEdge.attributeID,
          'and',
          id
        );

        // Create first edge (from pending data)
        createAttributeEdge(
          pendingAtrEdge.attributeEdgeID,
          pendingAtrEdge.attributeID,
          pendingAtrEdge.positionX,
          pendingAtrEdge.positionY
        );

        // create second edge (from current click)
        createAttributeEdge(pendingAtrEdge.attributeEdgeID, id, circlePosition.x, circlePosition.y);

        setPendingAtrEdge(null);
      } else {
        console.log('Same node clicked, canceling edge creation');
        setPendingAtrEdge(null);
      }
    }
  };
};
