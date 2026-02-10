export interface IEdge {
  id: number;
  srcNodeID: number;
  trgtNodeID: number;
  lowerBound: number;
  upperBound: number;
  isOrdered: boolean;
  type: EdgeType;
}

// multiplcities
// 1, 0..1, *, 0..*, 1..*

export enum EdgeType {
  assoc, // 0 --
  direct, // 1 -->
  comp, // 2 <>-->
  inherit // 3 --|>
}
