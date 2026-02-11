'use client';

import Correspondence from './component/correspondence';
import Diagram from './component/diagram';
import Export from './component/export';
import { useState } from 'react';
import { useAtrCon } from './hooks/useAtrCon';
import { useConnection } from './hooks/useConnection';
import { useMultiCon } from './hooks/useMultiCon';
import { ICorrespondence } from './interface/ICorrespondence';

export default function Home() {
  const { deleteAllCons } = useConnection();
  const { deleteAllMultiCons } = useMultiCon();
  const { deleteAllAtrCons } = useAtrCon();

  const reset = () => {
    deleteAllCons();
    deleteAllMultiCons();
    deleteAllAtrCons();
  };

  const [exportIsOpen, setExportIsOpen] = useState<boolean>(false);
  const [corres, setCorres] = useState<ICorrespondence>();

  const handleData = (data: ICorrespondence) => {
    setCorres(data);
  };

  const resetCorres = () => {
    setCorres(undefined);
  };

  return (
    <div className='font-sans items-center justify-items-left min-h-screen p-10'>
      <h1 className='pb-5'>Corrlang - semantic interoperability</h1>

      <div className='grid grid-cols-1 gap-x-6 gap-y-2 m-auto'>
        {!corres || (
          <div className='flex justify-between'>
            <button
              onClick={() => {
                resetCorres();
              }}
              className='border bg-blue-50 rounded-md px-4 py-1'
            >
              Pick correspondence
            </button>
            <div className='flex gap-2'>
              <button
                onClick={() => {
                  if (confirm('Remove all connections')) reset();
                }}
                className='border rounded-md px-4 py-1'
              >
                Reset connections
              </button>
              <button
                onClick={() => setExportIsOpen(!exportIsOpen)}
                className={` min-w-30 border rounded-md px-4 py-1 ${exportIsOpen ? 'bg-red-100' : 'bg-blue-100'}`}
              >
                {exportIsOpen ? 'Close export' : 'Export'}
              </button>
            </div>
          </div>
        )}

        <dialog
          open={exportIsOpen}
          className='bg-blue-50 mt-20 overflow-auto h-3/4 rounded-sm border p-4 m-auto w-5/6'
        >
          <h3>Copy results</h3>
          <Export />
        </dialog>

        {!corres ? (
          <Correspondence onDataEmit={handleData} reset={reset} />
        ) : (
          <Diagram cor={corres} />
        )}
      </div>
    </div>
  );
}
