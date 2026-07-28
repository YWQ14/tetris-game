import { useState, useEffect, useCallback, useRef } from 'react';
import { Grid, BlockType, Tetromino, GameStats, GameStatus, Point } from '../types';
import { COLS, ROWS, TETROMINO_MAP, TETROMINO_TYPES, SPEED_MAP, SCORE_MAP } from '../constants';
import { audio } from '../utils/audio';

// Helper to generate an empty game grid
const createEmptyGrid = (): Grid =>
  Array.from({ length: ROWS }, () => Array(COLS).fill(null));

// Get a random Tetromino type
const getRandomType = (): Exclude<BlockType, null> => {
  const index = Math.floor(Math.random() * TETROMINO_TYPES.length);
  return TETROMINO_TYPES[index];
};

export const useTetris = () => {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  
  // Game stats
  const [stats, setStats] = useState<GameStats>(() => {
    const savedHighScore = localStorage.getItem('tetris_high_score');
    return {
      score: 0,
      highScore: savedHighScore ? parseInt(savedHighScore, 10) : 0,
      lines: 0,
      level: 1,
    };
  });

  // Current piece details
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    type: Exclude<BlockType, null>;
    position: Point;
  } | null>(null);

  // Next piece preview
  const [nextPieceType, setNextPieceType] = useState<Exclude<BlockType, null>>(getRandomType);

  // Hold piece
  const [holdPieceType, setHoldPieceType] = useState<Exclude<BlockType, null> | null>(null);
  const [hasHeldThisTurn, setHasHeldThisTurn] = useState<boolean>(false);

  // Reference for tick interval
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reset or start game
  const startGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setHoldPieceType(null);
    setHasHeldThisTurn(false);
    
    // Spawn first piece
    const firstType = getRandomType();
    const nextType = getRandomType();
    
    setCurrentPiece({
      shape: TETROMINO_MAP[firstType].shape,
      type: firstType,
      position: { x: Math.floor(COLS / 2) - 1, y: -1 }, // Start slightly offscreen/at top
    });
    setNextPieceType(nextType);

    setStats((prev) => ({
      ...prev,
      score: 0,
      lines: 0,
      level: 1,
    }));
    setStatus('PLAYING');
  }, []);

  const pauseGame = useCallback(() => {
    if (status === 'PLAYING') {
      setStatus('PAUSED');
    }
  }, [status]);

  const resumeGame = useCallback(() => {
    if (status === 'PAUSED') {
      setStatus('PLAYING');
    }
  }, [status]);

  // Check collision for a hypothetical piece state
  const checkCollision = useCallback((
    shape: number[][],
    position: Point,
    currentGrid: Grid
  ): boolean => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const nextX = position.x + c;
          const nextY = position.y + r;

          // Check walls and bottom bounds
          if (nextX < 0 || nextX >= COLS || nextY >= ROWS) {
            return true;
          }

          // Check overlapping with placed blocks
          if (nextY >= 0 && currentGrid[nextY][nextX] !== null) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Soft drop / Move down
  const moveDown = useCallback(() => {
    if (status !== 'PLAYING' || !currentPiece) return false;

    const nextPos = { ...currentPiece.position, y: currentPiece.position.y + 1 };
    
    if (!checkCollision(currentPiece.shape, nextPos, grid)) {
      setCurrentPiece((prev) => prev ? { ...prev, position: nextPos } : null);
      audio.playMove();
      return true;
    } else {
      // Collision detected below: lock piece
      lockPiece();
      return false;
    }
  }, [status, currentPiece, grid, checkCollision]);

  // Lock piece into the grid
  const lockPiece = useCallback(() => {
    if (!currentPiece) return;

    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);
      let isGameOver = false;

      // Lock current block into the board
      for (let r = 0; r < currentPiece.shape.length; r++) {
        for (let c = 0; c < currentPiece.shape[r].length; c++) {
          if (currentPiece.shape[r][c] !== 0) {
            const blockY = currentPiece.position.y + r;
            const blockX = currentPiece.position.x + c;

            if (blockY < 0) {
              // Block locked above screen = Game Over
              isGameOver = true;
            } else if (blockY < ROWS && blockX >= 0 && blockX < COLS) {
              newGrid[blockY][blockX] = currentPiece.type;
            }
          }
        }
      }

      if (isGameOver) {
        setStatus('GAME_OVER');
        audio.playGameOver();
        
        // Update high score in local storage
        setStats((prev) => {
          if (prev.score > prev.highScore) {
            localStorage.setItem('tetris_high_score', prev.score.toString());
            return { ...prev, highScore: prev.score };
          }
          return prev;
        });
        return prevGrid;
      }

      audio.playDrop();

      // Check full lines
      let linesCleared = 0;
      const filteredGrid = newGrid.filter((row) => {
        const isFull = row.every((cell) => cell !== null);
        if (isFull) linesCleared++;
        return !isFull;
      });

      // Insert empty rows at the top for cleared lines
      while (filteredGrid.length < ROWS) {
        filteredGrid.unshift(Array(COLS).fill(null));
      }

      // Handle stats updates if lines cleared
      if (linesCleared > 0) {
        audio.playLineClear(linesCleared);
        
        setStats((prev) => {
          const newLines = prev.lines + linesCleared;
          // Level up every 10 lines, max level 10
          const newLevel = Math.min(10, Math.floor(newLines / 10) + 1);
          
          if (newLevel > prev.level) {
            audio.playLevelUp();
          }

          const basePoints = SCORE_MAP[linesCleared as keyof typeof SCORE_MAP] || 100;
          const pointsEarned = basePoints * prev.level;
          const newScore = prev.score + pointsEarned;

          return {
            ...prev,
            lines: newLines,
            level: newLevel,
            score: newScore,
          };
        });
      }

      // Spawn next piece
      const nextType = getRandomType();
      
      setCurrentPiece({
        shape: TETROMINO_MAP[nextPieceType].shape,
        type: nextPieceType,
        position: { x: Math.floor(COLS / 2) - 1, y: -1 },
      });
      setNextPieceType(nextType);
      setHasHeldThisTurn(false);

      return filteredGrid;
    });
  }, [currentPiece, nextPieceType]);

  // Hard drop: instantaneously drop the piece to the bottom
  const hardDrop = useCallback(() => {
    if (status !== 'PLAYING' || !currentPiece) return;

    let currentY = currentPiece.position.y;
    while (!checkCollision(currentPiece.shape, { x: currentPiece.position.x, y: currentY + 1 }, grid)) {
      currentY++;
    }

    // Set final position, then immediately lock
    const finalPiece = {
      ...currentPiece,
      position: { x: currentPiece.position.x, y: currentY },
    };

    setCurrentPiece(finalPiece);
    
    // We lock it. To avoid state async issues, we perform lock sequence directly using finalPiece
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) => [...row]);
      let isGameOver = false;

      for (let r = 0; r < finalPiece.shape.length; r++) {
        for (let c = 0; c < finalPiece.shape[r].length; c++) {
          if (finalPiece.shape[r][c] !== 0) {
            const blockY = finalPiece.position.y + r;
            const blockX = finalPiece.position.x + c;

            if (blockY < 0) {
              isGameOver = true;
            } else if (blockY < ROWS && blockX >= 0 && blockX < COLS) {
              newGrid[blockY][blockX] = finalPiece.type;
            }
          }
        }
      }

      if (isGameOver) {
        setStatus('GAME_OVER');
        audio.playGameOver();
        setStats((prev) => {
          if (prev.score > prev.highScore) {
            localStorage.setItem('tetris_high_score', prev.score.toString());
            return { ...prev, highScore: prev.score };
          }
          return prev;
        });
        return prevGrid;
      }

      audio.playDrop();

      let linesCleared = 0;
      const filteredGrid = newGrid.filter((row) => {
        const isFull = row.every((cell) => cell !== null);
        if (isFull) linesCleared++;
        return !isFull;
      });

      while (filteredGrid.length < ROWS) {
        filteredGrid.unshift(Array(COLS).fill(null));
      }

      if (linesCleared > 0) {
        audio.playLineClear(linesCleared);
        setStats((prev) => {
          const newLines = prev.lines + linesCleared;
          const newLevel = Math.min(10, Math.floor(newLines / 10) + 1);
          if (newLevel > prev.level) audio.playLevelUp();
          const basePoints = SCORE_MAP[linesCleared as keyof typeof SCORE_MAP] || 100;
          const pointsEarned = basePoints * prev.level;
          return {
            ...prev,
            lines: newLines,
            level: newLevel,
            score: prev.score + pointsEarned,
          };
        });
      }

      const nextType = getRandomType();
      setCurrentPiece({
        shape: TETROMINO_MAP[nextPieceType].shape,
        type: nextPieceType,
        position: { x: Math.floor(COLS / 2) - 1, y: -1 },
      });
      setNextPieceType(nextType);
      setHasHeldThisTurn(false);

      return filteredGrid;
    });
  }, [status, currentPiece, grid, checkCollision, nextPieceType]);

  // Move left
  const moveLeft = useCallback(() => {
    if (status !== 'PLAYING' || !currentPiece) return;
    const nextPos = { ...currentPiece.position, x: currentPiece.position.x - 1 };
    if (!checkCollision(currentPiece.shape, nextPos, grid)) {
      setCurrentPiece((prev) => prev ? { ...prev, position: nextPos } : null);
      audio.playMove();
    }
  }, [status, currentPiece, grid, checkCollision]);

  // Move right
  const moveRight = useCallback(() => {
    if (status !== 'PLAYING' || !currentPiece) return;
    const nextPos = { ...currentPiece.position, x: currentPiece.position.x + 1 };
    if (!checkCollision(currentPiece.shape, nextPos, grid)) {
      setCurrentPiece((prev) => prev ? { ...prev, position: nextPos } : null);
      audio.playMove();
    }
  }, [status, currentPiece, grid, checkCollision]);

  // Rotate piece matrix clockwise with Wall-kicks
  const rotate = useCallback(() => {
    if (status !== 'PLAYING' || !currentPiece) return;

    const shape = currentPiece.shape;
    const n = shape.length;
    
    // Create new rotated shape
    const rotated = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        rotated[c][n - 1 - r] = shape[r][c];
      }
    }

    // Attempt rotation with wall-kick shifts: Try original position, then left/right offset adjustments
    const kicks = [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: -2, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: -1 }, // upward kick
    ];

    for (const kick of kicks) {
      const testPos = {
        x: currentPiece.position.x + kick.x,
        y: currentPiece.position.y + kick.y,
      };

      if (!checkCollision(rotated, testPos, grid)) {
        setCurrentPiece((prev) => prev ? { ...prev, shape: rotated, position: testPos } : null);
        audio.playRotate();
        return;
      }
    }
  }, [status, currentPiece, grid, checkCollision]);

  // Hold current piece
  const hold = useCallback(() => {
    if (status !== 'PLAYING' || !currentPiece || hasHeldThisTurn) return;

    audio.playHold();
    const currentType = currentPiece.type;

    if (holdPieceType === null) {
      // First hold of the game
      setHoldPieceType(currentType);
      setCurrentPiece({
        shape: TETROMINO_MAP[nextPieceType].shape,
        type: nextPieceType,
        position: { x: Math.floor(COLS / 2) - 1, y: -1 },
      });
      setNextPieceType(getRandomType());
    } else {
      // Swap held piece with current piece
      const nextHoldType = holdPieceType;
      setHoldPieceType(currentType);
      setCurrentPiece({
        shape: TETROMINO_MAP[nextHoldType].shape,
        type: nextHoldType,
        position: { x: Math.floor(COLS / 2) - 1, y: -1 },
      });
    }

    setHasHeldThisTurn(true);
  }, [status, currentPiece, holdPieceType, nextPieceType, hasHeldThisTurn]);

  // Core gameplay tick timer loop
  useEffect(() => {
    if (status !== 'PLAYING') {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
        gameIntervalRef.current = null;
      }
      return;
    }

    const currentSpeed = SPEED_MAP[stats.level as keyof typeof SPEED_MAP] || 100;

    gameIntervalRef.current = setInterval(() => {
      moveDown();
    }, currentSpeed);

    return () => {
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [status, stats.level, moveDown]);

  // Calculate phantom shadow / preview placement at the bottom
  const getShadowY = useCallback((): number => {
    if (!currentPiece) return 0;
    let shadowY = currentPiece.position.y;
    while (!checkCollision(currentPiece.shape, { x: currentPiece.position.x, y: shadowY + 1 }, grid)) {
      shadowY++;
    }
    return shadowY;
  }, [currentPiece, grid, checkCollision]);

  return {
    grid,
    status,
    stats,
    currentPiece,
    nextPieceType,
    holdPieceType,
    startGame,
    pauseGame,
    resumeGame,
    moveLeft,
    moveRight,
    moveDown,
    hardDrop,
    rotate,
    hold,
    getShadowY,
  };
};
