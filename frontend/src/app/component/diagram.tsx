import Class from './class';

export default function Diagram() {
  const classes = [
    { id: 1, title: 'Person', labels: ['firstName', 'lastName'] },
    { id: 2, title: 'Person', labels: ['fullName'] },
  ];

  return (
    <div className='border-1 rounded-sm h-100 w-full bg-[#F9F9F9]'>
      <svg width='100%' height='100%'>
        {classes.map((c, i) => (
          <Class
            key={i}
            id={c.id}
            title={c.title}
            posX={50 + i * 180}
            posY={50 + i * 30}
            labels={c.labels}
          />
        ))}
      </svg>
    </div>
  );
}
