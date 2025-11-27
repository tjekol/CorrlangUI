import { atom } from 'jotai';
import { IEdge } from './interface/IEdge';
import { INode } from './interface/INode';
import { IAttributeEdge } from './interface/IAttributeEdge';
import { LiveAtrPosition, LiveNodePosition } from './interface/IStates';
import { IAttribute } from './interface/IAttribute';
import { ISchema } from './interface/ISchema';
import { IMultiEdge } from './interface/IMultiEdge';

// Node/attribute
export const schemaAtom = atom<ISchema[]>([]);
export const nodeAtom = atom<INode[]>([]);
export const attrAtom = atom<IAttribute[]>([]);

export const nodeColor = ['#86AD5A', '#A96CB5', '#5C97DC', '#D16370', '#F8A72F', '#F78DA7']

// Edges
export const edgeAtom = atom<IEdge[]>([]); // [{ id: 1, srcNodeID: 1, trgtNodeID: 2 }]
export const multiEdgeAtom = atom<IMultiEdge[]>([]); // [ {nodes: [1,2,3]} ]
export const attrEdgeAtom = atom<IAttributeEdge[]>([]); // [{ id: 1, srcNodeID: 1, trgtNodeID: 2 }]

// export const nodeLengthAtom = atom<{ id: number, length: number }[]>([]);
export const nodeLengthAtom = atom<number>(0); // [{ id: 1, length: 6 }]

// Live positions for edge source and target
export const liveNodePositionsAtom = atom<LiveNodePosition[]>([]); // [ {nodeID: 1, positionX: 0, positionY: 0} ]
export const liveAtrPositionsAtom = atom<LiveAtrPosition[]>([]);
