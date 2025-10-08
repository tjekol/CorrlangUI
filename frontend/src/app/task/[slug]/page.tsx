'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import tasks from '@/taskData.json';
import Link from 'next/link';

export default function Task() {
  const params = useParams();
  const slug = params.slug;
  const currentTask = tasks.find((t, i) => i + 1 === Number(slug));
  const classes = currentTask?.classes;

  const [text, setText] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const compileOutput = (text: string) => {
    setOutput(text);
  };

  return (
    <div className='font-sans items-center justify-items-left min-h-screen p-10'>
      <Link href={'/'}>
        <h1 className='pb-10'>Corrlang - semantic interoperability</h1>
      </Link>
      <h2>Task {slug}</h2>
      {currentTask?.taskText}

      <div className='grid grid-cols-2 gap-x-6 gap-y-2 m-auto'>
        <div className='flex justify-between'>
          <p className='self-end'>Input</p>
          <button
            onClick={() => compileOutput(text)}
            className='border-1 rounded-full px-4 py-1'
          >
            Compile
          </button>
        </div>
        <p className='self-end'>Output</p>
        <textarea
          className='bg-gray border-1 p-5 rounded-sm'
          rows={10}
          cols={10}
          onChange={(e) => setText(e.target.value)}
          defaultValue={Object.entries(classes ?? {})
            .map(([k, v]) => `${k}: ${v.join(', ')} \n`)
            .join('')}
        />
        <p className='bg-gray p-5 rounded-sm border-1 whitespace-pre-wrap'>
          {output}
        </p>
      </div>
    </div>
  );
}
