'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { attrEdgeAtom } from '../GlobalValues';
import { IAttributeEdge } from '../interface/IAttributeEdge';

export const useAttributeEdges = () => {
  const [loading, setLoading] = useState(true);
  const [attributeEdges, setAttributeEdges] = useAtom(attrEdgeAtom);

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

  const fetchAttributeEdges = () => handleAsync(async () => {
    const res = await fetch('/api/attributeEdges');
    if (!res.ok) {
      throw new Error('Failed to fetch edges');
    }
    const edgesData: IAttributeEdge[] = await res.json();
    setAttributeEdges(edgesData)
  })

  const createAttributeEdge = (attributeEdgeID: number, attributeID: number) => handleAsync(async () => {
    const res = await fetch('/api/attributeEdges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attributeEdgeID, attributeID }),
    })

    if (!res.ok) {
      console.log('Failed to create attribute edge:', res);
      return;
    }
    const edgeData: IAttributeEdge = await res.json();
    console.log(`Added attribute edge: ${attributeEdgeID} from attribute ${attributeID}`);
    setAttributeEdges(prev => [...prev, edgeData]);
  })

  const deleteAttributeEdges = (id: number) => handleAsync(async () => {
    const res = await fetch('/api/attributeEdges', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error('Failed to delete edges');
    }
    console.log(`Removed edges with id: ${id}`);
    setAttributeEdges(prev => prev.filter(edge => edge.attributeEdgeID !== id));
  })

  useEffect(() => { fetchAttributeEdges() }, [])

  return { attributeEdges, loading, createAttributeEdge, deleteAttributeEdges };
};
