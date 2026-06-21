import { statLabel } from "../utils/format";

interface StatRadarProps {
  stats: { name: string; value: number }[];
  color: string;
  className?: string;
}

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = 78;
const LABEL_RADIUS = 98;
const MAX_SCALE = 200; // base stats rarely exceed this; caps the axis nicely

function StatRadar({ stats, color, className }: StatRadarProps) {
  const count = stats.length;
  const angle = (i: number) => (-90 + (360 / count) * i) * (Math.PI / 180);
  const point = (i: number, r: number): [number, number] => [
    CENTER + r * Math.cos(angle(i)),
    CENTER + r * Math.sin(angle(i)),
  ];
  const toPath = (pts: [number, number][]) =>
    pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  const rings = [0.25, 0.5, 0.75, 1];
  const dataPoints = stats.map((s, i) =>
    point(i, RADIUS * Math.min(1, s.value / MAX_SCALE)),
  );

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={className}
      role="img"
      aria-label="Base stat radar chart"
    >
      {/* grid rings */}
      {rings.map((level) => (
        <polygon
          key={level}
          points={toPath(stats.map((_, i) => point(i, RADIUS * level)))}
          className="fill-none stroke-slate-200 dark:stroke-slate-700"
          strokeWidth={1}
        />
      ))}
      {/* axes */}
      {stats.map((_, i) => {
        const [x, y] = point(i, RADIUS);
        return (
          <line
            key={i}
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth={1}
          />
        );
      })}
      {/* data polygon */}
      <polygon
        points={toPath(dataPoints)}
        style={{ fill: color, stroke: color }}
        fillOpacity={0.25}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.5} style={{ fill: color }} />
      ))}
      {/* labels */}
      {stats.map((s, i) => {
        const [x, y] = point(i, LABEL_RADIUS);
        return (
          <text
            key={s.name}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-500 text-[10px] font-semibold dark:fill-slate-400"
          >
            {statLabel(s.name)}
          </text>
        );
      })}
    </svg>
  );
}

export default StatRadar;
