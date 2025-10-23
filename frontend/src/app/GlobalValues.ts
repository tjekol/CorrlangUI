import { atom } from 'jotai';
import { IEdge } from './interface/IEdge';
import { INode } from './interface/INode';

// Dynamic atoms
export const nodeAtom = atom<INode[]>([]);

// [{ edgeID: 1, nodeID: 1, position: { x: x, y: y }, edgeID: 1, nodeID: 2, position: { x: x, y: y } }]
export const edgeAtom = atom<IEdge[]>([]);
