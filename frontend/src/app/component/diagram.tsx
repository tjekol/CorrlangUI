import Node from './node';

export default function Diagram() {
  const nodes = [
    { id: 1, title: 'Person', labels: ['firstName', 'lastName'] },
    { id: 2, title: 'Person', labels: ['fullName'] },
  ];

  const edges = [{ id: 1, connectingNodes: [1, 2] }];

  return (
    <div className='border-1 rounded-sm h-100 w-full bg-[#F9F9F9] overflow-hidden'>
      <svg width='100%' height='100%'>
        {nodes.map((n, i) => (
          <Node
            key={i}
            id={n.id}
            title={n.title}
            posX={50 + i * 180}
            posY={50 + i * 30}
            labels={n.labels}
          />
        ))}
      </svg>
    </div>
  );
}
