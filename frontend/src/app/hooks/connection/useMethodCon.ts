'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { IMethodConnection } from '../../interface/IConnections';
import { methodConAtom } from '../../GlobalValues';

export const useMethodCon = () => {
  const [loading, setLoading] = useState(true);
  const [con, setCon] = useAtom(methodConAtom);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Action method connection operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCons = () => handleAsync(async () => {
    const res = await fetch('/api/method-connection');
    if (!res.ok) {
      throw new Error('Failed to fetch method connections');
    }
    const conData: IMethodConnection[] = await res.json();
    setCon(conData)
  })

  const createCon = (ids: number[]) => handleAsync(async () => {
    const res = await fetch('/api/method-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: ids }),
    })

    if (!res.ok) {
      console.log('Failed to create method connection:', res);
      return;
    }
    const conData: IMethodConnection = await res.json();
    console.log(`Added method connection: ${conData.id} between ${ids}`);
    setCon(prev => [...prev, conData]);
  })

  const updateCon = (conID: number, id: number) => handleAsync(async () => {
    const res = await fetch('/api/method-connection', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conID, id }),
    })

    if (!res.ok) {
      console.log('Failed to update method connection:', res);
      return;
    }

    const conData: IMethodConnection = await res.json();
    console.log(`Updated method connection ${conData.id} with ${id}`);
    setCon(prev => prev.map(con => con.id === conID ? conData : con));
  })

  const deleteCon = (id: number) => handleAsync(async () => {
    const res = await fetch('/api/method-connection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error('Failed to delete method connection');
    }
    console.log(`Removed method connection with id: ${id}`);
    setCon(prev => prev.filter(con => con.id !== id));
  })

  const deleteAllCons = () => handleAsync(async () => {
    const res = await fetch('/api/method-connection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      throw new Error('Failed to method connections');
    }
    console.log(`Removed all method connections`);
    setCon([]);
  })

  useEffect(() => { fetchCons() }, [])

  return { methodCon: con, loading, createMethodCon: createCon, updateMethodCon: updateCon, deleteMethodCon: deleteCon, deleteAllMethodCons: deleteAllCons };
};
