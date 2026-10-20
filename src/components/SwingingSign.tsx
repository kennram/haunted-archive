'use client'

import React from 'react'

export default function SwingingSign() {
  return (
    <div className="flex flex-col items-center pt-2 pb-6 select-none">
      {/* Wrought-Iron Wall Mount Bracket / Chain Anchor */}
      <div className="w-48 h-3 bg-zinc-900 border border-zinc-700 rounded-sm shadow-lg relative flex justify-around">
        <div className="w-1 h-6 bg-zinc-800 -bottom-6 absolute left-6" />
        <div className="w-1 h-6 bg-zinc-800 -bottom-6 absolute right-6" />
      </div>

      {/* Swinging Sign Container */}
      <div className="animate-swing pt-6">
        <div className="bg-[#1c120d] border-4 border-amber-900/80 px-8 py-5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] text-center relative max-w-lg mx-auto">
          {/* Subtle wood grain texture overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#451a03_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none rounded-lg" />
          
          <div className="relative z-10 space-y-1">
            <h1 className="text-4xl sm:text-6xl font-black font-mono tracking-tighter text-red-500 uppercase drop-shadow-[3px_3px_0px_#22c55e] italic leading-none">
              HAUNTED ARCHIVE
            </h1>
            <p className="text-green-400 font-mono text-[10px] sm:text-xs uppercase tracking-[0.25em] font-black pt-1">
              IFI@HOME HORROR COLLECTION
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}