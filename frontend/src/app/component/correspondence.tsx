import { useCorres } from '../hooks/useCorres';
import { ICorrespondence } from '../interface/ICorrespondence';

export default function Correspondence({
  onDataEmit,
}: {
  onDataEmit: (cor: ICorrespondence) => void;
}) {
  const { corres } = useCorres();

  return (
    <div className='flex flex-col m-auto items-start gap-4 bg-blue-100 w-full p-6 rounded-xl'>
      <h2 className='text-center m-auto'>Choose correspondences:</h2>
      <ul className='w-1/2 m-auto p-2 flex flex-col gap-2'>
        {corres.map((c) => (
          <li
            className={`list-none list-inside bg-blue-50 p-2 rounded-md w-full cursor-pointer hover:bg-white hover:border`}
            onClick={() => {
              onDataEmit(c);
            }}
            key={c.id}
          >
            {c.title + ' '}
          </li>
        ))}
      </ul>
    </div>
  );
}
