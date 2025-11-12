export interface IEdge {
  id: number;
  srcNodeID: number;
  trgtNodeID: number;
  type: EdgeType;
}

export enum EdgeType {
  assoc, // 0 --
  dirAssoc, // 1 -->
  inherit // 2 --|>
}
