'use client';

import Node from './node';
import Edge from './edge';
import { useNodes } from '../hooks/useNodes';
import { useConnection } from '../hooks/useConnection';
import { useAtrCon } from '../hooks/useAtrCon';
import { useEffect, useState, useMemo } from 'react';
import { handleConnection } from '../handler/handleConnection';
import { handleAtrCon } from '../handler/handleAtrCon';
import {
  IPendingAtrCon,
  IPendingCon,
  IPendingEdgeCon,
} from '../interface/IStates';
import { useAtom } from 'jotai';
import { liveNodePositionsAtom, nodeColor } from '../GlobalValues';
import { INode } from '../interface/INode';
import { useSchemas } from '../hooks/useSchemas';
import {
  handleMultiConCreate,
  handleMultiConUpdate,
} from '../handler/handleMultiCon';
import { useMultiCon } from '../hooks/useMultiCon';
import { useEdges } from '../hooks/useEdges';
import Connection from './connection';
import { useCalculation } from '../hooks/useCalculation';
import { useAttributes } from '../hooks/useAttributes';
import { ICorrespondence } from '../interface/ICorrespondence';
import { useEdgeCon } from '../hooks/useEdgeCon';
import { handleEdgeCon } from '../handler/handleEdgeCon';
import {
  handleAtrMultiConCreate,
  handleAtrMultiConUpdate,
} from '../handler/handleAtrMultiCon';
import { useAtrMultiCon } from '../hooks/useAtrMultiCon';

export default function Diagram({ cor }: { cor: ICorrespondence }) {
  const { schemas, refetchSchemas } = useSchemas();
  const { nodes, loading, refetchNodes } = useNodes();
  const { attributes, atrLoading, refetchAttributes } = useAttributes();
  const { edges, edgeLoading, refetchEdges } = useEdges();
  const { cons, createCon } = useConnection();
  const { createMultiCon, updateMultiCon } = useMultiCon();
  const { atrCons, createAtrCon } = useAtrCon();
  const { createAtrMultiCon, updateAtrMultiCon } = useAtrMultiCon();
  const { edgeCons, createEdgeCon } = useEdgeCon();
  const { calculateNodeLength } = useCalculation();

  // local state to store first click of node/attribute
  const [pendingCon, setPendingCon] = useState<IPendingCon | null>(null);
  const [pendingAtrCon, setPendingAtrCon] = useState<IPendingAtrCon | null>(
    null,
  );
  const [pendingEdgeCon, setPendingEdgeCon] = useState<IPendingEdgeCon | null>(
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

  const handleEdgeClick = handleEdgeCon(
    edgeCons,
    createEdgeCon,
    pendingEdgeCon,
    setPendingEdgeCon,
  );

  const handleConClick = handleMultiConCreate(
    createMultiCon,
    pendingCon,
    setPendingCon,
  );

  const handleMultiClick = handleMultiConUpdate(
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

  const handleAtrConClick = handleAtrMultiConCreate(
    createAtrMultiCon,
    pendingAtrCon,
    setPendingAtrCon,
  );

  const onAtrMultiConClick = handleAtrMultiConUpdate(
    updateAtrMultiCon,
    pendingAtrCon,
    setPendingAtrCon,
  );

  const [diagramDimensions, setDiagramDimensions] = useState({
    width: 800,
    height: 600,
  });

  useEffect(() => {
    const fetchSequentially = async () => {
      console.log('🔄 Starting sequential fetch...');
      await refetchSchemas();
      console.log('✅ Schemas done');
      await refetchNodes();
      console.log('✅ Nodes done');
      await refetchAttributes();
      console.log('✅ Attributes done');
      await refetchEdges();
      console.log('✅ Edges done');
    };

    fetchSequentially();
  }, []);

  // Creates layout with chosen correspondences only
  const filteredSchemas = useMemo(() => {
    if (!schemas) return [];
    return schemas.filter((s) => cor.schemaIDs.includes(s.id));
  }, [schemas]);

  const nodesWithAttributes = useMemo(() => {
    if (!nodes || !attributes) return [];
    const filteredNodes = nodes.filter((n) =>
      filteredSchemas.map((s) => s.id).includes(n.schemaID),
    );
    return filteredNodes.map((node) => ({
      ...node,
      attributes: attributes.filter((attr) => attr.nodeID === node.id),
    }));
  }, [nodes, attributes]);

  const filteredEdges = useMemo(() => {
    if (!edges) return [];
    return edges.filter((e) =>
      nodesWithAttributes.some(
        (n) => n.id === e.srcNodeID || n.id === e.trgtNodeID,
      ),
    );
  }, [edges]);

  useEffect(() => {
    if (
      !nodesWithAttributes ||
      nodesWithAttributes.length === 0 ||
      atrLoading ||
      !attributes
    )
      return;

    const loadELK = async () => {
      setLayoutLoading(true);
      try {
        const ELK = (await import('elkjs/lib/elk.bundled.js')).default;
        const elk = new ELK();

        const calculateNodeWidth = (node: INode) => {
          const width = calculateNodeLength(node.attributes, node.title);
          return Math.max(width, 100);
        };

        const calculateNodeHeight = (node: INode) => {
          const headerHeight = 40;
          const attributeHeight =
            node.attributes.length === 1
              ? headerHeight
              : (headerHeight * node.attributes.length) / 1.4;
          return headerHeight + attributeHeight;
        };

        const children = nodesWithAttributes.map((n) => ({
          id: n.id.toString(),
          width: calculateNodeWidth(n),
          height: calculateNodeHeight(n),
        }));

        const elkEdges: { id: string; sources: string[]; targets: string[] }[] =
          [];

        filteredEdges.forEach((edge) => {
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
            'elk.spacing.nodeNode': '40',
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

          // dynamic dimensions based on node positions and sizes
          if (newPositions.length > 0) {
            const maxX = Math.max(
              ...newPositions.map((pos, index) => {
                const node = nodesWithAttributes.find(
                  (n) => n.id === pos.nodeID,
                );
                return pos.positionX + (node ? calculateNodeWidth(node) : 120);
              }),
            );
            const maxY = Math.max(
              ...newPositions.map((pos, index) => {
                const node = nodesWithAttributes.find(
                  (n) => n.id === pos.nodeID,
                );
                return pos.positionY + (node ? calculateNodeHeight(node) : 80);
              }),
            );

            const minWidth = 800;
            const minHeight = 600;
            setDiagramDimensions({
              width: Math.max(maxX + 100, minWidth), // 100px padding
              height: Math.max(maxY + 100, minHeight), // 100px padding
            });
          }
        }
      } catch (error) {
        console.error('Failed to load ELK:', error);
      } finally {
        setLayoutLoading(false);
      }
    };

    loadELK();
  }, [
    filteredSchemas,
    nodesWithAttributes,
    filteredEdges,
    attributes,
    setLiveNodePositions,
    atrLoading,
  ]);

  return (
    <div className='border rounded-sm h-screen w-full bg-[#F9F9F9] overflow-auto'>
      <svg
        width={diagramDimensions.width}
        height={diagramDimensions.height}
        overflow='visible'
        className='min-w-full'
      >
        <defs>
          {/* Diamond */}
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
        {filteredSchemas.map((s, i) => {
          const color = i < nodeColor.length ? nodeColor[i] : nodeColor[0];
          return (
            <text x={100 + i * 80} y={20} key={i} fill={color}>
              {s.title}
            </text>
          );
        })}
        <Connection
          onConClick={handleConClick}
          onMultiConClick={handleMultiClick}
          onAtrConClick={handleAtrConClick}
          onAtrMultiConClick={onAtrMultiConClick}
          pendingCon={pendingCon}
          pendingAtrCon={pendingAtrCon}
          pendingEdgeCon={pendingEdgeCon}
        />
        <Edge onEdgeClick={handleEdgeClick} edges={filteredEdges} />
        {loading || edgeLoading || layoutLoading || atrLoading ? (
          <text x={50} y={50}>
            {loading || atrLoading ? 'Loading...' : 'Calculating layout...'}
          </text>
        ) : (
          nodesWithAttributes.map((n, i) => {
            const livePositions = liveNodePositions.find(
              (pos) => pos.nodeID === n.id,
            );

            const schemaIndex = filteredSchemas.findIndex(
              (s) => s.id === n.schemaID,
            );
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
