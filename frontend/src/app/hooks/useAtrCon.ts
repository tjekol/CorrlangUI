'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { atrConAtom } from '../GlobalValues';
import { IAtrConnection } from '../interface/Connection/IAtrConnection';

export const useAtrCon = () => {
  const [loading, setLoading] = useState(true);
  const [atrCons, setAtrCons] = useAtom(atrConAtom);

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

  const fetchAtrCons = () => handleAsync(async () => {
    const res = await fetch('/api/atrConnection');
    if (!res.ok) {
      throw new Error('Failed to fetch attribute connections.');
    }
    const conData: IAtrConnection[] = await res.json();
    setAtrCons(conData)
  })

  const createAtrCon = (srcAtrID: number, trgtAtrID: number) => handleAsync(async () => {
    const res = await fetch('/api/atrConnection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ srcAtrID, trgtAtrID }),
    })

    if (!res.ok) {
      console.log('Failed to create attribute connections:', res);
      return;
    }
    const edgeData: IAtrConnection = await res.json();
    console.log(`Added attribute connection: ${edgeData.id} between attributes ${srcAtrID}-${trgtAtrID}`);
    setAtrCons(prev => [...prev, edgeData]);
  })

  const deleteAtrCon = (id: number) => handleAsync(async () => {
    const res = await fetch('/api/atrConnection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error('Failed to delete attribute connections');
    }
    console.log(`Removed attribute connections with id: ${id}`);
    setAtrCons(prev => prev.filter(atrCon => atrCon.id !== id));
  })

  const deleteAllAtrCons = () => handleAsync(async () => {
    const res = await fetch('/api/atrConnection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      throw new Error('Failed to delete connections');
    }
    console.log(`Removed all attribute connections`);
    setAtrCons([]);
  })

  useEffect(() => { fetchAtrCons() }, [])

  return { atrCons, loading, createAtrCon, deleteAtrCon, deleteAllAtrCons };
};
