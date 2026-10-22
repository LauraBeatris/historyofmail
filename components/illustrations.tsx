import { useId } from "react";
import styles from "./scene.module.css";

const PALETTE: Record<string, string> = {
  "#": "#fdfdfd",
  g: "#8a8f98",
  d: "#3a3d44",
  n: "#15171c",
  r: "#ff5d5d",
  o: "#ffb02e",
  y: "#ffe14d",
  G: "#46fea5",
  c: "#46fea5",
  b: "#70b8ff",
  B: "#2f6fe0",
  p: "#c084fc",
  t: "#e8d5b5",
  w: "#a0623f",
};

const SPRITES: Record<number, string[]> = {
  1965: [
    "....................",
    ".....tttttttttttt...",
    ".....tnnnnnnnnnnt...",
    ".....tnGGnGnGGGnt...",
    ".....tnnnnnnnnnnt...",
    ".....tnGGGGGnGGnt...",
    ".....tnnnnnnnnnnt...",
    ".....tnGGnGGnnnnt...",
    ".....tnnnnncnnnnt...",
    ".....tttttttttttt...",
    ".........dd.........",
    ".......dddddd.......",
    "....................",
    "....................",
  ],
  1971: [
    "....................",
    ".......bbbbbb.......",
    ".....bb......bb.....",
    "....b..........b....",
    "...b....bbbb..b.b...",
    "...b...b....b...b...",
    "...b...b....b...b...",
    "...b...b....b...b...",
    "...b....bbbb.b..b...",
    "....b.........bb....",
    ".....bb.............",
    ".......bbbbbb.......",
    "....................",
    "....................",
  ],
  1978: [
    "....................",
    "......gggggggg......",
    ".....g########g.....",
    ".....g########g.....",
    ".....bbbbbbbbbb.....",
    ".....byyyyyyyyb.....",
    ".....byrrryrryb.....",
    ".....byyyyyyyyb.....",
    ".....byrrrrryyb.....",
    ".....byyyyyyyyb.....",
    ".....bbbbbbbbbb.....",
    ".....g########g.....",
    "......gggggggg......",
    "....................",
  ],
  1982: [
    "....................",
    ".....tttttttttt.....",
    ".....ttbbbbbbtt.....",
    ".....tttttttttt.....",
    ".....ttbbbbtttt.....",
    "...################.",
    "...#o############o#.",
    "...##o##########o##.",
    "...###o########o###.",
    "...####o######o####.",
    "...#####o####o#####.",
    "...######oooo######.",
    "...################.",
    "....................",
  ],
  1988: [
    "....................",
    "..gggggggggggggggg..",
    "..g#g#g#g#g#g#g#g#..",
    "..gggggggggggggggg..",
    "..g##############g..",
    "..g#r#bbbbbbb####g..",
    "..g##############g..",
    "..g#G#bbbbbbbbb##g..",
    "..g##############g..",
    "..g#r#bbbbb######g..",
    "..g##############g..",
    "..g#b#bbbbbbbb###g..",
    "..gggggggggggggggg..",
    "....................",
  ],
  1992: [
    "....................",
    ".......bbbbbb.......",
    "......b......b......",
    "......b.bbbb.b......",
    "......b.b..b.b......",
    "......b.b..b.b......",
    "......b.b..b.b......",
    "......b.b..b.b......",
    "......b.b..b.b......",
    "......b.b....b......",
    "......b.b....b......",
    "......bbbbbbbb......",
    "....................",
    "....................",
  ],
  1996: [
    "....................",
    "..gggggggggggggggg..",
    "..g.r.y.Gddddddd#g..",
    "..gggggggggggggggg..",
    "..g##############g..",
    "..g######bbbb####g..",
    "..g#####bGbbGb###g..",
    "..g#####bbGGbb###g..",
    "..g#####bGbGbb###g..",
    "..g######bbbb####g..",
    "..g##############g..",
    "..gggggggggggggggg..",
    "....................",
    "....................",
  ],
  1998: [
    "....................",
    ".....rrr............",
    ".....rrr............",
    ".....r..............",
    ".....r.BBBBBBBBB....",
    "....BBBBBBBBBBBBBB..",
    "....Bbbbbbbbbbbbbb..",
    "....B#########bbbb..",
    "....Bbbbbbbbbbbbbb..",
    "....BBBBBBBBBBBBBB..",
    ".........ww.........",
    ".........ww.........",
    ".........ww.........",
    "....................",
  ],
  1999: [
    "....................",
    "......dddddddd......",
    "......dddddddd......",
    ".....dbbbbbbbbd.....",
    ".....dbnbbnbbbd.....",
    ".....dbbbbbbbbd.....",
    "......dddddddd......",
    ".....d#d#d#d#dd.....",
    ".....dd#d#d#d#d.....",
    ".....d#d#d#d#dd.....",
    ".....dd#d#d#d#d.....",
    "......dddddddd......",
    "......dddddddd......",
    "....................",
  ],
  2004: [
    "....................",
    "...bb............GG.",
    "...brr..........rrG.",
    "...b.rr........rr.G.",
    "...b..rr......rr..G.",
    "...b...rr....rr...G.",
    "...b....rr..rr....G.",
    "...b.....rrrr.....G.",
    "...b......rr......G.",
    "...b..............G.",
    "...b..............G.",
    "...byyyyyyyyyyyyyyG.",
    "...yyyyyyyyyyyyyyyy.",
    "....................",
  ],
  2007: [
    ".......dddddd.......",
    "......dddddddd......",
    "......dbbbbbbd......",
    "......dbbbbbbd......",
    "......db###rbd......",
    "......db#bb#bd......",
    "......db####bd......",
    "......dbbbbbbd......",
    "......dbbbbbbd......",
    "......dbbbbbbd......",
    "......ddd##ddd......",
    ".......dddddd.......",
    "....................",
    "....................",
  ],
  2013: [
    "....................",
    "..GGGGGG............",
    "..GGGGGG###########.",
    "..GGGG#G#.........#.",
    "..G#G#GG#.bbbbbbb.#.",
    "..GG#GGG#.........#.",
    "..GGGGGG#.bbbb....#.",
    "..GGGGGG#.........#.",
    "..GGGGGG###########.",
    "..GGGGGG............",
    "...............o....",
    "..........oooooooo..",
    "...............o....",
    "....................",
  ],
  2020: [
    "....................",
    "......wwwwwwww......",
    "......wwwwwwww......",
    "......wwwyywww......",
    "......wwwyywww......",
    "......wwwwwwww......",
    "......wwwwwwyw......",
    "......wwppppww......",
    "......wwppppww......",
    "......wwppppww......",
    "......wwppppww......",
    "......wwwwwwww......",
    "..gggggggggggggggg..",
    "....................",
  ],
  2024: [
    "....................",
    "..p.............y...",
    ".ppp...........yyy..",
    "..p.............y...",
    "....############....",
    "....#o########o#....",
    "....##o######o##....",
    "....###o####o###....",
    "....####o##o####....",
    "....#####oo#####....",
    "....############....",
    "....############....",
    "..y..........p......",
    "....................",
  ],
};

export const SPRITE_COLUMNS = 20;
export const SPRITE_ROWS = 14;

function cells(rows: string[], color?: string) {
  return rows.flatMap((row, y) =>
    Array.from(row, (cell, x) => {
      const fill = PALETTE[cell];
      if (!fill) return null;
      return (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="1"
          height="1"
          fill={color ?? fill}
          className={cell === "c" ? styles.blink : undefined}
        />
      );
    }),
  );
}

export function Illustration({ year }: { year: number }) {
  const id = useId();
  const rows = SPRITES[year];
  const viewBox = `0 0 ${SPRITE_COLUMNS} ${SPRITE_ROWS}`;
  return (
    <>
      <svg viewBox={viewBox} className={styles.glow} aria-hidden="true">
        {cells(rows)}
      </svg>
      <svg viewBox={viewBox} shapeRendering="crispEdges" className={styles.sprite} aria-hidden="true">
        <defs>
          <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="0.45" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="1" stopColor="#000" stopOpacity="0.28" />
          </linearGradient>
          <mask id={`${id}-mask`}>{cells(rows, "#fff")}</mask>
        </defs>
        {cells(rows)}
        <rect
          width={SPRITE_COLUMNS}
          height={SPRITE_ROWS}
          fill={`url(#${id}-shine)`}
          mask={`url(#${id}-mask)`}
        />
      </svg>
    </>
  );
}
