'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { IMultiConnection } from '../interface/Connection/IMultiConnection';
import { multiConAtom } from '../GlobalValues';

export const useMultiCon = () => {
  const [loading, setLoading] = useState(true);
  const [multiCons, setMultiCons] = useAtom(multiConAtom);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Multi connection operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMultiCons = () => handleAsync(async () => {
    const res = await fetch('/api/multiConnection');
    if (!res.ok) {
      throw new Error('Failed to fetch multi connections');
    }
    const conData: IMultiConnection[] = await res.json();
    setMultiCons(conData)
  })

  const createMultiCon = (nodeIDs: number[]) => handleAsync(async () => {
    const res = await fetch('/api/multiConnection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodeIDs }),
    })

    if (!res.ok) {
      console.log('Failed to create multi connection:', res);
      return;
    }
    const conData: IMultiConnection = await res.json();
    console.log(`Added multi connection: ${conData.id} between nodes ${nodeIDs}`);
    setMultiCons(prev => [...prev, conData]);
  })

  const updateMultiCon = (id: number, nodeID: number) => handleAsync(async () => {
    const res = await fetch('/api/multiConnection', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, nodeID }),
    })

    if (!res.ok) {
      console.log('Failed to update multi connection:', res);
      return;
    }

    const conData: IMultiConnection = await res.json();
    console.log(`Updated multi connection ${conData.id} with nodes: ${nodeID}`);
    setMultiCons(prev => prev.map(con => con.id === id ? conData : con));
  })

  const deleteMultiCon = (id: number) => handleAsync(async () => {
    const res = await fetch('/api/multiConnection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error('Failed to delete multi connection');
    }
    console.log(`Removed multi connection with id: ${id}`);
    setMultiCons(prev => prev.filter(con => con.id !== id));
  })

  const deleteAllMultiCons = () => handleAsync(async () => {
    const res = await fetch('/api/multiConnection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      throw new Error('Failed to multi connections');
    }
    console.log(`Removed all multi connections`);
    setMultiCons([]);
  })

  useEffect(() => { fetchMultiCons() }, [])

  return { multiCons, loading, createMultiCon, updateMultiCon, deleteMultiCon, deleteAllMultiCons };
};
