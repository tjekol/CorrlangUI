'use client';

import { useEffect, useState } from 'react';
import { INode } from '../interface/INode';
import { useAtom } from 'jotai';
import { nodeAtom } from '../GlobalValues';

export const useNodes = () => {
  const [nodes, setNodes] = useAtom(nodeAtom)
  const [loading, setLoading] = useState(true);

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

  const fetchNodes = () => handleAsync(async () => {
    const res = await fetch('/api/nodes');
    if (!res.ok) {
      throw new Error('Failed to fetch nodes');
    }
    const nodesData: INode[] = await res.json();
    setNodes(nodesData);
  })

  useEffect(() => { fetchNodes(); }, []);

  return { nodes, loading }
}
