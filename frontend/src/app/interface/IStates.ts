export interface IPendingEdge {
  edgeID: number;
  nodeID: number;
  positionX: number;
  positionY: number;
}

export interface IPendingAtrEdge {
  attributeEdgeID: number;
  attributeID: number;
  positionX: number;
  positionY: number;
}

export interface LiveNodePosition {
  nodeID: number;
  positionX: number;
  positionY: number;
}

export interface LiveAtrPosition {
  nodeID: number;
  attributeID: number;
  positionX: number;
  positionY: number;
}

export enum Direction {
  left,
  right
}
