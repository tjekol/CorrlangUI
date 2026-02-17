'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { atrMultiConAtom } from '../GlobalValues';
import { IAtrMultiConnection } from '../interface/IConnections';

export const useAtrMultiCon = () => {
  const [loading, setLoading] = useState(true);
  const [atrMultiCons, setMultiCons] = useAtom(atrMultiConAtom);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Multi attribute connection operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAtrMultiCons = () => handleAsync(async () => {
    const res = await fetch('/api/atrMultiConnection');
    if (!res.ok) {
      throw new Error('Failed to fetch attribute multi connections');
    }
    const conData: IAtrMultiConnection[] = await res.json();
    setMultiCons(conData)
  })

  const createAtrMultiCon = (atrIDs: number[]) => handleAsync(async () => {
    const res = await fetch('/api/atrMultiConnection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ atrIDs }),
    })

    if (!res.ok) {
      console.log('Failed to create attribute multi connection:', res);
      return;
    }
    const conData: IAtrMultiConnection = await res.json();
    console.log(`Added attribute multi connection: ${conData.id} between attributes ${atrIDs}`);
    setMultiCons(prev => [...prev, conData]);
  })

  const updateAtrMultiCon = (id: number, atrID: number) => handleAsync(async () => {
    const res = await fetch('/api/atrMultiConnection', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, atrID }),
    })

    if (!res.ok) {
      console.log('Failed to update attribute multi connection:', res);
      return;
    }

    const conData: IAtrMultiConnection = await res.json();
    console.log(`Updated attribute multi connection ${conData.id} with attributes: ${atrID}`);
    setMultiCons(prev => prev.map(con => con.id === id ? conData : con));
  })

  const deleteAtrMultiCon = (id: number) => handleAsync(async () => {
    const res = await fetch('/api/atrMultiConnection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error('Failed to delete attribute multi connection');
    }
    console.log(`Removed attribute multi connection with id: ${id}`);
    setMultiCons(prev => prev.filter(con => con.id !== id));
  })

  const deleteAllAtrMultiCons = () => handleAsync(async () => {
    const res = await fetch('/api/atrMultiConnection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      throw new Error('Failed to attribute multi connections');
    }
    console.log(`Removed all attribute multi connections`);
    setMultiCons([]);
  })

  useEffect(() => { fetchAtrMultiCons() }, [])

  return { atrMultiCons, loading, createAtrMultiCon, updateAtrMultiCon, deleteAtrMultiCon, deleteAllAtrMultiCons };
};
