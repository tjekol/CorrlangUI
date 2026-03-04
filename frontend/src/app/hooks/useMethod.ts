'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { methodAtom } from '../GlobalValues';
import { IMethod } from '../interface/IMethod';

export const useMethod = () => {
  const [methods, setMethod] = useAtom(methodAtom)
  const [loading, setLoading] = useState(true);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Action operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMethod = () => handleAsync(async () => {
    const res = await fetch('/api/methods');
    if (!res.ok) {
      throw new Error('Failed to fetch methods');
    }
    const methodData: IMethod[] = await res.json();
    setMethod(methodData);
  })

  // useEffect(() => { fetchaction(); }, []);

  return { methods, methodLoading: loading, refetchMethods: fetchMethod }
}
