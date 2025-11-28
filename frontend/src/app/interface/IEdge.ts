export interface IEdge {
  id: number;
  srcNodeID: number;
  trgtNodeID: number;
  type: EdgeType;
}

export enum EdgeType {
  assoc, // 0 --
  direct, // 1 -->
  comp, // 2 <>-->
  inherit // 3 --|>
}
