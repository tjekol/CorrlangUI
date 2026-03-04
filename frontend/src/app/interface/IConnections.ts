import { INode } from './INode';
import { IAttribute } from './IAttribute';
import { IEdge } from './IEdge';
import { IAction } from './IAction';
import { IMethod } from './IMethod';

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

export interface IActionConnection {
  id: number;
  actions: IAction[];
}

export interface IMethodConnection {
  id: number;
  methods: IMethod[];
}
