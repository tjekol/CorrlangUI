'use client';

import { useAtomValue } from 'jotai';
import { nodeAtom } from '../GlobalValues';
import { useCalculation } from '../hooks/useCalculation';
import { INode } from '../interface/INode';
import { EdgeType, IEdge } from '../interface/IEdge';

export default function Edge({ edges }: { edges: IEdge[] }) {
  const nodes = useAtomValue(nodeAtom);
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
                const refPadding = 30;
                const mulPadding = 20;
                return (
                  <g key={edgeID}>
                    <defs>
                      {/* Arrows for edges */}
                      <marker
                        id='line'
                        viewBox='0 0 10 10'
                        refX='10'
                        refY='5'
                        markerWidth='6'
                        markerHeight='6'
                        orient='auto'
                      >
                        <path d='M 0 0 L 10 5 L 0 10 z' />
                      </marker>

                      <marker
                        id='arrow-dir'
                        viewBox='0 0 10 10'
                        refX='10'
                        refY='5'
                        markerWidth='8'
                        markerHeight='6'
                        orient='auto'
                      >
                        <path
                          stroke='black'
                          fill='none'
                          d='M 0 0 L 10 5 L 0 10'
                        />
                      </marker>

                      <marker
                        id='arrow-ih'
                        viewBox='0 0 10 10'
                        refX='10'
                        refY='5'
                        markerWidth='6'
                        markerHeight='6'
                        orient='auto'
                      >
                        <path
                          stroke='black'
                          fill='white'
                          d='M 0 0 L 10 5 L 0 10 z'
                        />
                      </marker>
                    </defs>
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

                    {/* Reference name */}
                    <text
                      x={
                        arrowData.pos1X < arrowData.pos2X
                          ? (arrowData.pos1X + arrowData.pos2X) / 2 - refPadding
                          : (arrowData.pos1X + arrowData.pos2X) / 2 + refPadding
                      }
                      y={
                        arrowData.pos1Y < arrowData.pos2Y
                          ? (arrowData.pos1Y + arrowData.pos2Y) / 2 - refPadding
                          : (arrowData.pos1Y + arrowData.pos2Y) / 2 + refPadding
                      }
                      textAnchor='middle'
                      dominantBaseline='middle'
                    >
                      {edge.refName}
                    </text>

                    {/* multiplicities */}
                    <text
                      x={
                        edge.type === EdgeType.comp
                          ? compData.pos1X + mulPadding
                          : arrowData.pos1X < pos2.x
                            ? arrowData.pos1X + mulPadding
                            : arrowData.pos1X - mulPadding
                      }
                      y={
                        arrowData.pos1Y > pos1.y
                          ? arrowData.pos1Y + mulPadding
                          : arrowData.pos1Y - mulPadding
                      }
                      textAnchor='middle'
                      dominantBaseline='middle'
                      pointerEvents='none'
                    >
                      {edge.lowerBound}...
                      {edge.upperBound === 0 ? '*' : edge.upperBound}
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
