import { useState } from 'react'
import type { ReactNode } from 'react'
import { useGame } from '../../context/GameContext'
import { MONS, RARITY_LABELS, OsMon } from '../data/osmons'
import { xpForLevel } from '../systems/battleSystem'
import MonSprite from './MonSprite'

const TYPE_COLORS: Record<string, string> = {
  Process:'#4488ff', Memory:'#9944ee', FileSystem:'#66aa33',
  Kernel:'#ff7700', Network:'#2288ee', Sync:'#ee44bb',
}
const RARITY_COLORS: Record<string, string> = {
  B:'#aaaaaa', C:'#88cc88', U:'#8888ff', R:'#ffaa44', L:'#ffdd00',
}

function StatBar({ label, val, max=100 }: { label:string; val:number; max?:number }) {
  const pct = Math.min(100, (val/max)*100)
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
      <span className="font-pixel" style={{ fontSize:6, color:'#6677aa', minWidth:28 }}>{label}</span>
      <div style={{ flex:1, height:6, background:'#111', border:'1px solid #222', borderRadius:2 }}>
        <div style={{ height:'100%', width:`${pct}%`, background:'#e8a020', borderRadius:2, transition:'width 0.3s' }} />
      </div>
      <span className="font-pixel" style={{ fontSize:6, color:'#aaa', minWidth:20, textAlign:'right' }}>{val}</span>
    </div>
  )
}

function HpBar({ cur, max }: { cur:number; max:number }) {
  const pct = Math.max(0,(cur/max)*100)
  const c = pct>50?'#3db83d':pct>20?'#d4a017':'#c82020'
  return (
    <div style={{ height:5, background:'#222', border:'1px solid #333', borderRadius:2, overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${pct}%`, background:c, transition:'width 0.3s' }} />
    </div>
  )
}

function DexDetail({ mon, onBack }: { mon: OsMon; onBack: () => void }) {
  const { state } = useGame()
  const isCaught = state.caught.has(mon.id)
  const typeCol = TYPE_COLORS[mon.type] ?? '#888'
  const rarCol  = RARITY_COLORS[mon.rarity] ?? '#aaa'

  return (
    <div className="anim-fadeIn" style={{ display:'flex', flexDirection:'column', gap:14 }}>
      <button className="font-pixel cursor-pointer" style={{ fontSize:7, background:'none', border:'none', color:'#556', textAlign:'left', padding:0, marginBottom:4 }} onClick={onBack}>
        ← BACK TO DEX
      </button>

      {/* Header */}
      <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
        <div style={{ background:'#0a0a1a', border:`2px solid ${typeCol}44`, padding:8, borderRadius:4 }}>
          <MonSprite mon={mon} size={100} animate={true} />
        </div>
        <div style={{ flex:1 }}>
          <div className="font-pixel" style={{ fontSize:7, color:'#445', marginBottom:4 }}>
            #{String(mon.id).padStart(2,'0')}
          </div>
          <div className="font-pixel" style={{ fontSize:13, color:'#e8e8e8', marginBottom:6 }}>{mon.name}</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
            <span className="font-pixel" style={{ fontSize:7, padding:'3px 8px', background:`${typeCol}22`, border:`1px solid ${typeCol}66`, color:typeCol }}>
              {mon.type}
            </span>
            <span className="font-pixel" style={{ fontSize:7, padding:'3px 8px', background:`${rarCol}22`, border:`1px solid ${rarCol}66`, color:rarCol }}>
              {RARITY_LABELS[mon.rarity]}
            </span>
            {isCaught && (
              <span className="font-pixel" style={{ fontSize:7, padding:'3px 8px', background:'#0d2a0d', border:'1px solid #44bb44', color:'#88ff88' }}>
                ✓ CAUGHT
              </span>
            )}
          </div>
          <div className="font-pixel" style={{ fontSize:6, color:'#4a5a7a' }}>Found in: {mon.area}</div>
        </div>
      </div>

      {/* Description */}
      <div className="font-vt" style={{ fontSize:17, color:'#99aacc', lineHeight:1.6, padding:'10px 12px', background:'#080816', border:'1px solid #1a2a4a' }}>
        {mon.desc}
      </div>

      {/* Stats */}
      <div style={{ background:'#080816', border:'1px solid #1a2a4a', padding:'12px 14px' }}>
        <div className="font-pixel" style={{ fontSize:7, color:'#e8a020', marginBottom:10 }}>BASE STATS</div>
        <StatBar label="HP"  val={mon.hp} />
        <StatBar label="ATK" val={mon.attack} />
        <StatBar label="DEF" val={mon.defense} />
        <StatBar label="SPD" val={mon.speed} />
        <StatBar label="INT" val={mon.stats?.INT ?? 50} />
      </div>

      {/* Moves */}
      <div style={{ background:'#080816', border:'1px solid #1a2a4a', padding:'12px 14px' }}>
        <div className="font-pixel" style={{ fontSize:7, color:'#e8a020', marginBottom:8 }}>MOVES</div>
        {mon.moves.map((mv, i) => (
          <div key={mv} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'1px solid #0d1428' }}>
            <span className="font-pixel" style={{ fontSize:7, color:'#eee', minWidth:120 }}>
              {mv.replace(/_/g,' ').toUpperCase()}
            </span>
            <span className="font-pixel" style={{ fontSize:6, color:'#4488ff' }}>PWR {mon.movePowers?.[i] ?? '?'}</span>
            <span className="font-vt" style={{ fontSize:14, color:'#667788', flex:1 }}>{mon.moveDescs?.[i] ?? ''}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function DexTab() {
  const { state } = useGame()
  const { seen, caught } = state
  const [selected, setSelected] = useState<OsMon | null>(null)

  if (selected) return <DexDetail mon={selected} onBack={() => setSelected(null)} />

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
      {/* Summary */}
      <div style={{ display:'flex', gap:16, padding:'8px 12px', background:'#080816', border:'1px solid #1a3a6e' }}>
        <div className="text-center">
          <div className="font-pixel" style={{ fontSize:6, color:'#445' }}>CAUGHT</div>
          <div className="font-pixel" style={{ fontSize:14, color:'#88ff88' }}>{caught.size}<span style={{ fontSize:8, color:'#445' }}>/18</span></div>
        </div>
        <div style={{ width:1, background:'#1a2a4a' }} />
        <div className="text-center">
          <div className="font-pixel" style={{ fontSize:6, color:'#445' }}>SEEN</div>
          <div className="font-pixel" style={{ fontSize:14, color:'#aabbcc' }}>{seen.size}<span style={{ fontSize:8, color:'#445' }}>/18</span></div>
        </div>
        <div style={{ flex:1, alignSelf:'center' }}>
          <div style={{ height:5, background:'#111', borderRadius:2, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${(caught.size/18)*100}%`, background:'#88ff88', borderRadius:2 }} />
          </div>
        </div>
      </div>

      {/* Mon list */}
      {MONS.map(mon => {
        const isSeen   = seen.has(mon.id)
        const isCaught = caught.has(mon.id)
        const typeCol  = TYPE_COLORS[mon.type] ?? '#888'
        const rarCol   = RARITY_COLORS[mon.rarity] ?? '#aaa'
        return (
          <div key={mon.id}
            onClick={() => isSeen && setSelected(mon)}
            style={{
              display:'flex', alignItems:'center', gap:10, padding:'8px 10px',
              background: isSeen ? '#090916' : '#050508',
              border:`1px solid ${isCaught ? '#224422' : isSeen ? '#151528' : '#0d0d14'}`,
              opacity: isSeen ? 1 : 0.30,
              cursor: isSeen ? 'pointer' : 'default',
              transition:'all 0.12s',
            }}
            onMouseEnter={e => { if(isSeen)(e.currentTarget as HTMLDivElement).style.background='#0d1428' }}
            onMouseLeave={e => { if(isSeen)(e.currentTarget as HTMLDivElement).style.background=isSeen?'#090916':'#050508' }}
          >
            <span className="font-pixel" style={{ fontSize:7, color:'#2a3050', minWidth:24 }}>
              #{String(mon.id).padStart(2,'0')}
            </span>

            {isSeen ? (
              <>
                <div style={{ width:40, height:40, flexShrink:0 }}>
                  <MonSprite mon={mon} size={40} animate={false} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <span className="font-pixel" style={{ fontSize:8, color: isCaught?'#88ff88':'#dde' }}>{mon.name}</span>
                    {isCaught && <span className="font-pixel" style={{ fontSize:6, color:'#44aa44' }}>✓</span>}
                  </div>
                  <div style={{ display:'flex', gap:6, marginTop:3 }}>
                    <span className="font-pixel" style={{ fontSize:6, color:typeCol }}>{mon.type}</span>
                    <span className="font-pixel" style={{ fontSize:6, color:rarCol }}>{RARITY_LABELS[mon.rarity]}</span>
                  </div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div className="font-pixel" style={{ fontSize:6, color:'#2a3a5a' }}>HP {mon.hp}</div>
                  <div className="font-pixel" style={{ fontSize:6, color:'#2a3a5a' }}>SPD {mon.speed}</div>
                </div>
                <span className="font-pixel" style={{ fontSize:7, color:'#334' }}>›</span>
              </>
            ) : (
              <span className="font-pixel" style={{ fontSize:8, color:'#222' }}>???</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

function RosterTab() {
  const { state, dispatch } = useGame()
  const { party } = state
  if (party.length === 0)
    return (
      <div style={{ padding:'24px 0', textAlign:'center' }}>
        <div className="font-pixel" style={{ fontSize:9, color:'#334', marginBottom:8 }}>NO OS-MONS YET</div>
        <div className="font-vt" style={{ fontSize:18, color:'#445566' }}>Walk in tall grass to encounter wild OS-Mons!</div>
      </div>
    )
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
      {party.map((mon, i) => {
        const needed = xpForLevel(mon.lv + 1)
        const xpPct = Math.min(100, ((mon.xp ?? 0) / needed) * 100)
        const typeCol = TYPE_COLORS[mon.type] ?? '#1a3a6e'
        return (
          <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:12,
            background:'#090916', border:`1.5px solid ${typeCol}44` }}>
            <MonSprite mon={mon} size={80} animate={true} />
            <div className="font-pixel" style={{ fontSize:8, color:'#e8c870' }}>{mon.name}</div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <span className="font-pixel" style={{ fontSize:8, color:'#e8a020' }}>Lv.{mon.lv}</span>
              <span className="font-pixel" style={{ fontSize:6, color:typeCol }}>{mon.type}</span>
            </div>
            {/* HP */}
            <div style={{ width:'100%' }}><HpBar cur={mon.curHp} max={mon.maxHp} /></div>
            <div className="font-pixel" style={{ fontSize:6, color:'#667' }}>{mon.curHp}/{mon.maxHp} HP</div>
            {/* XP bar */}
            <div style={{ width:'100%' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                <span className="font-pixel" style={{ fontSize:5, color:'#2244aa' }}>XP to next level</span>
                <span className="font-pixel" style={{ fontSize:5, color:'#2244aa' }}>{mon.xp ?? 0}/{needed}</span>
              </div>
              <div style={{ height:4, background:'#111', borderRadius:2, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${xpPct}%`, background:'#3366ff', borderRadius:2, transition:'width 0.4s' }} />
              </div>
            </div>
            {/* Stats */}
            <div style={{ width:'100%', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:3, marginTop:2 }}>
              {[
                { label:'ATK', val: mon.atkScaled ?? mon.attack },
                { label:'DEF', val: mon.defScaled ?? mon.defense },
                { label:'SPD', val: mon.spdScaled ?? mon.speed },
              ].map(st => (
                <div key={st.label} style={{ textAlign:'center', background:'#0a0a1a', padding:'3px 0', borderRadius:2 }}>
                  <div className="font-pixel" style={{ fontSize:5, color:'#334' }}>{st.label}</div>
                  <div className="font-pixel" style={{ fontSize:9, color:'#aabbcc' }}>{st.val}</div>
                </div>
              ))}
            </div>
            {mon.status !== 'none' && (
              <span className="font-pixel" style={{ fontSize:6, background:'#3a1500', color:'#ff8844', padding:'2px 5px' }}>
                {mon.status.toUpperCase()}
              </span>
            )}
            <div style={{ width:'100%', marginTop:2 }}>
              {mon.moves.slice(0,4).map(mId => (
                <div key={mId} className="font-pixel" style={{ fontSize:6, color:'#334', marginBottom:2 }}>
                  · {mId.replace(/_/g,' ').toUpperCase()}
                </div>
              ))}
            </div>
            {mon.curHp < mon.maxHp && state.items.potion > 0 && (
              <button className="font-pixel cursor-pointer" style={{ fontSize:6, padding:'4px 8px', background:'#0a1808', color:'#88ff88', border:'1px solid #44aa44' }}
                onClick={() => dispatch({ type:'USE_POTION' })}>
                USE POTION ({state.items.potion})
              </button>
            )}
          </div>
        )
      })}
      {Array.from({ length: Math.max(0, 6-party.length) }).map((_,i) => (
        <div key={`e${i}`} style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:100,
          background:'#050510', border:'1.5px dashed #0d1428', opacity:0.35 }}>
          <span className="font-pixel" style={{ fontSize:7, color:'#222' }}>EMPTY</span>
        </div>
      ))}
    </div>
  )
}

function InfoTab() {
  const { state } = useGame()
  const box = (title: string, children: ReactNode) => (
    <div style={{ background:'#090916', border:'1.5px solid #1a3a6e', padding:14, marginBottom:12 }}>
      <div className="font-pixel" style={{ fontSize:7, color:'#e8a020', marginBottom:10, borderBottom:'1px solid #1a2a4a', paddingBottom:6 }}>{title}</div>
      {children}
    </div>
  )
  return (
    <div>
      {box('TRAINER', (
        <div className="font-vt" style={{ fontSize:18, color:'#aabbcc', lineHeight:1.8 }}>
          <div>Name: <span style={{ color:'#e8a020' }}>{state.trainerName}</span></div>
          <div>Area: <span style={{ color:'#88ccff' }}>{state.currentArea}</span></div>
          <div>Caught: <span style={{ color:'#88ff88' }}>{state.caught.size}/18</span></div>
          <div>Seen: <span style={{ color:'#aaa' }}>{state.seen.size}/18</span></div>
        </div>
      ))}
      {box('ITEMS', (
        <div className="font-vt" style={{ fontSize:18, color:'#aabbcc', lineHeight:1.9 }}>
          <div>Kernel Balls: <span style={{ color:'#e8a020' }}>{state.items.kernelball}</span>
            <span className="font-vt" style={{ fontSize:14, color:'#445', marginLeft:6 }}>— standard catch</span></div>
          <div>Super Balls: <span style={{ color:'#88ccff' }}>{state.items.superball}</span>
            <span className="font-vt" style={{ fontSize:14, color:'#445', marginLeft:6 }}>— 1.5× catch rate</span></div>
          <div>Reboot Pot: <span style={{ color:'#88ff88' }}>{state.items.potion}</span>
            <span className="font-vt" style={{ fontSize:14, color:'#445', marginLeft:6 }}>— heal 50% HP</span></div>
          <div>Cache Clear: <span style={{ color:'#ffaa44' }}>{state.items.cacheclr}</span>
            <span className="font-vt" style={{ fontSize:14, color:'#445', marginLeft:6 }}>— cure status</span></div>
        </div>
      ))}
      {box('CONTROLS', (
        <div className="font-vt" style={{ fontSize:17, color:'#778899', lineHeight:1.9 }}>
          <div><span style={{ color:'#e8a020' }}>WASD / Arrows</span> — Move</div>
          <div><span style={{ color:'#e8a020' }}>E / Enter</span> — Interact / Talk</div>
          <div><span style={{ color:'#e8a020' }}>Space</span> — Open this menu</div>
          <div><span style={{ color:'#e8a020' }}>Escape</span> — Close menu</div>
          <div style={{ marginTop:8, color:'#445566' }}>Walk in TALL GRASS to encounter OS-Mons!</div>
          <div style={{ color:'#445566' }}>Press E near glowing QUIZ pillars for XP!</div>
          <div style={{ color:'#445566' }}>Step on glowing PORTAL GATES to travel!</div>
        </div>
      ))}
    </div>
  )
}

export default function InventoryPanel() {
  const { state, dispatch } = useGame()
  const close = () => dispatch({ type:'SET_PHASE', phase:'exploring' })
  const TABS = ['roster','dex','info'] as const
  const TAB_LABELS: Record<string, string> = { roster:'ROSTER', dex:'OS-DEX', info:'INFO' }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4"
      style={{ background:'rgba(0,0,0,0.88)' }}>
      <div className="anim-fadeIn flex flex-col w-full max-w-2xl"
        style={{ background:'#04040f', border:'2px solid #1a3a6e', maxHeight:'92vh', borderRadius:2 }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 16px', borderBottom:'1.5px solid #0d1e3a' }}>
          <div>
            <span className="font-pixel" style={{ fontSize:9, color:'#e8a020' }}>OS-MON ACADEMY</span>
            <span className="font-pixel" style={{ fontSize:6, color:'#334', marginLeft:12 }}>{state.trainerName}</span>
          </div>
          <button className="font-pixel cursor-pointer" style={{ fontSize:7, background:'none', border:'1px solid #1a2a3a', color:'#445', padding:'4px 10px' }} onClick={close}>
            ✕ ESC
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1.5px solid #0d1e3a' }}>
          {TABS.map(tab => (
            <button key={tab}
              className="font-pixel cursor-pointer"
              style={{
                flex:1, padding:'10px 4px', fontSize:7, border:'none',
                borderRight:'1px solid #0d1e3a',
                background: state.activeInventoryTab===tab ? '#0d1e3a' : 'transparent',
                color: state.activeInventoryTab===tab ? '#e8a020' : '#334',
                transition:'all 0.12s',
              }}
              onClick={() => dispatch({ type:'SET_INVENTORY_TAB', tab })}>
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex:1, overflowY:'auto', padding:14 }}>
          {state.activeInventoryTab==='roster' && <RosterTab />}
          {state.activeInventoryTab==='dex'    && <DexTab />}
          {state.activeInventoryTab==='info'   && <InfoTab />}
        </div>
      </div>
    </div>
  )
}
