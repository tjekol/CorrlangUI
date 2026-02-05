'client';

import { useState } from 'react';
import { useCorres } from '../hooks/useCorres';

export default function Correspondence({
  onDataEmit,
}: {
  onDataEmit: (title: string[]) => void;
}) {
  const { corres } = useCorres();
  const [pickedCorrs, setPickedCorrs] = useState<string[]>([]);

  return (
    <div className='flex flex-col m-auto items-start gap-4 bg-blue-100 w-1/2 p-6 rounded-xl'>
      <p className='text-center m-auto'>Choose correspondences for the task:</p>
      <ul className='w-full p-2 flex flex-col gap-2'>
        {corres.map((c) => (
          <li
            className={`list-none list-inside bg-blue-50 p-2 rounded-md w-full ${pickedCorrs.includes(c.title) ? 'border-2' : ''}`}
            onClick={() => {
              (console.log('Clicked', c.title),
                pickedCorrs.includes(c.title)
                  ? setPickedCorrs(pickedCorrs.filter((pc) => pc !== c.title))
                  : setPickedCorrs((prev) => [...prev, c.title]));
            }}
            key={c.id}
          >
            {c.title + ' '}
          </li>
        ))}
      </ul>
      <button
        className='bg-white py-2 px-4 self-center rounded-xl  border-black'
        onClick={() => onDataEmit(pickedCorrs)}
      >
        Confirm correspondences
      </button>
    </div>
  );
}
