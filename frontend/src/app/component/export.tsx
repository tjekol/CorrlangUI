'use client';

import { useAtomValue } from 'jotai';
import ReactCodeMirror from '@uiw/react-codemirror';
import {
  atrAtom,
  atrConAtom,
  edgeAtom,
  edgeConAtom,
  nodeAtom,
  nodeConAtom,
  schemaAtom,
} from '../GlobalValues';
import { useEffect, useState, useCallback } from 'react';

export default function Export() {
  const schemas = useAtomValue(schemaAtom);
  const nodes = useAtomValue(nodeAtom);
  const attributes = useAtomValue(atrAtom);
  const edges = useAtomValue(edgeAtom);
  const nodeCons = useAtomValue(nodeConAtom);
  const atrCons = useAtomValue(atrConAtom);
  const edgeCons = useAtomValue(edgeConAtom);

  const [exportResult, setExportResult] = useState<string>('');

  const onChange = useCallback((val: string) => {
    console.log('value', val);
    setExportResult(val);
  }, []);

  useEffect(() => {
    setExportResult('');

    nodeCons.map((con) => {
      const nodeIDs = con.nodes.map((n) => n.id);
      const multiConNodes = nodes.filter((node) => nodeIDs.includes(node.id));

      const result: { schemaTitle: string; nodeTitle: string }[] = [];

      for (const node of multiConNodes) {
        const schema = schemas.find((s) => s.id === node.schemaID);
        if (schema)
          result.push({ schemaTitle: schema?.title, nodeTitle: node.title });
      }

      const firstNode = result[0];
      const restOfNodes = result
        .splice(1)
        .map((r) => ' ' + r.schemaTitle + '.' + r.nodeTitle);

      if (firstNode && restOfNodes)
        setExportResult(
          (prev) =>
            prev +
            `identify (${firstNode.schemaTitle}.${firstNode.nodeTitle},${restOfNodes}) as ${firstNode.nodeTitle}; \n`,
        );
    });

    atrCons.map((con) => {
      const atrIDs = con.attributes.map((a) => a.id);
      const conAtrs = attributes.filter((a) => atrIDs.includes(a.id));

      const result: {
        schemaTitle: string;
        nodeTitle: string;
        atrText: string;
      }[] = [];

      for (const atr of conAtrs) {
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

      const firstAtr = result[0];
      const restOfAtrs = result
        .splice(1)
        .map((r) => ' ' + r.schemaTitle + '.' + r.nodeTitle + '.' + r.atrText);

      if (firstAtr && restOfAtrs)
        setExportResult(
          (prev) =>
            prev +
            `identify (${firstAtr.schemaTitle}.${firstAtr.nodeTitle}.${firstAtr.atrText},${restOfAtrs}) as ${firstAtr.atrText}; \n`,
        );
    });

    edgeCons.map((con) => {
      const edgeIDs = con.edges.map((e) => e.id);
      const conEdges = edges.filter((e) => edgeIDs.includes(e.id));

      const result: {
        schemaTitle: string;
        nodeTitle: string;
        edgeText: string;
      }[] = [];

      for (const edge of conEdges) {
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
      const firstAtr = result[0];
      const restOfAtrs = result
        .splice(1)
        .map((r) => ' ' + r.schemaTitle + '.' + r.nodeTitle + '.' + r.edgeText);

      if (firstAtr && restOfAtrs)
        setExportResult(
          (prev) =>
            prev +
            `identify (${firstAtr.schemaTitle}.${firstAtr.nodeTitle}.${firstAtr.edgeText},${restOfAtrs}) as ${firstAtr.edgeText}; \n`,
        );
    });
  }, [nodeCons, atrCons, edgeCons]);

  return (
    <ReactCodeMirror
      className='bg-[#F9F9F9] m-auto min-h-4/5 h-auto p-5 rounded-sm border whitespace-pre-wrap'
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
