import { BattleMon } from './battleSystem'

export type BallType = 'kernelball' | 'superball' | 'debugball'

export function calcCatchRate(wild: BattleMon, ball: BallType): number {
  const hpRatio = wild.curHp / wild.maxHp
  const catchRate = wild.catchRate / 255
  let ballMult = 1
  if (ball === 'superball') ballMult = 1.5
  if (ball === 'debugball') ballMult = 2
  const base = (1 - hpRatio * 0.7) * catchRate * 0.85 * ballMult
  return Math.min(0.95, Math.max(0.02, base))
}

export function attemptCatch(wild: BattleMon, ball: BallType): { caught: boolean; shakes: number } {
  const rate = calcCatchRate(wild, ball)
  const shakes = Math.floor(rate * 4)
  const caught = Math.random() < rate
  return { caught, shakes }
}
