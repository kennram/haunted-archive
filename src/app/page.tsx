'use client'

import React, { useState, useEffect } from 'react'
import HorrorScene from '@/components/HorrorScene'
import SwingingSign from '@/components/SwingingSign'
import GameOverSign from '@/components/GameOverSign'
import { soundFx } from '@/lib/audio'

interface MovieTrivia {
  title: string
  hint: string
  category: 'SLASHER' | 'MIDNIGHT MOVIE' | 'VIDEO NASTY' | 'B-CREATURE FEAT'
  minLevel: number
}

// Complete Tiered Movie Trivia Database
const MOVIES: MovieTrivia[] = [
  // --- LEVEL 1: Mainstream Horror & Gateway Classics ---
  { title: 'HALLOWEEN', hint: 'Michael Myers haunts Haddonfield on a chilly autumn night.', category: 'SLASHER', minLevel: 1 },
  { title: 'PSYCHO', hint: 'Norman Bates runs a quiet motel with his mother.', category: 'SLASHER', minLevel: 1 },
  { title: 'JAWS', hint: 'A great white terrorizes a New England summer resort town.', category: 'B-CREATURE FEAT', minLevel: 1 },
  { title: 'THE EXORCIST', hint: 'A young girl possessed in Georgetown requires a desperate rite.', category: 'MIDNIGHT MOVIE', minLevel: 1 },
  { title: 'SCREAM', hint: 'Ghostface terrorizes Woodsboro teens with meta slasher rules.', category: 'SLASHER', minLevel: 1 },
  { title: 'THE SHINING', hint: 'Overlook Hotel caretaker descends into winter madness.', category: 'SLASHER', minLevel: 1 },
  { title: 'CARRIE', hint: 'Telekinetic teenager takes revenge at her high school prom.', category: 'MIDNIGHT MOVIE', minLevel: 1 },
  { title: 'FRANKENSTEIN', hint: 'Mad scientist reanimates a creature constructed from human corpses.', category: 'B-CREATURE FEAT', minLevel: 1 },
  { title: 'DRACULA', hint: 'Transylvanian count travels to England seeking fresh blood.', category: 'MIDNIGHT MOVIE', minLevel: 1 },
  { title: 'FRIDAY THE 13TH', hint: 'Camp Crystal Lake counselors face a shadowy vengeful killer.', category: 'SLASHER', minLevel: 1 },

  // --- LEVEL 2: Popular Thrillers & Contemporary IFI@Home Releases ---
  { title: 'DOUBLE BLIND', hint: 'IFI Horror Season feature where experimental drug trial subjects die if they fall asleep.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'WE BURY THE DEAD', hint: 'IFI Horror Season survival thriller starring Daisy Ridley in a zombie-plagued military zone.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'THE SHROUDS', hint: 'David Cronenberg IFI feature where a grieving widower builds a tech device to connect with the deceased.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'ALIEN', hint: 'In space no one can hear you scream aboard the Nostromo.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'THE THING', hint: 'John Carpenter shape-shifting alien terrorizes an Antarctic research station.', category: 'B-CREATURE FEAT', minLevel: 2 },
  { title: 'A NIGHTMARE ON ELM STREET', hint: 'Freddy Krueger hunts teenagers inside their dreams.', category: 'SLASHER', minLevel: 2 },
  { title: 'THE SILENCE OF THE LAMBS', hint: 'FBI trainee seeks help from an incarcerated cannibalistic psychiatrist.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'THE RING', hint: 'A cursed videotape kills the viewer seven days after watching.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'SAW', hint: 'Jigsaw places victims in lethal mechanical test traps.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'POLTERGEIST', hint: 'Suburban family home built over a relocated cemetery.', category: 'MIDNIGHT MOVIE', minLevel: 2 },

  // --- LEVEL 3: Archival Monster Features, Folk Horror & Suspense ---
  { title: 'GORGO', hint: '1961 monster feature in the IFI Horror Season where a captured sea beast brings its colossal mother to London.', category: 'B-CREATURE FEAT', minLevel: 3 },
  { title: 'THE OUTCASTS', hint: '1982 Irish folk horror landmark from the IFI Archive set in rural Ireland exploring witchcraft.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'FUNNY GAMES', hint: 'Michael Haneke unsettling psychological thriller featured on IFI@Home about home intruders.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'ROSEMARY S BABY', hint: 'A Manhattan mother suspects her neighbors have sinister plans for her child.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'THE BLAIR WITCH PROJECT', hint: 'Film students vanish while investigating a Maryland legend.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'THE BIRDS', hint: 'Hitchcock thriller where avian swarms attack a coastal town.', category: 'B-CREATURE FEAT', minLevel: 3 },
  { title: 'MISERY', hint: 'An obsessed fan holds her favorite novelist captive in a remote cabin.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'NIGHT OF THE LIVING DEAD', hint: 'George Romero classic where reanimated corpses besiege a farmhouse.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'DON T LOOK NOW', hint: 'Grieving couple in Venice stalked by a mysterious figure in a red coat.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'TREMORS', hint: 'Giant subterranean carnivorous worms attack a Nevada desert town.', category: 'B-CREATURE FEAT', minLevel: 3 },

  // --- LEVEL 4: Art-House Masterpieces & IFI@Home Selections ---
  { title: 'RED ROOMS', hint: 'IFI Horror Season cyber-thriller surrounding a high-profile dark web murder trial.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'SISTER MIDNIGHT', hint: 'IFI Horror Season dark comedy horror following a frustrated Indian bride absorbing feral impulses.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'HOLY ISLAND', hint: 'Surreal Irish feature on IFI@Home following two souls trapped in an eerie port town.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'SUSPIRIA', hint: 'Dario Argento German dance academy secretly run by a coven of witches.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'EYES WITHOUT A FACE', hint: 'Guilt-ridden French surgeon attempts gruesome facial grafts for his daughter.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'THE WICKER MAN', hint: 'Police sergeant investigates a missing girl on a pagan Scottish island.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'CARNIVAL OF SOULS', hint: 'Surviving a car crash, an organist is drawn toward an abandoned Utah pavilion.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'BLACK SUNDAY', hint: 'Mario Bava Gothic masterwork about a witch executed in the 17th century.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'THE HOWLING', hint: 'A television news anchor visits a secluded retreat overrun by lycanthropes.', category: 'B-CREATURE FEAT', minLevel: 4 },
  { title: 'THE FOG', hint: 'John Carpenter tale of a glowing mist bringing vengeful leper ghosts.', category: 'MIDNIGHT MOVIE', minLevel: 4 },

  // --- LEVEL 5: European Giallo & Cult Video Nasties ---
  { title: 'FACES OF DEATH', hint: 'Infamous 1978 shocking horror compilation featured in the IFI Horror Season collection.', category: 'VIDEO NASTY', minLevel: 5 },
  { title: 'THE TEXAS CHAINSAW MASSACRE', hint: 'Leatherface and his cannibal family in 1974 Texas.', category: 'VIDEO NASTY', minLevel: 5 },
  { title: 'DEEP RED', hint: 'Dario Argento Giallo masterpiece involving a jazz pianist and a psychic reading.', category: 'MIDNIGHT MOVIE', minLevel: 5 },
  { title: 'TENEBRAE', hint: 'American mystery author in Rome stalked by a razor-wielding maniac.', category: 'MIDNIGHT MOVIE', minLevel: 5 },
  { title: 'BLOOD AND BLACK LACE', hint: 'Mario Bava haute couture salon targeted by a masked killer.', category: 'VIDEO NASTY', minLevel: 5 },
  { title: 'PHANTASM', hint: 'The Tall Man harvests small-town bodies using flying silver spheres.', category: 'MIDNIGHT MOVIE', minLevel: 5 },
  { title: 'THE FLY', hint: 'Cronenberg scientist teleports with tragic insect hybrid consequences.', category: 'B-CREATURE FEAT', minLevel: 5 },
  { title: 'DAWN OF THE DEAD', hint: 'Zombie apocalypse survivors barricade themselves inside a shopping mall.', category: 'VIDEO NASTY', minLevel: 5 },
  { title: 'HELLRAISER', hint: 'Mysterious puzzle box summons extradimensional Cenobites.', category: 'MIDNIGHT MOVIE', minLevel: 5 },
  { title: 'SCANNERS', hint: 'Telepathic renegades cause human heads to explode.', category: 'MIDNIGHT MOVIE', minLevel: 5 },

  // --- LEVEL 6: Regional Slashers, Splatter & Irish Avant-Garde ---
  { title: 'SOLITAIRE', hint: 'Experimental Irish feature on IFI@Home directed by Maximilian Le Cain.', category: 'MIDNIGHT MOVIE', minLevel: 6 },
  { title: 'THE EVIL DEAD', hint: 'Friends unleash Sumerian demonic forces via tape recorder in a remote cabin.', category: 'VIDEO NASTY', minLevel: 6 },
  { title: 'RE-ANIMATOR', hint: 'Medical student creates a glowing green reagent that revives dead tissue.', category: 'B-CREATURE FEAT', minLevel: 6 },
  { title: 'CANNIBAL HOLOCAUST', hint: 'Infamous documentary crew ventures deep into the Amazon basin.', category: 'VIDEO NASTY', minLevel: 6 },
  { title: 'RABID', hint: 'David Cronenberg body horror triggered by experimental skin grafts.', category: 'VIDEO NASTY', minLevel: 6 },
  { title: 'MY BLOODY VALENTINE', hint: 'Pickaxe-wielding killer terrorizes a small mining town on Valentine’s Day.', category: 'SLASHER', minLevel: 6 },
  { title: 'SLEEPAWAY CAMP', hint: 'Serial killer strikes a summer camp leading to an infamous twist ending.', category: 'SLASHER', minLevel: 6 },
  { title: 'THE BURNING', hint: 'Disfigured summer camp caretaker stalked by garden shears.', category: 'SLASHER', minLevel: 6 },
  { title: 'THE RETURN OF THE LIVING DEAD', hint: 'Trioxin gas creates brain-eating punk rock zombies.', category: 'B-CREATURE FEAT', minLevel: 6 },

  // --- LEVEL 7: Surrealism, Extreme Cinema & Body Nightmares ---
  { title: 'PHANTOM ISLANDS', hint: 'Experimental Irish docu-fiction on IFI@Home exploring isolation and phantom terrain.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'ERASERHEAD', hint: 'David Lynch surreal industrial nightmare featuring a mutant infant.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'POSSESSION', hint: 'Andrzej Zulawski marital meltdown and tentacled entity in West Berlin.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'HOUSE', hint: 'Nobuhiko Obayashi psychedelic Japanese haunted house masterwork.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'VIDEODROME', hint: 'Cable TV executive discovers a hallucinatory broadcast signal.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'LAST HOUSE ON THE LEFT', hint: 'Wes Craven controversial 1972 directorial debut revenge thriller.', category: 'VIDEO NASTY', minLevel: 7 },
  { title: 'HOUSE BY THE CEMETERY', hint: 'Lucio Fulci horror about Dr Freudstein lurking in a cellar.', category: 'VIDEO NASTY', minLevel: 7 },
  { title: 'ALTERED STATES', hint: 'Sensory deprivation chamber experiments lead to primal regression.', category: 'MIDNIGHT MOVIE', minLevel: 7 },

  // --- LEVEL 8+: Hardcore Archival & Underground Obscurities ---
  { title: 'AUDITION', hint: 'Japanese film producer holds a fake casting call with tragic consequences.', category: 'MIDNIGHT MOVIE', minLevel: 8 },
  { title: 'THE BEYOND', hint: 'Lucio Fulci Gates of Hell entry set in a hotel sitting over hell.', category: 'VIDEO NASTY', minLevel: 8 },
  { title: 'CANNIBAL FEROX', hint: 'Infamous 1981 exploitation film banned in 31 countries.', category: 'VIDEO NASTY', minLevel: 8 },
  { title: 'ANGST', hint: 'Obscure Austrian masterpiece depicting an unhinged ex-con on a home invasion spree.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'NEW YORK RIPPER', hint: 'Gritty Giallo featuring a razor killer with a duck voice.', category: 'VIDEO NASTY', minLevel: 9 },
  { title: 'BLOOD FOR DRACULA', hint: 'Andy Warhol and Paul Morrissey cult horror satire.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'SZAMAN', hint: 'Andrzej Zulawski psychological nightmare exploring Siberian shamanism.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'A FIELD IN ENGLAND', hint: 'Ben Wheatley psychedelic English Civil War mystical trip.', category: 'MIDNIGHT MOVIE', minLevel: 10 }
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
  const [hasConsultedThisLevel, setHasConsultedThisLevel] = useState<boolean>(false)
  
  const [level, setLevel] = useState<number>(1)
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(45)
  
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [gameWon, setGameWon] = useState<boolean>(false)
  const [lastRoundBonus, setLastRoundBonus] = useState<number>(0)
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false)
  
  const [musicOn, setMusicOn] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.25)
  const [trapFlash, setTrapFlash] = useState<boolean>(false)

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
    setHasConsultedThisLevel(false)
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

  const handleConsultArchive = () => {
    if (gameOver || gameWon || hasConsultedThisLevel) return
    soundFx.playTrapSnap()

    const titleLetters = currentMovie.title.replace(/[^A-Z]/g, '').split('')
    const unrevealed = titleLetters.filter((l) => !guessedLetters.includes(l))

    if (unrevealed.length === 0) return

    const letterToReveal = unrevealed[Math.floor(Math.random() * unrevealed.length)]
    const newGuessed = [...guessedLetters, letterToReveal]
    setGuessedLetters(newGuessed)
    setHasConsultedThisLevel(true)

    setTimeLeft((prev) => Math.max(1, prev - 5))

    const titleClean = currentMovie.title.replace(/[^A-Z]/g, '')
    const isWon = titleClean.split('').every((l) => newGuessed.includes(l))
    if (isWon) {
      soundFx.playWin()
      const roundBonus = 100 * level + timeLeft * 10
      setLastRoundBonus(roundBonus)
      setGameWon(true)
      const newScore = score + roundBonus
      setScore(newScore)
      checkAndUpdateHighScore(newScore)
    }
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
      }, 2400)
      return () => clearInterval(timer)
    }
  }, [gameWon])

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
      setTrapFlash(true)
      setTimeout(() => setTrapFlash(false), 250)

      const newWrong = wrongGuesses + 1
      setWrongGuesses(newWrong)
      if (newWrong >= maxWrong) {
        setGameOver(true)
        soundFx.playGameOver()
        checkAndUpdateHighScore(score)
      }
    } else if (isCurse) {
      soundFx.playTrapSnap()
      setTrapFlash(true)
      setTimeout(() => setTrapFlash(false), 250)

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
      const roundBonus = 100 * level + timeLeft * 10
      setLastRoundBonus(roundBonus)
      setGameWon(true)
      const newScore = score + roundBonus
      setScore(newScore)
      checkAndUpdateHighScore(newScore)
    }
  }

  return (
    <main className={`h-[100dvh] w-screen bg-[#0c0a09] text-zinc-100 flex flex-col items-center justify-between p-2 md:p-3 relative overflow-hidden select-none transition-colors duration-100 ${
      trapFlash ? 'bg-red-950/80' : ''
    }`}>
      {/* 35MM FILM GRAIN, DUST & CRT FLICKER OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-20 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.7)_50%)] bg-[length:100%_4px]" />
      <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,rgba(185,28,28,0.18)_0%,rgba(12,10,9,0.96)_100%)]" />

      {/* --- 35MM FILM PERFORATION BORDERS & EDGE-CODES --- */}
      <div className="absolute left-1 sm:left-3 top-0 bottom-0 w-6 flex flex-col justify-between py-2 pointer-events-none opacity-40 z-30 select-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-1">
            <div className="w-3.5 h-2 bg-black border border-amber-900/80 rounded-sm shadow-inner" />
            {i % 4 === 0 && (
              <span className="text-[7px] font-mono text-amber-600/70 rotate-90 tracking-tighter uppercase font-bold">
                35MM NITRATE
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="absolute right-1 sm:right-3 top-0 bottom-0 w-6 flex flex-col justify-between py-2 pointer-events-none opacity-40 z-30 select-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-1">
            <div className="w-3.5 h-2 bg-black border border-amber-900/80 rounded-sm shadow-inner" />
            {i % 4 === 2 && (
              <span className="text-[7px] font-mono text-green-600/70 -rotate-90 tracking-tighter uppercase font-bold">
                IFI-BOOTH
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl h-full flex flex-col justify-between py-1 my-auto px-6 sm:px-10">
        {!hasStarted ? (
          /* --- PRIMARY INTRO SCREEN --- */
          <div className="w-full h-full flex flex-col items-center justify-center text-center space-y-4 sm:space-y-5 my-auto relative">
            <div className="tracking-widest font-mono text-xs sm:text-sm md:text-base font-black text-green-400 uppercase drop-shadow-[0_0_15px_rgba(34,197,94,1)]">
              🩸 IFI@HOME PRESENTS 🩸
            </div>

            {/* Swinging Sign Title Component */}
            <SwingingSign />

            <div className="space-y-2 max-w-xl px-2">
              <p className="text-zinc-200 font-mono text-xs sm:text-sm md:text-base uppercase tracking-widest leading-relaxed mx-auto drop-shadow-md">
                Unravel classic horror titles frame-by-frame before the projection booth locks you in forever.
              </p>
            </div>

            {highScore > 0 && (
              <div className="bg-zinc-900/90 border-2 border-yellow-400 px-5 py-2 rounded-xl font-mono text-xs md:text-sm text-yellow-300 font-black tracking-widest shadow-[0_0_25px_rgba(234,179,8,0.4)] animate-pulse">
                🏆 ALL-TIME RECORD: {String(highScore).padStart(6, '0')} PTS
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <button
                onClick={handleIntroMusicToggle}
                className={`px-3 py-1.5 font-mono text-xs font-black uppercase tracking-widest rounded-lg border-2 transition-all ${
                  musicOn
                    ? 'bg-red-950 text-red-400 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-700'
                }`}
              >
                {musicOn ? 'PROJECTOR AUDIO: ON' : 'PROJECTOR AUDIO: OFF'}
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
                    <p className="text-green-400 font-bold uppercase text-[11px]">3. ARCHIVE HINT</p>
                    <p className="text-[10px] mt-0.5 text-zinc-300">Consult archive once per level to reveal a letter (-5s penalty).</p>
                  </div>
                </div>
              </div>
            )}

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
                      {musicOn ? 'PROJECTOR AUDIO: ON' : 'PROJECTOR AUDIO: OFF'}
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
              <div 
                className={`h-1 transition-all duration-1000 ease-linear ${
                  timeLeft <= 10 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]' : 'bg-yellow-400'
                }`}
                style={{ width: `${(timeLeft / getLevelTimer(level)) * 100}%` }}
              />

              <div className="flex items-center justify-between px-3 py-1.5">
                <button
                  onClick={handleReturnToIntro}
                  className="px-2.5 py-1 bg-zinc-950 hover:bg-red-950 text-zinc-300 hover:text-red-400 font-mono text-xs font-black uppercase tracking-wider transition-all border border-zinc-700 hover:border-red-500 rounded shadow"
                >
                  🏠 MENU
                </button>

                <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8 font-mono">
                  <div className="text-center">
                    <span className="text-[9px] text-zinc-100 block uppercase tracking-widest font-black">REEL</span>
                    <span className="font-black text-red-400 text-sm sm:text-base drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]">{level}</span>
                  </div>

                  <div 
                    className={`px-2.5 py-0.5 rounded border transition-all duration-300 ${
                      timeLeft <= 10 
                        ? 'bg-red-950/90 border-red-500 shadow-[0_0_25px_rgba(239,68,68,1)]' 
                        : 'bg-black/60 border-zinc-700'
                    }`}
                  >
                    <span className="text-[8px] text-zinc-300 block uppercase tracking-widest font-black text-center">TIME LEFT</span>
                    <span className={`font-black font-mono text-base sm:text-lg block text-center ${
                      timeLeft <= 10 
                        ? 'text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,1)]' 
                        : 'text-yellow-300'
                    }`}>
                      00:{String(timeLeft).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[9px] text-zinc-100 block uppercase tracking-widest font-black">SCORE</span>
                    <span className="font-black text-green-300 text-sm sm:text-base drop-shadow-[0_0_10px_rgba(134,239,172,0.6)]">
                      {String(score).padStart(6, '0')}
                    </span>
                  </div>

                  <div className="text-right hidden sm:block">
                    <span className="text-[9px] text-yellow-400 block uppercase tracking-widest font-black">BEST</span>
                    <span className="font-black text-yellow-300 text-sm sm:text-base drop-shadow-[0_0_10px_rgba(253,224,71,0.6)]">
                      {String(highScore).padStart(6, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* HIGH-IMPACT MOVIE CLUE / QUESTION MARQUIS */}
            <div className="w-full relative my-1 shrink-0 rounded-xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-2 border-amber-500/80 p-2.5 sm:p-3 text-center shadow-[0_0_25px_rgba(245,158,11,0.2)]">
              {/* Header Label Row */}
              <div className="flex items-center justify-between px-2 mb-1">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-[9px] sm:text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest">
                    ARCHIVE REEL CLUE
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-[9px] sm:text-[10px] font-mono font-black text-green-400 uppercase tracking-wider px-2 py-0.5 bg-black border border-green-500/80 rounded-full shadow-sm">
                    {currentMovie.category}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    TRAPS: <strong className="text-red-500 font-black">{wrongGuesses}</strong>/{maxWrong}
                  </span>
                </div>
              </div>

              {/* Highlighted Question / Hint Text */}
              <p className="text-base sm:text-lg md:text-xl font-mono font-black text-amber-100 italic tracking-wide leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] px-2">
                "{currentMovie.hint}"
              </p>
            </div>

            {/* CINEMATIC HORROR CANVAS */}
            <div className="w-full h-36 sm:h-44 md:h-52 relative my-0.5 shrink-0 overflow-hidden rounded-xl border border-red-900/80 shadow-2xl bg-black">
              <div className="absolute inset-0 w-full h-full">
                <HorrorScene
                  wrongGuesses={wrongGuesses}
                  maxGuesses={maxWrong}
                  highContrast={highContrast}
                  reduceMotion={reduceMotion}
                />
              </div>

              {timeLeft > 0 && timeLeft <= 10 && !gameOver && !gameWon && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-hidden">
                  <div className="absolute inset-0 bg-red-900/20 animate-ping opacity-30" />
                  <div 
                    className="font-mono font-black text-red-500 italic drop-shadow-[0_0_35px_rgba(239,68,68,1)] uppercase tracking-tighter transition-all duration-300"
                    style={{
                      fontSize: `${Math.max(3, 9 - timeLeft)}rem`,
                      transform: `scale(${1 + (11 - timeLeft) * 0.08})`,
                      animation: `pulse ${Math.max(0.25, timeLeft * 0.08)}s infinite alternate`
                    }}
                  >
                    {timeLeft}
                  </div>
                </div>
              )}
            </div>

            {/* DEDICATED HIGH-VISIBILITY TILED LETTER SLOT BAR */}
            <div className="w-full flex items-center justify-center py-2 px-3 my-0.5 bg-zinc-950/95 border-2 border-green-500/60 rounded-xl shrink-0 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 px-1">
                {currentMovie.title.split('').map((char, index) => {
                  if (char === ' ') {
                    return (
                      <div 
                        key={index} 
                        className="w-3 sm:w-5 h-8 sm:h-10 border-b-2 border-dashed border-zinc-600 my-auto" 
                      />
                    )
                  }

                  const isRevealed = guessedLetters.includes(char) || gameOver || gameWon

                  return (
                    <div
                      key={index}
                      className={`w-7 h-9 sm:w-9 sm:h-11 md:w-10 md:h-12 flex items-center justify-center font-mono text-lg sm:text-xl md:text-2xl font-black rounded-lg border-2 shadow-md transition-all ${
                        isRevealed
                          ? 'bg-zinc-900 border-yellow-400 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.7)]'
                          : 'bg-zinc-900 border-green-400 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                      }`}
                    >
                      {isRevealed ? char : '_'}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* COMPACT KEYBOARD & CONTROLS */}
            <div className="w-full flex flex-col items-center space-y-1 shrink-0 pt-0.5">
              <div className="flex flex-wrap justify-center gap-1 sm:gap-1.5 max-w-3xl px-1">
                {ALPHABET.map((letter) => {
                  const isGuessed = guessedLetters.includes(letter)
                  return (
                    <button
                      key={letter}
                      onClick={() => handleGuess(letter)}
                      disabled={isGuessed || gameOver || gameWon}
                      className={`w-7 h-8 sm:w-8 sm:h-9 md:w-9 md:h-10 font-mono text-xs font-black transition-all flex items-center justify-center rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 ${
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

              {!gameOver && !gameWon && (
                <div className="w-full flex justify-center pt-1 px-1">
                  <button
                    onClick={handleConsultArchive}
                    disabled={hasConsultedThisLevel}
                    className={`w-full max-w-sm py-1.5 font-mono text-xs sm:text-sm font-black uppercase tracking-widest transition-all border-2 rounded-lg shadow active:scale-95 ${
                      hasConsultedThisLevel
                        ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed shadow-none'
                        : 'bg-yellow-500 hover:bg-yellow-400 text-black border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.5)]'
                    }`}
                  >
                    {hasConsultedThisLevel ? '📖 ARCHIVE CONSULTED (USED)' : '📖 CONSULT ARCHIVE (-5s Penalty)'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

      </div>

      {/* ENHANCED ROUND WON / LEVEL CLEARED OVERLAY */}
      {gameWon && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-zinc-950 border-2 border-green-500 p-6 sm:p-8 rounded-xl shadow-[0_0_60px_rgba(34,197,94,0.4)] text-center max-w-md w-full space-y-4">
            
            <div className="py-1">
              <span className="text-[10px] sm:text-xs font-mono font-black text-green-400 uppercase tracking-widest bg-green-950 px-3 py-1 rounded-full border border-green-600">
                PROJECTION SUCCESSFUL
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tighter text-green-400 uppercase drop-shadow-[2px_2px_0px_#22c55e] italic mt-2">
                REEL {level} CLEARED!
              </h2>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg font-mono space-y-1.5 text-left text-xs sm:text-sm">
              <div className="flex justify-between text-zinc-300">
                <span>SOLVED FILM:</span>
                <span className="text-yellow-300 font-bold uppercase">{currentMovie.title}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>TIME REMAINING:</span>
                <span className="text-yellow-400 font-bold">+{timeLeft}s</span>
              </div>
              <div className="flex justify-between text-zinc-300 pt-1 border-t border-zinc-800">
                <span>ROUND BONUS:</span>
                <span className="text-green-300 font-bold">+{lastRoundBonus} PTS</span>
              </div>
            </div>

            <p className="text-zinc-400 font-mono text-[11px] animate-pulse pt-1">
              Spooling next feature reel...
            </p>
          </div>
        </div>
      )}

      {/* GRAINY DISTRESSED GAME OVER SCREEN WITH SWINGING SIGN */}
      {gameOver && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          {/* Intense Nitrate Red Vignette & Grain Blur Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_10%,rgba(185,28,28,0.45)_100%)] animate-pulse" />
          <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px]" />

          {/* SWINGING SIGNPOST HEADER */}
          <GameOverSign />

          {/* GAME OVER STATS PANEL */}
          <div className="relative bg-[#1a110c] border-2 border-amber-900/80 p-5 sm:p-6 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.95)] text-center max-w-md w-full space-y-4 relative z-10 overflow-hidden mt-1">
            
            <div className="relative z-10 space-y-1.5">
              <div className="inline-block bg-black/80 border border-amber-900/60 px-4 py-1.5 rounded-lg font-mono text-xs font-black text-zinc-300 uppercase tracking-widest shadow">
                REACHED REEL {level} • SCORE: <span className="text-green-400">{score}</span>
              </div>

              {isNewRecord && (
                <p className="text-yellow-400 font-mono text-xs font-black uppercase tracking-widest animate-bounce pt-1 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">
                  🏆 NEW BEST RECORD ESTABLISHED! 🏆
                </p>
              )}
            </div>

            {/* Unsolved Movie Reveal */}
            <div className="relative z-10 bg-black/90 border border-zinc-800 p-3 rounded-xl font-mono text-zinc-200">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black block mb-0.5">UNSOLVED FILM TITLE</span>
              <span className="text-yellow-400 font-black tracking-widest text-base sm:text-xl uppercase drop-shadow-[0_0_12px_rgba(253,224,71,0.7)]">
                {currentMovie.title}
              </span>
            </div>

            {/* Modal Controls */}
            <div className="relative z-10 space-y-2 pt-1">
              <button
                onClick={() => startNewGame(false)}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-yellow-300 font-mono text-base sm:text-lg font-black uppercase tracking-widest shadow-[0_0_35px_rgba(239,68,68,0.9)] transition-all hover:scale-105 active:scale-95 border-b-4 border-red-900 rounded-lg focus:outline-none focus:ring-4 focus:ring-yellow-400"
              >
                ▶ PLAY FEATURE
              </button>

              <button
                onClick={handleReturnToIntro}
                className="w-full py-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 font-mono text-xs font-black uppercase tracking-widest border border-zinc-800 rounded-lg transition-all"
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