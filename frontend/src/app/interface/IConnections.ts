import { IAttribute } from './IAttribute';
import { INode } from './INode';

export interface IConnection {
  id: number;
  srcNodeID: number;
  trgtNodeID: number;
}

export interface IMultiConnection {
  id: number;
  nodes: INode[];
}

export interface IAtrConnection {
  id: number;
  srcAtrID: number;
  trgtAtrID: number;
}

export interface IAtrMultiConnection {
  id: number;
  attributes: IAttribute[];
}

export interface IEdgeConnection {
  id: number;
  srcEdgeID: number;
  trgtEdgeID: number;
}
