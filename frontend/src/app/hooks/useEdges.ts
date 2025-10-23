'use client';

import { useEffect, useState } from 'react';
import { IEdge } from '../interface/IEdge';

export const useEdges = () => {
  const [edges, setEdges] = useState<IEdge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEdges() {
      try {
        const res = await fetch('/api/edges');
        if (!res.ok) {
          throw new Error('Failed to fetch edges');
        }
        const edgesData: IEdge[] = await res.json();
        setEdges(edgesData);
      } finally {
        setLoading(false);
      }
    }
    fetchEdges();
  }, []);

  // console.log(nodes)
  // The empty dependency array ensures this runs once when the component mounts.

  return { edges, loading }
}
