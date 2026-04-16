import { useCorres } from '../hooks/useCorres';
import { ICorrespondence } from '../interface/ICorrespondence';

export default function Correspondence({
  onDataEmit,
  reset,
}: {
  onDataEmit: (cor: ICorrespondence) => void;
  reset: () => void;
}) {
  const { corres, error, retry } = useCorres();

  return (
    <div className='flex flex-col m-auto items-start gap-4 border bg-blue-100 min-w-1/2 p-6 rounded-sm'>
      <h2 className='text-center m-auto'>Choose correspondence:</h2>
      {error ? (
        <div className='w-full m-auto text-center justify-items-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md'>
          <p className='pt-4 pb-2'>Could not connect to server: {error}</p>
          <p className='text-sm flex flex-row-reverse gap-2'>
            <div className='h-5 w-5 animate-spin rounded-full border-3 border-red-700 border-t-transparent'></div>
            Retrying automatically in 1 minute...
          </p>
          <button
            onClick={retry}
            className='mt-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
          >
            Retry Now
          </button>
        </div>
      ) : corres && corres.length > 0 ? (
        <ul className='w-1/2 m-auto p-2 flex flex-col gap-2'>
          {corres.map((c) => (
            <li
              className={`list-none list-inside bg-blue-50 p-2 rounded-md w-full cursor-pointer hover:bg-white hover:border`}
              onClick={() => {
                onDataEmit(c);
                reset();
              }}
              key={c.id}
            >
              {c.title + ' '}
            </li>
          ))}
          <button
            onClick={retry}
            className='mt-3 px-4 m-auto py-2 bg-blue-400 text-white rounded border-black hover:border'
          >
            Refresh...
          </button>
        </ul>
      ) : (
        <div className='w-full m-auto text-center justify-items-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-md'>
          <div className='flex flex-row m-auto items-center bg-red-100 p-4'>
            Couldn't find any correspondences... Have you applied correspondeces
            with CorrLang?
          </div>
          <button
            onClick={retry}
            className='mt-3 px-4 m-auto py-2 bg-red-500 text-white rounded hover:bg-red-600'
          >
            Try Again...
          </button>
        </div>
      )}
    </div>
  );
}
