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

// Complete Tiered Movie Trivia Database
const MOVIES: MovieTrivia[] = [
  // --- LEVEL 1: Iconic Mainstream Classics ---
  { title: 'HALLOWEEN', hint: 'Michael Myers haunts Haddonfield on a chilly autumn night.', category: 'SLASHER', minLevel: 1 },
  { title: 'PSYCHO', hint: 'Norman Bates runs a quiet motel with his mother.', category: 'SLASHER', minLevel: 1 },
  { title: 'THE SHINING', hint: 'Overlook Hotel caretaker descends into madness.', category: 'SLASHER', minLevel: 1 },
  { title: 'THE EXORCIST', hint: 'A young girl possessed in Georgetown requires a desperate rite.', category: 'MIDNIGHT MOVIE', minLevel: 1 },
  { title: 'JAWS', hint: 'A great white terrorizes a New England summer resort town.', category: 'B-CREATURE FEAT', minLevel: 1 },
  { title: 'CARRIE', hint: 'Telekinetic teenager takes revenge at her high school prom.', category: 'MIDNIGHT MOVIE', minLevel: 1 },
  { title: 'FRIDAY THE 13TH', hint: 'Camp Crystal Lake counselors face a shadowy killer.', category: 'SLASHER', minLevel: 1 },
  { title: 'FRANKENSTEIN', hint: 'Mad scientist reanimates a creature constructed from corpses.', category: 'B-CREATURE FEAT', minLevel: 1 },
  { title: 'DRACULA', hint: 'Transylvanian count travels to England seeking fresh blood.', category: 'MIDNIGHT MOVIE', minLevel: 1 },

  // --- LEVEL 2: Popular Horror & Blockbuster Thrillers ---
  { title: 'SCREAM', hint: 'Ghostface terrorizes Woodsboro teens with scary movie trivia.', category: 'SLASHER', minLevel: 2 },
  { title: 'THE OMEN', hint: 'An American diplomat unknowingly adopts the Antichrist.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'POLTERGEIST', hint: 'Suburban family home built over a relocated cemetery.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'CHILD S PLAY', hint: 'A dying serial killer transfers his soul into a Chucky doll.', category: 'SLASHER', minLevel: 2 },
  { title: 'THE RING', hint: 'A cursed videotape kills the viewer seven days after watching.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'THE SILENCE OF THE LAMBS', hint: 'FBI trainee seeks help from an incarcerated cannibal.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'IT', hint: 'Pennywise the Dancing Clown hunts children in Derry Maine.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'SAW', hint: 'Jigsaw places victims in lethal mechanical test traps.', category: 'MIDNIGHT MOVIE', minLevel: 2 },

  // --- LEVEL 3: Monster Features & Classic Suspense ---
  { title: 'THE BIRDS', hint: 'Hitchcock thriller where avian swarms attack a coastal town.', category: 'B-CREATURE FEAT', minLevel: 3 },
  { title: 'MISERY', hint: 'An obsessed fan holds her favorite novelist captive in a remote cabin.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'NIGHT OF THE LIVING DEAD', hint: 'George Romero classic where reanimated corpses besiege a farmhouse.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'THE BLAIR WITCH PROJECT', hint: 'Film students vanish while investigating a Maryland legend.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'TREMORS', hint: 'Giant subterranean carnivorous worms attack a Nevada desert town.', category: 'B-CREATURE FEAT', minLevel: 3 },
  { title: 'GREMLINS', hint: 'Mischievous little monsters multiply when exposed to water.', category: 'B-CREATURE FEAT', minLevel: 3 },

  // --- LEVEL 4: Cult 80s Classics & Paranormal Tales ---
  { title: 'SUSPIRIA', hint: 'Dario Argento dance academy secretly run by witches.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'A NIGHTMARE ON ELM STREET', hint: 'Freddy Krueger hunts teenagers in their dreams.', category: 'SLASHER', minLevel: 4 },
  { title: 'THE THING', hint: 'Shape-shifting alien terrorizes Antarctic research station.', category: 'B-CREATURE FEAT', minLevel: 4 },
  { title: 'ALIEN', hint: 'In space no one can hear you scream aboard the Nostromo.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'THE HOWLING', hint: 'A television news anchor visits a secluded resort overrun by lycanthropes.', category: 'B-CREATURE FEAT', minLevel: 4 },
  { title: 'THE FOG', hint: 'John Carpenter tale of a glowing mist bringing vengeful leper ghosts.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'CREEPSHOW', hint: 'Stephen King and George Romero horror comic anthology.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'CHRISTINE', hint: 'A possessed 1958 Plymouth Fury develops a murderous appetite.', category: 'MIDNIGHT MOVIE', minLevel: 4 },

  // --- LEVEL 5: Body Horror & Sci-Fi Creatures ---
  { title: 'THE FLY', hint: 'Cronenberg scientist teleports with insect consequences.', category: 'B-CREATURE FEAT', minLevel: 5 },
  { title: 'DAWN OF THE DEAD', hint: 'Survivors barricade themselves inside a shopping mall.', category: 'VIDEO NASTY', minLevel: 5 },
  { title: 'HELLRAISER', hint: 'Mysterious puzzle box summons extradimensional Cenobites.', category: 'MIDNIGHT MOVIE', minLevel: 5 },
  { title: 'AN AMERICAN WEREWOLF IN LONDON', hint: 'Two American backpackers are attacked on the Yorkshire moors.', category: 'B-CREATURE FEAT', minLevel: 5 },
  { title: 'PHANTASM', hint: 'The Tall Man harvests bodies using flying silver spheres.', category: 'MIDNIGHT MOVIE', minLevel: 5 },
  { title: 'SCANNERS', hint: 'Telepathic renegades cause human heads to explode.', category: 'MIDNIGHT MOVIE', minLevel: 5 },
  { title: 'BLOB', hint: 'Amorphous gelatinous alien consumes everything in its path.', category: 'B-CREATURE FEAT', minLevel: 5 },

  // --- LEVEL 6: Regional Slashers & Splatter ---
  { title: 'THE EVIL DEAD', hint: 'Friends unleash Sumerian demons in a remote cabin.', category: 'VIDEO NASTY', minLevel: 6 },
  { title: 'RE-ANIMATOR', hint: 'Medical student creates glowing reagent that revives the dead.', category: 'B-CREATURE FEAT', minLevel: 6 },
  { title: 'THE RETURN OF THE LIVING DEAD', hint: 'Trioxin gas creates brain-eating punk rock zombies.', category: 'B-CREATURE FEAT', minLevel: 6 },
  { title: 'MY BLOODY VALENTINE', hint: 'A pickaxe-wielding killer terrorizes a small mining town.', category: 'SLASHER', minLevel: 6 },
  { title: 'SLEEPAWAY CAMP', hint: 'Serial killer strikes a summer camp with a famous twist ending.', category: 'SLASHER', minLevel: 6 },
  { title: 'THE BURNING', hint: 'Disfigured summer camp caretaker stalked by shears.', category: 'SLASHER', minLevel: 6 },

  // --- LEVEL 7: European Giallo & 70s Video Nasties ---
  { title: 'ERASERHEAD', hint: 'David Lynch surreal nightmare in black and white.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'THE TEXAS CHAINSAW MASSACRE', hint: 'Leatherface and his cannibal family in 1974.', category: 'VIDEO NASTY', minLevel: 7 },
  { title: 'LAST HOUSE ON THE LEFT', hint: 'Wes Craven controversial revenge feature from 1972.', category: 'VIDEO NASTY', minLevel: 7 },
  { title: 'HOUSE BY THE CEMETERY', hint: 'Lucio Fulci tale of Dr Freudstein lurking in the cellar.', category: 'VIDEO NASTY', minLevel: 7 },
  { title: 'DON T LOOK NOW', hint: 'Grieving couple in Venice stalked by a figure in a red coat.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'SALEM S LOT', hint: 'Vampire takes over a small New England town.', category: 'MIDNIGHT MOVIE', minLevel: 7 },

  // --- LEVEL 8: Psychological & Extreme Cinema ---
  { title: 'CANNIBAL HOLOCAUST', hint: 'Documentary crew ventures deep into the Amazon basin.', category: 'VIDEO NASTY', minLevel: 8 },
  { title: 'POSSESSION', hint: 'Andrzej Zulawski psychological nightmare in West Berlin.', category: 'MIDNIGHT MOVIE', minLevel: 8 },
  { title: 'MANIAC', hint: 'William Lustig gritty slasher about a New York serial killer collecting scalps.', category: 'VIDEO NASTY', minLevel: 8 },
  { title: 'BLACK CHRISTMAS', hint: '1974 proto-slasher set in a sorority house over winter break.', category: 'SLASHER', minLevel: 8 },
  { title: 'I SPIT ON YOUR GRAVE', hint: 'Infamous 1978 controversial revenge thriller.', category: 'VIDEO NASTY', minLevel: 8 },
  { title: 'THE HILLS HAVE EYES', hint: 'Stranded family targeted by mutants in the desert.', category: 'VIDEO NASTY', minLevel: 8 },

  // --- LEVEL 9: Deep Cut Exploitation ---
  { title: 'RABID', hint: 'David Cronenberg body horror triggered by skin grafts.', category: 'VIDEO NASTY', minLevel: 9 },
  { title: 'TENEBRAE', hint: 'American writer in Rome stalked by a razor-wielding maniac.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'DEEP RED', hint: 'Dario Argento Giallo masterpiece involving a psychic reading.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'DRILLER KILLER', hint: 'An artist in NYC loses his sanity and turns to power tools.', category: 'VIDEO NASTY', minLevel: 9 },
  { title: 'PHENOMENA', hint: 'Young girl at a Swiss boarding school telepathically controls insects.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'CEMETERY MAN', hint: 'Italian graveyard watchman shoots reanimated corpses.', category: 'MIDNIGHT MOVIE', minLevel: 9 },

  // --- LEVEL 10+: Hardcore Archival & Obscure Horror ---
  { title: 'THE BEYOND', hint: 'Lucio Fulci Gothic horror where a hotel sits on a gateway to hell.', category: 'VIDEO NASTY', minLevel: 10 },
  { title: 'VIDEODROME', hint: 'Television station CEO discovers a signal that causes hallucinations.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'CANNIBAL FEROX', hint: 'Infamous 1981 exploitation film banned in 31 countries.', category: 'VIDEO NASTY', minLevel: 10 },
  { title: 'ANGST', hint: 'Obscure Austrian masterpiece depicting an escaped convict on a rampage.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'NEW YORK RIPPER', hint: 'Lucio Fulci gritty Giallo featuring a killer with a duck voice.', category: 'VIDEO NASTY', minLevel: 10 },
  { title: 'BLOOD FOR DRACULA', hint: 'Andy Warhol and Paul Morrissey cult horror satire.', category: 'MIDNIGHT MOVIE', minLevel: 10 }
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
  const [volume, setVolume] = useState<number>(0.25)

  const [highContrast, setHighContrast] = useState<boolean>(true)
  const [reduceMotion, setReduceMotion] = useState<boolean>(false)
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false)
  const [showRulesMenu, setShowRulesMenu] = useState<boolean>(false)

  const maxWrong = 6

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
    if (musicOn) {
      soundFx.toggleAmbientMusic(true)
    }
    startNewGame(false)
  }

  const handleReturnToIntro = () => {
    soundFx.playClick()
    setGameOver(false)
    setGameWon(false)
    setHasStarted(false)
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

  const handleIntroMusicToggle = () => {
    const newState = !musicOn
    setMusicOn(newState)
    soundFx.toggleAmbientMusic(newState)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value)
    setVolume(newVol)
    soundFx.setVolume(newVol)
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
    <main className="h-[100dvh] w-screen bg-[#0c0a09] text-zinc-100 flex flex-col items-center justify-between p-2 md:p-4 relative overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none z-50 opacity-15 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.6)_50%)] bg-[length:100%_4px]" />
      <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.15)_0%,rgba(12,10,9,0.95)_100%)]" />

      <div className="relative z-10 w-full max-w-4xl h-full flex flex-col justify-between py-1 my-auto">
        {!hasStarted ? (
          /* --- PRIMARY INTRO SCREEN WITH ACCESS TO RULES & SETTINGS MENU --- */
          <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4 sm:space-y-5 my-auto relative">
            <div className="tracking-widest font-mono text-xs sm:text-sm md:text-base font-black text-green-400 uppercase drop-shadow-[0_0_15px_rgba(34,197,94,1)]">
              🩸 IFI@HOME PRESENTS 🩸
            </div>

            <div className="space-y-3 max-w-2xl px-2">
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black font-mono tracking-tighter text-red-500 uppercase drop-shadow-[2px_2px_0px_#22c55e] md:drop-shadow-[5px_5px_0px_#22c55e] italic leading-none">
                HAUNTED ARCHIVE
              </h1>
              <p className="text-zinc-200 font-mono text-xs sm:text-sm md:text-lg uppercase tracking-widest leading-relaxed max-w-xl mx-auto drop-shadow-md">
                Unravel classic horror titles frame-by-frame before the projection booth locks you in forever.
              </p>
            </div>

            {/* High Score Banner */}
            {highScore > 0 && (
              <div className="bg-zinc-900/90 border-2 border-yellow-400 px-5 py-2 rounded-xl font-mono text-xs md:text-sm text-yellow-300 font-black tracking-widest shadow-[0_0_25px_rgba(234,179,8,0.4)] animate-pulse">
                🏆 ALL-TIME RECORD: {String(highScore).padStart(6, '0')} PTS
              </div>
            )}

            {/* Top Control Bar on Intro Screen */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={handleIntroMusicToggle}
                className={`px-3 py-1.5 font-mono text-xs font-black uppercase tracking-widest rounded-lg border-2 transition-all ${
                  musicOn
                    ? 'bg-red-950 text-red-400 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                }`}
              >
                {musicOn ? 'MUSIC: ON' : 'MUSIC: OFF'}
              </button>

              <button
                onClick={() => {
                  setShowSettingsMenu(!showSettingsMenu)
                  setShowRulesMenu(false)
                }}
                className="px-3 py-1.5 bg-zinc-950 hover:bg-red-950 text-red-400 hover:text-red-300 font-mono text-xs font-black uppercase tracking-wider transition-all border border-red-500 rounded-lg shadow"
              >
                ⚙️ CONFIG
              </button>

              <button
                onClick={() => {
                  setShowRulesMenu(!showRulesMenu)
                  setShowSettingsMenu(false)
                }}
                className="px-3 py-1.5 bg-zinc-950 hover:bg-green-950 text-green-400 hover:text-green-300 font-mono text-xs font-black uppercase tracking-wider transition-all border border-green-500 rounded-lg shadow"
              >
                📜 RULES
              </button>
            </div>

            {/* Intro Rules Modal Overlay */}
            {showRulesMenu && (
              <div className="absolute inset-x-2 top-2 z-40 bg-zinc-950/98 border-2 border-green-500 p-4 space-y-3 font-mono text-xs shadow-2xl rounded-xl">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-green-400 font-bold uppercase tracking-widest">ARCHIVE INSTRUCTIONS</span>
                  <button onClick={() => setShowRulesMenu(false)} className="text-zinc-300 hover:text-white font-bold">✕ CLOSE</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-zinc-100 text-left pt-1">
                  <div>
                    <p className="text-yellow-300 font-bold uppercase text-[11px]">1. OBJECTIVE</p>
                    <p className="text-[10px] mt-0.5 text-zinc-300">Solve horror titles before the projection timer runs out.</p>
                  </div>
                  <div>
                    <p className="text-red-400 font-bold uppercase text-[11px]">2. TRAPS</p>
                    <p className="text-[10px] mt-0.5 text-zinc-300">6 wrong letter guesses spring the trap completely.</p>
                  </div>
                  <div>
                    <p className="text-green-400 font-bold uppercase text-[11px]">3. CURSED</p>
                    <p className="text-[10px] mt-0.5 text-zinc-300">Secret cursed letters trigger a +2 trap penalty instantly.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Intro Config Modal Overlay */}
            {showSettingsMenu && (
              <div className="absolute inset-x-2 top-2 z-40 bg-zinc-950/98 border-2 border-red-600 p-4 space-y-3 font-mono text-xs shadow-2xl rounded-xl text-left">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-red-400 font-bold uppercase tracking-widest">CONFIGURATION</span>
                  <button onClick={() => setShowSettingsMenu(false)} className="text-zinc-300 hover:text-white font-bold">✕ CLOSE</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-zinc-200 font-bold uppercase text-[11px]">Audio System</p>
                    <button
                      onClick={handleIntroMusicToggle}
                      className={`px-3 py-1 font-bold text-xs rounded ${musicOn ? 'bg-red-800 text-white' : 'bg-zinc-800 text-zinc-200 border border-zinc-700'}`}
                    >
                      {musicOn ? 'MUSIC: ON' : 'MUSIC: OFF'}
                    </button>

                    <div className="pt-2 space-y-1">
                      <div className="flex justify-between text-[10px] text-zinc-300 font-bold">
                        <span>VOLUME</span>
                        <span>{Math.round(volume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full accent-red-600 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-zinc-200 font-bold uppercase text-[11px]">Accessibility</p>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} className="accent-red-600 w-4 h-4" />
                      <span className="text-[11px]">High Contrast Mode</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full max-w-xs pt-2 px-4">
              <button
                onClick={handleStartGame}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-yellow-300 font-mono text-lg md:text-xl font-black uppercase tracking-widest shadow-[0_0_35px_rgba(239,68,68,0.9)] transition-all hover:scale-105 active:scale-95 border-b-4 border-red-900 rounded-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
              >
                ▶ PLAY FEATURE
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ACTIVE GAMEPLAY HEADER */}
            <div className="w-full relative shrink-0 bg-zinc-900/95 border-2 border-red-600/90 rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.3)] overflow-hidden">
              
              {/* Real-time shrinking timer progress bar */}
              <div 
                className={`h-1 transition-all duration-1000 ease-linear ${
                  timeLeft <= 10 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]' : 'bg-yellow-400'
                }`}
                style={{ width: `${(timeLeft / getLevelTimer(level)) * 100}%` }}
              />

              <div className="flex items-center justify-between px-3 py-2">
                <button
                  onClick={handleReturnToIntro}
                  className="px-3 py-1.5 bg-zinc-950 hover:bg-red-950 text-zinc-300 hover:text-red-400 font-mono text-xs font-black uppercase tracking-wider transition-all border border-zinc-700 hover:border-red-500 rounded shadow"
                >
                  🏠 MENU
                </button>

                <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8 font-mono">
                  <div className="text-center">
                    <span className="text-[10px] text-zinc-100 block uppercase tracking-widest font-black">REEL</span>
                    <span className="font-black text-red-400 text-base sm:text-lg drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]">{level}</span>
                  </div>

                  {/* High-Visibility Escalating LED Clock Badge */}
                  <div 
                    className={`px-3 py-1 rounded border transition-all duration-300 ${
                      timeLeft <= 10 
                        ? 'bg-red-950/90 border-red-500 shadow-[0_0_25px_rgba(239,68,68,1)]' 
                        : 'bg-black/60 border-zinc-700'
                    }`}
                    style={
                      timeLeft <= 10 
                        ? { transform: `scale(${1 + (11 - timeLeft) * 0.02})` } 
                        : undefined
                    }
                  >
                    <span className="text-[9px] text-zinc-300 block uppercase tracking-widest font-black text-center">TIME LEFT</span>
                    <span className={`font-black font-mono text-lg sm:text-xl block text-center ${
                      timeLeft <= 10 
                        ? 'text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,1)]' 
                        : 'text-yellow-300'
                    }`}>
                      00:{String(timeLeft).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-100 block uppercase tracking-widest font-black">SCORE</span>
                    <span className="font-black text-green-300 text-base sm:text-lg drop-shadow-[0_0_10px_rgba(134,239,172,0.6)]">
                      {String(score).padStart(6, '0')}
                    </span>
                  </div>

                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-yellow-400 block uppercase tracking-widest font-black">BEST</span>
                    <span className="font-black text-yellow-300 text-base sm:text-lg drop-shadow-[0_0_10px_rgba(253,224,71,0.6)]">
                      {String(highScore).padStart(6, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full text-center space-y-1 py-1 px-3 bg-zinc-900/90 border border-red-900/80 rounded-lg shadow shrink-0">
              <div className="flex justify-center items-center space-x-3">
                <span className="text-[9px] uppercase font-mono tracking-widest text-green-400 font-black px-2 py-0.5 bg-black border border-green-500 rounded-full shadow">
                  {currentMovie.category}
                </span>
                <span className="text-[11px] font-mono text-zinc-200">
                  TRAPS: <strong className="text-red-500 font-black text-xs">{wrongGuesses}</strong> / {maxWrong}
                </span>
              </div>

              <p className="text-sm sm:text-base md:text-xl font-black font-mono text-white italic tracking-wide leading-tight drop-shadow">
                "{currentMovie.hint}"
              </p>
            </div>

            {/* 3D VIEWPORT WITH LAST 10 SECONDS ESCALATING COUNTDOWN */}
            <div className="w-full shrink-0 relative">
              <div className="h-36 sm:h-44 md:h-52 w-full">
                <HorrorScene
                  wrongGuesses={wrongGuesses}
                  maxGuesses={maxWrong}
                  highContrast={highContrast}
                  reduceMotion={reduceMotion}
                />
              </div>

              {/* LAST 10 SECONDS DRAMATIC PULSATING COUNTDOWN DISPLAY */}
              {timeLeft > 0 && timeLeft <= 10 && !gameOver && !gameWon && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-hidden">
                  <div className="absolute inset-0 bg-red-900/20 animate-ping opacity-30" />
                  <div 
                    className="font-mono font-black text-red-500 italic drop-shadow-[0_0_35px_rgba(239,68,68,1)] uppercase tracking-tighter transition-all duration-300"
                    style={{
                      fontSize: `${Math.max(4, 11 - timeLeft)}rem`,
                      transform: `scale(${1 + (11 - timeLeft) * 0.08})`,
                      animation: `pulse ${Math.max(0.25, timeLeft * 0.08)}s infinite alternate`
                    }}
                  >
                    {timeLeft}
                  </div>
                </div>
              )}
            </div>

            <div className="w-full flex flex-col items-center justify-center py-1 shrink-0">
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-3 max-w-full px-1">
                {currentMovie.title.split('').map((char, index) => {
                  if (char === ' ') return <div key={index} className="w-3 sm:w-5" />
                  const isRevealed = guessedLetters.includes(char) || gameOver || gameWon
                  return (
                    <div
                      key={index}
                      className={`w-7 h-9 sm:w-9 sm:h-11 md:w-11 md:h-13 flex items-center justify-center font-mono text-xl sm:text-2xl md:text-3xl font-black transition-all border-b-2 sm:border-b-4 ${
                        isRevealed
                          ? 'border-yellow-400 text-yellow-300 drop-shadow-[0_0_10px_rgba(234,179,8,0.9)]'
                          : 'border-zinc-600 text-transparent'
                      }`}
                    >
                      {isRevealed ? char : '_'}
                    </div>
                  )
                })}
              </div>

              {gameWon && (
                <div className="text-green-400 font-mono font-bold uppercase tracking-widest text-[11px] animate-bounce pt-0.5">
                  ✨ REEL {level} CLEARED! LOADING NEXT FEATURE...
                </div>
              )}
            </div>

            <div className="w-full flex flex-col items-center space-y-1.5 pt-0.5 shrink-0">
              <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 md:gap-2 max-w-3xl px-1">
                {ALPHABET.map((letter) => {
                  const isGuessed = guessedLetters.includes(letter)
                  return (
                    <button
                      key={letter}
                      onClick={() => handleGuess(letter)}
                      disabled={isGuessed || gameOver || gameWon}
                      className={`w-8 h-9 sm:w-9 sm:h-10 md:w-10 md:h-11 font-mono text-xs sm:text-sm font-black transition-all flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 ${
                        isGuessed
                          ? 'bg-zinc-950 text-zinc-700 border border-zinc-900 cursor-not-allowed'
                          : 'bg-zinc-800 hover:bg-red-900 text-white border border-zinc-600 hover:border-green-400 hover:text-green-300 shadow-sm'
                      }`}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>

              {!gameOver && (
                <div className="w-full flex justify-end pt-0.5 px-1">
                  <button
                    onClick={() => startNewGame(true)}
                    className="px-3 py-1 bg-red-800 hover:bg-red-700 text-white font-mono text-[10px] md:text-xs font-black uppercase tracking-widest transition-all border border-red-500 rounded shadow"
                  >
                    SKIP FILM ➔
                  </button>
                </div>
              )}
            </div>
          </>
        )}

      </div>

      {/* GAME OVER MODAL WITH BOTH RESTART AND MAIN MENU OPTIONS */}
      {gameOver && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-zinc-950 border-2 border-red-600/90 p-6 sm:p-8 rounded-xl shadow-[0_0_50px_rgba(220,38,38,0.5)] text-center max-w-md w-full space-y-5 -rotate-3 hover:rotate-0 transition-all duration-300">
            
            {/* Slanted Title Styled Exactly Like Intro Logo */}
            <div className="-rotate-3 transform py-1">
              <h2 className="text-4xl sm:text-6xl font-black font-mono tracking-tighter text-red-500 uppercase drop-shadow-[3px_3px_0px_#22c55e] italic leading-none">
                GAME OVER
              </h2>
            </div>

            <div className="space-y-2 pt-1">
              <div className="inline-block bg-zinc-900 border border-red-800 px-3 py-1 rounded-lg font-mono text-xs font-black text-zinc-200 uppercase tracking-widest shadow">
                REACHED REEL {level} • SCORE: {score}
              </div>

              {isNewRecord && (
                <p className="text-yellow-300 font-mono text-xs font-black uppercase tracking-widest animate-bounce pt-1">
                  🔥 NEW BEST RECORD ESTABLISHED! 🔥
                </p>
              )}
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-lg font-mono text-zinc-200 text-xs">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-black block mb-1">CORRECT FILM</span>
              <span className="text-yellow-300 font-black tracking-widest text-base sm:text-lg uppercase drop-shadow-[0_0_10px_rgba(253,224,71,0.6)]">
                {currentMovie.title}
              </span>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => startNewGame(false)}
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-yellow-300 font-mono text-base sm:text-lg font-black uppercase tracking-widest shadow-[0_0_35px_rgba(239,68,68,0.9)] transition-all hover:scale-105 active:scale-95 border-b-4 border-red-900 rounded-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
              >
                ▶ PLAY AGAIN
              </button>

              <button
                onClick={handleReturnToIntro}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs font-black uppercase tracking-widest border border-zinc-700 rounded-lg transition-all"
              >
                🏠 MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}