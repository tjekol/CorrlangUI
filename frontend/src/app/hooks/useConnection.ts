'use client';

import { useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import { nodeConAtom } from '../GlobalValues';
import { IConnection } from '../interface/Connection/IConnection';

export const useConnection = () => {
  const [loading, setLoading] = useState(true);
  const [cons, setCon] = useAtom(nodeConAtom);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Connection operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCons = () => handleAsync(async () => {
    const res = await fetch('/api/connections');
    if (!res.ok) {
      throw new Error('Failed to fetch connections');
    }
    const consData: IConnection[] = await res.json();
    setCon(consData)
  })

  const createCon = (srcNodeID: number, trgtNodeID: number) => handleAsync(async () => {
    if (!cons.some(con => (con.srcNodeID === srcNodeID && con.trgtNodeID === trgtNodeID) || (con.trgtNodeID === srcNodeID && con.srcNodeID === trgtNodeID))) {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ srcNodeID, trgtNodeID }),
      })

      if (!res.ok) {
        console.log('Failed to create connection:', res);
        return;
      }
      const conData: IConnection = await res.json();
      console.log(`Added connection: ${conData.id} between nodes ${srcNodeID}-${trgtNodeID}`);
      setCon(prev => [...prev, conData]);
    }
    else (
      alert("Connection already exists between nodes.")
    )
  })

  const deleteCon = (id: number) => handleAsync(async () => {
    const res = await fetch('/api/connections', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error('Failed to delete connections');
    }
    console.log(`Removed connection with id: ${id}`);
    setCon(prev => prev.filter(con => con.id !== id));
  })

  const deleteAllCons = () => handleAsync(async () => {
    const res = await fetch('/api/connections', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      throw new Error('Failed to delete all connections');
    }
    console.log(`Removed all connections`);
    setCon([]);
  })

  useEffect(() => { fetchCons(); }, [])

  return { cons, loading, createCon, deleteCon, deleteAllCons };
};
