// ── battleSystem.ts ──────────────────────────────────────────────
import { OsMon, Move, RARITY_MULT } from '../data/osmons'

export interface BattleMon extends OsMon {
  curHp: number
  maxHp: number
  lv: number
  xp: number
  xpToNext: number
  status: 'none' | 'paralyzed' | 'asleep' | 'confused'
  statusTurns: number
  // scaled stats (increase with level)
  atkScaled: number
  defScaled: number
  spdScaled: number
}

export function xpForLevel(lv: number): number {
  return Math.floor(lv * lv * 8)  // XP needed to reach this level: 8, 32, 72, 128...
}

export function makeBattleMon(mon: OsMon, lv = 5): BattleMon {
  const hp = calcMaxHp(mon.hp, lv)
  return {
    ...mon,
    curHp: hp, maxHp: hp, lv,
    xp: 0, xpToNext: xpForLevel(lv + 1),
    status: 'none', statusTurns: 0,
    atkScaled: calcStat(mon.attack, lv),
    defScaled: calcStat(mon.defense, lv),
    spdScaled: calcStat(mon.speed, lv),
  }
}

export function calcMaxHp(base: number, lv: number): number {
  return Math.floor(base * (1 + (lv - 1) * 0.12))
}

export function calcStat(base: number, lv: number): number {
  return Math.floor(base * (1 + (lv - 1) * 0.08))
}

/** Returns null or the levelled-up mon with updated stats */
export function tryLevelUp(mon: BattleMon): BattleMon | null {
  if (mon.xp < mon.xpToNext) return null
  const newLv = mon.lv + 1
  const newMaxHp = calcMaxHp(mon.hp, newLv)
  const hpGain = newMaxHp - mon.maxHp
  return {
    ...mon,
    lv: newLv,
    xp: mon.xp - mon.xpToNext,
    xpToNext: xpForLevel(newLv + 1),
    maxHp: newMaxHp,
    curHp: Math.min(mon.curHp + hpGain, newMaxHp),
    atkScaled: calcStat(mon.attack, newLv),
    defScaled: calcStat(mon.defense, newLv),
    spdScaled: calcStat(mon.speed, newLv),
  }
}

export function calcDamage(attacker: BattleMon, defender: BattleMon, move: Move): number {
  if (move.power === 0) return 0
  const atk = attacker.atkScaled ?? attacker.attack
  const def = defender.defScaled ?? defender.defense
  const base = Math.floor((atk / Math.max(1, def)) * move.power * (0.85 + Math.random() * 0.3) / 10)
  return Math.max(1, base)
}

export function shouldSkipTurn(mon: BattleMon): { skip: boolean; reason: string } {
  if (mon.status === 'paralyzed' && Math.random() < 0.25)
    return { skip: true, reason: `${mon.name} is paralyzed!` }
  if (mon.status === 'asleep') {
    if (mon.statusTurns > 0) return { skip: true, reason: `${mon.name} is fast asleep!` }
    return { skip: false, reason: `${mon.name} woke up!` }
  }
  if (mon.status === 'confused' && Math.random() < 0.33)
    return { skip: true, reason: `${mon.name} hurt itself in confusion!` }
  return { skip: false, reason: '' }
}

export function getXpReward(mon: BattleMon): number {
  return Math.floor(mon.lv * 12 * (RARITY_MULT[mon.rarity] ?? 1))
}

export function wildAiMove(wild: BattleMon): string {
  const available = wild.moves.filter(m => m)
  return available[Math.floor(Math.random() * available.length)]
}

export function applyStatus(target: BattleMon, effect: 'paralyze' | 'sleep' | 'confuse'): boolean {
  if (target.status !== 'none') return false
  if (Math.random() < 0.65) {
    target.status = effect === 'paralyze' ? 'paralyzed' : effect === 'sleep' ? 'asleep' : 'confused'
    target.statusTurns = effect === 'sleep' ? Math.floor(Math.random() * 3) + 1 : 3
    return true
  }
  return false
}

export function tickStatus(mon: BattleMon) {
  if (mon.statusTurns > 0) mon.statusTurns--
  if (mon.statusTurns === 0 && mon.status !== 'none' && mon.status !== 'paralyzed')
    mon.status = 'none'
}
