'use client'

import React, { useState, useEffect } from 'react'
import HorrorScene from '@/components/HorrorScene'
import { soundFx } from '@/lib/audio'

interface MovieTrivia {
  title: string
  hint: string
  category: 'SLASHER' | 'MIDNIGHT MOVIE' | 'VIDEO NASTY' | 'B-CREATURE FEAT'
  minLevel: number
}

// Tiered Movie Database
const MOVIES: MovieTrivia[] = [
  // --- TIER 1: LEVELS 1-3 ---
  { title: 'HALLOWEEN', hint: 'Michael Myers haunts Haddonfield on a chilly autumn night.', category: 'SLASHER', minLevel: 1 },
  { title: 'PSYCHO', hint: 'Norman Bates runs a quiet motel with his mother.', category: 'SLASHER', minLevel: 1 },
  { title: 'THE SHINING', hint: 'Overlook Hotel caretaker descends into madness.', category: 'SLASHER', minLevel: 1 },
  { title: 'THE EXORCIST', hint: 'A young girl possessed in Georgetown requires a desperate rite.', category: 'MIDNIGHT MOVIE', minLevel: 1 },
  { title: 'JAWS', hint: 'A great white terrorizes a New England summer resort town.', category: 'B-CREATURE FEAT', minLevel: 1 },
  { title: 'CARRIE', hint: 'Telekinetic teenager takes revenge at her high school prom.', category: 'MIDNIGHT MOVIE', minLevel: 1 },
  { title: 'FRIDAY THE 13TH', hint: 'Camp Crystal Lake counselors face a shadowy killer.', category: 'SLASHER', minLevel: 1 },
  { title: 'THE SILENCE OF THE LAMBS', hint: 'FBI trainee seeks help from an incarcerated cannibal.', category: 'MIDNIGHT MOVIE', minLevel: 1 },
  { title: 'THE BLAIR WITCH PROJECT', hint: 'Film students vanish while investigating a Maryland legend.', category: 'MIDNIGHT MOVIE', minLevel: 1 },
  { title: 'SCREAM', hint: 'Ghostface terrorizes Woodsboro teens with scary movie trivia.', category: 'SLASHER', minLevel: 2 },
  { title: 'THE OMEN', hint: 'An American diplomat unknowingly adopts the Antichrist.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'POLTERGEIST', hint: 'Suburban family home built over a relocated cemetery.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'CHILD S PLAY', hint: 'A dying serial killer transfers his soul into a Chucky doll.', category: 'SLASHER', minLevel: 2 },
  { title: 'THE RING', hint: 'A cursed videotape kills the viewer seven days after watching.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'THE BIRDS', hint: 'Hitchcock thriller where avian swarms attack a coastal town.', category: 'B-CREATURE FEAT', minLevel: 3 },
  { title: 'MISERY', hint: 'An obsessed fan holds her favorite novelist captive in a remote cabin.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'NIGHT OF THE LIVING DEAD', hint: 'George Romero classic where reanimated corpses besiege a farmhouse.', category: 'MIDNIGHT MOVIE', minLevel: 3 },

  // --- TIER 2: LEVELS 4-6 ---
  { title: 'SUSPIRIA', hint: 'Dario Argento dance academy secretly run by witches.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'A NIGHTMARE ON ELM STREET', hint: 'Freddy Krueger hunts teenagers in their dreams.', category: 'SLASHER', minLevel: 4 },
  { title: 'THE THING', hint: 'Shape-shifting alien terrorizes Antarctic research station.', category: 'B-CREATURE FEAT', minLevel: 4 },
  { title: 'ALIEN', hint: 'In space no one can hear you scream aboard the Nostromo.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'THE HOWLING', hint: 'A television news anchor visits a secluded resort overrun by lycanthropes.', category: 'B-CREATURE FEAT', minLevel: 4 },
  { title: 'THE FOG', hint: 'John Carpenter tale of a glowing mist bringing vengeful leper ghosts.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'THE FLY', hint: 'Cronenberg scientist teleports with insect consequences.', category: 'B-CREATURE FEAT', minLevel: 5 },
  { title: 'DAWN OF THE DEAD', hint: 'Survivors barricade themselves inside a shopping mall.', category: 'VIDEO NASTY', minLevel: 5 },
  { title: 'HELLRAISER', hint: 'Mysterious puzzle box summons extradimensional Cenobites.', category: 'MIDNIGHT MOVIE', minLevel: 5 },
  { title: 'AN AMERICAN WEREWOLF IN LONDON', hint: 'Two American backpackers are attacked on the Yorkshire moors.', category: 'B-CREATURE FEAT', minLevel: 5 },
  { title: 'PHANTASM', hint: 'The Tall Man harvests bodies using flying silver spheres.', category: 'MIDNIGHT MOVIE', minLevel: 5 },
  { title: 'THE EVIL DEAD', hint: 'Friends unleash Sumerian demons in a remote cabin.', category: 'VIDEO NASTY', minLevel: 6 },
  { title: 'RE-ANIMATOR', hint: 'Medical student creates glowing reagent that revives the dead.', category: 'B-CREATURE FEAT', minLevel: 6 },
  { title: 'THE RETURN OF THE LIVING DEAD', hint: 'Trioxin gas creates brain-eating punk rock zombies.', category: 'B-CREATURE FEAT', minLevel: 6 },
  { title: 'MY BLOODY VALENTINE', hint: 'A pickaxe-wielding killer terrorizes a small mining town.', category: 'SLASHER', minLevel: 6 },

  // --- TIER 3: LEVELS 7-10+ ---
  { title: 'ERASERHEAD', hint: 'David Lynch surreal nightmare in black and white.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'THE TEXAS CHAINSAW MASSACRE', hint: 'Leatherface and his cannibal family in 1974.', category: 'VIDEO NASTY', minLevel: 7 },
  { title: 'LAST HOUSE ON THE LEFT', hint: 'Wes Craven controversial revenge feature from 1972.', category: 'VIDEO NASTY', minLevel: 7 },
  { title: 'HOUSE BY THE CEMETERY', hint: 'Lucio Fulci tale of Dr Freudstein lurking in the cellar.', category: 'VIDEO NASTY', minLevel: 7 },
  { title: 'CANNIBAL HOLOCAUST', hint: 'Documentary crew ventures deep into the Amazon basin.', category: 'VIDEO NASTY', minLevel: 8 },
  { title: 'POSSESSION', hint: 'Andrzej Zulawski psychological nightmare in West Berlin.', category: 'MIDNIGHT MOVIE', minLevel: 8 },
  { title: 'MANIAC', hint: 'William Lustig gritty slasher about a New York serial killer collecting scalps.', category: 'VIDEO NASTY', minLevel: 8 },
  { title: 'BLACK CHRISTMAS', hint: '1974 proto-slasher set in a sorority house over winter break.', category: 'SLASHER', minLevel: 8 },
  { title: 'RABID', hint: 'David Cronenberg body horror triggered by skin grafts.', category: 'VIDEO NASTY', minLevel: 9 },
  { title: 'TENEBRAE', hint: 'American writer in Rome stalked by a razor-wielding maniac.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'DEEP RED', hint: 'Dario Argento Giallo masterpiece involving a psychic reading.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'DRILLER KILLER', hint: 'An artist in NYC loses his sanity and turns to power tools.', category: 'VIDEO NASTY', minLevel: 9 },
  { title: 'THE BEYOND', hint: 'Lucio Fulci Gothic horror where a hotel sits on a gateway to hell.', category: 'VIDEO NASTY', minLevel: 10 },
  { title: 'VIDEODROME', hint: 'Television station CEO discovers a signal that causes hallucinations.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'CANNIBAL FEROX', hint: 'Infamous 1981 exploitation film banned in 31 countries.', category: 'VIDEO NASTY', minLevel: 10 },
  { title: 'ANGST', hint: 'Obscure Austrian masterpiece depicting an escaped convict on a rampage.', category: 'MIDNIGHT MOVIE', minLevel: 10 }
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const getLevelTimer = (level: number) => {
  if (level <= 3) return 45
  if (level <= 6) return 30
  if (level <= 9) return 20
  return 12
}

export default function Home() {
  const [hasStarted, setHasStarted] = useState<boolean>(false)

  const [currentMovie, setCurrentMovie] = useState<MovieTrivia>(MOVIES[0])
  const [playedTitles, setPlayedTitles] = useState<string[]>([])
  
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [wrongGuesses, setWrongGuesses] = useState<number>(0)
  const [curseLetters, setCurseLetters] = useState<string[]>([])
  
  const [level, setLevel] = useState<number>(1)
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(45)
  
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [gameWon, setGameWon] = useState<boolean>(false)
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false)
  
  const [musicOn, setMusicOn] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.2)

  const [highContrast, setHighContrast] = useState<boolean>(true)
  const [reduceMotion, setReduceMotion] = useState<boolean>(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false)
  const [showRulesMenu, setShowRulesMenu] = useState<boolean>(false)

  const maxWrong = 6

  // Load High Score from Local Storage
  useEffect(() => {
    const saved = localStorage.getItem('haunted_archive_highscore')
    if (saved) {
      setHighScore(parseInt(saved, 10))
    }
  }, [])

  const checkAndUpdateHighScore = (currentScore: number) => {
    if (currentScore > highScore) {
      setHighScore(currentScore)
      setIsNewRecord(true)
      localStorage.setItem('haunted_archive_highscore', currentScore.toString())
    }
  }

  const startNewGame = (nextLevel: boolean = false) => {
    soundFx.playClick()
    const newLevel = nextLevel ? level + 1 : 1
    const currentPlayed = nextLevel ? playedTitles : []
    
    if (!nextLevel) {
      setScore(0)
      setIsNewRecord(false)
    }
    
    setLevel(newLevel)
    setTimeLeft(getLevelTimer(newLevel))
    
    let eligibleMovies = MOVIES.filter((m) => m.minLevel <= newLevel)
    let unplayedMovies = eligibleMovies.filter((m) => !currentPlayed.includes(m.title))

    if (unplayedMovies.length === 0) {
      unplayedMovies = eligibleMovies
    }

    const movie = unplayedMovies[Math.floor(Math.random() * unplayedMovies.length)]
    
    setCurrentMovie(movie)
    setPlayedTitles([...currentPlayed, movie.title])
    setGuessedLetters([])
    setWrongGuesses(0)
    setGameOver(false)
    setGameWon(false)

    const uniqueLetters = Array.from(new Set(movie.title.replace(/[^A-Z]/g, '')))
    const count = newLevel >= 7 ? 2 : 1
    const shuffled = [...uniqueLetters].sort(() => 0.5 - Math.random())
    setCurseLetters(shuffled.slice(0, count))
  }

  const handleStartGame = () => {
    soundFx.playClick()
    setHasStarted(true)
    startNewGame(false)
  }

  useEffect(() => {
    if (!hasStarted || gameOver || gameWon || timeLeft <= 0) return

    if (timeLeft <= 10) {
      const urgencyFactor = (11 - timeLeft) / 10
      soundFx.playHeartbeat(urgencyFactor)
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          soundFx.playTrapSnap()
          soundFx.playGameOver()
          setGameOver(true)
          checkAndUpdateHighScore(score)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [hasStarted, timeLeft, gameOver, gameWon, score])

  useEffect(() => {
    if (gameWon) {
      const timer = setTimeout(() => {
        startNewGame(true)
      }, 1800)
      return () => clearTimeout(timer)
    }
  }, [gameWon])

  const handleMusicToggle = () => {
    const newState = !musicOn
    setMusicOn(newState)
    soundFx.toggleAmbientMusic(newState)
  }

  const handleGuess = (letter: string) => {
    if (guessedLetters.includes(letter) || gameOver || gameWon) return

    soundFx.playClick()
    const newGuessed = [...guessedLetters, letter]
    setGuessedLetters(newGuessed)

    const isCurse = curseLetters.includes(letter)

    if (!currentMovie.title.includes(letter)) {
      soundFx.playTrapSnap()
      const newWrong = wrongGuesses + 1
      setWrongGuesses(newWrong)
      if (newWrong >= maxWrong) {
        setGameOver(true)
        soundFx.playGameOver()
        checkAndUpdateHighScore(score)
      }
    } else if (isCurse) {
      soundFx.playTrapSnap()
      setWrongGuesses((prev) => {
        const updated = Math.min(prev + 2, maxWrong)
        if (updated >= maxWrong) {
          setGameOver(true)
          soundFx.playGameOver()
          checkAndUpdateHighScore(score)
        }
        return updated
      })
    }

    const titleClean = currentMovie.title.replace(/[^A-Z]/g, '')
    const isWon = titleClean.split('').every((l) => newGuessed.includes(l))
    if (isWon) {
      soundFx.playWin()
      setGameWon(true)
      const roundBonus = 100 * level + timeLeft * 10
      const newScore = score + roundBonus
      setScore(newScore)
      checkAndUpdateHighScore(newScore)
    }
  }

  return (
    <main className="h-screen max-h-screen w-screen bg-[#0c0a09] text-zinc-100 flex flex-col items-center justify-between p-2 md:p-4 relative overflow-hidden select-none">
      
      {/* CRT Scanline & Brightened Red Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-15 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.6)_50%)] bg-[length:100%_4px]" />
      <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.15)_0%,rgba(12,10,9,0.95)_100%)]" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl h-full flex flex-col justify-between py-1">
        
        {/* --- WELCOME SCREEN --- */}
        {!hasStarted ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="tracking-widest font-mono text-sm md:text-base font-black text-green-400 uppercase drop-shadow-[0_0_15px_rgba(34,197,94,1)]">
              🩸 IFI MIDNIGHT DRIVE-IN FEATURE PRESENTATION 🩸
            </div>

            <div className="space-y-4 max-w-2xl">
              <h1 className="text-5xl md:text-8xl font-black font-mono tracking-tighter text-red-500 uppercase drop-shadow-[6px_6px_0px_#22c55e] italic leading-none">
                HAUNTED ARCHIVE
              </h1>
              <p className="text-zinc-200 font-mono text-sm md:text-lg uppercase tracking-widest leading-relaxed max-w-xl mx-auto drop-shadow-md">
                Unravel classic horror titles frame-by-frame before the projection booth locks you in forever.
              </p>
            </div>

            {/* High Score Badge */}
            {highScore > 0 && (
              <div className="bg-zinc-900 border-2 border-yellow-400 px-5 py-2.5 rounded-lg font-mono text-xs md:text-sm text-yellow-300 font-black tracking-widest shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                🏆 BEST RECORD: {String(highScore).padStart(6, '0')} PTS
              </div>
            )}

            <div className="w-full max-w-xs pt-2">
              <button
                onClick={handleStartGame}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-yellow-300 font-mono text-xl font-black uppercase tracking-widest shadow-[0_0_35px_rgba(239,68,68,0.9)] transition-all hover:scale-105 active:scale-95 border-b-4 border-red-900 rounded-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
              >
                ▶ PLAY FEATURE
              </button>
            </div>

            <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold">
              RATED X FOR EXTREME TERROR • ALL NIGHT DOUBLE FEATURE
            </div>
          </div>
        ) : (
          /* --- ACTIVE GAMEPLAY INTERFACE --- */
          <>
            {/* Top Marquee Header */}
            <div className="w-full flex items-center justify-between pb-2 border-b-2 border-red-800/80 gap-4 shrink-0 bg-zinc-950/60 px-3 py-1.5 rounded-t-lg">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setShowSettingsMenu(!showSettingsMenu)
                    setShowRulesMenu(false)
                  }}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-red-950 text-red-400 font-mono text-xs font-black uppercase tracking-wider transition-all border border-red-700 shadow focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  ⚙️ MENU
                </button>

                <button
                  onClick={() => {
                    setShowRulesMenu(!showRulesMenu)
                    setShowSettingsMenu(false)
                  }}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-green-950 text-green-400 font-mono text-xs font-black uppercase tracking-wider transition-all border border-green-700 shadow focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  📜 RULES
                </button>
              </div>

              {/* High-Contrast Status Counters */}
              <div className="flex items-center space-x-5 md:space-x-7 font-mono text-xs md:text-sm">
                <div className="text-center">
                  <span className="text-[10px] text-zinc-300 block uppercase tracking-widest font-black">REEL</span>
                  <span className="font-black text-red-500 text-lg">{level}</span>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-zinc-300 block uppercase tracking-widest font-black">TIMER</span>
                  <span className={`font-black text-lg ${timeLeft <= 10 ? 'text-green-400 animate-pulse' : 'text-yellow-300'}`}>
                    {timeLeft}s
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-zinc-300 block uppercase tracking-widest font-black">SCORE</span>
                  <span className="font-black text-green-400 text-lg">
                    {String(score).padStart(6, '0')}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-yellow-400 block uppercase tracking-widest font-black">BEST</span>
                  <span className="font-black text-yellow-300 text-lg">
                    {String(highScore).padStart(6, '0')}
                  </span>
                </div>
              </div>
            </div>

            {/* RULES DROPDOWN */}
            {showRulesMenu && (
              <div className="absolute top-12 left-0 right-0 z-40 bg-zinc-950/95 border-l-4 border-green-500 p-4 space-y-3 font-mono text-xs shadow-2xl">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-green-400 font-bold uppercase tracking-widest">PROJECTIONIST INSTRUCTIONS</span>
                  <button onClick={() => setShowRulesMenu(false)} className="text-zinc-300 hover:text-white font-bold">✕ CLOSE</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-zinc-100 pt-1">
                  <div>
                    <p className="text-yellow-300 font-bold uppercase">1. OBJECTIVE</p>
                    <p className="text-[11px] mt-1 text-zinc-300">Solve horror movie titles before time runs out.</p>
                  </div>
                  <div>
                    <p className="text-red-400 font-bold uppercase">2. TRAPS</p>
                    <p className="text-[11px] mt-1 text-zinc-300">6 wrong guesses spring the trap completely.</p>
                  </div>
                  <div>
                    <p className="text-green-400 font-bold uppercase">3. CURSED LETTERS</p>
                    <p className="text-[11px] mt-1 text-zinc-300">Secret cursed letters trigger a +2 trap penalty.</p>
                  </div>
                </div>
              </div>
            )}

            {/* SETTINGS DROPDOWN */}
            {showSettingsMenu && (
              <div className="absolute top-12 left-0 right-0 z-40 bg-zinc-950/95 border-l-4 border-red-600 p-4 space-y-4 font-mono text-xs shadow-2xl">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-red-400 font-bold uppercase tracking-widest">CONFIGURATION</span>
                  <button onClick={() => setShowSettingsMenu(false)} className="text-zinc-300 hover:text-white font-bold">✕ CLOSE</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-zinc-200 font-bold uppercase">Audio System</p>
                    <button
                      onClick={handleMusicToggle}
                      className={`px-3 py-1 font-bold text-xs rounded ${musicOn ? 'bg-red-800 text-white' : 'bg-zinc-800 text-zinc-200 border border-zinc-700'}`}
                    >
                      {musicOn ? '🎵 SCORE: ON' : '🔇 SCORE: OFF'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-zinc-200 font-bold uppercase">Accessibility</p>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} className="accent-red-600 w-4 h-4" />
                      <span>High Contrast Mode</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Brightened Movie Hint Card */}
            <div className="w-full text-center space-y-1.5 py-2 px-4 bg-zinc-900/90 border border-red-900/80 rounded-xl shadow-lg shrink-0">
              <div className="flex justify-center items-center space-x-4">
                <span className="text-[10px] uppercase font-mono tracking-widest text-green-400 font-black px-3 py-1 bg-black border border-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                  GENRE: {currentMovie.category}
                </span>
                <span className="text-xs font-mono text-zinc-200">
                  TRAPS: <strong className="text-red-500 font-black text-sm">{wrongGuesses}</strong> / {maxWrong}
                </span>
              </div>

              <p className="text-xl md:text-2xl font-black font-mono text-white italic tracking-wide leading-relaxed drop-shadow-[0_2px_10px_rgba(239,68,68,0.5)]">
                "{currentMovie.hint}"
              </p>
            </div>

            {/* 3D Viewport Box */}
            <div className="w-full shrink-0">
              <HorrorScene
                wrongGuesses={wrongGuesses}
                maxGuesses={maxWrong}
                highContrast={highContrast}
                reduceMotion={reduceMotion}
              />

              {gameOver && (
                <div className="absolute inset-0 z-30 bg-black/95 flex flex-col items-center justify-center p-6 space-y-4">
                  <h2 className="text-5xl md:text-7xl font-black font-mono tracking-widest text-red-500 italic uppercase drop-shadow-[0_0_35px_rgba(239,68,68,1)]">
                    GAME OVER
                  </h2>
                  <p className="text-green-400 font-mono text-xs uppercase font-bold tracking-widest">
                    REACHED REEL {level} • FINAL SCORE: {score}
                  </p>
                  
                  {isNewRecord && (
                    <p className="text-yellow-300 font-mono text-xs font-black uppercase tracking-widest animate-bounce">
                      🔥 NEW PERSONAL BEST RECORD! 🔥
                    </p>
                  )}

                  <p className="font-mono text-zinc-200 text-xs">
                    CORRECT FILM: <strong className="text-white tracking-widest text-sm">{currentMovie.title}</strong>
                  </p>
                  <button
                    onClick={() => startNewGame(false)}
                    className="px-8 py-3 bg-red-600 hover:bg-red-500 text-yellow-300 font-mono text-sm font-black uppercase tracking-widest shadow-[0_0_30px_rgba(239,68,68,0.9)] rounded-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  >
                    ▶ PLAY AGAIN
                  </button>
                </div>
              )}
            </div>

            {/* Illuminated Word Display Slots */}
            <div className="w-full flex flex-col items-center justify-center py-2 shrink-0">
              <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                {currentMovie.title.split('').map((char, index) => {
                  if (char === ' ') return <div key={index} className="w-5" />
                  const isRevealed = guessedLetters.includes(char) || gameOver || gameWon
                  return (
                    <div
                      key={index}
                      className={`w-9 h-11 md:w-11 md:h-13 flex items-center justify-center font-mono text-2xl md:text-3xl font-black transition-all border-b-4 ${
                        isRevealed
                          ? 'border-yellow-400 text-yellow-300 drop-shadow-[0_0_12px_rgba(234,179,8,0.9)]'
                          : 'border-zinc-500 text-transparent'
                      }`}
                    >
                      {isRevealed ? char : '_'}
                    </div>
                  )
                })}
              </div>

              {gameWon && (
                <div className="text-green-400 font-mono font-bold uppercase tracking-widest text-xs animate-bounce pt-1">
                  ✨ REEL {level} CLEARED! LOADING NEXT FEATURE...
                </div>
              )}
            </div>

            {/* Brightened Keypad */}
            <div className="w-full flex flex-col items-center space-y-2 pt-1 shrink-0">
              <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 max-w-2xl">
                {ALPHABET.map((letter) => {
                  const isGuessed = guessedLetters.includes(letter)
                  return (
                    <button
                      key={letter}
                      onClick={() => handleGuess(letter)}
                      disabled={isGuessed || gameOver || gameWon}
                      className={`w-8 h-9 md:w-10 md:h-11 font-mono text-xs md:text-sm font-black transition-all flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        isGuessed
                          ? 'bg-zinc-950 text-zinc-700 border border-zinc-900 cursor-not-allowed'
                          : 'bg-zinc-800 hover:bg-red-900 text-white border border-zinc-600 hover:border-green-400 hover:text-green-300 shadow-md'
                      }`}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>

              {!gameOver && (
                <div className="w-full flex justify-end pt-1">
                  <button
                    onClick={() => startNewGame(true)}
                    className="px-4 py-1.5 bg-red-800 hover:bg-red-700 text-white font-mono text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border border-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  >
                    SKIP FILM ➔
                  </button>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </main>
  )
}