export interface IPendingCon {
  conID: number;
  id: number;
  positionX: number;
  positionY: number;
}

export interface LiveNodePosition {
  id: number;
  positionX: number;
  positionY: number;
}

export interface LiveAtrPosition {
  nodeID: number;
  attributeID: number;
  positionX: number;
  positionY: number;
}
