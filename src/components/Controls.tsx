import React from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, RotateCw, Download, Shuffle } from 'lucide-react';

interface ControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  onHold: () => void;
  disabled: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  onHold,
  disabled,
}) => {
  const handleTouch = (e: React.TouchEvent<HTMLButtonElement>, action: () => void) => {
    if (disabled) return;
    e.preventDefault();
    action();
  };

  return (
    <div className="w-full flex flex-col gap-5 glass-panel p-4 rounded-[24px] backdrop-blur-md">
      {/* 1. Mobile Touch Controls Pad */}
      <div className="flex flex-col items-center gap-3">
        <span className="text-[10px] font-sans font-semibold tracking-[1.5px] text-white/50 uppercase">Mobiele Besturing</span>
        
        <div className="grid grid-cols-3 gap-2 w-full max-w-[280px]">
          {/* Top row: Hold, Rotate, Hard Drop */}
          <button
            onTouchStart={(e) => handleTouch(e, onHold)}
            onClick={() => !disabled && onHold()}
            disabled={disabled}
            className="flex flex-col items-center justify-center p-2.5 bg-white/10 hover:bg-white/15 disabled:opacity-30 rounded-xl border border-white/10 text-white transition active:scale-95 shadow-md group touch-none"
            title="Wissel blok (Shift / C)"
          >
            <Shuffle className="w-5 h-5 text-indigo-300 group-hover:rotate-12 transition-transform" />
            <span className="text-[9px] font-mono mt-1 text-white/70">HOLD</span>
          </button>

          <button
            onTouchStart={(e) => handleTouch(e, onRotate)}
            onClick={() => !disabled && onRotate()}
            disabled={disabled}
            className="flex flex-col items-center justify-center p-2.5 bg-white/10 hover:bg-white/15 disabled:opacity-30 rounded-xl border border-white/10 text-white transition active:scale-95 shadow-md group touch-none"
            title="Draai blok (Pijltje Omhoog / W)"
          >
            <RotateCw className="w-5 h-5 text-cyan-300 group-hover:rotate-90 transition-transform duration-200" />
            <span className="text-[9px] font-mono mt-1 text-cyan-200">ROTEER</span>
          </button>

          <button
            onTouchStart={(e) => handleTouch(e, onHardDrop)}
            onClick={() => !disabled && onHardDrop()}
            disabled={disabled}
            className="flex flex-col items-center justify-center p-2.5 bg-white/10 hover:bg-white/15 disabled:opacity-30 rounded-xl border border-white/10 text-white transition active:scale-95 shadow-md group touch-none"
            title="Hard vallen (Spatiebalk)"
          >
            <Download className="w-5 h-5 text-amber-300 group-hover:translate-y-0.5 transition-transform" />
            <span className="text-[9px] font-mono mt-1 text-amber-200">DROP</span>
          </button>

          {/* Bottom Row: Move Left, Move Down, Move Right */}
          <button
            onTouchStart={(e) => handleTouch(e, onMoveLeft)}
            onClick={() => !disabled && onMoveLeft()}
            disabled={disabled}
            className="p-3.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-xl border border-white/10 flex items-center justify-center text-white transition active:scale-95 shadow-md touch-none"
            title="Beweeg Links"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <button
            onTouchStart={(e) => handleTouch(e, onMoveDown)}
            onClick={() => !disabled && onMoveDown()}
            disabled={disabled}
            className="p-3.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-xl border border-white/10 flex items-center justify-center text-white transition active:scale-95 shadow-md touch-none"
            title="Beweeg Omlaag"
          >
            <ArrowDown className="w-5 h-5" />
          </button>

          <button
            onTouchStart={(e) => handleTouch(e, onMoveRight)}
            onClick={() => !disabled && onMoveRight()}
            disabled={disabled}
            className="p-3.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-xl border border-white/10 flex items-center justify-center text-white transition active:scale-95 shadow-md touch-none"
            title="Beweeg Rechts"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 2. Desktop Keyboard Guide */}
      <div className="hidden sm:flex flex-col gap-2 border-t border-white/10 pt-3">
        <span className="text-[10px] font-sans font-semibold tracking-[1.5px] text-white/50 uppercase text-center mb-1">Toetsenbord Gids</span>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono text-white/70">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded shadow text-[10px] text-white">A</kbd> / <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded shadow text-[10px] text-white">←</kbd>
            <span className="text-[11px]">Links</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded shadow text-[10px] text-white">D</kbd> / <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded shadow text-[10px] text-white">→</kbd>
            <span className="text-[11px]">Rechts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded shadow text-[10px] text-white">S</kbd> / <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded shadow text-[10px] text-white">↓</kbd>
            <span className="text-[11px]">Zacht val</span>
          </div>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded shadow text-[10px] text-white">W</kbd> / <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/10 rounded shadow text-[10px] text-white">↑</kbd>
            <span className="text-[11px]">Roteer</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <kbd className="px-2.5 py-0.5 bg-white/10 border border-white/10 rounded shadow text-[10px] text-white">Spatie</kbd>
            <span className="text-[11px]">Hard drop</span>
          </div>
        </div>
      </div>
    </div>
  );
};
