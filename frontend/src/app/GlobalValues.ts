import { atom } from 'jotai';
import { ISchema } from './interface/ISchema';
import { INode } from './interface/INode';
import { IAttribute } from './interface/IAttribute';
import { IEdge } from './interface/IEdge';
import { LiveAtrPosition, LiveNodePosition } from './interface/IStates';
import { INodeConnection, IAtrConnection, IEdgeConnection } from './interface/IConnections';

// Node/attribute
export const schemaAtom = atom<ISchema[]>([]);
export const nodeAtom = atom<INode[]>([]);
export const atrAtom = atom<IAttribute[]>([]);

export const nodeColor = ['#86AD5A', '#A96CB5', '#5C97DC', '#D16370', '#F8A72F', '#F78DA7']
export const nodeLengthAtom = atom<{ id: number, length: number }[]>([]); // [{ id: 1, length: 6 }]

// Midpoints paths (edge/connections)
export const midConAtom = atom<Record<number, { x: number; y: number }>>({});
export const midEdgeAtom = atom<Record<number, { x: number; y: number }>>({});

// Edges
export const edgeAtom = atom<IEdge[]>([]); // [{ id: 1, srcNodeID: 1, trgtNodeID: 2 }]

// Connection
export const nodeConAtom = atom<INodeConnection[]>([]); // [ { id: 1,  nodeIDs: [1,2,3] }, { id: 2,  nodeIDs: [4,5,6] } ]
export const atrConAtom = atom<IAtrConnection[]>([]); //[ { id: 1,  atrIDs: [1,2,3] }, { id: 2,  atrIDs: [4,5,6] } ]
export const edgeConAtom = atom<IEdgeConnection[]>([]); //[ { id: 1,  edgeIDs: [1,2,3] }, { id: 2,  edgeIDs: [4,5,6] } ]

// Live positions for nodes and attributes
export const liveNodePositionsAtom = atom<LiveNodePosition[]>([]); // [ {nodeID: 1, positionX: 0, positionY: 0} ]
export const liveAtrPositionsAtom = atom<LiveAtrPosition[]>([]);
