'use client';

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { schemaAtom } from '../GlobalValues';
import { ISchema } from '../interface/ISchema';

export const useSchemas = () => {
  const [schemas, setSchemas] = useAtom(schemaAtom)
  const [loading, setLoading] = useState(true);

  const handleAsync = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (error) {
      console.error('Schema operation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchemas = () => handleAsync(async () => {
    const res = await fetch('/api/schemas');
    if (!res.ok) {
      throw new Error('Failed to fetch nodes');
    }
    const schemasData: ISchema[] = await res.json();
    setSchemas(schemasData);
  })

  useEffect(() => { fetchSchemas(); }, []);

  return { schemas, loading }
}
