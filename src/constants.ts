import { Tetromino, BlockType } from './types';

export const COLS = 10;
export const ROWS = 20;

export const TETROMINO_MAP: Record<Exclude<BlockType, null>, Tetromino> = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    type: 'I',
    color: 'bg-cyan-400/90 border-cyan-300 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_2px_10px_rgba(34,211,238,0.45)]',
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    type: 'O',
    color: 'bg-amber-400/90 border-amber-300 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_2px_10px_rgba(251,191,36,0.45)]',
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    type: 'T',
    color: 'bg-purple-400/90 border-purple-300 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_2px_10px_rgba(192,132,252,0.45)]',
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    type: 'S',
    color: 'bg-emerald-400/90 border-emerald-300 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_2px_10px_rgba(52,211,153,0.45)]',
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    type: 'Z',
    color: 'bg-rose-400/90 border-rose-300 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_2px_10px_rgba(244,63,94,0.45)]',
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    type: 'J',
    color: 'bg-blue-400/90 border-blue-300 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_2px_10px_rgba(96,165,250,0.45)]',
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    type: 'L',
    color: 'bg-orange-400/90 border-orange-300 shadow-[inset_0_1px_3px_rgba(255,255,255,0.4),0_2px_10px_rgba(251,146,60,0.45)]',
  },
};

export const TETROMINO_TYPES: Exclude<BlockType, null>[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// Speed mapping based on Level (ms per tick)
export const SPEED_MAP: Record<number, number> = {
  1: 800,
  2: 720,
  3: 630,
  4: 550,
  5: 470,
  6: 380,
  7: 300,
  8: 220,
  9: 130,
  10: 100,
};

// Points based on standard Nintendo scoring system, multiplied for levels
export const SCORE_MAP = {
  1: 100,  // 1 line cleared
  2: 300,  // 2 lines cleared
  3: 500,  // 3 lines cleared
  4: 800,  // 4 lines cleared (Tetris!)
};
