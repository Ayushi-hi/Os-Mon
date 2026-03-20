import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useGame } from '../../context/GameContext'

const STORAGE_KEY = 'osmon_music_v1'

const AREA_TO_TRACK: Record<string, string> = {
  'CPU Valley': '/audio/music/cpu_valley.mp3',
  'Process Plains': '/audio/music/process.mp3',
  'Memory Mountains': '/audio/music/process.mp3',
  'File Forest': '/audio/music/sync.mp3',
  'Sync Sanctuary': '/audio/music/sync.mp3',
  'Network Nexus': '/audio/music/network.mp3',
  'Kernel Castle': '/audio/music/kernal.mp3',
}

function clamp01(n: number) { return Math.max(0, Math.min(1, n)) }

function IconSpeaker({ muted, volume }: { muted: boolean; volume: number }) {
  if (muted || volume === 0) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
  if (volume < 0.4) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}

export default function MusicController({ enabled = true }: { enabled?: boolean }) {
  const { state } = useGame()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const failedTracksRef = useRef<Set<string>>(new Set())
  const popupRef = useRef<HTMLDivElement | null>(null)
  const [volume, setVolume] = useState<number>(0.65)
  const [muted, setMuted] = useState<boolean>(false)
  const [activeUrl, setActiveUrl] = useState<string | null>(null)
  const [hasError, setHasError] = useState<boolean>(false)
  const [open, setOpen] = useState(false)

  const targetUrl = useMemo(() => AREA_TO_TRACK[state.currentArea] ?? null, [state.currentArea])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const parsed = JSON.parse(raw) as { volume?: number; muted?: boolean }
      if (typeof parsed.volume === 'number' && Number.isFinite(parsed.volume)) setVolume(clamp01(parsed.volume))
      if (typeof parsed.muted === 'boolean') setMuted(parsed.muted)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    const a = audioRef.current; if (!a) return
    a.muted = muted; a.volume = clamp01(volume)
  }, [muted, volume])

  const attemptPlay = useCallback(async () => {
    const a = audioRef.current; if (!a) return
    if (muted) a.muted = true
    a.volume = clamp01(volume)
    try { await a.play() } catch { /* autoplay blocked */ }
  }, [muted, volume])

  useEffect(() => {
    if (!enabled) return
    let attempted = false
    const tryOnce = () => { if (attempted) return; attempted = true; void attemptPlay() }
    window.addEventListener('pointerdown', tryOnce, { once: true })
    window.addEventListener('keydown', tryOnce, { once: true })
    return () => { window.removeEventListener('pointerdown', tryOnce); window.removeEventListener('keydown', tryOnce) }
  }, [enabled, attemptPlay])

  useEffect(() => {
    if (!enabled || !targetUrl) return
    const a = audioRef.current; if (!a) return
    if (failedTracksRef.current.has(targetUrl)) { setHasError(true); return }
    if (activeUrl === targetUrl && !a.paused) return
    setHasError(false); setActiveUrl(targetUrl)
    a.loop = true; a.src = targetUrl; a.currentTime = 0
    const onError = () => { failedTracksRef.current.add(targetUrl); setHasError(true); try { a.pause() } catch { /* no-op */ } }
    a.addEventListener('error', onError, { once: true })
    void attemptPlay()
  }, [enabled, targetUrl, activeUrl, attemptPlay])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume, muted })) } catch { /* ignore */ }
  }, [volume, muted])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => { if (popupRef.current && !popupRef.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const setVol = useCallback((next: number) => { setVolume(clamp01(next)); if (next > 0 && muted) setMuted(false) }, [muted])
  const onToggleMute = useCallback(() => { if (volume <= 0) { setMuted(false); setVolume(0.65); return } setMuted(v => !v) }, [volume])

  if (!enabled) return null
  const effectiveVolume = muted ? 0 : volume
  const iconColor = muted ? '#ff7070' : '#88ccff'

  return (
    <>
      <audio ref={audioRef} preload="auto" />
      <div ref={popupRef} style={{ position: 'absolute', top: 58, right: 16, zIndex: 60, pointerEvents: 'auto' }}>
        <button onClick={() => setOpen(v => !v)} onDoubleClick={onToggleMute}
          aria-label="Toggle music controls" title="Music controls (double-click to mute)"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 8,
            background: open ? 'rgba(30,60,120,0.92)' : 'rgba(4,4,16,0.72)',
            border: `1px solid ${open ? 'rgba(136,204,255,0.35)' : 'rgba(255,255,255,0.10)'}`,
            backdropFilter: 'blur(8px)', cursor: 'pointer', color: iconColor, transition: 'background 0.15s', padding: 0 }}>
          <IconSpeaker muted={muted} volume={effectiveVolume} />
        </button>
        {open && (
          <div style={{ position: 'absolute', top: 40, right: 0, background: 'rgba(4,4,20,0.90)',
            border: '1px solid rgba(136,204,255,0.18)', borderRadius: 8, backdropFilter: 'blur(12px)',
            padding: '10px 12px', width: 196, boxShadow: '0 8px 24px rgba(0,0,0,0.55)', animation: 'mc-pop 0.12s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 6, color: '#445566', letterSpacing: 1 }}>MUSIC</span>
              <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 6, color: hasError ? '#ff6666' : '#88ccff',
                maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {hasError ? 'MISSING TRACK' : state.currentArea.toUpperCase()}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={onToggleMute} aria-label={muted ? 'Unmute' : 'Mute'}
                style={{ background: 'none', border: 'none', padding: 2, cursor: 'pointer', color: muted ? '#ff7070' : '#88ccff', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <IconSpeaker muted={muted} volume={effectiveVolume} />
              </button>
              <input type="range" min={0} max={1} step={0.01} value={effectiveVolume}
                onChange={e => setVol(Number(e.target.value))} aria-label="Music volume"
                style={{ flex: 1, accentColor: '#88ccff', cursor: 'pointer', height: 4 }} />
              <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 6, color: '#8899bb', minWidth: 26, textAlign: 'right' }}>
                {Math.round(effectiveVolume * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes mc-pop { from { opacity:0; transform:translateY(-4px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </>
  )
}
