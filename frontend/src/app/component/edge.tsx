'use client';

import { useAtomValue } from 'jotai';
import { edgeAtom, nodeAtom } from '../GlobalValues';
import { useCalculation } from '../hooks/useCalculation';
import { INode } from '../interface/INode';
import { EdgeType } from '../interface/IEdge';

export default function Edge() {
  const nodes = useAtomValue(nodeAtom);
  const edges = useAtomValue(edgeAtom);

  const { getNodePosition, getArrowData } = useCalculation();

  const getNodes = (
    edgeID: number,
  ):
    | { srcNode: INode | undefined; trgtNode: INode | undefined }
    | undefined => {
    const edge = edges.find((edge) => edge.id === edgeID);
    if (edge)
      return {
        srcNode: nodes.find((n) => n.id === edge.srcNodeID),
        trgtNode: nodes.find((n) => n.id === edge.trgtNodeID),
      };
  };

  return (
    <>
      {edges.map((edge) => {
        const edgeID = edge.id;
        const nodes = getNodes(edgeID);

        if (nodes) {
          const { srcNode, trgtNode } = nodes;
          if (srcNode && trgtNode) {
            const pos1 = getNodePosition(srcNode.id);
            const pos2 = getNodePosition(trgtNode.id);
            if (pos1 && pos2) {
              // nodes under same schema
              if (srcNode.schemaID === trgtNode.schemaID) {
                // offset for diamond
                const pos1Comp = { x: pos1.x, y: pos1.y + 8 };
                const compData = getArrowData(
                  pos1Comp,
                  pos2,
                  srcNode,
                  trgtNode,
                );
                const arrowData = getArrowData(pos1, pos2, srcNode, trgtNode);
                const padding = 20;
                return (
                  <g key={edgeID}>
                    <path
                      d={
                        edge.type === EdgeType.comp
                          ? `M ${compData.pos1X} ${compData.pos1Y} L ${compData.pos2X} ${compData.pos2Y}`
                          : `M ${arrowData.pos1X} ${arrowData.pos1Y} L ${arrowData.pos2X} ${arrowData.pos2Y}`
                      }
                      strokeWidth={2}
                      stroke='black'
                      markerStart={
                        edge.type === EdgeType.comp ? 'url(#diamond)' : ''
                      }
                      markerEnd={`${
                        edge.type === EdgeType.assoc
                          ? 'url(#line)'
                          : edge.type === EdgeType.direct ||
                              edge.type === EdgeType.comp
                            ? 'url(#arrow-dir)'
                            : edge.type === EdgeType.inherit
                              ? 'url(#arrow-ih)'
                              : ''
                      }`}
                    />

                    {/* multiplicities */}
                    <text
                      x={
                        edge.type === EdgeType.comp
                          ? compData.pos1X + padding
                          : arrowData.pos1X + padding
                      }
                      y={arrowData.pos1Y + padding}
                      textAnchor='middle'
                      dominantBaseline='middle'
                      pointerEvents='none'
                    >
                      {edge.srcMul}
                    </text>
                    {/* TODO: Fix Y value accuracy */}
                    <text
                      x={arrowData.pos2X + padding}
                      y={
                        arrowData.pos1Y < arrowData.pos2Y
                          ? arrowData.pos2Y - padding
                          : arrowData.pos2Y + padding
                      }
                      textAnchor='middle'
                      dominantBaseline='middle'
                      pointerEvents='none'
                    >
                      {edge.trgtMul}
                    </text>
                  </g>
                );
              }
            }
          }
        }
        return null;
      })}
    </>
  );
}
