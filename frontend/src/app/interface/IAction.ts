import { IMethod } from './IMethod';

export interface IAction {
  id: number;
  name: string;
  positionX: number;
  positionY: number;
  schemaID: number;

  methods: IMethod[];
}
