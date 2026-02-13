'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { edgeConAtom } from '../GlobalValues';
import { IEdgeConnection } from '../interface/Connection/IEdgeConnection';

export const useEdgeCon = () => {
  const [loading, setLoading] = useState(true);
  const [edgeCons, setEdgeCons] = useAtom(edgeConAtom);

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

  const fetchEdgeCons = () => handleAsync(async () => {
    const res = await fetch('/api/edgeConnection');
    if (!res.ok) {
      throw new Error('Failed to fetch edge connections.');
    }
    const conData: IEdgeConnection[] = await res.json();
    setEdgeCons(conData)
  })

  const createEdgeCon = (srcEdgeID: number, trgtEdgeID: number) => handleAsync(async () => {
    const res = await fetch('/api/edgeConnection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ srcEdgeID, trgtEdgeID }),
    })

    if (!res.ok) {
      console.log('Failed to create attribute connections:', res);
      return;
    }
    const conData: IEdgeConnection = await res.json();
    console.log(`Added edge connection: ${conData.id} between edges ${srcEdgeID}-${trgtEdgeID}`);
    setEdgeCons(prev => [...prev, conData]);
  })

  const deleteEdgeCon = (id: number) => handleAsync(async () => {
    const res = await fetch('/api/edgeConnection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error('Failed to delete attribute connections');
    }
    console.log(`Removed attribute connections with id: ${id}`);
    setEdgeCons(prev => prev.filter(edgeCon => edgeCon.id !== id));
  })

  const deleteAllEdgeCons = () => handleAsync(async () => {
    const res = await fetch('/api/edgeConnection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      throw new Error('Failed to delete connections');
    }
    console.log(`Removed all edge connections`);
    setEdgeCons([]);
  })

  useEffect(() => { fetchEdgeCons() }, [])

  return { edgeCons, loading, createEdgeCon, deleteEdgeCon, deleteAllEdgeCons };
};
