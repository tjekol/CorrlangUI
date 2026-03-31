'use client';

import { useState } from 'react';
import { useAtom } from 'jotai';
import { IAction } from '../interface/IAction';
import { actionAtom } from '../GlobalValues';

export const useAction = () => {
  const [actions, setAction] = useAtom(actionAtom)
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

  const fetchAction = () => handleAsync(async () => {
    const res = await fetch('/api/actions');
    if (!res.ok) {
      throw new Error('Failed to fetch action');
    }
    const actionData: IAction[] = await res.json();
    setAction(actionData);
  })

  // useEffect(() => { fetchaction(); }, []);

  return { actions, loading, refetchActions: fetchAction }
}
