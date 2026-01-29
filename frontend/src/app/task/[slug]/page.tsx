'use client';

import { useParams } from 'next/navigation';
import tasks from '@/taskData.json';
import Link from 'next/link';
import Diagram from '@/app/component/diagram';
import { useConnection } from '@/app/hooks/useConnection';
import { useMultiCon } from '@/app/hooks/useMultiCon';
import { useAtrCon } from '@/app/hooks/useAtrCon';

export default function Task() {
  const params = useParams();
  const slug = params.slug;
  const currentTask = tasks.find((t, i) => i + 1 === Number(slug));
  const { deleteAllCons } = useConnection();
  const { deleteAllMultiCons } = useMultiCon();
  const { deleteAllAtrCons } = useAtrCon();

  const reset = () => {
    deleteAllCons();
    deleteAllMultiCons();
    deleteAllAtrCons();
  };

  return (
    <div className='font-sans items-center justify-items-left min-h-screen p-10'>
      <h1 className='pb-10'>
        <Link href={'/'} className='m-auto'>
          Corrlang - semantic interoperability
        </Link>
      </h1>
      <h2>Task {slug}</h2>
      {currentTask?.taskText}

      <div className='grid grid-cols-1 gap-x-6 gap-y-2 m-auto'>
        <div className='flex justify-between'>
          <p className='self-end'>Input</p>
          <button
            onClick={() => reset()}
            className='border-1 rounded-full px-4 py-1'
          >
            Reset
          </button>
        </div>
        <Diagram />
        {/* <p className='self-end'>Output</p>
        <p className='bg-gray min-h-100 p-5 rounded-sm border-1 whitespace-pre-wrap'>
          {output}
        </p> */}
      </div>
    </div>
  );
}
