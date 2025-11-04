import { IAttribute } from './IAttribute';

export interface INode {
  id: number;
  title: string;
  positionX: number;
  positionY: number;

  attributes: IAttribute[];
}
