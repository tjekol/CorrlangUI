'use client';

import Node from './node';
import Edge from './edge';
import { useNodes } from '../hooks/useNodes';
import { useConnection } from '../hooks/useConnection';
import { useAtrCon } from '../hooks/useAtrCon';
import { useEffect, useState } from 'react';
import { handleConnection } from '../handler/handleConnection';
import { handleMultiConUpd } from '../handler/handleMultiConUpd';
import { handleAtrCon } from '../handler/handleAtrCon';
import { IPendingAtrCon, IPendingCon } from '../interface/IStates';
import { useAtom } from 'jotai';
import { liveNodePositionsAtom, nodeColor } from '../GlobalValues';
import { INode } from '../interface/INode';
import { IAttribute } from '../interface/IAttribute';
import { useSchemas } from '../hooks/useSchemas';
import { handleMultiCon } from '../handler/handleMultiCon';
import { useMultiCon } from '../hooks/useMultiCon';
import { useEdges } from '../hooks/useEdges';
import Connection from './connection';

export default function Diagram() {
  const { schemas } = useSchemas();
  const { nodes, loading } = useNodes();
  const { edges, edgeLoading } = useEdges();
  const { cons, createCon } = useConnection();
  const { multiCons, createMultiCon, updateMultiCon } = useMultiCon();
  const { atrCons, createAtrCon } = useAtrCon();

  // local state to store first click of node/attribute
  const [pendingCon, setPendingCon] = useState<IPendingCon | null>(null);
  const [pendingAtrCon, setPendingAtrCon] = useState<IPendingAtrCon | null>(
    null,
  );
  const [liveNodePositions, setLiveNodePositions] = useAtom(
    liveNodePositionsAtom,
  );
  const [layoutLoading, setLayoutLoading] = useState(false);

  const handleHeaderClick = handleConnection(
    cons,
    createCon,
    pendingCon,
    setPendingCon,
  );

  const handleConClick = handleMultiCon(
    createMultiCon,
    pendingCon,
    setPendingCon,
  );

  const handleMultiClick = handleMultiConUpd(
    updateMultiCon,
    pendingCon,
    setPendingCon,
  );

  const handleAttributeClick = handleAtrCon(
    atrCons,
    createAtrCon,
    pendingAtrCon,
    setPendingAtrCon,
  );

  useEffect(() => {
    if (!nodes || nodes.length === 0) return;

    const loadELK = async () => {
      setLayoutLoading(true);
      try {
        const ELK = (await import('elkjs/lib/elk.bundled.js')).default;
        const elk = new ELK();

        const calculateNodeWidth = (node: INode) => {
          const labels = node.attributes.map((attr: IAttribute) => attr.text);
          const maxLength = Math.max(
            node.title.length,
            ...labels.map((l: string) => l.length),
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

        cons.forEach((con) => {
          elkEdges.push({
            id: `edgeID-0${con.id}`,
            sources: [con.srcNodeID.toString()],
            targets: [con.trgtNodeID.toString()],
          });
        });

        multiCons.forEach((multiCon) => {
          const nodes = multiCon.nodes;
          if (nodes) {
            nodes.map((node, index) => {
              elkEdges.push({
                id: `edgeID-${multiCon.id}${index}`,
                sources: [node.id.toString()],
                targets: [
                  index >= nodes.length - 1
                    ? nodes[0].id.toString()
                    : nodes[index + 1].id.toString(),
                ],
              });
            });
          }
        });

        const graph = {
          id: 'root',
          layoutOptions: {
            'elk.algorithm': 'org.eclipse.elk.force',
            'elk.spacing.nodeNode': '80',
          },
          children,
          edges: elkEdges,
        };

        const layoutedGraph = await elk.layout(graph);
        if (layoutedGraph.children) {
          const newPositions = layoutedGraph.children.map((child) => ({
            nodeID: parseInt(child.id),
            positionX: child.x || 0,
            positionY: (child.y || 0) + 20,
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
  }, [nodes, cons, edges, multiCons, setLiveNodePositions]);

  return (
    <div className='border rounded-sm h-screen w-full bg-[#F9F9F9] overflow-hidden'>
      <svg width='100%' height='100%'>
        <defs>
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
            <path stroke='black' fill='none' d='M 0 0 L 10 5 L 0 10' />
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

          <marker
            id='diamond'
            viewBox='0 0 20 20'
            refX='7'
            refY='10'
            markerWidth='8'
            markerHeight='15'
          >
            <path
              stroke='black'
              fill='black'
              d='M 7 0 L 14 10 L 7 20 L 0 10 Z'
            />
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
        <Edge />
        <Connection
          onConClick={handleConClick}
          onMultiConClick={handleMultiClick}
          pendingCon={pendingCon}
          pendingAtrCon={pendingAtrCon}
        />
        {loading || edgeLoading || layoutLoading ? (
          <text x={50} y={50}>
            {loading ? 'Loading...' : 'Calculating layout...'}
          </text>
        ) : (
          nodes.map((n, i) => {
            const livePositions = liveNodePositions.find(
              (pos) => pos.nodeID === n.id,
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
