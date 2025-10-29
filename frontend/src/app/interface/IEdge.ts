import { INode } from './INode'

export interface IEdge {
  edgeID: number,
  nodeID: number

  node: INode[]
}
