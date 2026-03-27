import { useAtomValue } from 'jotai';
import { nodeLengthAtom, actionLengthAtom, computingVal, height } from '../GlobalValues';
import { INode } from '../interface/INode';
import { useCalculation } from './useCalculation';
import { IPosition } from '../interface/IPosition';

export const usePath = () => {
  const { getNode, getAction, } = useCalculation()
  const nodeLengths = useAtomValue(nodeLengthAtom);
  const actionLengths = useAtomValue(actionLengthAtom);

  const getPathData = (
    conType: number,
    pos1: { x: number; y: number },
    pos2: { x: number; y: number },
    srcNodeID?: number,
    trgtNodeID?: number
  ): string => {
    let pos1Y = pos1.y;
    let pos2Y = pos2.y;

    let pos1X = pos1.x;
    let pos2X = pos2.x;

    if (srcNodeID && trgtNodeID) {
      let srcNodeLength = 0, trgtNodeLength = 0;
      if (conType === 0) {
        srcNodeLength = nodeLengths.find((l) => l.id === srcNodeID)?.length || 0
        trgtNodeLength = nodeLengths.find((l) => l.id === trgtNodeID)?.length || 0
      } else if (conType === 1) {
        srcNodeLength = actionLengths.find((l) => l.id === srcNodeID)?.length || 0
        trgtNodeLength = actionLengths.find((l) => l.id === trgtNodeID)?.length || 0
      }

      pos1Y = pos1.y + height / 2
      pos2Y = pos2.y + height / 2

      // connect to left or rigth circle closest to pos2
      const diff1X = pos2.x - pos1.x;
      const diff1XWidth = pos2.x - (pos1.x + srcNodeLength);
      pos1X =
        Math.abs(diff1X) < Math.abs(diff1XWidth) ? pos1.x : pos1.x + srcNodeLength;

      // conntect to left or rigth circle closest to pos1
      const diff2X = pos1X - pos2.x;
      const diff2XWidth = pos1X - (pos2.x + trgtNodeLength);
      pos2X =
        Math.abs(diff2X) < Math.abs(diff2XWidth) ? pos2.x : pos2.x + trgtNodeLength;

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
    }

    const distance = Math.abs(pos2X - pos1X);
    const curveStrength = Math.min(distance * 0.8, 100);

    const controlPoint1X =
      pos1X + (pos1X > pos2X ? -curveStrength : curveStrength);
    const controlPoint1Y = pos1Y;
    const controlPoint2X =
      pos2X + (pos1X < pos2X ? -curveStrength : curveStrength);
    const controlPoint2Y = pos2Y;

    return `M ${pos1X} ${pos1Y} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${pos2X} ${pos2Y}`;
  };


  const getShortestPath = (conType: number, midpoint: IPosition, position: IPosition, nodeID?: number, atrID?: number) => {
    let nodeLength = 0;

    if (conType === 0) {
      if (nodeID) {
        nodeLength = nodeLengths.find(l => l.id === nodeID)?.length || 0;
      } else if (atrID) {
        let node = getNode(atrID)
        nodeLength = nodeLengths.find(l => l.id === node?.id)?.length || 0;
      }
      else {
        return `M ${midpoint.x} ${midpoint.y} L ${position.x} ${position.y}`
      }
    } else if (conType === 1) {
      if (nodeID) {
        nodeLength = actionLengths.find(l => l.id === nodeID)?.length || 0;
      } else if (atrID) {
        let node = getAction(atrID)
        nodeLength = actionLengths.find(l => l.id === node?.id)?.length || 0;
      } else {
        return `M ${midpoint.x} ${midpoint.y} L ${position.x} ${position.y}`
      }
    }

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

  const getArrowData = (pos1: { x: number; y: number }, pos2: { x: number; y: number }, srcNode: INode, trgtNode: INode) => {
    // height of node + attributes
    const srcHeaderHeight = pos1.y + height
    const srcAtrLen = srcNode.attributes.length
    const trgtHeaderHeight = pos2.y + height
    const trgtAtrLen = trgtNode.attributes.length

    const trgtNodeBottom = trgtAtrLen <= 0 ? trgtHeaderHeight : trgtAtrLen === 1 ? trgtHeaderHeight + height : trgtHeaderHeight + (height * trgtAtrLen) / computingVal;
    const srcNodeBottom = srcAtrLen <= 0 ? srcHeaderHeight : srcAtrLen === 1 ? srcHeaderHeight + height : srcHeaderHeight + (height * srcAtrLen) / computingVal;

    // connect to top/bottom of node closest to other node
    const diff1Y = trgtHeaderHeight - pos1.y;
    const diff1YHeight = trgtHeaderHeight - (srcNodeBottom);
    const pos1Y =
      Math.abs(diff1Y) < Math.abs(diff1YHeight) ? pos1.y : srcNodeBottom;

    const diff2Y = pos1Y - pos2.y;
    const diff2YHeight = pos1Y - (trgtNodeBottom);
    const pos2Y =
      Math.abs(diff2Y) < Math.abs(diff2YHeight) ? pos2.y : trgtNodeBottom;

    const srcNodeLength = nodeLengths.find((l) => l.id === srcNode.id)?.length || 100
    const trgtNodeLength = nodeLengths.find((l) => l.id === trgtNode.id)?.length || 100

    const srcRightSide = pos1.x + srcNodeLength
    const srcMiddle = pos1.x + srcNodeLength / 2
    const trgtRightSide = pos2.x + trgtNodeLength
    const trgtMiddle = pos2.x + trgtNodeLength / 2

    const pos1X = pos1.x <= trgtRightSide && srcRightSide >= pos2.x ? srcMiddle : srcRightSide < pos2.x ? srcRightSide : pos1.x;
    const pos2X = pos2.x <= srcRightSide && trgtRightSide >= pos1.x ? trgtMiddle : trgtRightSide < pos1.x ? trgtRightSide : pos2.x;

    return { pos1X, pos1Y, pos2X, pos2Y }
  }

  return { getPathData, getShortestPath, getTempPathData, getArrowData }
}
