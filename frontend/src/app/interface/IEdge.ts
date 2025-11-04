import { INode } from './INode'

export interface IEdge {
  id: number;
  edgeID: number;
  nodeID: number;

  node: INode[]
}
