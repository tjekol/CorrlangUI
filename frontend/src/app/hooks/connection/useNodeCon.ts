'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { INodeConnection } from '../../interface/IConnections';
import { nodeConAtom } from '../../GlobalValues';

export const useNodeCon = () => {
  const [loading, setLoading] = useState(true);
  const [nodeCon, setNodeCon] = useAtom(nodeConAtom);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Node connection operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNodeCon = (ids: number[]) => handleAsync(async () => {
    const res = await fetch('/api/node-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    })

    if (!res.ok) {
      console.log('Failed to create connection:', res);
      return;
    }
    const conData: INodeConnection = await res.json();
    console.log(`Added connection: ${conData.id} between nodes ${ids}`);
    setNodeCon(prev => [...prev, conData]);
  })

  const updateNodeCon = (conID: number, id: number) => handleAsync(async () => {
    const res = await fetch('/api/node-connection', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conID, id }),
    })

    if (!res.ok) {
      console.log('Failed to update connection:', res);
      return;
    }

    const conData: INodeConnection = await res.json();
    console.log(`Updated connection ${conData.id} with node: ${id}`);
    setNodeCon(prev => prev.map(con => con.id === conID ? conData : con));
  })

  const deleteCon = (id: number) => handleAsync(async () => {
    const res = await fetch('/api/node-connection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (!res.ok) {
      throw new Error('Failed to delete connection');
    }
    console.log(`Removed connection with id: ${id}`);
    setNodeCon(prev => prev.filter(con => con.id !== id));
  })

  const deleteAllNodeCons = () => handleAsync(async () => {
    const res = await fetch('/api/node-connection', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    if (!res.ok) {
      throw new Error('Failed to connections');
    }
    console.log(`Removed all connections`);
    setNodeCon([]);
  })

  useEffect(() => {
    const fetchNodeCons = () => handleAsync(async () => {
      const res = await fetch('/api/node-connection');
      if (!res.ok) {
        throw new Error('Failed to fetch connections');
      }
      const conData: INodeConnection[] = await res.json();
      setNodeCon(conData)
    })
    fetchNodeCons()
  }, [setNodeCon])

  return { nodeCon, loading, createNodeCon, updateNodeCon, deleteNodeCon: deleteCon, deleteAllNodeCons };
};
