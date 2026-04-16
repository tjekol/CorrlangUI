'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import Action from './action';
import Connection from './connection';
import { ICorrespondence } from '@/app/interface/ICorrespondence';
import { useSchemas } from '@/app/hooks/useSchemas';
import { useAction } from '@/app/hooks/useAction';
import { useMethod } from '@/app/hooks/useMethod';
import { useActionCon } from '@/app/hooks/connection/useActionCon';
import { IPendingCon } from '@/app/interface/IStates';
import {
  liveActionPositionsAtom,
  midActionConAtom,
  midMethodConAtom,
  nodeColor,
} from '@/app/GlobalValues';
import {
  handleActionConCreate,
  handleActionConUpdate,
} from '../handler/handleActionCon';
import { useMethodCon } from '@/app/hooks/connection/useMethodCon';
import {
  HandleMethodConCreate,
  HandleMethodConUpdate,
} from '@/app/handler/handleMethodCon';
import { useCalculation } from '../hooks/useCalculation';

export default function ActionDiagram({ cor }: { cor: ICorrespondence }) {
  const { schemas, refetchSchemas } = useSchemas();
  const { actions, loading, refetchActions } = useAction();
  const { methods, methodLoading, refetchMethods } = useMethod();
  const { actionCon, createActionCon, updateActionCon, deleteActionCon } =
    useActionCon();
  const { methodCon, createMethodCon, updateMethodCon, deleteMethodCon } =
    useMethodCon();
  const { calculateNodeWidth, calculateNodeHeight } = useCalculation();
  const midActionCon = useAtomValue(midActionConAtom);
  const midMethodCon = useAtomValue(midMethodConAtom);
  const [liveNodePositions, setLiveNodePositions] = useAtom(
    liveActionPositionsAtom,
  );
  const [diagramDimensions, setDiagramDimensions] = useState({
    width: 800,
    height: 600,
  });
  const [layoutLoading, setLayoutLoading] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // local state to store first click of node/attribute
  const [pendingNodeCon, setPendingNodeCon] = useState<IPendingCon | null>(
    null,
  );
  const [pendingAtrCon, setPendingAtrCon] = useState<IPendingCon | null>(null);

  const handleNodeClick = handleActionConCreate(
    actionCon,
    createActionCon,
    pendingNodeCon,
    setPendingNodeCon,
  );

  const handleMethodClick = HandleMethodConCreate(
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

  const handleMethodConClick = HandleMethodConUpdate(
    updateMethodCon,
    pendingAtrCon,
    setPendingAtrCon,
  );

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
  }, [schemas, cor.schemaIDs]);

  const actionWithMethods = useMemo(() => {
    if (!actions || !methods) return [];
    const filteredActions = actions.filter((n) =>
      filteredSchemas.map((s) => s.id).includes(n.schemaID),
    );

    return filteredActions.map((action) => ({
      ...action,
      methods: methods.filter((attr) => attr.actionID === action.id),
    }));
  }, [actions, methods, filteredSchemas]);

  useEffect(() => {
    if (
      !actionWithMethods ||
      actionWithMethods.length === 0 ||
      methodLoading ||
      !methods
    )
      return;
    const loadELK = async () => {
      setLayoutLoading(true);
      try {
        const ELK = (await import('elkjs/lib/elk.bundled.js')).default;
        const elk = new ELK();

        const elkEdges: { id: string; sources: string[]; targets: string[] }[] =
          [];

        const children = actionWithMethods.map((n) => ({
          id: n.id.toString(),
          width: calculateNodeWidth(n),
          height: calculateNodeHeight(n),
        }));

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
            id: parseInt(child.id),
            positionX: child.x || 0,
            positionY: (child.y || 0) + 20,
          }));
          setLiveNodePositions(newPositions);

          // dynamic dimensions based on node positions and sizes
          if (newPositions.length > 0) {
            const maxX = Math.max(
              ...newPositions.map((pos) => {
                const node = actionWithMethods.find((n) => n.id === pos.id);
                return pos.positionX + (node ? calculateNodeWidth(node) : 120);
              }),
            );
            const maxY = Math.max(
              ...newPositions.map((pos) => {
                const node = actionWithMethods.find((n) => n.id === pos.id);
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
    actionWithMethods,
    methods,
    methodLoading,
    setLiveNodePositions,
  ]);

  if (actionWithMethods.length < 1) {
    return (
      <div className='bg-[#F9F9F9] h-screen rounded-sm border p-4'>
        The correspondence has no actions.
      </div>
    );
  }

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
          actionWithMethods.map((n, i) => {
            const livePositions = liveNodePositions.find(
              (pos) => pos.id === n.id,
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
