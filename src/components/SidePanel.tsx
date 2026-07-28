import React from 'react';
import { BlockType, GameStats } from '../types';
import { TETROMINO_MAP } from '../constants';
import { Trophy, Zap, RefreshCw, Hash, Play, Square } from 'lucide-react';

interface SidePanelProps {
  stats: GameStats;
  nextPieceType: Exclude<BlockType, null>;
  holdPieceType: Exclude<BlockType, null> | null;
}

// Sub-component to render a 4x4 grid representing a block type
export const BlockPreview: React.FC<{ type: BlockType | null; label: string; compact?: boolean }> = ({ type, label, compact = false }) => {
  // Setup standard 4x4 viewport representation
  const grid: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));

  if (type) {
    const shape = TETROMINO_MAP[type].shape;
    const shapeRows = shape.length;
    const shapeCols = shape[0].length;

    // Center calculations inside 4x4
    const startRow = Math.floor((4 - shapeRows) / 2);
    const startCol = Math.floor((4 - shapeCols) / 2);

    for (let r = 0; r < shapeRows; r++) {
      for (let c = 0; c < shapeCols; c++) {
        if (shape[r][c] !== 0) {
          const targetR = Math.max(0, Math.min(3, startRow + r));
          const targetC = Math.max(0, Math.min(3, startCol + c));
          grid[targetR][targetC] = 1;
        }
      }
    }
  }

  return (
    <div className={`flex flex-col items-center glass-panel ${compact ? 'p-2 rounded-[14px]' : 'p-4 rounded-[20px]'} shadow-lg backdrop-blur-md w-full`}>
      <span className={`${compact ? 'text-[9px] mb-1.5' : 'text-[11px] mb-3'} font-sans font-semibold tracking-[1.5px] text-white/60 uppercase`}>{label}</span>
      <div className={`grid grid-cols-4 gap-0.5 p-1 bg-black/20 rounded-lg border border-white/10 ${compact ? 'w-12 h-12' : 'w-24 h-24'}`}>
        {grid.map((row, r) =>
          row.map((val, c) => {
            const blockDef = type ? TETROMINO_MAP[type] : null;
            const blockClass = val && blockDef 
              ? `${blockDef.color} border border-white/10 rounded-sm` 
              : "bg-transparent border border-white/[0.02]";

            return (
              <div
                key={`${r}-${c}`}
                className={`aspect-square relative ${blockClass}`}
              >
                {val && blockDef && (
                  <div className="absolute inset-x-[0.5px] top-[0.5px] h-[30%] bg-white/20 rounded-t-[1px] pointer-events-none" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export const SidePanel: React.FC<SidePanelProps> = ({ stats, nextPieceType, holdPieceType }) => {
  return (
    <div className="flex flex-col gap-4 w-full md:w-56">
      
      {/* 1. Previews Section (Hold & Next) */}
      <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
        <BlockPreview type={nextPieceType} label="Volgende" />
        <BlockPreview type={holdPieceType} label="Held" />
      </div>

      {/* 2. Stats Section */}
      <div className="flex flex-col gap-3.5 glass-panel p-4.5 rounded-[24px] shadow-lg backdrop-blur-md">
        
        {/* Score */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-sans font-semibold tracking-[1.5px] text-white/60 uppercase">Score</span>
          </div>
          <span className="text-3xl font-mono font-bold text-white tracking-tight leading-none mt-1">
            {stats.score.toLocaleString()}
          </span>
        </div>

        {/* Level */}
        <div className="flex flex-col gap-1 border-t border-white/10 pt-3">
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-sans font-semibold tracking-[1.5px] text-white/60 uppercase">Level</span>
          </div>
          <span className="text-3xl font-mono font-bold text-cyan-400 leading-none mt-1">
            {stats.level}
          </span>
        </div>

        {/* Lines */}
        <div className="flex flex-col gap-1 border-t border-white/10 pt-3">
          <div className="flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-sans font-semibold tracking-[1.5px] text-white/60 uppercase">Lijnen</span>
          </div>
          <span className="text-3xl font-mono font-bold text-emerald-400 leading-none mt-1">
            {stats.lines}
          </span>
        </div>

        {/* High Score */}
        <div className="flex flex-col gap-1 border-t border-white/10 pt-3">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
            <span className="text-[11px] font-sans font-semibold tracking-[1.5px] text-white/60 uppercase">Highscore</span>
          </div>
          <span className="text-2xl font-mono font-bold text-yellow-500/90 leading-none mt-1">
            {stats.highScore.toLocaleString()}
          </span>
        </div>

      </div>

    </div>
  );
};
