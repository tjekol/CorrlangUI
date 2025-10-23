'use client';

import { useEffect, useState } from 'react';
import { INode } from '../interface/INode';

export const useNodes = () => {
  const [nodes, setNodes] = useState<INode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNodes() {
      try {
        const res = await fetch('/api/nodes');
        if (!res.ok) {
          throw new Error('Failed to fetch nodes');
        }
        const nodesData: INode[] = await res.json();
        setNodes(nodesData);
      } finally {
        setLoading(false);
      }
    }
    fetchNodes();
  }, []);

  // console.log(nodes)
  // The empty dependency array ensures this runs once when the component mounts.

  return { nodes, loading }
}
