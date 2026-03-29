'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { edgeConAtom } from '../../GlobalValues';
import { IEdgeConnection } from '../../interface/IConnections';

export const useEdgeCon = () => {
  const [loading, setLoading] = useState(true);
  const [edgeCon, setEdgeCon] = useAtom(edgeConAtom);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Edge connection operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEdgeCon = (ids: number[]) => handleAsync(async () => {
    const res = await fetch('/api/edge-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })

    if (!res.ok) {
      console.log('Failed to create edge connection:', res);
      return;
    }
    const conData: IEdgeConnection = await res.json();
    console.log(`Added edge connection: ${conData.id} between edges ${ids}`);
    setEdgeCon(prev => [...prev, conData]);
  })

  const updateEdgeCon = (conID: number, id: number) => handleAsync(async () => {
    const res = await fetch('/api/edge-connection', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conID, id }),
    })

    if (!res.ok) {
      throw new Error('Failed to update edge connection');
    }

    const conData: IEdgeConnection = await res.json();
    console.log(`Removed edge connection with id: ${conID}`);
    setEdgeCon(prev => prev.map(edgeCon => edgeCon.id === conID ? conData : edgeCon));
  })

  const deleteEdgeCon = (id: number) => handleAsync(async () => {
    const res = await fetch('/api/edge-connection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error('Failed to delete edge connection');
    }
    console.log(`Removed edge connection with id: ${id}`);
    setEdgeCon(prev => prev.filter(edgeCon => edgeCon.id !== id));
  })

  const deleteAllEdgeCons = () => handleAsync(async () => {
    const res = await fetch('/api/edge-connection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      throw new Error('Failed to delete edge connections');
    }
    console.log(`Removed all edge connections`);
    setEdgeCon([]);
  })

  useEffect(() => {
    const fetchEdgeCons = () => handleAsync(async () => {
      const res = await fetch('/api/edge-connection');
      if (!res.ok) {
        throw new Error('Failed to fetch edge connections.');
      }
      const conData: IEdgeConnection[] = await res.json();
      setEdgeCon(conData)
    })
    fetchEdgeCons()
  }, [setEdgeCon])

  return { edgeCon, loading, createEdgeCon, updateEdgeCon, deleteEdgeCon, deleteAllEdgeCons };
};
