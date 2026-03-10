import { useAtomValue, useSetAtom } from 'jotai';
import { liveNodePositionsAtom, nodeAtom, nodeLengthAtom, atrAtom, midNodeConAtom, midEdgeAtom, liveAtrPositionsAtom, midEdgeConAtom, midAtrConAtom, liveActionPositionsAtom, liveMethodPositionsAtom, actionAtom, methodAtom, actionLengthAtom, midActionConAtom, midMethodConAtom } from '../GlobalValues';
import { INode } from '../interface/INode';
import { IAttribute } from '../interface/IAttribute';
import { IMethod } from '../interface/IMethod';
import { IAction } from '../interface/IAction';

export const useCalculation = () => {
  const liveNodePositions = useAtomValue(liveNodePositionsAtom);
  const liveAtrPositions = useAtomValue(liveAtrPositionsAtom);
  const liveActionPositions = useAtomValue(liveActionPositionsAtom);
  const liveMethodPositions = useAtomValue(liveMethodPositionsAtom);
  const nodes = useAtomValue(nodeAtom);
  const actions = useAtomValue(actionAtom);
  const nodeLengths = useAtomValue(nodeLengthAtom);
  const actionLengths = useAtomValue(actionLengthAtom);
  const attributes = useAtomValue(atrAtom);
  const methods = useAtomValue(methodAtom);

  const setMidNodeCon = useSetAtom(midNodeConAtom)
  const setMidAtrCon = useSetAtom(midAtrConAtom)
  const setMidEdgeCon = useSetAtom(midEdgeConAtom)
  const setMidEdge = useSetAtom(midEdgeAtom)
  const setMidActionCon = useSetAtom(midActionConAtom)
  const setMidMethodCon = useSetAtom(midMethodConAtom)

  const height = 40

  const getNode = (attributeID: number): INode | null => {
    const atr = attributes.find((a) => a.id === attributeID);
    if (!atr) return null;

    const parentNode = nodes.find((n) => n.id === atr.nodeID);
    if (!parentNode) return null;

    return parentNode;
  };

  const getAction = (methodID: number): IAction | null => {
    const method = methods.find((m) => m.id === methodID);
    if (!method) return null;

    const parentNode = actions.find((a) => a.id === method.actionID);
    if (!parentNode) return null;

    return parentNode;
  };

  const getNodePosition = (id: number, conType: number) => {
    if (conType === 0) {
      const livePos = liveNodePositions.find((pos) => pos.id === id);
      if (livePos) {
        return {
          x: livePos.positionX,
          y: livePos.positionY,
        };
      }
      const node = nodes.find((n) => n.id === id);
      if (node) {
        const position = { x: node.positionX || 0, y: node.positionY || 0 };
        // circle position
        return {
          x: position.x,
          y: position.y,
        };
      } else {
        return {
          x: 0,
          y: 0,
        };
      }
    } else if (conType === 1) {
      const livePos = liveActionPositions.find((pos) => pos.id === id);
      if (livePos) {
        return {
          x: livePos.positionX,
          y: livePos.positionY,
        };
      }
      const action = actions.find((a) => a.id === id);
      if (action) {
        const position = { x: action.positionX || 0, y: action.positionY || 0 };
        // circle position
        return {
          x: position.x,
          y: position.y,
        };
      } else {
        return {
          x: 0,
          y: 0,
        };
      }
    }
  };

  const calculateNodeLength = (attributes: IAttribute[] | IMethod[], title: string) => {
    const labels = [...attributes.map((label) => 'text' in label ? label.text : label.name)];
    const strLenghts = labels.map((str) =>
      str.length > 5 ? str.length * 1.4 : str.length * 2.5,
    );
    const maxStringLength = Math.max(...strLenghts, title.length);
    const width = maxStringLength * 12;

    return width
  }

  const getAttributePosition = (id: number, conType: number) => {
    if (conType === 0) {
      const livePos = liveAtrPositions.find((pos) => pos.childID === id);
      if (livePos) {
        return {
          x: livePos.positionX,
          y: livePos.positionY,
        };
      }

      const parentNode = getNode(id)
      if (!parentNode) return null;

      const nodeAttributes = attributes.filter((atr) => atr.nodeID === parentNode.id);
      const attributeIndex = nodeAttributes.findIndex(
        (atr) => atr.id === id
      );
      if (attributeIndex === -1) return null;

      const nodePos = getNodePosition(parentNode.id, 0);
      if (!nodePos) return null;

      const attributeY =
        nodePos.y + height + (height / 2) * (attributeIndex);

      return {
        x: nodePos.x,
        y: attributeY,
      };
    } else if (conType === 1) {
      const livePos = liveMethodPositions.find((pos) => pos.childID === id);
      if (livePos) {
        return {
          x: livePos.positionX,
          y: livePos.positionY,
        };
      }

      const parentNode = getAction(id)
      if (!parentNode) return null;

      const actionMethods = methods.filter((m) => m.actionID === parentNode.id);
      const attributeIndex = actionMethods.findIndex(
        (atr) => atr.id === id
      );
      if (attributeIndex === -1) return null;

      const nodePos = getNodePosition(parentNode.id, 1);
      if (!nodePos) return null;

      const attributeY =
        nodePos.y + height + (height / 2) * (attributeIndex);

      return {
        x: nodePos.x,
        y: attributeY,
      };
    }
  };

  // calculate midpoint for a path
  const calculateMidpoint = (pathElement: SVGPathElement, conID: number, type: number) => {
    const totalLength = pathElement.getTotalLength();
    if (!isFinite(totalLength) || totalLength === 0) return;

    const pt = pathElement.getPointAtLength(totalLength / 2);

    switch (type) {
      // nodes
      case 0:
        setMidNodeCon((prev) => ({
          ...prev,
          [conID]: { x: pt.x, y: pt.y },
        }));
        break;
      // attributes
      case 1:
        setMidAtrCon((prev) => ({
          ...prev,
          [conID]: { x: pt.x, y: pt.y },
        }));
        break;
      // edges
      case 2:
        setMidEdgeCon((prev) => ({
          ...prev,
          [conID]: { x: pt.x, y: pt.y },
        }));
        break;
      // actions
      case 3:
        setMidActionCon((prev) => ({
          ...prev,
          [conID]: { x: pt.x, y: pt.y },
        }));
        break;
      // methods
      case 4:
        setMidMethodCon((prev) => ({
          ...prev,
          [conID]: { x: pt.x, y: pt.y },
        }));
        break;
      default:
        console.log("Calculation of midpoint failed.")
    }
  };

  const calculateMidpointEdge = (pathElement: SVGPathElement, edgeID: number) => {
    const totalLength = pathElement.getTotalLength();
    if (!isFinite(totalLength) || totalLength === 0) return;

    const pt = pathElement.getPointAtLength(totalLength / 2);
    setMidEdge((prev) => ({
      ...prev,
      [edgeID]: { x: pt.x, y: pt.y },
    }));
  };

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

  const getMidpoint = (positions: { x: number, y: number }[]) => {
    if (!positions || positions.length === 0) return null;

    const sumX = positions.reduce((sum, pos) => sum + pos.x, 0);
    const sumY = positions.reduce((sum, pos) => sum + pos.y, 0);

    return {
      x: sumX / positions.length,
      y: sumY / positions.length
    };
  }

  const getShortestPath = (conType: number, midpoint: { x: number, y: number }, position: { x: number, y: number }, nodeID?: number, atrID?: number) => {
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

    const trgtNodeBottom = trgtAtrLen <= 0 ? trgtHeaderHeight : trgtAtrLen === 1 ? trgtHeaderHeight + height : trgtHeaderHeight + (height * trgtAtrLen) / 1.4;
    const srcNodeBottom = srcAtrLen <= 0 ? srcHeaderHeight : srcAtrLen === 1 ? srcHeaderHeight + height : srcHeaderHeight + (height * srcAtrLen) / 1.4;

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

  return { getNode, getAction, getNodePosition, calculateNodeLength, calculateMidpoint, calculateMidpointEdge, getAttributePosition, getPathData, getMidpoint, getShortestPath, getTempPathData, getArrowData }
}
