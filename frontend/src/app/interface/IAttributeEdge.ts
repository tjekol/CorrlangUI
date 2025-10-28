import { IAttribute } from './IAttribute'

export interface IAttributeEdge {
  attributeEdgeID: number,
  attributeID: number,
  positionX: number,
  positionY: number

  attribute: IAttribute
}
