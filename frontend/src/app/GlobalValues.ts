import { atom } from 'jotai';
import { IEdge } from './interface/IEdge';
import { INode } from './interface/INode';
import { IAttributeEdge } from './interface/IAttributeEdge';

// Dynamic atoms
export const nodeAtom = atom<INode[]>([]);

// [{ edgeID: 1, nodeID: 1, edgeID: 1, nodeID: 2 }]
export const edgeAtom = atom<IEdge[]>([]);

export const attributeEdgeAtom = atom<IAttributeEdge[]>([]);
