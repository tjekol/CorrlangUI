import { useAtomValue, useSetAtom } from 'jotai';
import { height, liveNodePositionsAtom, nodeAtom, atrAtom, midNodeConAtom, midEdgeAtom, liveAtrPositionsAtom, midEdgeConAtom, midAtrConAtom, liveActionPositionsAtom, liveMethodPositionsAtom, actionAtom, methodAtom, midActionConAtom, midMethodConAtom, computingVal } from '../GlobalValues';
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
  const attributes = useAtomValue(atrAtom);
  const methods = useAtomValue(methodAtom);

  const setMidNodeCon = useSetAtom(midNodeConAtom)
  const setMidAtrCon = useSetAtom(midAtrConAtom)
  const setMidEdgeCon = useSetAtom(midEdgeConAtom)
  const setMidEdge = useSetAtom(midEdgeAtom)
  const setMidActionCon = useSetAtom(midActionConAtom)
  const setMidMethodCon = useSetAtom(midMethodConAtom)

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

  const calculateNodeWidth = (node: INode | IAction) => {
    if ('attributes' in node) {
      const width = calculateNodeLength(node.attributes, node.title);
      return Math.max(width, 100);
    } else if ('methods' in node) {
      const width = calculateNodeLength(node.methods, node.name);
      return Math.max(width, 100);
    }
    return 100
  };

  const calculateNodeHeight = (node: INode | IAction) => {
    if ('attributes' in node) {
      const headerHeight = height;
      const attributeHeight =
        node.attributes.length === 1
          ? headerHeight
          : (headerHeight * node.attributes.length) / computingVal;
      return headerHeight + attributeHeight;
    } else if ('methods' in node) {
      const headerHeight = height;
      const attributeHeight =
        node.methods.length === 1
          ? headerHeight
          : (headerHeight * node.methods.length) / computingVal;
      return headerHeight + attributeHeight;
    }
    return 40
  };

  const calculateNodeLength = (attributes: IAttribute[] | IMethod[], title: string) => {
    const labels = [...attributes.map((label) => 'text' in label ? label.text + label.type : label.name + label.input + label.output)];
    const strLenghts = labels.map((str) =>
      str.length > 40 ? str.length * 0.85 : str.length > 20 ? str.length * 1 : str.length > 5 ? str.length * computingVal : str.length * 2.5
    );
    const maxStringLength = Math.max(...strLenghts, title.length);
    const width = maxStringLength * 10;

    return width
  }

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

  const getChildrenPosition = (id: number, conType: number) => {
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


  const getMidpoint = (positions: { x: number, y: number }[]) => {
    if (!positions || positions.length === 0) return null;

    const sumX = positions.reduce((sum, pos) => sum + pos.x, 0);
    const sumY = positions.reduce((sum, pos) => sum + pos.y, 0);

    return {
      x: sumX / positions.length,
      y: sumY / positions.length
    };
  }

  return { getNode, getAction, calculateNodeWidth, calculateNodeHeight, getNodePosition, calculateNodeLength, calculateMidpoint, calculateMidpointEdge, getChildrenPosition, getMidpoint }
}
