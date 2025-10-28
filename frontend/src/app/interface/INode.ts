import { IAttribute } from './IAttribute';

export interface INode {
  id: number;
  title: string;
  attributes: IAttribute[];
}
