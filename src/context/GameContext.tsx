import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { BattleMon, makeBattleMon, calcDamage, getXpReward, wildAiMove, applyStatus, tickStatus, shouldSkipTurn, tryLevelUp } from '../game/systems/battleSystem'
import { attemptCatch } from '../game/systems/catchingSystem'
import { MONS, MOVES } from '../game/data/osmons'
import { AREAS } from '../game/data/areas'
import { QUIZ_QUESTIONS, QuizQuestion } from '../game/data/quizQuestions'
import { saveGame } from '../game/systems/saveManager'

export type Phase = 'title' | 'exploring' | 'battle' | 'dialogue' | 'quiz' | 'inventory' | 'transition' | 'gameover'

export interface Items {
  kernelball: number
  superball: number
  potion: number
  cacheclr: number
}

export interface DialogueLine {
  speaker: string
  text: string
  color?: string
}

export interface GameState {
  phase: Phase
  trainerName: string
  currentArea: string
  playerPos: { x: number; y: number }
  playerDir: 'up' | 'down' | 'left' | 'right'
  party: BattleMon[]
  caught: Set<number>
  seen: Set<number>
  items: Items
  badges: number
  wildMon: BattleMon | null
  battleLog: string[]
  battlePhase: 'menu' | 'moves' | 'animating' | 'catch' | 'end'
  battleResult: 'none' | 'win' | 'lose' | 'caught' | 'ran'
  dialogueLines: DialogueLine[]
  dialogueIndex: number
  pendingBattle: { monId: number; lv: number } | null
  currentQuiz: QuizQuestion | null
  quizAnswered: boolean
  quizCorrect: boolean
  activeInventoryTab: 'roster' | 'dex' | 'info'
  transitionArea: string
  notification: string
  levelUpMsg: string
  npcDefeated: Record<string, boolean>
  npcTalked: Record<string, boolean>
}

type Action =
  | { type: 'START_GAME'; name: string }
  | { type: 'LOAD_SAVE'; data: Partial<GameState> }
  | { type: 'MOVE_PLAYER'; x: number; y: number; dir: 'up'|'down'|'left'|'right' }
  | { type: 'SET_PHASE'; phase: Phase }
  | { type: 'SET_AREA'; area: string; x: number; y: number }
  | { type: 'START_BATTLE'; monId: number; lv: number }
  | { type: 'PLAYER_MOVE'; moveId: string }
  | { type: 'WILD_MOVE' }
  | { type: 'SWITCH_OSMON'; partyIndex: number }
  | { type: 'THROW_BALL'; ballType: 'kernelball' | 'superball' | 'debugball' }
  | { type: 'RUN' }
  | { type: 'START_DIALOGUE'; lines: DialogueLine[]; pendingBattle?: { monId: number; lv: number } | null }
  | { type: 'ADVANCE_DIALOGUE' }
  | { type: 'START_QUIZ'; questionId?: number }
  | { type: 'ANSWER_QUIZ'; index: number }
  | { type: 'GAIN_XP'; amount: number }
  | { type: 'USE_POTION' }
  | { type: 'SET_INVENTORY_TAB'; tab: 'roster'|'dex'|'info' }
  | { type: 'SET_NOTIFICATION'; msg: string }
  | { type: 'CLEAR_LEVEL_UP_MSG' }
  | { type: 'MARK_SEEN'; monId: number }
  | { type: 'TRANSITION_AREA'; area: string; x: number; y: number }
  | { type: 'MARK_NPC_DEFEATED'; area: string; npcIndex: number }
  | { type: 'MARK_NPC_TALKED'; area: string; npcIndex: number }

const initialState: GameState = {
  phase: 'title',
  trainerName: 'SYSADMIN',
  currentArea: 'CPU Valley',
  playerPos: { x: 9, y: 7 },
  playerDir: 'down',
  party: [],
  caught: new Set(),
  seen: new Set(),
  items: { kernelball: 5, superball: 2, potion: 3, cacheclr: 1 },
  badges: 0,
  wildMon: null,
  battleLog: [],
  battlePhase: 'menu',
  battleResult: 'none',
  dialogueLines: [],
  dialogueIndex: 0,
  pendingBattle: null,
  currentQuiz: null,
  quizAnswered: false,
  quizCorrect: false,
  activeInventoryTab: 'roster',
  transitionArea: '',
  notification: '',
  levelUpMsg: '',
  npcDefeated: {},
  npcTalked: {},
}

function addLog(state: GameState, msg: string): GameState {
  return { ...state, battleLog: [...state.battleLog.slice(-20), msg] }
}

function giveXp(party: BattleMon[], amount: number): { party: BattleMon[]; msg: string } {
  if (!party[0]) return { party, msg: '' }
  let mon = { ...party[0], xp: (party[0].xp ?? 0) + amount }
  let msgs: string[] = []
  let levelled = tryLevelUp(mon)
  while (levelled) {
    msgs.push(`${levelled.name} grew to Lv.${levelled.lv}! ATK↑ DEF↑ HP↑`)
    mon = levelled
    levelled = tryLevelUp(mon)
  }
  return {
    party: party.map((m, i) => i === 0 ? mon : m),
    msg: msgs.join(' | '),
  }
}

function allFainted(party: BattleMon[]): boolean {
  return party.length > 0 && party.every(m => m.curHp <= 0)
}

const INTRO_DIALOGUE: DialogueLine[] = [
  { speaker: 'Prof. Dijkstra', text: 'Welcome to OS-MON ACADEMY — a world where Operating System concepts come alive as creatures called OS-Mons!', color: '#e8a020' },
  { speaker: 'Prof. Dijkstra', text: 'Each OS-Mon represents a core OS concept: processes, threads, memory, file systems, networking, and more.', color: '#e8a020' },
  { speaker: 'Prof. Dijkstra', text: 'Explore the world, talk to trainers, battle wild OS-Mons, and answer quiz questions to earn XP and grow your team!', color: '#e8a020' },
  { speaker: 'Prof. Dijkstra', text: 'Use WASD to move. Press E or ENTER near NPCs to interact. Walk through tall grass to find wild OS-Mons!', color: '#e8a020' },
  { speaker: 'Prof. Dijkstra', text: 'In battle, you can switch your active OS-Mon using the SWITCH button. Keep your team healthy with potions!', color: '#e8a020' },
  { speaker: 'Prof. Dijkstra', text: 'Your starter is Processus — the humble CPU process. Train it well. The Kernel Castle awaits! Good luck, trainer!', color: '#e8a020' },
]

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {

    case 'START_GAME': {
      const starter = makeBattleMon(MONS[0], 5)
      const area = AREAS['CPU Valley']
      return {
        ...initialState,
        phase: 'dialogue',
        trainerName: action.name || 'SYSADMIN',
        party: [starter],
        caught: new Set([1]),
        seen: new Set([1, 2, 3, 7, 10, 12, 13]),
        currentArea: 'CPU Valley',
        playerPos: area.playerStart,
        dialogueLines: INTRO_DIALOGUE,
        dialogueIndex: 0,
        pendingBattle: null,
      }
    }

    case 'LOAD_SAVE': {
      return { ...state, ...action.data, phase: 'exploring' }
    }

    case 'MOVE_PLAYER': {
      return { ...state, playerPos: { x: action.x, y: action.y }, playerDir: action.dir }
    }

    case 'SET_PHASE':
      return { ...state, phase: action.phase }

    case 'SET_AREA': {
      const area = AREAS[action.area]
      if (!area) return state
      return { ...state, currentArea: action.area, playerPos: { x: action.x, y: action.y }, phase: 'exploring' }
    }

    case 'TRANSITION_AREA': {
      return { ...state, phase: 'transition', transitionArea: action.area, playerPos: { x: action.x, y: action.y } }
    }

    case 'START_BATTLE': {
      const monData = MONS.find(m => m.id === action.monId)
      if (!monData) return state
      const wild = makeBattleMon(monData, action.lv)
      const newSeen = new Set(state.seen)
      newSeen.add(monData.id)
      return {
        ...state,
        phase: 'battle',
        wildMon: wild,
        battleLog: [`A wild ${wild.name} appeared!`],
        battlePhase: 'menu',
        battleResult: 'none',
        seen: newSeen,
        pendingBattle: null,
      }
    }

    case 'SWITCH_OSMON': {
      const idx = action.partyIndex
      if (idx <= 0 || idx >= state.party.length) return state
      if (state.party[idx].curHp <= 0) return addLog(state, `${state.party[idx].name} is fainted!`)
      const newParty = [...state.party]
      const [front] = newParty.splice(idx, 1)
      newParty.unshift(front)
      return addLog({ ...state, party: newParty }, `Go, ${front.name}!`)
    }

    case 'PLAYER_MOVE': {
      if (!state.wildMon || (state.battlePhase !== 'menu' && state.battlePhase !== 'moves')) return state
      const player = state.party[0]
      if (!player || player.curHp <= 0) return state
      const move = MOVES[action.moveId]
      if (!move) return state

      let logs: string[] = []
      let newWild = { ...state.wildMon }
      let newPlayer = { ...player }

      const { skip, reason } = shouldSkipTurn(newPlayer)
      if (skip) {
        logs.push(reason)
      } else {
        const dmg = calcDamage(newPlayer, newWild, move)
        newWild.curHp = Math.max(0, newWild.curHp - dmg)
        logs.push(`${newPlayer.name} used ${move.name}!`)
        if (dmg > 0) logs.push(`Dealt ${dmg} damage!`)
        if (move.effect && newWild.curHp > 0) {
          const applied = applyStatus(newWild, move.effect)
          if (applied) logs.push(`${newWild.name} is now ${newWild.status}!`)
        }
      }
      tickStatus(newPlayer)

      if (newWild.curHp <= 0) {
        const xp = getXpReward(newWild)
        const { party: newParty, msg: lvMsg } = giveXp(state.party.map((m,i)=>i===0?newPlayer:m), xp)
        logs.push(`${newWild.name} fainted! +${xp} XP!`)
        if (lvMsg) logs.push(lvMsg)
        let s = { ...state }
        s = addLog(s, logs.join('\n'))
        return { ...s, wildMon: newWild, party: newParty, battlePhase: 'end', battleResult: 'win', levelUpMsg: lvMsg }
      }

      const wildMoveId = wildAiMove(newWild)
      const wildMove = MOVES[wildMoveId]
      const { skip: wSkip, reason: wReason } = shouldSkipTurn(newWild)
      if (wSkip) {
        logs.push(wReason)
      } else if (wildMove) {
        const wdmg = calcDamage(newWild, newPlayer, wildMove)
        newPlayer.curHp = Math.max(0, newPlayer.curHp - wdmg)
        logs.push(`${newWild.name} used ${wildMove.name}!`)
        if (wdmg > 0) logs.push(`${newPlayer.name} took ${wdmg} damage!`)
        if (wildMove.effect && newPlayer.curHp > 0) {
          const applied = applyStatus(newPlayer, wildMove.effect)
          if (applied) logs.push(`${newPlayer.name} is now ${newPlayer.status}!`)
        }
      }
      tickStatus(newWild)

      const newParty2 = state.party.map((m, i) => i === 0 ? newPlayer : m)

      if (newPlayer.curHp <= 0) {
        logs.push(`${newPlayer.name} fainted!`)
        if (allFainted(newParty2)) {
          let s = { ...state }
          s = addLog(s, logs.join('\n'))
          return { ...s, wildMon: newWild, party: newParty2, battlePhase: 'end', battleResult: 'lose' }
        }
        // Auto-switch to next alive mon
        const nextAliveIdx = newParty2.findIndex((m, i) => i > 0 && m.curHp > 0)
        if (nextAliveIdx > 0) {
          const switched = [...newParty2]
          const [front] = switched.splice(nextAliveIdx, 1)
          switched.unshift(front)
          logs.push(`${front.name} was sent out!`)
          let s = state
          for (const l of logs) s = addLog(s, l)
          return { ...s, wildMon: newWild, party: switched, battlePhase: 'menu' }
        }
        let s = { ...state }
        s = addLog(s, logs.join('\n'))
        return { ...s, wildMon: newWild, party: newParty2, battlePhase: 'end', battleResult: 'lose' }
      }

      let s = state
      for (const l of logs) s = addLog(s, l)
      return { ...s, wildMon: newWild, party: newParty2, battlePhase: 'menu' }
    }

    case 'WILD_MOVE': return state

    case 'THROW_BALL': {
      if (!state.wildMon) return state
      const ballKey = action.ballType
      if (ballKey !== 'debugball' && state.items[ballKey as keyof Items] <= 0) {
        return addLog(state, 'No more balls!')
      }
      const newItems = { ...state.items }
      if (ballKey !== 'debugball') newItems[ballKey as keyof Items]--

      const { caught, shakes } = attemptCatch(state.wildMon, action.ballType)
      let logs: string[] = [`Threw a ${ballKey}! ...${shakes} shake${shakes !== 1 ? 's' : ''}...`]
      let s: GameState = { ...state, items: newItems }

      if (caught) {
        const newCaught = new Set(state.caught)
        newCaught.add(state.wildMon.id)
        const newParty = state.party.length < 6
          ? [...state.party, { ...state.wildMon }]
          : state.party
        logs.push(`Gotcha! ${state.wildMon.name} was caught!`)
        s = addLog(s, logs.join('\n'))
        return { ...s, caught: newCaught, party: newParty, battlePhase: 'end', battleResult: 'caught' }
      } else {
        logs.push(`${state.wildMon.name} broke free!`)
        const wildMoveId = wildAiMove(state.wildMon)
        const wildMove = MOVES[wildMoveId]
        const player = s.party[0]
        if (player && wildMove) {
          const dmg = calcDamage(state.wildMon, player, wildMove)
          const newPlayer = { ...player, curHp: Math.max(0, player.curHp - dmg) }
          const newParty = s.party.map((m, i) => i === 0 ? newPlayer : m)
          logs.push(`${state.wildMon.name} used ${wildMove.name}! (${dmg} dmg)`)
          s = { ...s, party: newParty }
          if (newPlayer.curHp <= 0 && allFainted(s.party)) {
            for (const l of logs) s = addLog(s, l)
            return { ...s, battlePhase: 'end', battleResult: 'lose' }
          }
        }
        for (const l of logs) s = addLog(s, l)
        return { ...s, battlePhase: 'menu' }
      }
    }

    case 'RUN': {
      return addLog({ ...state, phase: 'exploring', battlePhase: 'menu', battleResult: 'ran', wildMon: null }, 'Got away safely!')
    }

    case 'START_DIALOGUE': {
      return {
        ...state,
        phase: 'dialogue',
        dialogueLines: action.lines,
        dialogueIndex: 0,
        pendingBattle: action.pendingBattle ?? null,
      }
    }

    case 'ADVANCE_DIALOGUE': {
      const currentLine = state.dialogueLines[state.dialogueIndex]
      // [BATTLE] on current line => trigger battle
      if (currentLine?.text.includes('[BATTLE]')) {
        const pb = state.pendingBattle
        if (pb) {
          const monData = MONS.find(m => m.id === pb.monId)
          if (monData) {
            const wild = makeBattleMon(monData, pb.lv)
            const newSeen = new Set(state.seen)
            newSeen.add(monData.id)
            return {
              ...state,
              phase: 'battle',
              wildMon: wild,
              battleLog: [`${wild.name} wants to battle!`],
              battlePhase: 'menu',
              battleResult: 'none',
              seen: newSeen,
              dialogueLines: [],
              dialogueIndex: 0,
              pendingBattle: null,
            }
          }
        }
        return { ...state, phase: 'exploring', dialogueLines: [], dialogueIndex: 0, pendingBattle: null }
      }

      const next = state.dialogueIndex + 1
      if (next >= state.dialogueLines.length) {
        return { ...state, phase: 'exploring', dialogueLines: [], dialogueIndex: 0, pendingBattle: null }
      }
      return { ...state, dialogueIndex: next }
    }

    case 'START_QUIZ': {
      const pool = QUIZ_QUESTIONS
      const q = action.questionId != null
        ? pool.find(q => q.id === action.questionId) ?? pool[Math.floor(Math.random() * pool.length)]
        : pool[Math.floor(Math.random() * pool.length)]
      return { ...state, phase: 'quiz', currentQuiz: q, quizAnswered: false, quizCorrect: false }
    }

    case 'ANSWER_QUIZ': {
      if (!state.currentQuiz || state.quizAnswered) return state
      const correct = action.index === state.currentQuiz.correctIndex
      let newParty = state.party
      let lvMsg = ''
      if (correct && state.party[0]) {
        const result = giveXp(state.party, state.currentQuiz.xpReward)
        newParty = result.party; lvMsg = result.msg
      }
      return { ...state, quizAnswered: true, quizCorrect: correct, party: newParty, levelUpMsg: lvMsg }
    }

    case 'GAIN_XP': {
      if (!state.party[0]) return state
      const { party: newParty, msg: lvMsg } = giveXp(state.party, action.amount)
      return { ...state, party: newParty, levelUpMsg: lvMsg }
    }

    case 'USE_POTION': {
      if (state.items.potion <= 0 || !state.party[0]) return state
      const newParty = state.party.map((m, i) => {
        if (i !== 0) return m
        return { ...m, curHp: Math.min(m.maxHp, m.curHp + Math.floor(m.maxHp * 0.5)) }
      })
      const newItems = { ...state.items, potion: state.items.potion - 1 }
      return addLog({ ...state, party: newParty, items: newItems }, `${state.party[0].name} was healed!`)
    }

    case 'SET_INVENTORY_TAB':
      return { ...state, activeInventoryTab: action.tab }

    case 'SET_NOTIFICATION':
      return { ...state, notification: action.msg }

    case 'CLEAR_LEVEL_UP_MSG':
      return { ...state, levelUpMsg: '' }

    case 'MARK_SEEN': {
      const newSeen = new Set(state.seen)
      newSeen.add(action.monId)
      return { ...state, seen: newSeen }
    }

    case 'MARK_NPC_DEFEATED': {
      const key = `${action.area}__${action.npcIndex}`
      return { ...state, npcDefeated: { ...state.npcDefeated, [key]: true } }
    }

    case 'MARK_NPC_TALKED': {
      const key = `${action.area}__${action.npcIndex}`
      return { ...state, npcTalked: { ...state.npcTalked, [key]: true } }
    }

    default:
      return state
  }
}

interface GameContextType {
  state: GameState
  dispatch: React.Dispatch<Action>
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    if (state.phase === 'exploring') {
      saveGame(state)
    }
  }, [state.playerPos, state.phase])

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be used within GameProvider')
  return ctx
}
