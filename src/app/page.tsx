'use client'

import React, { useState, useEffect, useCallback } from 'react'
import HorrorScene from '@/components/HorrorScene'
import SwingingSign from '@/components/SwingingSign'
import GameOverSign from '@/components/GameOverSign'
import { soundFx } from '@/lib/audio'

interface MovieTrivia {
  title: string
  hint: string
  category: 'SLASHER' | 'MIDNIGHT MOVIE' | 'VIDEO NASTY' | 'B-CREATURE FEAT'
  minLevel: number
  ifiUrl?: string
}

// Complete Tiered Movie Trivia Database with Scaled Clue Complexity
const MOVIES: MovieTrivia[] = [
  // --- LEVEL 1: Mainstream Horror & Gateway Classics (Direct Plot Hooks) ---
  { title: 'DOUBLE BLIND', hint: 'Experimental drug trial subjects face a lethal rule: if they fall asleep, they die.', category: 'MIDNIGHT MOVIE', minLevel: 1, ifiUrl: 'https://www.ifihome.ie/film/double-blind/' },
  { title: 'HALLOWEEN', hint: 'Michael Myers haunts Haddonfield on a chilly autumn night.', category: 'SLASHER', minLevel: 1 },
  { title: 'PSYCHO', hint: 'Norman Bates runs a quiet motel with his mother.', category: 'SLASHER', minLevel: 1 },
  { title: 'JAWS', hint: 'A great white terrorizes a New England summer resort town.', category: 'B-CREATURE FEAT', minLevel: 1 },
  { title: 'THE EXORCIST', hint: 'A young girl possessed in Georgetown requires a desperate rite.', category: 'MIDNIGHT MOVIE', minLevel: 1 },
  { title: 'SCREAM', hint: 'Ghostface terrorizes Woodsboro teens with meta slasher rules.', category: 'SLASHER', minLevel: 1 },
  { title: 'THE SHINING', hint: 'Overlook Hotel caretaker descends into winter madness.', category: 'SLASHER', minLevel: 1, ifiUrl: 'https://www.ifihome.ie/film/the-shining/' },
  { title: 'CARRIE', hint: 'Telekinetic teenager takes revenge at her high school prom.', category: 'MIDNIGHT MOVIE', minLevel: 1 },
  { title: 'FRANKENSTEIN', hint: 'Mad scientist reanimates a creature constructed from human corpses.', category: 'B-CREATURE FEAT', minLevel: 1 },
  { title: 'DRACULA', hint: 'Transylvanian count travels to England seeking fresh blood.', category: 'MIDNIGHT MOVIE', minLevel: 1, ifiUrl: 'https://www.ifihome.ie/film/dracula/' },
  { title: 'FRIDAY THE 13TH', hint: 'Camp Crystal Lake counselors face a shadowy vengeful killer.', category: 'SLASHER', minLevel: 1 },
  { title: 'IT', hint: 'Tim Curry plays a shape-shifting entity posing as a sinister clown in Derry, Maine.', category: 'SLASHER', minLevel: 1, ifiUrl: 'https://www.ifihome.ie/film/it/' },

  // --- LEVEL 2: Popular Thrillers & Modern Contemporary (Cast & Synopsis) ---
  { title: 'WE BURY THE DEAD', hint: 'Survival thriller starring Daisy Ridley traversing a zombie-plagued military containment zone.', category: 'MIDNIGHT MOVIE', minLevel: 2, ifiUrl: 'https://www.ifihome.ie/film/we-bury-the-dead/' },
  { title: 'THE SHROUDS', hint: 'David Cronenberg feature where a grieving widower builds a device connecting with the deceased.', category: 'MIDNIGHT MOVIE', minLevel: 2, ifiUrl: 'https://www.ifihome.ie/film/the-shrouds/' },
  { title: 'ALIEN', hint: 'In space no one can hear you scream aboard the commercial vessel Nostromo.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'THE THING', hint: 'John Carpenter shape-shifting alien terrorizes an isolated Antarctic research station.', category: 'B-CREATURE FEAT', minLevel: 2 },
  { title: 'A NIGHTMARE ON ELM STREET', hint: 'A disfigured killer stalks teenagers inside their shared dreamscape.', category: 'SLASHER', minLevel: 2 },
  { title: 'THE SILENCE OF THE LAMBS', hint: 'An FBI trainee consults an incarcerated cannibalistic psychiatrist to catch a killer.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'THE RING', hint: 'A cursed videotape marks its viewers for death precisely seven days after viewing.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'SAW', hint: 'Two men awaken chained in a subterranean bathroom at the mercy of the Jigsaw killer.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'POLTERGEIST', hint: 'A suburban family communicates with spirits through their television set.', category: 'MIDNIGHT MOVIE', minLevel: 2 },
  { title: 'DOCTOR SLEEP', hint: 'An adult Dan Torrance protects a young psychic girl from a soul-harvesting cult.', category: 'MIDNIGHT MOVIE', minLevel: 2, ifiUrl: 'https://www.ifihome.ie/film/doctor-sleep/' },
  { title: 'SINNERS', hint: 'Ryan Coogler Southern Gothic horror starring Michael B. Jordan in dual twin roles facing a local threat.', category: 'MIDNIGHT MOVIE', minLevel: 2, ifiUrl: 'https://www.ifihome.ie/film/sinners/' },
  { title: 'DRACULA A LOVE TALE', hint: 'Luc Besson dark romantic reimagining starring Caleb Landry Jones as a cursed warrior count.', category: 'MIDNIGHT MOVIE', minLevel: 2, ifiUrl: 'https://www.ifihome.ie/film/dracula/' },

  // --- LEVEL 3: Archival Classics, Folk Horror & Suspense (Auteur & Setting) ---
  { title: 'GORGO', hint: '1961 British Kaiju feature where a captured sea beast brings its colossal mother to London.', category: 'B-CREATURE FEAT', minLevel: 3, ifiUrl: 'https://www.ifihome.ie/film/gorgo/' },
  { title: 'THE OUTCASTS', hint: '1982 landmark Irish folk horror set in rural 19th-century Ireland exploring witchcraft and isolation.', category: 'MIDNIGHT MOVIE', minLevel: 3, ifiUrl: 'https://www.ifihome.ie/film/the-outcasts/' },
  { title: 'FUNNY GAMES', hint: 'Michael Haneke rigorous psychological home-invasion thriller analyzing spectator violence.', category: 'MIDNIGHT MOVIE', minLevel: 3, ifiUrl: 'https://www.ifihome.ie/film/funny-games/' },
  { title: 'ROSEMARY S BABY', hint: 'A pregnant Manhattan wife grows paranoid that her ambition-driven husband made a pact with neighbors.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'THE BLAIR WITCH PROJECT', hint: '1999 found-footage landmark tracking three film students who vanish in Maryland woods.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'THE BIRDS', hint: 'Alfred Hitchcock thriller examining unexplained avian hostility in Bodega Bay.', category: 'B-CREATURE FEAT', minLevel: 3 },
  { title: 'MISERY', hint: 'Rob Reiner adaptation where an obsessed fan holds her favorite novelist captive in a snowy cabin.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'NIGHT OF THE LIVING DEAD', hint: 'George Romero independent black-and-white debut besieging survivors in a Pennsylvania farmhouse.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'DON T LOOK NOW', hint: 'Nicolas Roeg grief-stricken Venetian mystery featuring non-linear editing and a red-coated figure.', category: 'MIDNIGHT MOVIE', minLevel: 3 },
  { title: 'TREMORS', hint: 'Subterranean carnivorous worms hunt by acoustic vibration beneath a desert valley town.', category: 'B-CREATURE FEAT', minLevel: 3 },
  { title: 'STRANGERS ON A TRAIN', hint: 'Alfred Hitchcock suspense classic involving a psychopathic proposal to trade murders.', category: 'MIDNIGHT MOVIE', minLevel: 3, ifiUrl: 'https://www.ifihome.ie/film/strangers-on-a-train/' },
  { title: 'LIES WE TELL', hint: 'Lisa Mulcahy period thriller following an orphaned heiress combating greed and coercion.', category: 'MIDNIGHT MOVIE', minLevel: 3, ifiUrl: 'https://www.ifihome.ie/film/lies-we-tell/' },

  // --- LEVEL 4: Art-House & Festival Selections (Stylistic & Thematic) ---
  { title: 'RED ROOMS', hint: 'Pascal Plante cyber-thriller detailing a young woman’s obsession with a dark-web trial.', category: 'MIDNIGHT MOVIE', minLevel: 4, ifiUrl: 'https://www.ifihome.ie/film/red-rooms-les-chambres-rouges/' },
  { title: 'SISTER MIDNIGHT', hint: 'Karan Kandhari genre-blending dark comedy following a frustrated Indian bride absorbing feral impulses.', category: 'MIDNIGHT MOVIE', minLevel: 4, ifiUrl: 'https://www.ifihome.ie/film/sister-midnight/' },
  { title: 'HOLY ISLAND', hint: 'Surreal Irish feature following two lost souls stranded in an eerie, timeless port town.', category: 'MIDNIGHT MOVIE', minLevel: 4, ifiUrl: 'https://www.ifihome.ie/film/holy-island/' },
  { title: 'SUSPIRIA', hint: 'Dario Argento technicolor nightmare centering on a Freiburg dance academy secretly run by a coven.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'EYES WITHOUT A FACE', hint: 'Georges Franju poetic horror concerning a surgeon performing skin grafts to restore his daughter’s face.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'THE WICKER MAN', hint: 'Robin Hardy pagan folk horror tracking a devout police officer investigating a missing girl on Summerisle.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'CARNIVAL OF SOULS', hint: 'Herk Harvey low-budget eerie masterpiece following a sole crash survivor drawn to an abandoned pavilion.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'BLACK SUNDAY', hint: 'Mario Bava Gothic masterpiece starring Barbara Steele as a resurrected 17th-century Moldavian witch.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'THE HOWLING', hint: 'Joe Dante satire blending news media culture with transformative werewolf effects.', category: 'B-CREATURE FEAT', minLevel: 4 },
  { title: 'THE FOG', hint: 'John Carpenter atmospheric tale of a glowing sea mist carrying vengeful phantom sailors.', category: 'MIDNIGHT MOVIE', minLevel: 4 },
  { title: 'MATCH', hint: 'Danishka Esterhazy thriller where an online date leads to a secluded estate filled with dark secrets.', category: 'MIDNIGHT MOVIE', minLevel: 4, ifiUrl: 'https://www.ifiathome.ie/film/match' },

  // --- LEVEL 5: European Giallo & Cult Nasties (Transgressive Cinema) ---
  { title: 'FACES OF DEATH', hint: 'Infamous 1978 shockumentary compiling real and staged gruesome footage, central to video nasty lore.', category: 'VIDEO NASTY', minLevel: 5, ifiUrl: 'https://www.ifihome.ie/film/faces-of-death/' },
  { title: 'THE TEXAS CHAINSAW MASSACRE', hint: 'Tobe Hooper 1974 raw horror classic depicting rural Texas cannibalism and industrial noise design.', category: 'VIDEO NASTY', minLevel: 5 },
  { title: 'DEEP RED', hint: 'Dario Argento seminal Giallo featuring a jazz musician, telepathic clues, and Goblin score.', category: 'MIDNIGHT MOVIE', minLevel: 5 },
  { title: 'TENEBRAE', hint: 'Dario Argento meta-Giallo about an American crime novelist in Rome whose work inspires real murders.', category: 'MIDNIGHT MOVIE', minLevel: 5 },
  { title: 'BLOOD AND BLACK LACE', hint: 'Mario Bava foundational Giallo utilizing vibrant lighting and masked stalkers in a fashion house.', category: 'VIDEO NASTY', minLevel: 5 },
  { title: 'PHANTASM', hint: 'Don Coscarelli surreal cult entry featuring the Tall Man, silver flying spheres, and dimensional portals.', category: 'MIDNIGHT MOVIE', minLevel: 5 },
  { title: 'THE FLY', hint: 'David Cronenberg tragic body-horror tragedy detailing genetic decay and insect metamorphosis.', category: 'B-CREATURE FEAT', minLevel: 5 },
  { title: 'DAWN OF THE DEAD', hint: 'George Romero satirical apocalyptic masterpiece staging zombie survival inside a suburban mall.', category: 'VIDEO NASTY', minLevel: 5 },
  { title: 'HELLRAISER', hint: 'Clive Barker dark fantasy exploring sadomasochistic extradimensional Cenobites summoned by a puzzle box.', category: 'MIDNIGHT MOVIE', minLevel: 5 },
  { title: 'SCANNERS', hint: 'David Cronenberg sci-fi horror investigating telepathic warfare, private defense firms, and explosive heads.', category: 'MIDNIGHT MOVIE', minLevel: 5 },

  // --- LEVEL 6: Regional Splatter & Avant-Garde (Underground Techniques) ---
  { title: 'SOLITAIRE', hint: 'Maximilian Le Cain experimental Irish feature exploring memory, decay, and non-narrative video art.', category: 'MIDNIGHT MOVIE', minLevel: 6 },
  { title: 'THE EVIL DEAD', hint: 'Sam Raimi kinetic low-budget cabin horror utilizing aggressive steadicam and Necronomicon lore.', category: 'VIDEO NASTY', minLevel: 6 },
  { title: 'RE-ANIMATOR', hint: 'Stuart Gordon Lovecraft adaptation following a medical student obsessed with glowing green reagent serum.', category: 'B-CREATURE FEAT', minLevel: 6 },
  { title: 'CANNIBAL HOLOCAUST', hint: 'Ruggero Deodato controversial 1980 mockumentary investigating a lost film crew in the Amazon.', category: 'VIDEO NASTY', minLevel: 6 },
  { title: 'RABID', hint: 'David Cronenberg Canadian body horror tracking an outbreak originating from experimental plastic surgery.', category: 'VIDEO NASTY', minLevel: 6 },
  { title: 'MY BLOODY VALENTINE', hint: '1981 Canadian regional slasher featuring pickaxe murders inside an abandoned coal mine.', category: 'SLASHER', minLevel: 6 },
  { title: 'SLEEPAWAY CAMP', hint: '1983 slasher renowned for its psychological twist ending and summer camp atmosphere.', category: 'SLASHER', minLevel: 6 },
  { title: 'THE BURNING', hint: 'Tom Savini special-effects slasher revolving around a disfigured caretaker wielding garden shears.', category: 'SLASHER', minLevel: 6 },
  { title: 'THE RETURN OF THE LIVING DEAD', hint: 'Dan O Bannon punk-rock horror comedy introducing fast, brain-hungry zombies caused by military gas.', category: 'B-CREATURE FEAT', minLevel: 6 },

  // --- LEVEL 7: Surrealism, Extreme Cinema & Cosmic Horror (Psychological Nightmare) ---
  { title: 'PHANTOM ISLANDS', hint: 'Experimental Irish docu-fiction blending performance art, island terrain, and psychological decay.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'ERASERHEAD', hint: 'David Lynch industrial surrealist nightmare detailing anxieties of parenthood and physical deformity.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'POSSESSION', hint: 'Andrzej Żuławski intense breakdown of a Berlin marriage featuring hysterics and a tentacled entity.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'HOUSE', hint: 'Nobuhiko Obayashi psychedelic Japanese haunted-house frenzy incorporating collage and playful absurdity.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'VIDEODROME', hint: 'David Cronenberg media-theory horror investigating hallucination-inducing broadcast signals.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'LAST HOUSE ON THE LEFT', hint: 'Wes Craven controversial 1972 debut adapting Bergman’s Virgin Spring into grit splatter.', category: 'VIDEO NASTY', minLevel: 7 },
  { title: 'HOUSE BY THE CEMETERY', hint: 'Lucio Fulci splatter classic revolving around Dr. Freudstein lurking beneath an old New England house.', category: 'VIDEO NASTY', minLevel: 7 },
  { title: 'ALTERED STATES', hint: 'Ken Russell hallucinatory sci-fi exploring sensory deprivation, genetic memory, and primal regression.', category: 'MIDNIGHT MOVIE', minLevel: 7 },
  { title: 'IT ENDS', hint: 'Alex Ullom cosmic horror feature following friends trapped on an infinitely stretching two-lane highway.', category: 'MIDNIGHT MOVIE', minLevel: 7, ifiUrl: 'https://www.ifihome.ie/film/it-ends/' },

  // --- LEVEL 8: Archival Curatorial & Hardcore Transgressive (Movement & History) ---
  { title: 'AUDITION', hint: 'Takashi Miike psychological horror shifting from quiet drama into visceral torture-cinema.', category: 'MIDNIGHT MOVIE', minLevel: 8 },
  { title: 'THE BEYOND', hint: 'Lucio Fulci surreal Southern Gothic horror where a Louisiana hotel sits atop one of the Seven Gates of Hell.', category: 'VIDEO NASTY', minLevel: 8 },
  { title: 'CANNIBAL FEROX', hint: 'Umberto Lenzi exploitation feature infamous for its global ban history and jungle staging.', category: 'VIDEO NASTY', minLevel: 8 },
  { title: 'THE LURE', hint: 'Agnieszka Smoczyńska 1980s Polish synth-pop musical horror reimagining sirens in a Warsaw nightclub.', category: 'MIDNIGHT MOVIE', minLevel: 8 },
  { title: 'GANJA AND HESS', hint: 'Bill Gunn 1973 avant-garde Black horror masterpiece exploring addiction, religion, and ancient vampirism.', category: 'MIDNIGHT MOVIE', minLevel: 8 },
  { title: 'BERBERIAN SOUND STUDIO', hint: 'Peter Strickland psychological nightmare following a sound engineer unravelling while mixing a Giallo.', category: 'MIDNIGHT MOVIE', minLevel: 8 },
  { title: 'CURE', hint: 'Kiyoshi Kurosawa 1997 Japanese neo-noir masterpiece centering on hypnotically induced, X-marked murders.', category: 'MIDNIGHT MOVIE', minLevel: 8 },
  { title: 'KWAIDAN', hint: 'Masaki Kobayashi 1964 painted-set anthology depicting four traditional Japanese ghost folklore tales.', category: 'MIDNIGHT MOVIE', minLevel: 8 },
  { title: 'ONIBABA', hint: 'Kaneto Shindo 1964 stark medieval drama following two women murdering stranded samurai in tall pampas grass.', category: 'MIDNIGHT MOVIE', minLevel: 8 },
  { title: 'THE TENANT', hint: 'Roman Polanski 1976 paranoia trilogy entry following a quiet clerk assimilating into his predecessor’s suicide.', category: 'MIDNIGHT MOVIE', minLevel: 8 },
  { title: 'THE DEVILS', hint: 'Ken Russell 1971 controversial historical drama detailing religious hysteria and exorcisms in 17th-century Loudun.', category: 'MIDNIGHT MOVIE', minLevel: 8 },
  { title: 'VAMPYR', hint: 'Carl Theodor Dreyer 1932 dreamlike atmospheric masterwork tracking a traveler’s surreal encounter in Courtempierre.', category: 'MIDNIGHT MOVIE', minLevel: 8 },
  { title: 'PEEPING TOM', hint: 'Michael Powell 1960 psychological horror examining voyeurism through a murderer who films his victims’ terror.', category: 'MIDNIGHT MOVIE', minLevel: 8 },

  // --- LEVEL 9: Extreme Underground & Film Movement Rarities ---
  { title: 'ANGST', hint: 'Gerald Kargl 1983 Austrian masterpiece featuring radical movement camerawork and real-time home invasion.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'NEW YORK RIPPER', hint: 'Lucio Fulci gritty Giallo featuring a razor-wielding killer communicating in a duck voice.', category: 'VIDEO NASTY', minLevel: 9 },
  { title: 'BLOOD FOR DRACULA', hint: 'Paul Morrissey and Andy Warhol satyr-horror examining decadent aristocracy and virgin blood.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'VALERIE AND HER WEEK OF WONDERS', hint: '1970 Czechoslovak New Wave surrealist Gothic fantasy blending folk motifs and coming-of-age symbolism.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'SANTA SANGRE', hint: 'Alejandro Jodorowsky surrealist psychodrama following a circus performer bound to his cult-leader mother.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'A PAGE OF MADNESS', hint: '1926 Japanese silent avant-garde masterpiece set in an asylum, utilizing radical montage and dreamscapes.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'NOVEMBER', hint: 'Rainer Sarnet stark black-and-white Estonian folk horror blending paganism and mechanical animism.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'BENNY S VIDEO', hint: 'Michael Haneke early media-critique drama exploring an alienated teenager who records an unprovoked murder.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'TETSUO THE IRON MAN', hint: 'Shinya Tsukamoto 1989 cyberpunk body-horror landmark shot on kinetic 16mm black-and-white stock.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'NEKROMANTIK', hint: 'Jörg Buttgereit 1987 West German underground cult film centering on a corpse-cleanup worker and necrophilia.', category: 'VIDEO NASTY', minLevel: 9 },
  { title: 'I SPIT ON YOUR GRAVE', hint: 'Meir Zarchi controversial 1978 exploitation entry central to the Video Nasty ban list.', category: 'VIDEO NASTY', minLevel: 9 },
  { title: 'MAN BITES DOG', hint: '1992 Belgian dark mockumentary following a film crew tracking a charismatic serial killer.', category: 'MIDNIGHT MOVIE', minLevel: 9 },
  { title: 'THE REFLECTING SKIN', hint: 'Philip Ridley 1990 sun-drenched Midwestern gothic examining childhood innocence, vampirism, and trauma.', category: 'MIDNIGHT MOVIE', minLevel: 9 },

  // --- LEVEL 10: Structuralist Masterworks & Transgressive Peak ---
  { title: 'SZAMAN', hint: 'Andrzej Żuławski extreme psychological nightmare exploring anthropology, obsession, and Siberian shamanism.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'A FIELD IN ENGLAND', hint: 'Ben Wheatley black-and-white psychedelic Civil War trip involving alchemy and field mushrooms.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'BEGOTTEN', hint: 'E. Elias Merhige 1989 experimental silent splatter art-film shot on degraded, high-contrast optical stock.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'THE STRANGE COLOR OF YOUR BODIES TEARS', hint: 'Hélène Cattet and Bruno Forzani hyper-stylized fetishistic homage to Giallo architecture and razor framing.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'DAUGHTERS OF DARKNESS', hint: 'Harry Kümel 1971 Belgian art-house erotic vampire masterpiece starring Delphine Seyrig in Ostend.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'THE WHITE REINDEER', hint: '1952 Finnish Golden Globe-winning folk horror following a lonely woman turned vampiric Arctic creature.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'TAXIDERMIA', hint: 'György Pálfi surreal Hungarian multi-generational saga detailing obsession, taxidermy, and speed-eating.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'CLIMAX', hint: 'Gaspar Noé 2018 continuous-shot dance nightmare tracking a French troupe descending into madness after spiked sangria.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'THE HOLY MOUNTAIN', hint: 'Alejandro Jodorowsky 1973 mystical avant-garde masterpiece filled with esoteric symbolism and spiritual seeker rites.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'IN A GLASS CAGE', hint: 'Agustí Villaronga 1986 transgressive Spanish psychological study of an iron-lung-bound Nazi doctor and his young nurse.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'TROUBLE EVERY DAY', hint: 'Claire Denis 2001 French art-house entry examining cannibalistic desire through scientific affliction in Paris.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'ANTICHRIST', hint: 'Lars von Trier 2009 psychological horror exploring grief, nature, and despair inside an isolated cabin named Eden.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'BEYOND THE BLACK RAINBOW', hint: 'Panos Cosmatos 2010 retro-futuristic structuralist nightmare featuring analog synthesizers and neon-lit isolation.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'THE FALL OF THE HOUSE OF USHER', hint: 'Jean Epstein 1928 French silent avant-garde masterpiece featuring impressionistic slow-motion double exposures.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
  { title: 'SALO OR THE 120 DAYS OF SODOM', hint: 'Pier Paolo Pasolini 1975 transgressive structural adaptation of Sade set in fascist Italy.', category: 'MIDNIGHT MOVIE', minLevel: 10 },
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// Get target films needed to clear a reel tier (Capped at 5)
const getTargetFilmsForReel = (reel: number): number => {
  if (reel === 1) return 1
  if (reel === 2) return 2
  if (reel === 3) return 3
  if (reel === 4) return 4
  return 5
}

export default function Home() {
  const [hasStarted, setHasStarted] = useState<boolean>(false)

  // Game Engine & Progression
  const [currentMovie, setCurrentMovie] = useState<MovieTrivia>(MOVIES[0])
  const [playedTitles, setPlayedTitles] = useState<string[]>([])
  const [reel, setReel] = useState<number>(1)
  const [filmsClearedInReel, setFilmsClearedInReel] = useState<number>(0)
  
  // Guesses & Traps
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [wrongGuesses, setWrongGuesses] = useState<number>(0)
  const [curseLetters, setCurseLetters] = useState<string[]>([])
  
  // Master Continuous Timer & Score
  const [globalTimeLeft, setGlobalTimeLeft] = useState<number>(60)
  const [score, setScore] = useState<number>(0)
  const [highScore, setHighScore] = useState<number>(0)
  
  // Power-Up Inventory
  const [rewindCount, setRewindCount] = useState<number>(1)
  const [lightLeakCount, setLightLeakCount] = useState<number>(1)
  const [shieldActive, setShieldActive] = useState<boolean>(false)
  const [shieldInventory, setShieldInventory] = useState<number>(1)
  
  // Game States & Brand Touchpoints
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [filmWon, setFilmWon] = useState<boolean>(false)
  const [reelClearedModal, setReelClearedModal] = useState<boolean>(false)
  const [lastSolvedIfiMovie, setLastSolvedIfiMovie] = useState<MovieTrivia | null>(null)
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false)
  
  // Config & Audio
  const [musicOn, setMusicOn] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.25)
  const [trapFlash, setTrapFlash] = useState<boolean>(false)
  const [jamWarning, setJamWarning] = useState<boolean>(false)

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

  // Load next movie title
  const loadNextMovie = useCallback((targetReel: number, currentPlayed: string[]) => {
    let eligibleMovies = MOVIES.filter((m) => m.minLevel === targetReel)
    let unplayedMovies = eligibleMovies.filter((m) => !currentPlayed.includes(m.title))

    if (unplayedMovies.length === 0) {
      eligibleMovies = MOVIES.filter((m) => m.minLevel <= targetReel)
      unplayedMovies = eligibleMovies.filter((m) => !currentPlayed.includes(m.title))
      if (unplayedMovies.length === 0) {
        unplayedMovies = eligibleMovies.length > 0 ? eligibleMovies : MOVIES
      }
    }

    const movie = unplayedMovies[Math.floor(Math.random() * unplayedMovies.length)] || MOVIES[0]
    
    setCurrentMovie(movie)
    setPlayedTitles((prev) => [...prev, movie.title])
    setGuessedLetters([])
    setWrongGuesses(0)
    setFilmWon(false)

    // Cursed Nitrate Letters setup for Reel 4+
    if (targetReel >= 4) {
      const uniqueLetters = Array.from(new Set(movie.title.replace(/[^A-Z]/g, '')))
      const count = targetReel >= 7 ? 2 : 1
      const shuffled = [...uniqueLetters].sort(() => 0.5 - Math.random())
      setCurseLetters(shuffled.slice(0, count))
    } else {
      setCurseLetters([])
    }
  }, [])

  // Start new full session
  const startNewGame = () => {
    soundFx.playClick()
    setScore(0)
    setIsNewRecord(false)
    setReel(1)
    setFilmsClearedInReel(0)
    setGlobalTimeLeft(60)
    setRewindCount(1)
    setLightLeakCount(1)
    setShieldInventory(1)
    setShieldActive(false)
    setGameOver(false)
    setReelClearedModal(false)
    setLastSolvedIfiMovie(null)
    
    loadNextMovie(1, [])
  }

  const handleStartGame = () => {
    soundFx.playClick()
    setHasStarted(true)
    if (musicOn) {
      soundFx.toggleAmbientMusic(true)
    }
    startNewGame()
  }

  const handleReturnToIntro = () => {
    soundFx.playClick()
    setGameOver(false)
    setFilmWon(false)
    setReelClearedModal(false)
    setHasStarted(false)
  }

  // --- POWER-UP TRIGGERS ---
  const useReelRewind = () => {
    if (rewindCount <= 0 || gameOver || filmWon) return
    soundFx.playClick()
    setRewindCount((prev) => prev - 1)
    setGlobalTimeLeft((prev) => prev + 10)
  }

  const useLightLeak = () => {
    if (lightLeakCount <= 0 || gameOver || filmWon || !currentMovie) return
    soundFx.playClick()

    const vowels = ['A', 'E', 'I', 'O', 'U']
    const titleLetters = currentMovie.title.replace(/[^A-Z]/g, '').split('')
    const unrevealedVowels = vowels.filter((v) => titleLetters.includes(v) && !guessedLetters.includes(v))

    let letterToReveal = ''
    if (unrevealedVowels.length > 0) {
      letterToReveal = unrevealedVowels[Math.floor(Math.random() * unrevealedVowels.length)]
    } else {
      const unrevealed = titleLetters.filter((l) => !guessedLetters.includes(l))
      if (unrevealed.length === 0) return
      letterToReveal = unrevealed[Math.floor(Math.random() * unrevealed.length)]
    }

    setLightLeakCount((prev) => prev - 1)
    const newGuessed = [...guessedLetters, letterToReveal]
    setGuessedLetters(newGuessed)

    // Check win condition
    const titleClean = currentMovie.title.replace(/[^A-Z]/g, '')
    if (titleClean.split('').every((l) => newGuessed.includes(l))) {
      handleFilmSolved(newGuessed)
    }
  }

  const useNitrateShield = () => {
    if (shieldInventory <= 0 || shieldActive || gameOver || filmWon) return
    soundFx.playClick()
    setShieldInventory((prev) => prev - 1)
    setShieldActive(true)
  }

  // Handle film clear logic
  const handleFilmSolved = useCallback((updatedGuessed: string[]) => {
    soundFx.playWin()
    setFilmWon(true)

    if (currentMovie.ifiUrl) {
      setLastSolvedIfiMovie(currentMovie)
    }

    const isFlawless = wrongGuesses === 0
    const timeAdd = isFlawless ? 25 : 15
    setGlobalTimeLeft((prev) => prev + timeAdd)

    const filmScore = 150 * reel + (isFlawless ? 100 : 0)
    const newScore = score + filmScore
    setScore(newScore)
    checkAndUpdateHighScore(newScore)

    if (isFlawless) {
      setRewindCount((prev) => prev + 1)
    }

    const nextClearedCount = filmsClearedInReel + 1
    const targetFilms = getTargetFilmsForReel(reel)

    if (nextClearedCount >= targetFilms) {
      // REEL CLEARED!
      setTimeout(() => {
        setReelClearedModal(true)
        setGlobalTimeLeft((prev) => prev + 30) // Reel Clear Global Time Bonus
        setLightLeakCount((prev) => prev + 1)
      }, 1200)
    } else {
      // Next film in current reel
      setFilmsClearedInReel(nextClearedCount)
      setTimeout(() => {
        loadNextMovie(reel, playedTitles)
        setFilmWon(false)
      }, 1600)
    }
  }, [currentMovie, wrongGuesses, reel, score, filmsClearedInReel, playedTitles, loadNextMovie])

  // Advance to Next Reel Tier
  const handleAdvanceNextReel = () => {
    soundFx.playClick()
    const nextReel = reel + 1
    setReel(nextReel)
    setFilmsClearedInReel(0)
    setReelClearedModal(false)

    // Award Shield on entering Reel 4
    if (nextReel === 4) {
      setShieldInventory((prev) => prev + 1)
    }

    loadNextMovie(nextReel, playedTitles)
  }

  // Handle Guess Logic
  const handleGuess = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || gameOver || filmWon || !currentMovie) return

    soundFx.playClick()
    const newGuessed = [...guessedLetters, letter]
    setGuessedLetters(newGuessed)

    const isCurse = curseLetters.includes(letter)
    const isCorrect = currentMovie.title.includes(letter)

    if (!isCorrect || isCurse) {
      if (shieldActive) {
        // Shield absorbs penalty!
        soundFx.playClick()
        setShieldActive(false)
      } else {
        soundFx.playTrapSnap()
        setTrapFlash(true)
        setTimeout(() => setTrapFlash(false), 250)

        // Projector Jam Hazard on Reel 6+
        if (reel >= 6 && !isCorrect) {
          setJamWarning(true)
          setGlobalTimeLeft((prev) => Math.max(0, prev - 3))
          setTimeout(() => setJamWarning(false), 600)
        }

        const penalty = isCurse ? 2 : 1
        const newWrong = wrongGuesses + penalty
        setWrongGuesses(newWrong)

        if (newWrong >= maxWrong) {
          setGameOver(true)
          soundFx.playGameOver()
          checkAndUpdateHighScore(score)
          return
        }
      }
    }

    // Check Win
    const titleClean = currentMovie.title.replace(/[^A-Z]/g, '')
    if (titleClean.split('').every((l) => newGuessed.includes(l))) {
      handleFilmSolved(newGuessed)
    }
  }, [guessedLetters, gameOver, filmWon, currentMovie, curseLetters, shieldActive, reel, wrongGuesses, maxWrong, score, handleFilmSolved])

  // Continuous Master Projection Clock
  useEffect(() => {
    if (!hasStarted || gameOver || filmWon || reelClearedModal || globalTimeLeft <= 0) return

    if (globalTimeLeft <= 10) {
      const urgencyFactor = (11 - globalTimeLeft) / 10
      soundFx.playHeartbeat(urgencyFactor)
    }

    const timer = setInterval(() => {
      setGlobalTimeLeft((prev) => {
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
  }, [hasStarted, globalTimeLeft, gameOver, filmWon, reelClearedModal, score])

  // Physical Keyboard Listeners (A-Z and 1, 2, 3 for Power-Ups)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted || gameOver || filmWon || reelClearedModal) return
      
      const key = e.key.toUpperCase()
      if (/^[A-Z]$/.test(key)) {
        handleGuess(key)
      } else if (e.key === '1') {
        useReelRewind()
      } else if (e.key === '2') {
        useLightLeak()
      } else if (e.key === '3') {
        useNitrateShield()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasStarted, gameOver, filmWon, reelClearedModal, handleGuess])

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

  return (
    <main className={`h-[100dvh] w-screen bg-[#111113] text-zinc-100 flex flex-col items-center justify-between p-2 md:p-3 relative overflow-hidden select-none transition-colors duration-100 ${
      trapFlash ? 'bg-[#E31B23]/20' : jamWarning ? 'bg-amber-500/20' : ''
    }`}>
      {/* ILLUMINATED IFI PROJECTION SPOTLIGHT BEAM */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(227,27,35,0.12)_0%,rgba(0,0,0,0)_75%)] pointer-events-none z-10" />

      {/* 35MM FILM GRAIN, DUST & CRT OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-10 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />
      <div className="absolute inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,rgba(227,27,35,0.05)_0%,rgba(17,17,19,0.95)_100%)]" />

      {/* --- 35MM FILM PERFORATION BORDERS --- */}
      <div className="absolute left-1 sm:left-3 top-0 bottom-0 w-6 flex flex-col justify-between py-2 pointer-events-none opacity-40 z-30 select-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-1">
            <div className="w-3.5 h-2 bg-black border border-zinc-700 rounded-sm shadow-inner" />
            {i % 4 === 0 && (
              <span className="text-[7px] font-mono text-zinc-400 rotate-90 tracking-tighter uppercase font-bold">
                IFI ARCHIVE
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="absolute right-1 sm:right-3 top-0 bottom-0 w-6 flex flex-col justify-between py-2 pointer-events-none opacity-40 z-30 select-none">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center space-y-1">
            <div className="w-3.5 h-2 bg-black border border-zinc-700 rounded-sm shadow-inner" />
            {i % 4 === 2 && (
              <span className="text-[7px] font-mono text-[#E31B23] -rotate-90 tracking-tighter uppercase font-bold">
                35MM REEL
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="relative z-20 w-full max-w-4xl h-full flex flex-col justify-between py-1 my-auto px-6 sm:px-10">
        {!hasStarted ? (
          /* --- IFI BRANDED INTRO SCREEN --- */
          <div className="w-full h-full flex flex-col justify-between items-center text-center py-4 px-2 relative z-20">
            
            {/* 1. TOP HEADER: BRANDING & LOGO */}
            <div className="flex flex-col items-center space-y-3 pt-2">
              <a 
                href="https://www.ifihome.ie/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition-transform hover:scale-105 focus:outline-none"
              >
                <img 
                  src="/ifi-home-logo.png" 
                  alt="IFI@Home" 
                  className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
                />
              </a>

              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#E31B23]/15 border border-[#E31B23]/40 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-pulse" />
                <span className="tracking-widest font-mono text-xs sm:text-sm font-black text-[#E31B23] uppercase">
                  IRISH FILM INSTITUTE PRESENTS
                </span>
              </div>
            </div>

            {/* 2. CENTER HERO: SIGNBOARD, DESCRIPTION & START CTA */}
            <div className="flex flex-col items-center space-y-4 max-w-xl w-full my-auto">
              <div className="scale-95 sm:scale-100 transition-transform">
                <SwingingSign />
              </div>

              <div className="space-y-2 px-4 max-w-lg">
                <p className="text-zinc-200 font-sans text-xs sm:text-sm md:text-base uppercase tracking-wider leading-relaxed mx-auto drop-shadow-sm font-medium">
                  Test your horror film knowledge and clear as many levels as you can. Keep the projector running, outrun the clock, and try not to lose your head!
                </p>
              </div>

              {highScore > 0 && (
                <div className="bg-zinc-900/90 border border-yellow-500/60 px-4 py-1.5 rounded-xl font-mono text-xs md:text-sm text-yellow-400 font-black tracking-widest shadow-[0_0_20px_rgba(234,179,8,0.2)] animate-pulse">
                  🏆 ALL-TIME RECORD: {String(highScore).padStart(6, '0')} PTS
                </div>
              )}

              {/* PRIMARY CTA */}
              <div className="w-full max-w-xs pt-2">
                <button
                  onClick={handleStartGame}
                  className="w-full py-3.5 bg-[#E31B23] hover:bg-[#c4131b] text-white font-mono text-lg font-black uppercase tracking-widest shadow-[0_0_30px_rgba(227,27,35,0.6)] transition-all hover:scale-105 active:scale-95 border-b-4 border-red-950 rounded-lg focus:outline-none"
                >
                  ▶ START PROJECTION
                </button>
              </div>

              {/* SECONDARY CONTROLS TOOLBAR */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <a
                  href="https://www.ifihome.ie/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-red-400 font-mono text-xs font-black uppercase tracking-wider transition-all border border-red-900/60 rounded-lg shadow-sm flex items-center space-x-1"
                >
                  <span>🎟️ BROWSE IFI@HOME</span>
                  <span className="text-[10px]">↗</span>
                </a>

                <button
                  onClick={handleIntroMusicToggle}
                  className={`px-3 py-1.5 font-mono text-xs font-black uppercase tracking-widest rounded-lg border transition-all ${
                    musicOn
                      ? 'bg-[#E31B23]/20 text-red-300 border-[#E31B23] shadow-[0_0_15px_rgba(227,27,35,0.4)]'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                  }`}
                >
                  {musicOn ? 'AUDIO: ON' : 'AUDIO: OFF'}
                </button>

                <button
                  onClick={() => {
                    setShowSettingsMenu(!showSettingsMenu)
                    setShowRulesMenu(false)
                  }}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-mono text-xs font-black uppercase tracking-wider transition-all border border-zinc-700 rounded-lg shadow-sm"
                >
                  ⚙️ CONFIG
                </button>

                <button
                  onClick={() => {
                    setShowRulesMenu(!showRulesMenu)
                    setShowSettingsMenu(false)
                  }}
                  className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-green-400 font-mono text-xs font-black uppercase tracking-wider transition-all border border-green-500/80 rounded-lg shadow-sm"
                >
                  📜 RULES
                </button>
              </div>

              {showRulesMenu && (
                <div className="absolute inset-x-2 top-2 z-40 bg-zinc-900/98 border border-green-500/80 p-4 space-y-3 font-mono text-xs shadow-2xl rounded-xl">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                    <span className="text-green-400 font-bold uppercase tracking-widest">ARCHIVE INSTRUCTIONS</span>
                    <button onClick={() => setShowRulesMenu(false)} className="text-zinc-200 hover:text-white font-bold">✕ CLOSE</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-zinc-100 text-left pt-1">
                    <div>
                      <p className="text-yellow-400 font-bold uppercase text-[11px]">1. MASTER CLOCK</p>
                      <p className="text-[10px] mt-0.5 text-zinc-300">Continuous global timer. Solve films fast to add +15s / +25s back.</p>
                    </div>
                    <div>
                      <p className="text-[#E31B23] font-bold uppercase text-[11px]">2. REEL PROGRESSION</p>
                      <p className="text-[10px] mt-0.5 text-zinc-300">Solve target film count to clear reels (1 → 2 → 3 → 4 → capped at 5).</p>
                    </div>
                    <div>
                      <p className="text-green-400 font-bold uppercase text-[11px]">3. POWER-UPS</p>
                      <p className="text-[10px] mt-0.5 text-zinc-300">Use Rewind (1), Light Leak (2), and Shield (3) to survive.</p>
                    </div>
                  </div>
                </div>
              )}

              {showSettingsMenu && (
                <div className="absolute inset-x-2 top-2 z-40 bg-zinc-900/98 border border-zinc-700 p-4 space-y-3 font-mono text-xs shadow-2xl rounded-xl text-left">
                  <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                    <span className="text-zinc-200 font-bold uppercase tracking-widest">CONFIGURATION</span>
                    <button onClick={() => setShowSettingsMenu(false)} className="text-zinc-200 hover:text-white font-bold">✕ CLOSE</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-zinc-100 font-bold uppercase text-[11px]">Audio System</p>
                      <button
                        onClick={handleIntroMusicToggle}
                        className={`px-3 py-1 font-bold text-xs rounded ${musicOn ? 'bg-[#E31B23] text-white' : 'bg-zinc-800 text-zinc-200 border border-zinc-700'}`}
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
                          className="w-full accent-[#E31B23] cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-zinc-100 font-bold uppercase text-[11px]">Accessibility</p>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" checked={highContrast} onChange={(e) => setHighContrast(e.target.checked)} className="accent-[#E31B23] w-4 h-4" />
                        <span className="text-[11px]">High Contrast Mode</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. FOOTER: FUNDING & ARTS COUNCIL LOGO */}
            <div className="pb-2 pt-3 border-t border-zinc-800/80 w-full max-w-md flex flex-col items-center justify-center space-y-1.5">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                SUPPORTED BY THE ARTS COUNCIL / AN CHOMHAIRLE EALAÍON
              </span>
              
              <a 
                href="https://www.artscouncil.ie/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100 transition-opacity"
              >
                <img 
                  src="/arts-council-logo.png" 
                  alt="The Arts Council / An Chomhairle Ealaíon" 
                  className="h-8 sm:h-9 w-auto object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </a>
            </div>

          </div>
        ) : (
          <>
            {/* MASTER GAMEPLAY HEADER WITH GLOBAL CONTINUOUS TIMER */}
            <div className="w-full relative shrink-0 bg-zinc-900/90 border border-zinc-800 rounded-lg shadow-lg overflow-hidden">
              <div 
                className={`h-1.5 transition-all duration-1000 ease-linear ${
                  globalTimeLeft <= 15 ? 'bg-[#E31B23] shadow-[0_0_10px_rgba(227,27,35,1)]' : 'bg-yellow-400'
                }`}
                style={{ width: `${Math.min(100, (globalTimeLeft / 60) * 100)}%` }}
              />

              <div className="flex items-center justify-between px-3 py-1.5">
                <button
                  onClick={handleReturnToIntro}
                  className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 font-mono text-xs font-black uppercase tracking-wider transition-all border border-zinc-700 rounded shadow"
                >
                  🏠 MENU
                </button>

                <div className="flex items-center space-x-3 sm:space-x-6 md:space-x-8 font-mono">
                  {/* Reel & Film Progress Counter */}
                  <div className="text-center">
                    <span className="text-[8px] text-zinc-400 block uppercase tracking-widest font-bold">REEL {reel}</span>
                    <span className="font-black text-amber-400 text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">
                      FILM {filmsClearedInReel + 1}/{getTargetFilmsForReel(reel)}
                    </span>
                  </div>

                  {/* Master Global Continuous Clock */}
                  <div 
                    className={`px-3 py-0.5 rounded border transition-all duration-300 ${
                      globalTimeLeft <= 15 
                        ? 'bg-red-950/90 border-[#E31B23] shadow-[0_0_20px_rgba(227,27,35,0.8)]' 
                        : 'bg-black/60 border-zinc-700'
                    }`}
                  >
                    <span className="text-[8px] text-zinc-400 block uppercase tracking-widest font-bold text-center">MASTER CLOCK</span>
                    <span className={`font-black font-mono text-base sm:text-lg block text-center ${
                      globalTimeLeft <= 15 
                        ? 'text-[#E31B23] animate-pulse drop-shadow-[0_0_15px_rgba(227,27,35,1)]' 
                        : 'text-yellow-400'
                    }`}>
                      {String(Math.floor(globalTimeLeft / 60)).padStart(2, '0')}:{String(globalTimeLeft % 60).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[8px] text-zinc-400 block uppercase tracking-widest font-bold">SCORE</span>
                    <span className="font-black text-green-400 text-xs sm:text-sm drop-shadow-[0_0_10px_rgba(34,197,94,0.6)]">
                      {String(score).padStart(6, '0')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* HIGH-IMPACT MOVIE CLUE & ACTIVE HAZARD BAR */}
            <div className="w-full relative my-1 shrink-0 rounded-xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-700/80 p-2 sm:p-2.5 text-center shadow-md">
              <div className="flex items-center justify-between px-2 mb-1">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E31B23] animate-ping" />
                  <span className="text-[9px] font-mono font-black text-zinc-300 uppercase tracking-widest">
                    ARCHIVE CLUE
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {shieldActive && (
                    <span className="text-[9px] font-mono font-black text-blue-400 uppercase tracking-wider px-2 py-0.5 bg-blue-950 border border-blue-500 rounded-full animate-pulse">
                      🛡️ SHIELD ACTIVE
                    </span>
                  )}
                  <span className="text-[9px] font-mono font-black text-green-400 uppercase tracking-wider px-2 py-0.5 bg-black border border-green-500/60 rounded-full">
                    {currentMovie?.category}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    TRAPS: <strong className="text-[#E31B23] font-black">{wrongGuesses}</strong>/{maxWrong}
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base md:text-lg font-mono font-black text-amber-100 italic tracking-wide leading-snug drop-shadow px-2">
                "{currentMovie?.hint}"
              </p>

              {/* IN-GAME SOLVED FILM STREAM BADGE TOUCHPOINT */}
              {filmWon && currentMovie?.ifiUrl && (
                <div className="mt-1.5 pt-1.5 border-t border-zinc-800 flex items-center justify-center space-x-2 animate-in fade-in duration-300">
                  <span className="text-[10px] font-mono font-bold text-yellow-400">FILM UNLOCKED!</span>
                  <a
                    href={currentMovie.ifiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-2.5 py-0.5 bg-[#E31B23] hover:bg-[#c4131b] text-white font-mono text-[10px] font-black uppercase tracking-wider rounded transition-all shadow"
                  >
                    🎟️ STREAM ON IFI@HOME ↗
                  </a>
                </div>
              )}
            </div>

            {/* CINEMATIC HORROR CANVAS */}
            <div className="w-full h-32 sm:h-40 md:h-48 relative my-0.5 shrink-0 overflow-hidden rounded-xl border border-zinc-800 shadow-xl bg-black">
              <div className="absolute inset-0 w-full h-full">
                <HorrorScene
                  wrongGuesses={wrongGuesses}
                  maxGuesses={maxWrong}
                  highContrast={highContrast}
                  reduceMotion={reduceMotion}
                />
              </div>

              {globalTimeLeft > 0 && globalTimeLeft <= 10 && !gameOver && !filmWon && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20 overflow-hidden">
                  <div className="absolute inset-0 bg-red-900/20 animate-ping opacity-30" />
                  <div 
                    className="font-mono font-black text-[#E31B23] italic drop-shadow-[0_0_35px_rgba(227,27,35,1)] uppercase tracking-tighter transition-all duration-300"
                    style={{
                      fontSize: `${Math.max(2.5, 8 - globalTimeLeft)}rem`,
                      transform: `scale(${1 + (11 - globalTimeLeft) * 0.08})`,
                      animation: `pulse ${Math.max(0.25, globalTimeLeft * 0.08)}s infinite alternate`
                    }}
                  >
                    {globalTimeLeft}
                  </div>
                </div>
              )}
            </div>

            {/* DEDICATED TILED LETTER SLOT BAR */}
            <div className="w-full flex items-center justify-center py-1.5 px-3 my-0.5 bg-zinc-900/90 border border-zinc-800 rounded-xl shrink-0 shadow-md">
              <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 px-1">
                {currentMovie?.title.split('').map((char, index) => {
                  if (char === ' ') {
                    return (
                      <div 
                        key={index} 
                        className="w-3 sm:w-5 h-8 sm:h-10 border-b-2 border-dashed border-zinc-600 my-auto" 
                      />
                    )
                  }

                  const isRevealed = guessedLetters.includes(char) || gameOver || filmWon

                  return (
                    <div
                      key={index}
                      className={`w-7 h-9 sm:w-9 sm:h-11 md:w-10 md:h-12 flex items-center justify-center font-mono text-lg sm:text-xl md:text-2xl font-black rounded-lg border shadow-sm transition-all ${
                        isRevealed
                          ? 'bg-zinc-950 border-yellow-400 text-yellow-300 shadow-[0_0_12px_rgba(234,179,8,0.6)]'
                          : 'bg-zinc-800 border-zinc-600 text-zinc-100'
                      }`}
                    >
                      {isRevealed ? char : '_'}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ENLARGED TOUCH KEYBOARD & POWER-UP INVENTORY TOOLBAR */}
            <div className="w-full flex flex-col items-center space-y-1.5 shrink-0 pt-0.5">
              {/* Active Power-Ups Bar */}
              <div className="flex items-center justify-center gap-2 w-full max-w-xl px-1 font-mono text-xs">
                <button
                  onClick={useReelRewind}
                  disabled={rewindCount <= 0 || gameOver || filmWon}
                  className={`flex-1 py-1 px-2 rounded-lg border flex items-center justify-center space-x-1 font-bold transition-all ${
                    rewindCount > 0
                      ? 'bg-amber-950/80 border-amber-500/80 text-amber-300 hover:bg-amber-900 shadow-md active:scale-95'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <span>🎞️ REWIND (+10s)</span>
                  <span className="bg-amber-500 text-black px-1.5 rounded-full text-[10px] font-black">{rewindCount}</span>
                </button>

                <button
                  onClick={useLightLeak}
                  disabled={lightLeakCount <= 0 || gameOver || filmWon}
                  className={`flex-1 py-1 px-2 rounded-lg border flex items-center justify-center space-x-1 font-bold transition-all ${
                    lightLeakCount > 0
                      ? 'bg-yellow-950/80 border-yellow-500/80 text-yellow-300 hover:bg-yellow-900 shadow-md active:scale-95'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <span>💡 VOWEL LEAK</span>
                  <span className="bg-yellow-500 text-black px-1.5 rounded-full text-[10px] font-black">{lightLeakCount}</span>
                </button>

                <button
                  onClick={useNitrateShield}
                  disabled={shieldInventory <= 0 || shieldActive || gameOver || filmWon}
                  className={`flex-1 py-1 px-2 rounded-lg border flex items-center justify-center space-x-1 font-bold transition-all ${
                    shieldInventory > 0 && !shieldActive
                      ? 'bg-blue-950/80 border-blue-500/80 text-blue-300 hover:bg-blue-900 shadow-md active:scale-95'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  <span>🛡️ SHIELD</span>
                  <span className="bg-blue-500 text-black px-1.5 rounded-full text-[10px] font-black">{shieldInventory}</span>
                </button>
              </div>

              {/* Enlarged On-Screen Keyboard */}
              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-3xl px-1">
                {ALPHABET.map((letter) => {
                  const isGuessed = guessedLetters.includes(letter)
                  return (
                    <button
                      key={letter}
                      onClick={() => handleGuess(letter)}
                      disabled={isGuessed || gameOver || filmWon}
                      className={`w-9 h-10 sm:w-11 sm:h-11 font-mono text-sm sm:text-base font-black transition-all flex items-center justify-center rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E31B23] active:scale-95 ${
                        isGuessed
                          ? 'bg-zinc-950 text-zinc-700 border border-zinc-900 cursor-not-allowed opacity-40'
                          : 'bg-zinc-800 hover:bg-[#E31B23] text-zinc-100 hover:text-white border border-zinc-600 shadow-md hover:border-[#E31B23]'
                      }`}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}

      </div>

      {/* REEL CLEARED INTERMISSION OVERLAY */}
      {reelClearedModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-zinc-900 border-2 border-yellow-500 p-6 sm:p-8 rounded-xl shadow-[0_0_50px_rgba(234,179,8,0.4)] text-center max-w-md w-full space-y-4">
            
            <div className="py-1">
              <span className="text-[10px] sm:text-xs font-mono font-black text-yellow-400 uppercase tracking-widest bg-yellow-950 px-3 py-1 rounded-full border border-yellow-600">
                PROJECTION REEL CLEARED
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-mono tracking-tighter text-yellow-400 uppercase italic mt-2">
                REEL {reel} COMPLETE!
              </h2>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-lg font-mono space-y-2 text-left text-xs sm:text-sm">
              <div className="flex justify-between text-zinc-300">
                <span>REEL REWARD BONUS:</span>
                <span className="text-green-400 font-bold">+30s CLOCK TIME</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>POWER-UP AWARDED:</span>
                <span className="text-yellow-300 font-bold">+1 VOWEL LEAK</span>
              </div>
              <div className="flex justify-between text-zinc-300 pt-1 border-t border-zinc-800">
                <span>NEXT REEL TARGET:</span>
                <span className="text-amber-400 font-bold">{getTargetFilmsForReel(reel + 1)} FILMS TO CLEAR</span>
              </div>
            </div>

            {/* IFI@HOME STREAMING SPOTLIGHT FOR SOLVED FILMS */}
            {lastSolvedIfiMovie && lastSolvedIfiMovie.ifiUrl && (
              <div className="bg-red-950/40 border border-[#E31B23]/60 p-3 rounded-lg font-mono text-left space-y-1.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-[#E31B23] uppercase tracking-widest">
                    🎟️ FEATURED ARCHIVE STREAM
                  </span>
                  <span className="text-[9px] text-zinc-400 uppercase">IFI@HOME</span>
                </div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  {lastSolvedIfiMovie.title}
                </p>
                <a
                  href={lastSolvedIfiMovie.ifiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full py-2 bg-[#E31B23] hover:bg-[#c4131b] text-white font-mono text-xs font-black uppercase tracking-wider rounded transition-all shadow-md mt-1"
                >
                  STREAM THIS FILM ON IFI@HOME ↗
                </a>
              </div>
            )}

            <button
              onClick={handleAdvanceNextReel}
              className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-mono text-base sm:text-lg font-black uppercase tracking-widest shadow-lg transition-all hover:scale-105 active:scale-95 rounded-lg"
            >
              ▶ ADVANCE TO REEL {reel + 1}
            </button>
          </div>
        </div>
      )}

      {/* GAME OVER SCREEN */}
      {gameOver && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_10%,rgba(227,27,35,0.35)_100%)] animate-pulse" />

          <GameOverSign />

          <div className="relative bg-zinc-900 border border-zinc-700 p-5 sm:p-6 rounded-xl shadow-2xl text-center max-w-md w-full space-y-4 relative z-10 overflow-hidden mt-1">
            
            <div className="relative z-10 space-y-1.5">
              <div className="inline-block bg-black/80 border border-zinc-800 px-4 py-1.5 rounded-lg font-mono text-xs font-black text-zinc-300 uppercase tracking-widest shadow">
                REACHED REEL {reel} • SCORE: <span className="text-green-400">{score}</span>
              </div>

              {isNewRecord && (
                <p className="text-yellow-400 font-mono text-xs font-black uppercase tracking-widest animate-bounce pt-1 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]">
                  🏆 NEW BEST RECORD ESTABLISHED! 🏆
                </p>
              )}
            </div>

            {/* Unsolved Movie Reveal */}
            <div className="relative z-10 bg-black border border-zinc-800 p-3.5 rounded-xl font-mono text-zinc-200 shadow-md text-left space-y-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] text-zinc-400 uppercase tracking-[0.2em] font-black">
                  🔍 UNSOLVED ARCHIVE REEL
                </span>
                <span className="text-[9px] text-zinc-500">IFI COLLECTION</span>
              </div>

              <div className="text-yellow-300 font-black tracking-widest text-base sm:text-lg uppercase drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                {currentMovie?.title}
              </div>

              {currentMovie?.ifiUrl && (
                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-amber-400">Available on IFI@Home</span>
                  <a
                    href={currentMovie.ifiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-3 py-1 bg-[#E31B23] hover:bg-[#c4131b] text-white font-mono text-[10px] font-black uppercase tracking-wider rounded transition-all shadow"
                  >
                    🎟️ STREAM FILM ↗
                  </a>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="relative z-10 space-y-2 pt-1">
              <button
                onClick={startNewGame}
                className="w-full py-3 bg-[#E31B23] hover:bg-[#c4131b] text-white font-mono text-base sm:text-lg font-black uppercase tracking-widest shadow-[0_0_25px_rgba(227,27,35,0.6)] transition-all hover:scale-105 active:scale-95 border-b-4 border-red-950 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-400"
              >
                ▶ RESTART PROJECTION
              </button>

              <button
                onClick={handleReturnToIntro}
                className="w-full py-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-xs font-black uppercase tracking-widest border border-zinc-800 rounded-lg transition-all"
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