export interface IAttribute {
  id: number;
  nodeID: number;
  text: string;
  type: AtrType;
}

export enum AtrType {
  number, // 0
  string, // 1
  array, // 2
}
