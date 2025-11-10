import { atom } from 'jotai';
import { IEdge } from './interface/IEdge';
import { INode } from './interface/INode';
import { IAttributeEdge } from './interface/IAttributeEdge';
import { LiveAtrPosition, LiveNodePosition } from './interface/IStates';
import { IAttribute } from './interface/IAttribute';

// Node/attribute
export const nodeAtom = atom<INode[]>([]);
export const attrAtom = atom<IAttribute[]>([]);

// Edges
// [{ id: 1, srcNodeID: 1, trgtNodeID: 2 }]
export const edgeAtom = atom<IEdge[]>([]);
export const attrEdgeAtom = atom<IAttributeEdge[]>([]);

// [{ id: 1, length: 6 }]
// export const nodeLengthAtom = atom<{ id: number, length: number }[]>([]);
export const nodeLengthAtom = atom<number>(0);

// Live positions for edge source and target
export const liveNodePositionsAtom = atom<LiveNodePosition[]>([]);
export const liveAtrPositionsAtom = atom<LiveAtrPosition[]>([]);

