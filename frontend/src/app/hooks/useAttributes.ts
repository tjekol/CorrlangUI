'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { attrAtom } from '../GlobalValues';
import { IAttribute } from '../interface/IAttribute';

export const useAttributes = () => {
  const [attributes, setAttributes] = useAtom(attrAtom)
  const [loading, setLoading] = useState(true);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Attribute operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttributes = () => handleAsync(async () => {
    const res = await fetch('/api/attributes');
    if (!res.ok) {
      throw new Error('Failed to fetch attributes');
    }
    const attrData: IAttribute[] = await res.json();
    setAttributes(attrData);
  })

  useEffect(() => { fetchAttributes(); }, []);

  return { attributes, loading }
}
