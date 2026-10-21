'use client'

import React from 'react'

export default function GameOverSign() {
  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      <style jsx>{`
        @keyframes gallowsSway {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(-5.5deg); }
          40% { transform: rotate(4deg); }
          60% { transform: rotate(-2.5deg); }
          80% { transform: rotate(1.2deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-gallows-sway {
          transform-origin: top center;
          animation: gallowsSway 3.8s ease-in-out infinite;
        }
      `}</style>

      {/* Heavy Iron Gallows Mounting Beam & Hooks */}
      <div className="relative w-72 sm:w-96 flex justify-between items-center z-20">
        <div className="w-4 h-4 rounded-full border-2 border-zinc-700 bg-zinc-950 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
        </div>
        <div className="h-1.5 w-full bg-gradient-to-r from-zinc-800 via-amber-950 to-zinc-800 border-t border-zinc-700" />
        <div className="w-4 h-4 rounded-full border-2 border-zinc-700 bg-zinc-950 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
        </div>
      </div>

      {/* Rusted Hanging Chains */}
      <div className="w-64 sm:w-80 flex justify-between px-6 z-10 -mt-1">
        <div className="flex flex-col items-center space-y-0.5">
          <div className="w-2 h-3 border-2 border-amber-900 bg-zinc-900 rounded-sm shadow" />
          <div className="w-2 h-3 border-2 border-zinc-700 bg-zinc-950 rounded-sm shadow" />
          <div className="w-2 h-3 border-2 border-amber-900 bg-zinc-900 rounded-sm shadow" />
        </div>
        <div className="flex flex-col items-center space-y-0.5">
          <div className="w-2 h-3 border-2 border-amber-900 bg-zinc-900 rounded-sm shadow" />
          <div className="w-2 h-3 border-2 border-zinc-700 bg-zinc-950 rounded-sm shadow" />
          <div className="w-2 h-3 border-2 border-amber-900 bg-zinc-900 rounded-sm shadow" />
        </div>
      </div>

      {/* SWINGING DISTRESSED WOODEN SIGNPOST */}
      <div className="animate-gallows-sway relative -mt-1 z-30">
        <div className="relative bg-[#20120b] border-4 border-amber-950 rounded-lg p-4 sm:p-5 shadow-[0_15px_35px_rgba(0,0,0,0.95)] max-w-xs sm:max-w-sm text-center transform overflow-hidden">
          
          {/* Wood Grain & Distressed Scratch Texture */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#78350f_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.6)_50%,rgba(255,255,255,0.05)_50%)] bg-[length:100%_4px] opacity-25 pointer-events-none" />

          {/* Splattered Stain Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

          {/* Rusted Corner Iron Brackets */}
          <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-800" />
          <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-800" />
          <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-800" />
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-800" />

          <div className="relative z-10 space-y-1">
            <span className="text-[9px] sm:text-[10px] font-mono font-black tracking-[0.3em] text-red-500 uppercase block drop-shadow">
              PROJECTION BOOTH LOCKED
            </span>
            <h2 className="text-3xl sm:text-5xl font-mono font-black text-red-600 tracking-tighter uppercase italic drop-shadow-[2px_3px_0px_#000000]">
              GAME OVER
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}