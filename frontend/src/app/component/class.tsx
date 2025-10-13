interface IClass {
  id: number;
  title: string;
  posX: number;
  posY: number;
  labels: string[];
}

export default function Class({ id, title, posX, posY, labels }: IClass) {
  const position = { x: posX, y: posY };
  const lengths = labels.map((str) => str.length);
  const longestString = Math.max(...lengths);

  const width = longestString * 15;
  const height = 40;

  return (
    <>
      <rect
        x={position.x}
        y={position.y}
        width={width}
        height={height}
        fill='#FFFFFF'
        stroke='black'
        strokeWidth={1}
        rx={5}
      />
      <circle
        className='hover:cursor-pointer hover:fill-black/80'
        cx={position.x + width}
        cy={position.y + height / 2}
        r={6}
        fill='#D9D9D9'
        stroke='black'
        strokeWidth={1}
        onClick={() => console.log('clicked: ', id)}
      />
      <text
        x={position.x + width / 2}
        y={position.y + height / 2}
        textAnchor='middle'
        dominantBaseline='middle'
      >
        {title}
      </text>

      <rect
        x={position.x}
        y={position.y + height}
        width={width}
        height={labels.length === 1 ? height : (height * labels.length) / 1.4}
        fill='#FFFFFF'
        stroke='black'
        strokeWidth={1}
        rx={5}
      />

      {labels.map((t, i) => (
        <g key={i}>
          <circle
            className='hover:cursor-pointer hover:fill-black/80'
            cx={position.x + width}
            cy={position.y + height + (height / 2) * (i + 1)}
            r={6}
            fill='#D9D9D9'
            stroke='black'
            strokeWidth={1}
            onClick={() => console.log('clicked: ', t, i)}
          />
          <text
            x={position.x + 10}
            y={position.y + height + (height / 2) * (i + 1)}
            textAnchor='start'
            dominantBaseline='middle'
          >
            {t}
          </text>
        </g>
      ))}
    </>
  );
}
