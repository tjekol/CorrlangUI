import { useAtomValue } from 'jotai';
import { liveNodePositionsAtom, nodeAtom, nodeLengthAtom } from '../GlobalValues';
import { INode } from '../interface/INode';

export const usePositionCalculation = () => {
  const livePositions = useAtomValue(liveNodePositionsAtom);
  const nodes = useAtomValue(nodeAtom);
  const nodeLength = useAtomValue(nodeLengthAtom);
  const height = 40

  const getNodePosition = (nodeID: number) => {
    const livePos = livePositions.find((pos) => pos.nodeID === nodeID);
    if (livePos) {
      return {
        x: livePos.positionX,
        y: livePos.positionY,
      };
    }
    const node = nodes.find((n) => n.id === nodeID);
    if (node) {
      const position = { x: node.positionX || 0, y: node.positionY || 0 };
      // circle position
      return {
        x: position.x,
        y: position.y,
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

    const attributeY =
      nodePos.y + height * (attributeIndex + 1);

    return {
      x: nodePos.x,
      y: attributeY,
    };
  };

  const getPathData = (
    pos1: { x: number; y: number },
    pos2: { x: number; y: number }
  ): string => {
    const pos1Y = pos1.y + height / 2
    const pos2Y = pos2.y + height / 2

    // connect to left or rigth circle closest to pos2
    const diff1X = pos2.x - pos1.x;
    const diff1XWidth = pos2.x - (pos1.x + nodeLength);
    const pos1X =
      Math.abs(diff1X) < Math.abs(diff1XWidth) ? pos1.x : pos1.x + nodeLength;

    // conntect to left or rigth circle closest to pos1
    const diff2X = pos1X - pos2.x;
    const diff2XWidth = pos1X - (pos2.x + nodeLength);
    const pos2X =
      Math.abs(diff2X) < Math.abs(diff2XWidth) ? pos2.x : pos2.x + nodeLength;

    const actualDiffY = pos1Y - pos2Y;
    if (actualDiffY < 1 && actualDiffY > -1) {
      return `M ${pos1X} ${pos1Y} L ${pos2X} ${pos2Y}`;
    }

    const distance = Math.abs(pos2X - pos1X);
    const curveStrength = Math.min(distance * 0.8, 100);

    const controlPoint1X =
      pos1X + (pos1X === pos1.x ? -curveStrength : curveStrength);
    const controlPoint1Y = pos1Y;
    const controlPoint2X =
      pos2X + (pos2X === pos2.x ? -curveStrength : curveStrength);
    const controlPoint2Y = pos2Y;

    return `M ${pos1X} ${pos1Y} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${pos2X} ${pos2Y}`;
  };

  const getMidpoint = (positions: { x: number, y: number }[]) => {
    if (positions.length === 0) return null;

    const sumX = positions.reduce((sum, pos) => sum + pos.x, 0);
    const sumY = positions.reduce((sum, pos) => sum + pos.y, 0);

    return {
      x: sumX / positions.length,
      y: sumY / positions.length
    };
  }

  const getShortestPath = (midpoint: { x: number, y: number }, position: { x: number, y: number }) => {
    const diffX = midpoint.x - position.x;
    const diffXWidth = midpoint.x - (position.x + nodeLength);
    const positionX =
      Math.abs(diffX) < Math.abs(diffXWidth) ? position.x : position.x + nodeLength;

    return `M ${midpoint.x} ${midpoint.y} L ${positionX} ${position.y + height / 2}`
  }

  const getTempPathData = (
    pos1: { x: number; y: number },
    pos2: { x: number; y: number }
  ): string => {
    return `M ${pos1.x} ${pos1.y} L ${pos2.x} ${pos2.y}`;
  };

  const getArrowData = (pos1: { x: number; y: number }, pos2: { x: number; y: number }, trgtNode: INode) => {
    // height of node + attributes
    const nodeHeight = height + trgtNode.attributes.length * height

    // connect to top/bottom of node closest to other node
    const diffY = pos2.y - pos1.y;
    const diffYHeight = pos2.y - (pos1.y + nodeHeight);
    const pos2Y =
      Math.abs(diffY) > Math.abs(diffYHeight) ? pos2.y : pos2.y + nodeHeight;

    const pos1X = pos1.x + nodeLength / 2;
    const pos1Y = pos1.y;
    const pos2X = pos2.x + nodeLength / 2;

    return `M ${pos1X} ${pos1Y} L ${pos2X} ${pos2Y}`
  }

  return { getNodePosition, getAttributePosition, getPathData, getMidpoint, getShortestPath, getTempPathData, getArrowData }
}
