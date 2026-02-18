'use client';

import { useAtomValue } from 'jotai';
import {
  atrAtom,
  atrConAtom,
  atrMultiConAtom,
  multiConAtom,
  nodeAtom,
  nodeConAtom,
  schemaAtom,
} from '../GlobalValues';
import { useEffect, useState } from 'react';

export default function Export() {
  const schemas = useAtomValue(schemaAtom);
  const nodes = useAtomValue(nodeAtom);
  const attributes = useAtomValue(atrAtom);
  const nodeCons = useAtomValue(nodeConAtom);
  const atrCons = useAtomValue(atrConAtom);
  const multiCons = useAtomValue(multiConAtom);
  const atrMultiCons = useAtomValue(atrMultiConAtom);

  const [exportResult, setExportResult] = useState<string[]>([]);

  useEffect(() => {
    setExportResult([]);

    nodeCons.map((con) => {
      const srcNode = nodes.find((n) => n.id === con.srcNodeID);
      const trgtNode = nodes.find((n) => n.id === con.trgtNodeID);

      if (srcNode && trgtNode) {
        const srcSchema = schemas.find((s) => s.id === srcNode.schemaID);
        const trgtSchema = schemas.find((s) => s.id === trgtNode.schemaID);

        if (srcSchema && trgtSchema)
          setExportResult((prev) => [
            ...prev,
            `identify (${srcSchema.title}.${srcNode.title}, ${trgtSchema.title}.${trgtNode.title}) as ${srcNode.title}; \n`,
          ]);
      }
    });

    atrCons.map((con) => {
      const srcAtr = attributes.find((a) => a.id === con.srcAtrID);
      const trgtAtr = attributes.find((a) => a.id === con.trgtAtrID);

      if (srcAtr && trgtAtr) {
        const srcNode = nodes.find((n) => n.id === srcAtr.nodeID);
        const trgtNode = nodes.find((n) => n.id === trgtAtr.nodeID);

        if (srcNode && trgtNode) {
          const srcSchema = schemas.find((s) => s.id === srcNode.schemaID);
          const trgtSchema = schemas.find((s) => s.id === trgtNode.schemaID);

          if (srcSchema && trgtSchema)
            setExportResult((prev) => [
              ...prev,
              `identify (${srcSchema.title}.${srcNode.title}.${srcAtr.text}, ${trgtSchema.title}.${trgtNode.title}.${trgtAtr.text}) as ${srcAtr.text}; \n`,
            ]);
        }
      }
    });

    multiCons.map((con) => {
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
        setExportResult((prev) => [
          ...prev,
          `identify (${firstNode.schemaTitle}.${firstNode.nodeTitle},${restOfNodes}) as ${firstNode.nodeTitle}; \n`,
        ]);
    });

    atrMultiCons.map((con) => {
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
        .map((r) => ' ' + r.schemaTitle + '.' + r.nodeTitle + ' ' + r.atrText);

      if (firstAtr && restOfAtrs)
        setExportResult((prev) => [
          ...prev,
          `identify (${firstAtr.schemaTitle}.${firstAtr.nodeTitle}.${firstAtr.atrText},${restOfAtrs}) as ${firstAtr.atrText}; \n`,
        ]);
    });
  }, [nodeCons, atrCons, multiCons, atrMultiCons]);

  return (
    <p className='bg-[#F9F9F9] m-auto h-full p-5 rounded-sm border whitespace-pre-wrap'>
      {exportResult.length > 0
        ? exportResult.map((res) => {
            return res;
          })
        : 'Create connections between nodes and attributes…'}
    </p>
  );
}
