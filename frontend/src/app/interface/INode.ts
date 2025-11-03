import { IAttribute } from './IAttribute';
import { IEdge } from './IEdge';

export interface INode {
  id: number;
  title: string;
  positionX: number;
  positionY: number;

  attributes: IAttribute[];
}
