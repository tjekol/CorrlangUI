export interface IPendingCon {
  conID: number;
  id: number;
  positionX: number;
  positionY: number;
}

export interface LiveParentPosition {
  id: number;
  positionX: number;
  positionY: number;
}

export interface LiveChildPosition {
  parentID: number;
  childID: number;
  positionX: number;
  positionY: number;
}
