export interface IPendingCon {
  connectID: number;
  nodeID: number;
  positionX: number;
  positionY: number;
}

export interface IPendingAtrCon {
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
