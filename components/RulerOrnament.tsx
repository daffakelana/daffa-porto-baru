"use client";

interface RulerOrnamentProps {
  /** Sisi mana ornamen menempel — menentukan arah angka & tick. */
  side: "left" | "right";
  /** Jarak antar tick besar (ber-angka), dalam px. */
  step?: number;
  /** Angka maksimum yang ditampilkan. */
  max?: number;
}

const WIDTH = 44; // lebar kolom ruler

export function RulerOrnament({
  side,
  step = 50,
  max = 2000,
}: RulerOrnamentProps) {
  const marks: number[] = [];
  for (let v = 0; v <= max; v += step) marks.push(v);

  const isLeft = side === "left";

  // Tick besar keluar dari tepi dalam; angka di sisinya.
  const tickLongX1 = isLeft ? WIDTH : 0;
  const tickLongX2 = isLeft ? WIDTH - 10 : 10;
  const tickShortX2 = isLeft ? WIDTH - 5 : 5;
  const labelX = isLeft ? WIDTH - 16 : 16;
  const labelAnchor = isLeft ? "end" : "start";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none hidden shrink-0 select-none md:block"
      style={{ width: WIDTH }}
    >
      <div className="sticky top-[48px] h-[calc(100vh-48px)] overflow-hidden">
        <svg
          width={WIDTH}
          height="100%"
          style={{ display: "block" }}
        >
          {/* Garis divider utama di tepi dalam */}
          <line
            x1={isLeft ? WIDTH - 0.5 : 0.5}
            y1={0}
            x2={isLeft ? WIDTH - 0.5 : 0.5}
            y2="100%"
            stroke="var(--divider-color)"
            strokeWidth="1"
          />

          {marks.map((value, i) => {
            const y = i * step + 8;
            const major = value % 100 === 0;
            return (
              <g key={value}>
                <line
                  x1={tickLongX1}
                  y1={y}
                  x2={major ? tickLongX2 : tickShortX2}
                  y2={y}
                  stroke="var(--divider-color)"
                  strokeWidth="1"
                />
                {major && (
                  <text
                    x={labelX}
                    y={y}
                    textAnchor={labelAnchor}
                    dominantBaseline="middle"
                    fontSize="8"
                    fill="var(--text-color-tertiary)"
                    style={{
                      writingMode: "vertical-rl",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {value}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default RulerOrnament;