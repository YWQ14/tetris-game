import React from 'react';
import { Grid, BlockType, Point } from '../types';
import { ROWS, COLS, TETROMINO_MAP } from '../constants';

interface GameBoardProps {
  grid: Grid;
  currentPiece: {
    shape: number[][];
    type: Exclude<BlockType, null>;
    position: Point;
  } | null;
  shadowY: number;
}

export const GameBoard: React.FC<GameBoardProps> = ({ grid, currentPiece, shadowY }) => {
  // Create a combined grid to render both the board and the active piece (+ shadow)
  const renderGrid = grid.map((row) => row.map((cell) => ({ cellType: cell, isShadow: false, isActive: false })));

  // 1. Draw Phantom Shadow
  if (currentPiece) {
    const { shape, type, position } = currentPiece;
    const dy = shadowY - position.y; // distance to shadow

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const targetY = shadowY + r;
          const targetX = position.x + c;

          if (targetY >= 0 && targetY < ROWS && targetX >= 0 && targetX < COLS) {
            // Only draw shadow if there's no solid block already there
            if (!renderGrid[targetY][targetX].cellType) {
              renderGrid[targetY][targetX] = {
                cellType: type,
                isShadow: true,
                isActive: false,
              };
            }
          }
        }
      }
    }
  }

  // 2. Draw Active Moving Piece
  if (currentPiece) {
    const { shape, type, position } = currentPiece;

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const targetY = position.y + r;
          const targetX = position.x + c;

          if (targetY >= 0 && targetY < ROWS && targetX >= 0 && targetX < COLS) {
            renderGrid[targetY][targetX] = {
              cellType: type,
              isShadow: false,
              isActive: true,
            };
          }
        }
      }
    }
  }

  return (
    <div className="relative p-3.5 glass-panel rounded-[24px] shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Visual background elements */}
      <div className="absolute inset-0 bg-grid-white/[0.015] pointer-events-none" />

      {/* Main Grid container with specific 0,0,0,0.4 back and glass border */}
      <div 
        id="tetris-grid-container"
        className="grid grid-cols-10 gap-[1px] bg-black/40 p-1.5 rounded-xl border-2 border-white/15 max-w-full w-[210px] min-[370px]:w-[240px] sm:w-[300px] aspect-[1/2]"
      >
        {renderGrid.map((row, r) =>
          row.map((cellState, c) => {
            const { cellType, isShadow, isActive } = cellState;
            let blockClass = "bg-transparent border border-white/[0.02]";
            let customStyle = {};

            if (cellType && !isShadow) {
              // Locked or active solid piece
              const blockDef = TETROMINO_MAP[cellType];
              blockClass = `${blockDef.color} border rounded-[4px] transition-all duration-100`;
            } else if (cellType && isShadow) {
              // Ghost shadow block exactly from design: rgba(255,255,255,0.05) with 1px border
              blockClass = "bg-white/5 border border-white/10 rounded-[4px]";
            }

            return (
              <div
                key={`${r}-${c}`}
                id={`cell-${r}-${c}`}
                className={`relative aspect-square flex items-center justify-center transition-colors duration-200 ${blockClass}`}
                style={customStyle}
              >
                {/* Subtle top glare highlight for locked blocks to emphasize glassiness */}
                {cellType && !isShadow && (
                  <div className="absolute inset-x-[1px] top-[1px] h-[30%] bg-white/20 rounded-t-[2px] pointer-events-none" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
