'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import Action from './action';
import Connection from './connection';
import { ICorrespondence } from '../interface/ICorrespondence';
import { IAction } from '../interface/IAction';
import { useSchemas } from '../hooks/useSchemas';
import { useAction } from '../hooks/useAction';
import { useMethod } from '../hooks/useMethod';
import { useCalculation } from '../hooks/useCalculation';
import { useActionCon } from '../hooks/connection/useActionCon';
import { IPendingAtrCon, IPendingNodeCon } from '../interface/IStates';
import { useAtom, useAtomValue } from 'jotai';
import {
  liveActionPositionsAtom,
  midActionConAtom,
  midMethodConAtom,
  nodeColor,
} from '../GlobalValues';
import {
  handleActionConCreate,
  handleActionConUpdate,
} from '../handler/handleActionCon';
import { useMethodCon } from '../hooks/connection/useMethodCon';
import {
  handleMethodConCreate,
  handleMethodConUpdate,
} from '../handler/handleMethodCon';

export default function ActionDiagram({ cor }: { cor: ICorrespondence }) {
  const { schemas, refetchSchemas } = useSchemas();
  const { actions, loading, refetchActions } = useAction();
  const { methods, methodLoading, refetchMethods } = useMethod();
  const { actionCon, createActionCon, updateActionCon, deleteActionCon } =
    useActionCon();
  const { methodCon, createMethodCon, updateMethodCon, deleteMethodCon } =
    useMethodCon();
  const { calculateNodeLength } = useCalculation();
  const midActionCon = useAtomValue(midActionConAtom);
  const midMethodCon = useAtomValue(midMethodConAtom);

  // local state to store first click of node/attribute
  const [pendingNodeCon, setPendingNodeCon] = useState<IPendingNodeCon | null>(
    null,
  );
  const [pendingAtrCon, setPendingAtrCon] = useState<IPendingAtrCon | null>(
    null,
  );

  const [liveNodePositions, setLiveNodePositions] = useAtom(
    liveActionPositionsAtom,
  );
  const [layoutLoading, setLayoutLoading] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const handleNodeClick = handleActionConCreate(
    actionCon,
    createActionCon,
    pendingNodeCon,
    setPendingNodeCon,
  );

  const handleMethodClick = handleMethodConCreate(
    methodCon,
    createMethodCon,
    pendingAtrCon,
    setPendingAtrCon,
  );

  const handleNodeConClick = handleActionConUpdate(
    updateActionCon,
    pendingNodeCon,
    setPendingNodeCon,
  );

  const handleMethodConClick = handleMethodConUpdate(
    updateMethodCon,
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
      await refetchActions();
      console.log('✅ Actions done');
      await refetchMethods();
      console.log('✅ Methods done');
    };

    fetchSequentially();
  }, []);

  // Creates layout with chosen correspondences only
  const filteredSchemas = useMemo(() => {
    if (!schemas) return [];
    return schemas.filter((s) => cor.schemaIDs.includes(s.id));
  }, [schemas]);

  const nodesWithAttributes = useMemo(() => {
    if (!actions || !methods) return [];
    const filteredNodes = actions.filter((n) =>
      filteredSchemas.map((s) => s.id).includes(n.schemaID),
    );

    return filteredNodes.map((action) => ({
      ...action,
      methods: methods.filter((attr) => attr.actionID === action.id),
    }));
  }, [actions, methods]);

  useEffect(() => {
    if (
      !nodesWithAttributes ||
      nodesWithAttributes.length === 0 ||
      methodLoading ||
      !methods
    )
      return;

    const loadELK = async () => {
      setLayoutLoading(true);
      try {
        const ELK = (await import('elkjs/lib/elk.bundled.js')).default;
        const elk = new ELK();

        const calculateNodeWidth = (node: IAction) => {
          const width = calculateNodeLength(node.methods, node.name);
          return Math.max(width, 100);
        };

        const calculateNodeHeight = (node: IAction) => {
          const headerHeight = 40;
          const attributeHeight =
            node.methods.length === 1
              ? headerHeight
              : (headerHeight * node.methods.length) / 1.4;
          return headerHeight + attributeHeight;
        };

        const children = nodesWithAttributes.map((n) => ({
          id: n.id.toString(),
          width: calculateNodeWidth(n),
          height: calculateNodeHeight(n),
        }));

        const elkEdges: { id: string; sources: string[]; targets: string[] }[] =
          [];

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
    methods,
    methodLoading,
    setLiveNodePositions,
  ]);

  return (
    <div className='border rounded-sm h-screen w-full bg-[#F9F9F9] overflow-auto'>
      <svg
        ref={svgRef}
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
        <Connection
          conType={1}
          cons={actionCon}
          onConClick={handleNodeConClick}
          deleteCon={deleteActionCon}
          deleteChildCon={deleteMethodCon}
          pendingCon={pendingNodeCon}
          midCon={midActionCon}
          onChildConClick={handleMethodConClick}
          pendingChildCon={pendingAtrCon}
          childCons={methodCon}
          midChildCon={midMethodCon}
          svgRef={svgRef}
        />
        {loading || layoutLoading || methodLoading ? (
          <text x={50} y={50}>
            {loading || methodLoading ? 'Loading...' : 'Calculating layout...'}
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
              <Action
                key={i}
                id={n.id}
                name={n.name}
                methods={n.methods}
                positionX={livePositions?.positionX || n.positionX || 0}
                positionY={livePositions?.positionY || n.positionY || 0}
                schemaID={n.schemaID}
                color={color}
                onNodeClick={handleNodeClick}
                onAttributeClick={handleMethodClick}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}
