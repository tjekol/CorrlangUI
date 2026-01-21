export interface IAttribute {
  id: number;
  nodeID: number;
  text: string;
  type: AtrType;
}

export enum AtrType {
  id, // 0
  number, // 1
  string, // 2
  array, // 3
}
