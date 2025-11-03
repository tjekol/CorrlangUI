import { atom } from 'jotai';
import { IEdge } from './interface/IEdge';
import { INode } from './interface/INode';
import { IAttributeEdge } from './interface/IAttributeEdge';
import { LiveAtrPosition, LiveNodePosition } from './interface/IStates';

// Dynamic atoms
export const nodeAtom = atom<INode[]>([]);

// [{ id: 1, length: 6 }]
// export const nodeLengthAtom = atom<{ id: number, length: number }[]>([]);
export const nodeLengthAtom = atom<number>(0);

// Edge/AtrEdge positions
export const liveNodePositionsAtom = atom<LiveNodePosition[]>([]);
export const liveAtrPositionsAtom = atom<LiveAtrPosition[]>([]);

// [{ edgeID: 1, nodeID: 1, edgeID: 1, nodeID: 2 }]
export const edgeAtom = atom<IEdge[]>([]);

export const attrEdgeAtom = atom<IAttributeEdge[]>([]);
