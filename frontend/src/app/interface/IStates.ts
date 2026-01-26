export interface IPendingCon {
  conID: number;
  nodeID: number;
  positionX: number;
  positionY: number;
}

export interface IPendingAtrCon {
  attributeConID: number;
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
