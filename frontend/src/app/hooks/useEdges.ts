'use client';

import { useEffect, useState } from 'react';
import { IEdge } from '../interface/IEdge';
import { useAtom } from 'jotai';
import { edgeAtom } from '../GlobalValues';

export const useEdges = () => {
  const [loading, setLoading] = useState(true);
  const [edges, setEdges] = useAtom(edgeAtom);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Node operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEdges = () => handleAsync(async () => {
    const res = await fetch('/api/edges');
    if (!res.ok) {
      throw new Error('Failed to fetch edges');
    }
    const edgesData: IEdge[] = await res.json();
    setEdges(edgesData)
  })

  const createEdge = (edgeID: number, nodeID: number, positionX: number, positionY: number, isAttributeNode: boolean) => handleAsync(async () => {
    const res = await fetch('/api/edges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ edgeID, nodeID, positionX, positionY, isAttributeNode }),
    })

    if (!res.ok) {
      console.log('Failed to create edge:', res);
      return;
    }
    const edgeData: IEdge = await res.json();
    console.log(`Added edge: ${edgeID} from node ${nodeID}`);
    setEdges(prev => [...prev, edgeData]);
  })

  const deleteEdges = (id: number) => handleAsync(async () => {
    const res = await fetch('/api/edges', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error('Failed to delete edges');
    }
    console.log(`Removed edges with id: ${id}`);
    setEdges(prev => prev.filter(edge => edge.edgeID !== id));
  })

  useEffect(() => { fetchEdges() }, [])

  return { edges, loading, createEdge, deleteEdges };
};
