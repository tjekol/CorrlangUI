import { atom } from 'jotai';
import { IEdge } from './interface/IEdge';

// Dynamic atoms
export const nodeAtom = atom([
  { id: 1, title: 'Person', labels: ['firstName', 'lastName'] },
  { id: 2, title: 'Person', labels: ['fullName'] },
  { id: 3, title: 'Employee', labels: ['firstName', 'lastName'] },
  { id: 4, title: 'Client', labels: ['fullName'] },
]);

// [{ edgeID: 1, nodeID: 1, position: { x: x, y: y }, edgeID: 1, nodeID: 2, position: { x: x, y: y } }]
export const edgeAtom = atom<IEdge[]>([]);

// Counter should increase when an edge is created between two different nodes
export const edgeCounterAtom = atom<number>(1);
