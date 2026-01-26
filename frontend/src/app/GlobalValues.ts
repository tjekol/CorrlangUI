import { atom } from 'jotai';
import { IEdge } from './interface/IEdge';
import { INode } from './interface/INode';
import { IAtrConnection } from './interface/Connection/IAtrConnection';
import { IAttribute } from './interface/IAttribute';
import { ISchema } from './interface/ISchema';
import { IMultiConnection } from './interface/Connection/IMultiConnection';
import { IConnection } from './interface/Connection/IConnection';
import { LiveAtrPosition, LiveNodePosition } from './interface/IStates';

// Node/attribute
export const schemaAtom = atom<ISchema[]>([]);
export const nodeAtom = atom<INode[]>([]);
export const atrAtom = atom<IAttribute[]>([]);

export const nodeColor = ['#86AD5A', '#A96CB5', '#5C97DC', '#D16370', '#F8A72F', '#F78DA7']
export const nodeLengthAtom = atom<number>(0); // [{ id: 1, length: 6 }]

// Edges
export const edgeAtom = atom<IEdge[]>([]); // [{ id: 1, srcNodeID: 1, trgtNodeID: 2 }]

// Connection
export const nodeConAtom = atom<IConnection[]>([]); // [{ id: 1, srcNodeID: 1, trgtNodeID: 2 }]
export const multiConAtom = atom<IMultiConnection[]>([]); // [ { id: 1,  nodes: [1,2,3] }, { id: 2,  nodes: [1,2,3] } ]
export const atrConAtom = atom<IAtrConnection[]>([]); // [{ id: 1, srcAtrID: 1, trgtAtrID: 2 }]

// Live positions for nodes and attributes
export const liveNodePositionsAtom = atom<LiveNodePosition[]>([]); // [ {nodeID: 1, positionX: 0, positionY: 0} ]
export const liveAtrPositionsAtom = atom<LiveAtrPosition[]>([]);
