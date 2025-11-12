'use client';

import Node from './node';
import Edge from './edge';
import { useNodes } from '../hooks/useNodes';
import { useEdges } from '../hooks/useEdges';
import { useAttributeEdges } from '../hooks/useAttributeEdges';
import { useEffect, useState } from 'react';
import { handleEdge } from '../handler/handleEdge';
import { handleAttributeEdge } from '../handler/handleAtrEdge';
import { IPendingAtrEdge, IPendingEdge } from '../interface/IStates';
import { useAtom } from 'jotai';
import { liveNodePositionsAtom, nodeColor } from '../GlobalValues';
import { INode } from '../interface/INode';
import { IAttribute } from '../interface/IAttribute';
import { useSchemas } from '../hooks/useSchemas';

export default function Diagram() {
  const { schemas } = useSchemas();
  const { nodes, loading } = useNodes();
  const { edges, createEdge } = useEdges();
  const { attributeEdges, createAttributeEdge } = useAttributeEdges();

  // local state to store first click of node/attribute
  const [pendingEdge, setPendingEdge] = useState<IPendingEdge | null>(null);
  const [pendingAtrEdge, setPendingAtrEdge] = useState<IPendingAtrEdge | null>(
    null
  );
  const [liveNodePositions, setLiveNodePositions] = useAtom(
    liveNodePositionsAtom
  );
  const [layoutLoading, setLayoutLoading] = useState(false);

  const handleHeaderClick = handleEdge(
    edges,
    createEdge,
    pendingEdge,
    setPendingEdge
  );

  const handleAttributeClick = handleAttributeEdge(
    attributeEdges,
    createAttributeEdge,
    pendingAtrEdge,
    setPendingAtrEdge
  );

  useEffect(() => {
    if (nodes.length === 0) return;

    const loadELK = async () => {
      setLayoutLoading(true);
      try {
        const ELK = (await import('elkjs/lib/elk.bundled.js')).default;
        const elk = new ELK();

        const calculateNodeWidth = (node: INode) => {
          const labels = node.attributes.map((attr: IAttribute) => attr.text);
          const maxLength = Math.max(
            node.title.length,
            ...labels.map((l: string) => l.length)
          );
          return Math.max(maxLength * 15, 120);
        };

        const calculateNodeHeight = (node: INode) => {
          const headerHeight = 40;
          const attributeHeight =
            node.attributes.length === 1
              ? headerHeight
              : (headerHeight * node.attributes.length) / 1.4;
          return headerHeight + attributeHeight;
        };

        const children = nodes.map((n) => ({
          id: n.id.toString(),
          width: calculateNodeWidth(n),
          height: calculateNodeHeight(n),
        }));

        const elkEdges: { id: string; sources: string[]; targets: string[] }[] =
          [];

        edges.forEach((edge) => {
          elkEdges.push({
            id: `edgeID-${edge.id}`,
            sources: [edge.srcNodeID.toString()],
            targets: [edge.trgtNodeID.toString()],
          });
        });

        const graph = {
          id: 'root',
          layoutOptions: {
            'elk.algorithm': 'org.eclipse.elk.force',
            'elk.spacing.nodeNode': '60',
            'elk.spacing.edgeNode': '40',
            'elk.force.repulsivePower': '0.5',
            'elk.direction': 'UNDEFINED',
          },
          children,
          edges: elkEdges,
        };

        const layoutedGraph = await elk.layout(graph);
        if (layoutedGraph.children) {
          const newPositions = layoutedGraph.children.map((child) => ({
            nodeID: parseInt(child.id),
            positionX: child.x || 0,
            positionY: child.y || 0,
          }));
          setLiveNodePositions(newPositions);
        }
      } catch (error) {
        console.error('Failed to load ELK:', error);
      } finally {
        setLayoutLoading(false);
      }
    };

    loadELK();
  }, [nodes, edges, setLiveNodePositions]);

  return (
    <div className='border-1 rounded-sm h-150 w-full bg-[#F9F9F9] overflow-hidden'>
      <svg width='100%' height='100%'>
        <defs>
          <marker
            id='arrow'
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
            id='arrow-ih'
            viewBox='0 0 10 10'
            refX='10'
            refY='5'
            markerWidth='6'
            markerHeight='6'
            orient='auto'
          >
            <path stroke='black' fill='white' d='M 0 0 L 10 5 L 0 10 z' />
          </marker>
        </defs>

        <text x={10} y={20}>
          Schemas:
        </text>
        {schemas.map((s, i) => {
          const color = i < nodeColor.length ? nodeColor[i] : nodeColor[0];
          return (
            <text x={100 + i * 80} y={20} key={i} fill={color}>
              {s.title}
            </text>
          );
        })}
        <Edge
          onHeaderClick={handleHeaderClick}
          pendingEdge={pendingEdge}
          pendingAtrEdge={pendingAtrEdge}
        />
        {loading || layoutLoading ? (
          <text x={50} y={50}>
            {loading ? 'Loading nodes...' : 'Calculating layout...'}
          </text>
        ) : (
          nodes.map((n, i) => {
            const livePositions = liveNodePositions.find(
              (pos) => pos.nodeID === n.id
            );

            const schemaIndex = schemas.findIndex((s) => s.id === n.schemaID);
            // default color if schemaIndex fails
            const color =
              schemaIndex >= 0 && schemaIndex < nodeColor.length
                ? nodeColor[schemaIndex]
                : nodeColor[0];

            return (
              <Node
                key={i}
                id={n.id}
                title={n.title}
                attributes={n.attributes}
                positionX={livePositions?.positionX || n.positionX || 0}
                positionY={livePositions?.positionY || n.positionY || 0}
                schemaID={n.schemaID}
                color={color}
                onHeaderClick={handleHeaderClick}
                onAttributeClick={handleAttributeClick}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}
