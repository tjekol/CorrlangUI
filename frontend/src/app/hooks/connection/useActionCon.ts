'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { IActionConnection } from '../../interface/IConnections';
import { actionConAtom } from '../../GlobalValues';

export const useActionCon = () => {
  const [loading, setLoading] = useState(true);
  const [con, setCon] = useAtom(actionConAtom);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Action action connection operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCon = (ids: number[]) => handleAsync(async () => {
    const res = await fetch('/api/action-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: ids }),
    })

    if (!res.ok) {
      console.log('Failed to create action connection:', res);
      return;
    }
    const conData: IActionConnection = await res.json();
    console.log(`Added action connection: ${conData.id} between ${ids}`);
    setCon(prev => [...prev, conData]);
  })

  const updateCon = (conID: number, id: number) => handleAsync(async () => {
    const res = await fetch('/api/action-connection', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conID, id }),
    })

    if (!res.ok) {
      console.log('Failed to update action connection:', res);
      return;
    }

    const conData: IActionConnection = await res.json();
    console.log(`Updated action connection ${conData.id} with ${id}`);
    setCon(prev => prev.map(con => con.id === conID ? conData : con));
  })

  const deleteCon = (id: number) => handleAsync(async () => {
    const res = await fetch('/api/action-connection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error('Failed to delete action connection');
    }
    console.log(`Removed action connection with id: ${id}`);
    setCon(prev => prev.filter(con => con.id !== id));
  })

  const deleteAllCons = () => handleAsync(async () => {
    const res = await fetch('/api/action-connection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      throw new Error('Failed to delete action action connections');
    }
    console.log(`Removed all action connections`);
    setCon([]);
  })

  useEffect(() => {
    const fetchCons = () => handleAsync(async () => {
      const res = await fetch('/api/action-connection');
      if (!res.ok) {
        throw new Error('Failed to fetch action connections');
      }
      const conData: IActionConnection[] = await res.json();
      setCon(conData)
    })
    fetchCons()
  }, [setCon])

  return { actionCon: con, loading, createActionCon: createCon, updateActionCon: updateCon, deleteActionCon: deleteCon, deleteAllActionCons: deleteAllCons };
};
