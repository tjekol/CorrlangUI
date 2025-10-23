import { ILabel } from './ILabel';

export interface INode {
  id: number;
  title: string;
  nodeLabels: ILabel[];
}
