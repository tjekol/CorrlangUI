import { useAtomValue } from 'jotai';
import { liveNodePositionsAtom, nodeAtom } from '../GlobalValues';

export const usePositionCalculators = () => {
  const livePositions = useAtomValue(liveNodePositionsAtom);
  const nodes = useAtomValue(nodeAtom);
  const height = 40

  const getNodePosition = (nodeID: number) => {

    const livePos = livePositions.find((pos) => pos.nodeID === nodeID);
    if (livePos) {
      return {
        x: livePos.positionX,
        y: livePos.positionY + height / 2,
      };
    }
    const node = nodes.find((n) => n.id === nodeID);
    if (node) {
      const position = { x: node.positionX || 0, y: node.positionY || 0 };
      return {
        x: position.x,
        y: position.y + height / 2,
      };
    }
    return null;
  };

  const getAttributePosition = (attributeID: number) => {
    const parentNode = nodes.find((node) =>
      node.attributes.some((attr) => attr.id === attributeID)
    );
    if (!parentNode) return null;
    const attributeIndex = parentNode.attributes.findIndex(
      (attr) => attr.id === attributeID
    );

    if (attributeIndex === -1) return null;
    const nodePos = getNodePosition(parentNode.id);
    if (!nodePos) return null;

    const height = 40;
    const attributeY =
      nodePos.y - height / 2 + height + (height / 2) * (attributeIndex + 1);

    return {
      x: nodePos.x,
      y: attributeY,
    };
  };

  return { getNodePosition, getAttributePosition }
}
