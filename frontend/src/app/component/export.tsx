'use client';

import { useAtomValue } from 'jotai';
import {
  atrAtom,
  atrConAtom,
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

  const [exportResult, setExportResult] = useState<string[]>([]);

  useEffect(() => {
    setExportResult([]);

    nodeCons.map((nc) => {
      const srcNode = nodes.find((n) => n.id === nc.srcNodeID);
      const trgtNode = nodes.find((n) => n.id === nc.trgtNodeID);

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

    atrCons.map((ac) => {
      const srcAtr = attributes.find((a) => a.id === ac.srcAtrID);
      const trgtAtr = attributes.find((a) => a.id === ac.trgtAtrID);

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

    multiCons.map((mc) => {
      const nodeIDs = mc.nodes.map((n) => n.id);
      const multiConNodes = nodes.filter((node) => nodeIDs.includes(node.id));

      const multiRes: { schemaTitle: string; nodeTitle: string }[] = [];

      for (const node of multiConNodes) {
        const schema = schemas.find((s) => s.id === node.schemaID);
        if (schema)
          multiRes.push({ schemaTitle: schema?.title, nodeTitle: node.title });
      }

      const firstNode = multiRes[0];
      const restOfNodes = multiRes
        .splice(1)
        .map((r) => ' ' + r.schemaTitle + '.' + r.nodeTitle);

      if (firstNode && restOfNodes)
        setExportResult((prev) => [
          ...prev,
          `identify (${firstNode.schemaTitle}.${firstNode.nodeTitle},${restOfNodes}) as ${firstNode.nodeTitle}; \n `,
        ]);
    });
  }, [nodeCons, atrCons, multiCons]);

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
