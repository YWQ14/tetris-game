export type BlockType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L' | null;

export type Grid = BlockType[][];

export interface Point {
  x: number;
  y: number;
}

export interface Tetromino {
  shape: number[][];
  type: BlockType;
  color: string;
}

export interface GameStats {
  score: number;
  highScore: number;
  lines: number;
  level: number;
}

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
