import { INode } from './INode'

export interface IEdge {
  edgeID: number,
  nodeID: number,
  positionX: number,
  positionY: number

  node: INode[]
}
