'use client';

import { useState } from 'react';
import Correspondence from './component/correspondence';
import Diagram from './component/diagram';
import Export from './component/export';
import { ICorrespondence } from './interface/ICorrespondence';
import ActionDiagram from './component/action-diagram';

export default function Home() {
  const reset = async () => {
    try {
      await fetch('/api/reset', { method: 'POST' });
    } catch (error) {
      console.error('Failed to reset database:', error);
    }
  };

  const [actionIsOpen, setActionIsOpen] = useState<boolean>(false);
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
              onClick={() => (resetCorres(), setExportIsOpen(false))}
              className='border bg-blue-50 rounded-md px-4 py-1'
            >
              Pick correspondence
            </button>
            <div className='flex gap-2'>
              <button
                onClick={() => {
                  if (confirm('Remove all connections')) reset();
                }}
                className='bg-red-100 border rounded-md px-4 py-1'
              >
                Reset connections
              </button>
              <button
                onClick={() => {
                  setActionIsOpen(!actionIsOpen);
                }}
                className={`bg-blue-50 border rounded-md px-4 py-1 ${actionIsOpen && 'bg-blue-200'}`}
              >
                {actionIsOpen ? 'Close actions' : 'Connect actions'}
              </button>
              <button
                onClick={() => setExportIsOpen(!exportIsOpen)}
                className={` min-w-30 border rounded-md px-4 py-1 ${exportIsOpen ? 'bg-blue-200' : 'bg-blue-100'}`}
              >
                {exportIsOpen ? 'Close export' : 'Export'}
              </button>
            </div>
          </div>
        )}

        {!corres ? (
          <Correspondence onDataEmit={handleData} reset={reset} />
        ) : (
          <>
            <Diagram cor={corres} />
            <dialog
              open={actionIsOpen}
              className='bg-blue-50 mt-20 overflow-auto h-9/10 rounded-sm border p-4 m-auto w-9/10 '
            >
              <h3 className='mb-2'>Connect actions</h3>
              <ActionDiagram cor={corres} />
            </dialog>
          </>
        )}

        <dialog
          open={exportIsOpen}
          className='bg-blue-50 mt-20 overflow-auto h-9/10 rounded-sm border p-4 m-auto w-9/10 open:flex open:flex-col'
        >
          <h3 className='mb-2'>Copy results</h3>
          <Export />
        </dialog>
      </div>
    </div>
  );
}
