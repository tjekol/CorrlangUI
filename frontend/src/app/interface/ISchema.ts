import { INode } from './INode';

export interface ISchema {
  id: number;
  title: string;
  nodes: INode[];
}
