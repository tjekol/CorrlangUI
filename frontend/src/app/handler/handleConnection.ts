import { IConnection } from '../interface/Connection/IConnection';
import { IPendingCon } from '../interface/IStates';

export const handleConnection = (
  cons: IConnection[],
  createCon: (srcNodeID: number, trgtNodeID: number) => void,
  pendingCon: IPendingCon | null,
  setPendingCon: (pendingEdge: IPendingCon | null) => void
) => {
  return (id: number, circlePosition: { x: number; y: number }) => {
    if (!pendingCon) {
      const newConID = Math.max(0, ...cons.map((e) => e.id)) + 1;

      setPendingCon({
        conID: newConID,
        nodeID: id,
        positionX: circlePosition.x,
        positionY: circlePosition.y
      });

      console.log('First node selected:', {
        nodeID: id,
        position: circlePosition
      });
    } else {
      // TODO: restrict one connection between two nodes
      if (pendingCon.nodeID !== id) {
        console.log(`Creating connection between nodes: ${pendingCon.nodeID}-${id}`)
        createCon(
          pendingCon.nodeID,
          id
        );
        setPendingCon(null);
      } else {
        console.log('Same node clicked, canceling connection creation');
        setPendingCon(null);
      }
    }
  };
};
