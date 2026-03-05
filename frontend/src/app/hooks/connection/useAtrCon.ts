'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { IAtrConnection } from '../../interface/IConnections';
import { atrConAtom } from '../../GlobalValues';

export const useAtrCon = () => {
  const [loading, setLoading] = useState(true);
  const [atrCon, setAtrCon] = useAtom(atrConAtom);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Attribute connection operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAtrCons = () => handleAsync(async () => {
    const res = await fetch('/api/atr-connection');
    if (!res.ok) {
      throw new Error('Failed to fetch attribute connections');
    }
    const conData: IAtrConnection[] = await res.json();
    setAtrCon(conData)
  })

  const createAtrCon = (atrIDs: number[]) => handleAsync(async () => {
    const res = await fetch('/api/atr-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ atrIDs }),
    })

    if (!res.ok) {
      console.log('Failed to create attribute connection:', res);
      return;
    }
    const conData: IAtrConnection = await res.json();
    console.log(`Added attribute connection: ${conData.id} between attributes ${atrIDs}`);
    setAtrCon(prev => [...prev, conData]);
  })

  const updateAtrCon = (atrConID: number, atrID: number) => handleAsync(async () => {
    const res = await fetch('/api/atr-connection', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ atrConID, atrID }),
    })

    if (!res.ok) {
      console.log('Failed to update attribute connection:', res);
      return;
    }

    const conData: IAtrConnection = await res.json();
    console.log(`Updated attribute connection ${conData.id} with attributes: ${atrID}`);
    setAtrCon(prev => prev.map(con => con.id === atrConID ? conData : con));
  })

  const deleteCon = (id: number) => handleAsync(async () => {
    const res = await fetch('/api/atr-connection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error('Failed to delete attribute connection');
    }
    console.log(`Removed attribute connection with id: ${id}`);
    setAtrCon(prev => prev.filter(con => con.id !== id));
  })

  const deleteAllAtrCons = () => handleAsync(async () => {
    const res = await fetch('/api/atr-connection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      throw new Error('Failed to attribute connections');
    }
    console.log(`Removed all attribute connections`);
    setAtrCon([]);
  })

  useEffect(() => { fetchAtrCons() }, [])

  return { atrCon, loading, createAtrCon, updateAtrCon, deleteAtrCon: deleteCon, deleteAllAtrCons };
};
