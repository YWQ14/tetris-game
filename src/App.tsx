import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameBoard } from './components/GameBoard';
import { SidePanel, BlockPreview } from './components/SidePanel';
import { Controls } from './components/Controls';
import { RetroBackground } from './components/RetroBackground';
import { useTetris } from './hooks/useTetris';
import { audio } from './utils/audio';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Gamepad2, Award } from 'lucide-react';

export default function App() {
  const {
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
  } = useTetris();

  const [soundEnabled, setSoundEnabled] = useState(true);

  // Synchronize local sound state with singleton controller
  useEffect(() => {
    audio.enabled = soundEnabled;
  }, [soundEnabled]);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'PLAYING') {
        // Allow starting/resuming with certain keys
        if (e.key === 'Enter') {
          if (status === 'IDLE' || status === 'GAME_OVER') {
            startGame();
          } else if (status === 'PAUSED') {
            resumeGame();
          }
        } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
          if (status === 'PAUSED') {
            resumeGame();
          }
        }
        return;
      }

      // Prevent default scrolling on arrow keys & space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Spacebar'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          moveLeft();
          break;
        case 'arrowright':
        case 'd':
          moveRight();
          break;
        case 'arrowdown':
        case 's':
          moveDown();
          break;
        case 'arrowup':
        case 'w':
          rotate();
          break;
        case ' ':
          hardDrop();
          break;
        case 'c':
        case 'shift':
          hold();
          break;
        case 'p':
        case 'escape':
          pauseGame();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [status, moveLeft, moveRight, moveDown, rotate, hardDrop, hold, pauseGame, resumeGame, startGame]);

  const renderOverlays = () => (
    <AnimatePresence>
      {status === 'IDLE' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute inset-0 glass-panel rounded-[24px] flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl z-20"
        >
          <div className="mb-6 space-y-2">
            <motion.h2 
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-4xl sm:text-5xl font-display font-extrabold tracking-widest text-white text-glow-cyan"
            >
              TETRIS
            </motion.h2>
            <p className="text-xs font-mono text-white/60 max-w-[200px] mx-auto leading-relaxed">
              Stapel de blokken, maak lijnen compleet en geniet van de frosted minimalistische sfeer!
            </p>
          </div>

          <button
            onClick={startGame}
            className="flex items-center gap-2 px-6 py-3.5 bg-white/15 hover:bg-white/20 border border-white/20 text-white font-sans text-xs font-bold tracking-[1px] rounded-xl shadow-lg active:scale-95 transition-all duration-150"
          >
            <Play className="w-4 h-4 fill-white text-white" />
            START SPEL
          </button>
        </motion.div>
      )}

      {status === 'PAUSED' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 glass-panel rounded-[24px] flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl z-20"
        >
          <h2 className="text-3xl font-display font-bold tracking-wider text-white mb-2 text-glow-cyan">
            GEPAUZEERD
          </h2>
          <p className="text-xs font-mono text-white/60 mb-6">
            Druk op P of Hervat om verder te gaan
          </p>

          <div className="flex flex-col gap-2 w-48">
            <button
              onClick={resumeGame}
              className="w-full py-3 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-sans text-xs font-bold rounded-xl shadow transition"
            >
              HERVAT SPEL
            </button>
            <button
              onClick={startGame}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-sans text-xs font-semibold rounded-xl transition"
            >
              NIEUW SPEL
            </button>
          </div>
        </motion.div>
      )}

      {status === 'GAME_OVER' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="absolute inset-0 glass-panel rounded-[24px] flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl z-20"
        >
          <Award className="w-12 h-12 text-rose-400 mb-2 animate-bounce" />
          <h2 className="text-3xl font-display font-bold tracking-wider text-rose-400 mb-1">
            GAME OVER
          </h2>
          
          <div className="bg-black/30 border border-white/10 rounded-xl p-4 my-4 w-52 space-y-1.5 shadow-inner">
            <div className="flex justify-between text-xs font-mono text-white/60">
              <span>Eindscore:</span>
              <span className="font-bold text-amber-300">{stats.score}</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-white/60">
              <span>Lijnen:</span>
              <span className="font-bold text-emerald-300">{stats.lines}</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-white/60">
              <span>Level:</span>
              <span className="font-bold text-cyan-300">{stats.level}</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 border border-white/20 text-white font-sans text-xs font-bold rounded-xl active:scale-95 transition"
          >
            <RotateCcw className="w-4 h-4" />
            SPEEL OPNIEUW
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 select-none text-white font-sans overflow-x-hidden">
      {/* Immersive radial mesh background */}
      <RetroBackground />

      {/* --- HEADER --- */}
      <header className="w-full max-w-4xl flex items-center justify-between border-b border-white/10 pb-4 mb-4 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 border border-white/15 rounded-xl shadow-lg">
            <Gamepad2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-display font-bold tracking-tight text-white text-glow-cyan">
              TETRI-GLASS
            </h1>
            <p className="text-[10px] sm:text-xs font-mono text-white/50 tracking-wider uppercase">
              Frosted Glass Arcade
            </p>
          </div>
        </div>

        {/* Action Controls / Toggle Sounds */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition-all duration-300 ${
              soundEnabled
                ? 'bg-white/15 border-white/20 hover:bg-white/20 text-cyan-400 shadow-md'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/40'
            }`}
            title={soundEnabled ? "Geluid Dempen" : "Geluid Inschakelen"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {status === 'PLAYING' && (
            <button
              onClick={pauseGame}
              className="p-2.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white/80 rounded-xl transition"
              title="Spel Pauzeren (P)"
            >
              <Pause className="w-5 h-5" />
            </button>
          )}

          {status === 'PAUSED' && (
            <button
              onClick={resumeGame}
              className="p-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-200 rounded-xl transition animate-pulse"
              title="Spel Hervatten (P)"
            >
              <Play className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* --- MAIN GAME LAYOUT --- */}
      <main className="w-full max-w-4xl flex-1 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 my-auto z-10 w-full px-2 sm:px-4">
        
        {/* --- DESKTOP VIEW (Visible on tablet/desktop) --- */}
        <div className="hidden md:flex flex-row items-start justify-center gap-8 w-full">
          {/* Left Column: Game Board */}
          <div className="relative flex flex-col items-center">
            <GameBoard
              grid={grid}
              currentPiece={currentPiece}
              shadowY={getShadowY()}
            />
            {/* Interactive Screen Overlays */}
            {renderOverlays()}
          </div>

          {/* Right Column: SidePanel and Controls */}
          <div className="flex flex-col gap-6 w-56">
            <SidePanel
              stats={stats}
              nextPieceType={nextPieceType}
              holdPieceType={holdPieceType}
            />
            
            <Controls
              onMoveLeft={moveLeft}
              onMoveRight={moveRight}
              onMoveDown={moveDown}
              onRotate={rotate}
              onHardDrop={hardDrop}
              onHold={hold}
              disabled={status !== 'PLAYING'}
            />
          </div>
        </div>

        {/* --- SMARTPHONE VIEW (Visible on mobile) --- */}
        <div className="flex md:hidden flex-col items-center gap-3 w-full max-w-[340px] sm:max-w-[400px]">
          {/* Mobile Top Stats Bar */}
          <div className="grid grid-cols-3 gap-2 w-full glass-panel p-2 rounded-[16px] text-center">
            <div>
              <span className="text-[8px] font-sans font-semibold text-white/50 block uppercase tracking-wider">Score</span>
              <span className="text-sm font-mono font-bold text-amber-300">{stats.score.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[8px] font-sans font-semibold text-white/50 block uppercase tracking-wider">Level</span>
              <span className="text-sm font-mono font-bold text-cyan-400">{stats.level}</span>
            </div>
            <div>
              <span className="text-[8px] font-sans font-semibold text-white/50 block uppercase tracking-wider">Highscore</span>
              <span className="text-sm font-mono font-bold text-yellow-400">{stats.highScore.toLocaleString()}</span>
            </div>
          </div>

          {/* Mobile Game Console Grid */}
          <div className="flex items-stretch justify-center gap-2.5 w-full">
            {/* Left Column: Hold Block */}
            <div className="flex flex-col justify-start gap-2.5 w-14">
              <BlockPreview type={holdPieceType} label="Held" compact />
              <div className="glass-panel p-2 rounded-[14px] text-center mt-1">
                <span className="text-[7px] font-sans font-semibold text-white/50 block uppercase tracking-wider">Lijnen</span>
                <span className="text-xs font-mono font-bold text-emerald-400">{stats.lines}</span>
              </div>
            </div>

            {/* Center: Game Board */}
            <div className="relative">
              <GameBoard
                grid={grid}
                currentPiece={currentPiece}
                shadowY={getShadowY()}
              />
              {/* Interactive Screen Overlays for mobile */}
              {renderOverlays()}
            </div>

            {/* Right Column: Next Block */}
            <div className="flex flex-col justify-start gap-2.5 w-14">
              <BlockPreview type={nextPieceType} label="Volg" compact />
              <div className="glass-panel p-2 rounded-[14px] text-center mt-1">
                <span className="text-[7px] font-sans font-semibold text-white/50 block uppercase tracking-wider">Target</span>
                <span className="text-[10px] font-mono font-bold text-purple-300">
                  {Math.max(0, stats.level * 10 - stats.lines)}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Bottom Controller */}
          <div className="w-full mt-1">
            <Controls
              onMoveLeft={moveLeft}
              onMoveRight={moveRight}
              onMoveDown={moveDown}
              onRotate={rotate}
              onHardDrop={hardDrop}
              onHold={hold}
              disabled={status !== 'PLAYING'}
            />
          </div>
        </div>

      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full max-w-4xl text-center border-t border-white/10 pt-4 mt-6 z-10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span className="text-[10px] font-sans font-semibold tracking-[1px] text-white/40 uppercase">
          TETRI-GLASS v1.0.4
        </span>
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
          Spatie = Drop &bull; Up / W = Roteer &bull; Shift = Wissel &bull; Esc = Pauze
        </span>
      </footer>
    </div>
  );
}
