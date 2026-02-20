import { INode } from './INode';
import { IAttribute } from './IAttribute';
import { IEdge } from './IEdge';

export interface INodeConnection {
  id: number;
  nodes: INode[];
}

export interface IAtrConnection {
  id: number;
  attributes: IAttribute[];
}

export interface IEdgeConnection {
  id: number;
  edges: IEdge[]
}
