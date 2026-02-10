'use client';

import Correspondence from './component/correspondence';
import Diagram from './component/diagram';
import { useState } from 'react';
import { useAtrCon } from './hooks/useAtrCon';
import { useConnection } from './hooks/useConnection';
import { useMultiCon } from './hooks/useMultiCon';

export default function Home() {
  const { deleteAllCons } = useConnection();
  const { deleteAllMultiCons } = useMultiCon();
  const { deleteAllAtrCons } = useAtrCon();

  const reset = () => {
    deleteAllCons();
    deleteAllMultiCons();
    deleteAllAtrCons();
  };

  const [corres, setCorres] = useState<string[]>([]);

  const handleData = (data: string[]) => {
    setCorres(data);
  };

  const resetCorres = () => {
    setCorres([]);
  };

  return (
    <div className='font-sans items-center justify-items-left min-h-screen p-10'>
      <h1 className='pb-10'>Corrlang - semantic interoperability</h1>

      <div className='grid grid-cols-1 gap-x-6 gap-y-2 m-auto'>
        <div className='flex justify-between'>
          <button
            onClick={() => resetCorres()}
            className='border bg-blue-50 rounded-md px-4 py-1'
          >
            Pick correspondence
          </button>
          {!corres || corres.length === 0 || (
            <button
              onClick={() => reset()}
              className='border rounded-md px-4 py-1'
            >
              Reset connections
            </button>
          )}
        </div>

        {!corres || corres.length === 0 ? (
          <Correspondence onDataEmit={handleData} />
        ) : (
          <Diagram pickedCorres={corres} />
        )}
        {/* <p className='self-end'>Output</p>
        <p className='bg-gray min-h-100 p-5 rounded-sm border-1 whitespace-pre-wrap'>
          {output}
        </p> */}
      </div>
    </div>
  );
}
