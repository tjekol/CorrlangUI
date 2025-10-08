import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const tasks = [1, 2];

  return (
    <div className='font-sans items-center justify-items-left min-h-screen p-10'>
      <h1 className='pb-10'>Corrlang - semantic interoperability</h1>

      <div className='w-80'>
        <h2>Tasks</h2>
        <hr className='w-80' />
        <ul>
          {tasks.map((t) => (
            <Link key={t} href={`/task/${t}`}>
              <li>Task {t}</li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
}
