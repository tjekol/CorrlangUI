'use client';

import { useAtomValue } from 'jotai';
import ReactCodeMirror from '@uiw/react-codemirror';
import {
  actionAtom,
  actionConAtom,
  atrAtom,
  atrConAtom,
  edgeAtom,
  edgeConAtom,
  methodAtom,
  methodConAtom,
  nodeAtom,
  nodeConAtom,
  schemaAtom,
} from '../GlobalValues';
import { useEffect, useState, useCallback } from 'react';
import {
  IActionConnection,
  IAtrConnection,
  IEdgeConnection,
  IMethodConnection,
  INodeConnection,
} from '../interface/IConnections';
import { INode } from '../interface/INode';
import { IAction } from '../interface/IAction';
import { IAttribute } from '../interface/IAttribute';
import { IEdge } from '../interface/IEdge';
import { IMethod } from '../interface/IMethod';

export default function Export() {
  const schemas = useAtomValue(schemaAtom);
  const nodes = useAtomValue(nodeAtom);
  const attributes = useAtomValue(atrAtom);
  const edges = useAtomValue(edgeAtom);
  const actions = useAtomValue(actionAtom);
  const methods = useAtomValue(methodAtom);

  const nodeCons = useAtomValue(nodeConAtom);
  const atrCons = useAtomValue(atrConAtom);
  const edgeCons = useAtomValue(edgeConAtom);
  const actionCons = useAtomValue(actionConAtom);
  const methodCons = useAtomValue(methodConAtom);

  const [exportResult, setExportResult] = useState<string>('');

  const onChange = useCallback((val: string) => {
    setExportResult(val);
  }, []);

  const addConsToExport = (
    cons:
      | INodeConnection[]
      | IAtrConnection[]
      | IEdgeConnection[]
      | IActionConnection[]
      | IMethodConnection[],
  ) => {
    cons.map((con) => {
      let ids: number[];
      let conObjs: INode[] | IAttribute[] | IEdge[] | IAction[] | IMethod[];
      let result = [];

      if ('nodes' in con) {
        ids = con.nodes.map((n) => n.id);
        conObjs = nodes.filter((node) => ids.includes(node.id));

        for (const node of conObjs) {
          const schema = schemas.find((s) => s.id === node.schemaID);
          if (schema)
            result.push({ schemaTitle: schema?.title, nodeTitle: node.title });
        }
      } else if ('attributes' in con) {
        ids = con.attributes.map((a) => a.id);
        conObjs = attributes.filter((a) => ids.includes(a.id));

        for (const atr of conObjs) {
          const node = nodes.find((n) => n.id === atr.nodeID);
          if (node) {
            const schema = schemas.find((s) => s.id === node.schemaID);
            if (schema)
              result.push({
                schemaTitle: schema.title,
                nodeTitle: node.title,
                atrText: atr.text,
              });
          }
        }
      } else if ('edges' in con) {
        ids = con.edges.map((e) => e.id);
        conObjs = edges.filter((e) => ids.includes(e.id));

        for (const edge of conObjs) {
          const node = nodes.find((n) => n.id === edge.srcNodeID);
          if (node) {
            const schema = schemas.find((s) => s.id === node.schemaID);
            if (schema)
              result.push({
                schemaTitle: schema.title,
                nodeTitle: node.title,
                edgeText: edge.refName,
              });
          }
        }
      } else if ('actions' in con) {
        ids = con.actions.map((a) => a.id);
        conObjs = actions.filter((action) => ids.includes(action.id));

        for (const action of conObjs) {
          const schema = schemas.find((s) => s.id === action.schemaID);
          if (schema)
            result.push({
              schemaTitle: schema?.title,
              actionName: action.name,
            });
        }
      } else if ('methods' in con) {
        ids = con.methods.map((m) => m.id);
        conObjs = methods.filter((method) => ids.includes(method.id));

        for (const method of conObjs) {
          const action = actions.find((a) => a.id === method.actionID);
          if (action) {
            const schema = schemas.find((s) => s.id === action.schemaID);
            if (schema)
              result.push({
                schemaTitle: schema?.title,
                actionName: action.name,
                methodName: method.name,
              });
          }
        }
      }

      const objs = result.map(
        (r) =>
          ` ${r.schemaTitle}.${r.nodeTitle || r.actionName}${
            (r.atrText && '.' + r.atrText) ||
            (r.actionName && '.' + r.actionName) ||
            (r.edgeText && '.' + r.edgeText) ||
            ''
          }`,
      );

      if (objs[0] && objs)
        setExportResult(
          (prev) =>
            prev +
            `identify (${objs[0].trim()},${objs.slice(1)}) as ${objs[0].split('.').at(-1)}; \n`,
        );
    });
  };

  useEffect(() => {
    setExportResult('');

    addConsToExport(nodeCons);
    addConsToExport(atrCons);
    addConsToExport(edgeCons);
    addConsToExport(actionCons);
    addConsToExport(methodCons);
  }, [nodeCons, atrCons, edgeCons, actionCons, methodCons]);

  return (
    <ReactCodeMirror
      className='bg-[#F9F9F9] m-auto h-full w-full p-5 rounded-sm border whitespace-pre-wrap'
      value={
        exportResult.length > 0
          ? exportResult
          : 'Create connections between nodes and attributes…'
      }
      minHeight='200px'
      height='auto'
      onChange={onChange}
    />
  );
}
