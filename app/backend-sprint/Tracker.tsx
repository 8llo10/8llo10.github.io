'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Cloud,
  Copy,
  ExternalLink,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Timer,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { breaks, phases, sessionTimes, sprintDays } from './roadmapData';
import './roadmap.css';
import './sync.css';

type TimerProgress = {
  startedAt?: string;
  completedAt?: string;
  activeSince?: string;
  accumulatedSeconds?: number;
  importedDone?: boolean;
};

type AppState = {
  version: 6;
  phaseProgress: Record<string, TimerProgress>;
  sessionProgress: Record<string, TimerProgress>;
  breakProgress: Record<string, { completedAt?: string }>;
};

type SyncStatus = 'loading' | 'synced' | 'saving' | 'offline' | 'error' | 'readonly';

const SYNC_URL = 'https://ovtnbytzbahokxlwbmkm.supabase.co/functions/v1/backend-roadmap-sync';
const PUBLISHABLE_KEY = 'sb_publishable_qG1fKvyXeWgoFYqcBqCp2Q__6CxVAVe';
const OWNER_STORAGE_KEY = 'ghala-backend-roadmap-owner-v1';
const LOCAL_STORAGE_KEY = 'ghala-backend-engineering-roadmap-v6';
const LEGACY_STORAGE_KEY = 'ghala-backend-engineering-roadmap-v4';

const emptyState = (): AppState => ({
  version: 6,
  phaseProgress: {},
  sessionProgress: {},
  breakProgress: {},
});

function formatDateTime(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value));
}

function formatShort(value?: string) {
  if (!value) return 'Pending';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value));
}

function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h) return `${h}h ${String(m).padStart(2, '0')}m`;
  return `${m}m`;
}

function elapsed(timer: TimerProgress | undefined, nowMs: number) {
  if (!timer) return 0;
  let seconds = timer.accumulatedSeconds || 0;
  if (timer.activeSince) seconds += Math.max(0, (nowMs - new Date(timer.activeSince).getTime()) / 1000);
  return seconds;
}

function pauseTimer(timer: TimerProgress | undefined, nowIso: string): TimerProgress {
  const current = timer || {};
  if (!current.activeSince) return current;
  const delta = Math.max(0, (new Date(nowIso).getTime() - new Date(current.activeSince).getTime()) / 1000);
  return {
    ...current,
    activeSince: undefined,
    accumulatedSeconds: (current.accumulatedSeconds || 0) + delta,
  };
}

function pauseEverything(state: AppState, nowIso: string): AppState {
  const phaseProgress = { ...state.phaseProgress };
  const sessionProgress = { ...state.sessionProgress };
  Object.keys(phaseProgress).forEach((key) => {
    if (phaseProgress[key]?.activeSince) phaseProgress[key] = pauseTimer(phaseProgress[key], nowIso);
  });
  Object.keys(sessionProgress).forEach((key) => {
    if (sessionProgress[key]?.activeSince) sessionProgress[key] = pauseTimer(sessionProgress[key], nowIso);
  });
  return { ...state, phaseProgress, sessionProgress };
}

function normalizeState(raw: any): AppState {
  const next = emptyState();
  if (!raw || typeof raw !== 'object') return next;
  if (raw.phaseProgress && typeof raw.phaseProgress === 'object') next.phaseProgress = raw.phaseProgress;
  if (raw.sessionProgress && typeof raw.sessionProgress === 'object') next.sessionProgress = raw.sessionProgress;
  if (raw.breakProgress && typeof raw.breakProgress === 'object') next.breakProgress = raw.breakProgress;

  // Import the previous local-only checklist without inventing historical timestamps.
  if (raw.sprintChecks && typeof raw.sprintChecks === 'object') {
    Object.entries(raw.sprintChecks).forEach(([key, done]) => {
      if (done && !next.sessionProgress[key]) next.sessionProgress[key] = { importedDone: true };
    });
  }
  return next;
}

function stateHasProgress(state: AppState) {
  return Object.keys(state.phaseProgress).length > 0 || Object.keys(state.sessionProgress).length > 0 || Object.keys(state.breakProgress).length > 0;
}

function earliest(values: Array<string | undefined>) {
  const dates = values.filter(Boolean).map((v) => new Date(v as string).getTime()).filter(Number.isFinite);
  if (!dates.length) return undefined;
  return new Date(Math.min(...dates)).toISOString();
}

function latest(values: Array<string | undefined>) {
  const dates = values.filter(Boolean).map((v) => new Date(v as string).getTime()).filter(Number.isFinite);
  if (!dates.length) return undefined;
  return new Date(Math.max(...dates)).toISOString();
}

function addDays(base: Date, days: number) {
  const date = new Date(base);
  date.setDate(date.getDate() + days);
  return date;
}

async function fetchCloudState() {
  const response = await fetch(SYNC_URL, {
    method: 'GET',
    headers: { apikey: PUBLISHABLE_KEY },
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(`Cloud load failed (${response.status})`);
  const body = await response.json();
  return { state: normalizeState(body.state), updatedAt: body.updatedAt as string | null };
}

async function saveCloudState(state: AppState, ownerKey: string) {
  const response = await fetch(SYNC_URL, {
    method: 'POST',
    headers: {
      apikey: PUBLISHABLE_KEY,
      'Content-Type': 'application/json',
      'x-roadmap-key': ownerKey,
    },
    body: JSON.stringify({ state }),
  });
  if (!response.ok) throw new Error(`Cloud save failed (${response.status})`);
  return response.json();
}

export default function Tracker() {
  const [tab, setTab] = useState<'roadmap' | 'sprint' | 'progress'>('roadmap');
  const [expanded, setExpanded] = useState<number | null>(1);
  const [state, setState] = useState<AppState>(emptyState());
  const [ownerKey, setOwnerKey] = useState('');
  const [ready, setReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('loading');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | undefined>();
  const [tick, setTick] = useState(Date.now());
  const [toast, setToast] = useState('');

  const canEdit = Boolean(ownerKey);

  useEffect(() => {
    const timer = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      let key = '';
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const hashOwner = hashParams.get('owner');
      if (hashOwner) {
        key = hashOwner;
        localStorage.setItem(OWNER_STORAGE_KEY, hashOwner);
      } else {
        key = localStorage.getItem(OWNER_STORAGE_KEY) || '';
      }
      if (!cancelled) setOwnerKey(key);

      let local = emptyState();
      try {
        const current = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null');
        const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY) || 'null');
        local = normalizeState(current || legacy);
      } catch {}

      try {
        const cloud = await fetchCloudState();
        const cloudHasData = stateHasProgress(cloud.state);
        const chosen = cloudHasData ? cloud.state : local;
        if (!cancelled) {
          setState(chosen);
          setLastSyncedAt(cloud.updatedAt || undefined);
          setSyncStatus(key ? 'synced' : 'readonly');
          setReady(true);
        }
        if (key && !cloudHasData && stateHasProgress(local)) {
          const saved = await saveCloudState(local, key);
          if (!cancelled) {
            setLastSyncedAt(saved.updatedAt);
            setSyncStatus('synced');
          }
        }
      } catch {
        if (!cancelled) {
          setState(local);
          setSyncStatus(key ? 'offline' : 'error');
          setReady(true);
        }
      }
    }
    boot();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    if (!ownerKey) return;

    setSyncStatus('saving');
    const handle = window.setTimeout(async () => {
      try {
        const result = await saveCloudState(state, ownerKey);
        setLastSyncedAt(result.updatedAt);
        setSyncStatus('synced');
      } catch {
        setSyncStatus('offline');
      }
    }, 350);
    return () => window.clearTimeout(handle);
  }, [state, ownerKey, ready]);

  useEffect(() => {
    if (!ready) return;
    const onVisible = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const cloud = await fetchCloudState();
        if (cloud.updatedAt && (!lastSyncedAt || new Date(cloud.updatedAt) > new Date(lastSyncedAt))) {
          setState(cloud.state);
          setLastSyncedAt(cloud.updatedAt);
          setSyncStatus(ownerKey ? 'synced' : 'readonly');
        }
      } catch {}
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [ready, ownerKey, lastSyncedAt]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  }

  function requireOwner() {
    if (canEdit) return true;
    notify('Public view is read-only');
    return false;
  }

  function startPhase(id: number) {
    if (!requireOwner()) return;
    const now = new Date().toISOString();
    setState((previous) => {
      const next = pauseEverything(previous, now);
      const key = String(id);
      const current = next.phaseProgress[key] || {};
      return {
        ...next,
        phaseProgress: {
          ...next.phaseProgress,
          [key]: {
            ...current,
            startedAt: current.startedAt || now,
            completedAt: undefined,
            activeSince: now,
            importedDone: false,
          },
        },
      };
    });
  }

  function pausePhase(id: number) {
    if (!requireOwner()) return;
    const now = new Date().toISOString();
    setState((previous) => ({
      ...previous,
      phaseProgress: {
        ...previous.phaseProgress,
        [String(id)]: pauseTimer(previous.phaseProgress[String(id)], now),
      },
    }));
  }

  function completePhase(id: number) {
    if (!requireOwner()) return;
    const now = new Date().toISOString();
    setState((previous) => {
      const paused = pauseTimer(previous.phaseProgress[String(id)], now);
      return {
        ...previous,
        phaseProgress: {
          ...previous.phaseProgress,
          [String(id)]: {
            ...paused,
            startedAt: paused.startedAt || now,
            completedAt: now,
            activeSince: undefined,
            importedDone: false,
          },
        },
      };
    });
  }

  function reopenPhase(id: number) {
    if (!requireOwner()) return;
    setState((previous) => ({
      ...previous,
      phaseProgress: {
        ...previous.phaseProgress,
        [String(id)]: { ...previous.phaseProgress[String(id)], completedAt: undefined, activeSince: undefined },
      },
    }));
  }

  function startSession(day: number, index: number) {
    if (!requireOwner()) return;
    const now = new Date().toISOString();
    const key = `${day}-s${index}`;
    setState((previous) => {
      const next = pauseEverything(previous, now);
      const current = next.sessionProgress[key] || {};
      return {
        ...next,
        sessionProgress: {
          ...next.sessionProgress,
          [key]: {
            ...current,
            startedAt: current.startedAt || now,
            completedAt: undefined,
            activeSince: now,
            importedDone: false,
          },
        },
      };
    });
  }

  function pauseSession(day: number, index: number) {
    if (!requireOwner()) return;
    const now = new Date().toISOString();
    const key = `${day}-s${index}`;
    setState((previous) => ({
      ...previous,
      sessionProgress: {
        ...previous.sessionProgress,
        [key]: pauseTimer(previous.sessionProgress[key], now),
      },
    }));
  }

  function completeSession(day: number, index: number) {
    if (!requireOwner()) return;
    const now = new Date().toISOString();
    const key = `${day}-s${index}`;
    setState((previous) => {
      const paused = pauseTimer(previous.sessionProgress[key], now);
      return {
        ...previous,
        sessionProgress: {
          ...previous.sessionProgress,
          [key]: {
            ...paused,
            startedAt: paused.startedAt || now,
            completedAt: now,
            activeSince: undefined,
            importedDone: false,
          },
        },
      };
    });
  }

  function reopenSession(day: number, index: number) {
    if (!requireOwner()) return;
    const key = `${day}-s${index}`;
    setState((previous) => ({
      ...previous,
      sessionProgress: {
        ...previous.sessionProgress,
        [key]: {
          ...previous.sessionProgress[key],
          completedAt: undefined,
          activeSince: undefined,
          importedDone: false,
        },
      },
    }));
  }

  function toggleBreak(day: number, index: number) {
    if (!requireOwner()) return;
    const key = `${day}-b${index}`;
    setState((previous) => ({
      ...previous,
      breakProgress: {
        ...previous.breakProgress,
        [key]: previous.breakProgress[key]?.completedAt ? {} : { completedAt: new Date().toISOString() },
      },
    }));
  }

  async function syncNow() {
    setSyncStatus('loading');
    try {
      const cloud = await fetchCloudState();
      setState(cloud.state);
      setLastSyncedAt(cloud.updatedAt || undefined);
      setSyncStatus(ownerKey ? 'synced' : 'readonly');
      notify('Cloud progress loaded');
    } catch {
      setSyncStatus(ownerKey ? 'offline' : 'error');
      notify('Cloud sync unavailable');
    }
  }

  async function copyPublicLink() {
    const url = `${window.location.origin}${window.location.pathname}`;
    await navigator.clipboard.writeText(url);
    notify('Public read-only link copied');
  }

  async function copyOwnerLink() {
    if (!ownerKey) return;
    const url = `${window.location.origin}${window.location.pathname}#owner=${ownerKey}`;
    await navigator.clipboard.writeText(url);
    notify('Private owner link copied — do not share it');
  }

  function forgetOwnerDevice() {
    if (!window.confirm('Remove editing access from this device? Cloud progress will stay محفوظ.')) return;
    localStorage.removeItem(OWNER_STORAGE_KEY);
    setOwnerKey('');
    window.history.replaceState(null, '', window.location.pathname);
    setSyncStatus('readonly');
    notify('This device is now read-only');
  }

  function resetAll() {
    if (!requireOwner()) return;
    if (!window.confirm('Reset all roadmap dates, timers and sprint progress?')) return;
    setState(emptyState());
    notify('Progress reset');
  }

  const phaseValues = Object.values(state.phaseProgress);
  const sessionValues = Object.values(state.sessionProgress);
  const completedPhases = phases.filter((phase) => Boolean(state.phaseProgress[String(phase.id)]?.completedAt)).length;
  const startedPhases = phases.filter((phase) => Boolean(state.phaseProgress[String(phase.id)]?.startedAt) && !state.phaseProgress[String(phase.id)]?.completedAt).length;
  const roadmapPercent = Math.round((completedPhases / phases.length) * 100);
  const completedSessions = sprintDays.reduce((total, day) => total + day.sessions.filter((_, index) => {
    const value = state.sessionProgress[`${day.day}-s${index}`];
    return Boolean(value?.completedAt || value?.importedDone);
  }).length, 0);
  const sprintPercent = Math.round((completedSessions / 120) * 100);
  const trackedSeconds = [...phaseValues, ...sessionValues].reduce((sum, item) => sum + elapsed(item, tick), 0);
  const trackedHours = trackedSeconds / 3600;
  const roadmapStartedAt = earliest([...phaseValues.map((v) => v.startedAt), ...sessionValues.map((v) => v.startedAt)]);
  const roadmapCompletedAt = completedPhases === phases.length ? latest(phaseValues.map((v) => v.completedAt)) : undefined;
  const sprintStartedAt = earliest(sessionValues.map((v) => v.startedAt));
  const sprintCompletedAt = completedSessions === 120 ? latest(sessionValues.map((v) => v.completedAt)) : undefined;
  const remainingHours = Math.max(0, 300 - trackedHours);
  const projectedFinish = roadmapStartedAt ? addDays(new Date(), Math.ceil(remainingHours / 10)).toISOString() : undefined;

  const active = useMemo(() => {
    for (const phase of phases) {
      const value = state.phaseProgress[String(phase.id)];
      if (value?.activeSince) return { type: 'phase' as const, key: String(phase.id), title: phase.title, timer: value };
    }
    for (const day of sprintDays) {
      for (let index = 0; index < day.sessions.length; index += 1) {
        const key = `${day.day}-s${index}`;
        const value = state.sessionProgress[key];
        if (value?.activeSince) return { type: 'session' as const, key, title: `Day ${day.day} · ${day.sessions[index]}`, timer: value };
      }
    }
    return null;
  }, [state]);

  const currentPhase = phases.find((phase) => {
    const value = state.phaseProgress[String(phase.id)];
    return value?.startedAt && !value?.completedAt;
  }) || phases.find((phase) => !state.phaseProgress[String(phase.id)]?.completedAt) || phases[phases.length - 1];

  if (!ready) return <main className="be-site"><div className="be-loading">Loading roadmap…</div></main>;

  return (
    <main className="be-site" dir="rtl">
      <div className="be-gridBg" />

      <header className="be-hero">
        <div className="be-topline">
          <span>GHALA ALAMEER</span>
          <span className="be-live"><i /> BACKEND ENGINEERING ROADMAP</span>
        </div>

        <div className="be-heroGrid">
          <div>
            <p className="be-eyebrow">PROFESSIONAL DEVELOPMENT ROADMAP</p>
            <h1>Backend Engineering<br /><span>Roadmap</span></h1>
            <p className="be-lead">
              خطة تنفيذية موثقة لبناء مهارات هندسة الباك إند من اللغة وHTTP وقواعد البيانات إلى الاختبارات،
              الـcloud، والـsystem design. التقدم هنا يعتمد على تنفيذ فعلي، وقت مسجل، ومخرجات تقنية قابلة للمراجعة.
            </p>
            <div className="be-stack">
              {['TypeScript','Node.js','NestJS','PostgreSQL','Redis','Testing','Docker','CI/CD','AWS','System Design'].map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="be-actions">
              <button className="primary" onClick={copyPublicLink}><Copy size={14}/> Copy public progress link</button>
              <button onClick={syncNow}><RefreshCw size={14}/> Sync now</button>
              {canEdit && <button onClick={copyOwnerLink}><ShieldCheck size={14}/> Copy private device link</button>}
            </div>
          </div>

          <aside className="be-currentCard">
            <span className="be-cardLabel">CURRENT FOCUS</span>
            <strong>{String(currentPhase.id).padStart(2, '0')}</strong>
            <h2>{currentPhase.title}</h2>
            <p>{currentPhase.area}</p>
            <div className="be-currentMeta">
              <div><span>STATUS</span><b>{state.phaseProgress[String(currentPhase.id)]?.activeSince ? 'TRACKING' : state.phaseProgress[String(currentPhase.id)]?.startedAt ? 'IN PROGRESS' : 'PLANNED'}</b></div>
              <div><span>TRACKED</span><b>{formatDuration(elapsed(state.phaseProgress[String(currentPhase.id)], tick))}</b></div>
              <div><span>SYNC</span><b>{syncStatus.toUpperCase()}</b></div>
            </div>
          </aside>
        </div>
      </header>

      <div className={`be-syncBanner ${canEdit ? 'owner' : 'public'} ${syncStatus}`}>
        <span className="be-syncIcon">{syncStatus === 'offline' || syncStatus === 'error' ? <WifiOff size={15}/> : <Cloud size={15}/>}</span>
        <div>
          <b>{canEdit ? 'Owner mode · Cloud sync enabled' : 'Public view · Read only'}</b>
          <small>
            {canEdit
              ? 'أي Start / Pause / Complete تحفظ في السحابة وتظهر على أجهزتك الأخرى.'
              : 'هذه الصفحة تعرض آخر تقدم متزامن. التعديل متاح فقط من رابط المالك الخاص.'}
          </small>
        </div>
        <span className="be-syncTime">{lastSyncedAt ? `Last sync ${formatShort(lastSyncedAt)}` : syncStatus}</span>
      </div>

      {active && (
        <div className="be-activeTimer">
          <div><span><Timer size={14}/> ACTIVE TIMER</span><b>{active.title}</b></div>
          <strong>{formatDuration(elapsed(active.timer, tick))}</strong>
          {canEdit && (
            <button onClick={() => active.type === 'phase' ? pausePhase(Number(active.key)) : pauseSession(Number(active.key.split('-s')[0]), Number(active.key.split('-s')[1]))}>
              <Pause size={14}/> Pause
            </button>
          )}
        </div>
      )}

      <section className="be-overview">
        <div><small>ROADMAP PROGRESS</small><strong>{roadmapPercent}%</strong><span>{completedPhases} / 20 completed</span><i><b style={{width:`${roadmapPercent}%`}} /></i></div>
        <div><small>SPRINT COMPLETION</small><strong>{sprintPercent}%</strong><span>{completedSessions} / 120 sessions</span><i><b style={{width:`${sprintPercent}%`}} /></i></div>
        <div><small>ACTUAL TRACKED TIME</small><strong>{trackedHours.toFixed(1)}<em>h</em></strong><span>Timer-based, not scheduled time</span></div>
        <div><small>PROJECTED FINISH</small><strong className="dateValue">{projectedFinish ? formatDateTime(projectedFinish) : 'Not started'}</strong><span>At 10 tracked hours/day</span></div>
      </section>

      <nav className="be-tabs">
        <button className={tab === 'roadmap' ? 'active' : ''} onClick={() => setTab('roadmap')}>Roadmap <span>20 stages</span></button>
        <button className={tab === 'sprint' ? 'active' : ''} onClick={() => setTab('sprint')}>30-Day Sprint <span>live timers</span></button>
        <button className={tab === 'progress' ? 'active' : ''} onClick={() => setTab('progress')}>Progress <span>timeline</span></button>
      </nav>

      <div className="be-content">
        {tab === 'roadmap' && (
          <section>
            <div className="be-sectionHead">
              <div><p>ENGINEERING PATH</p><h2>Backend Engineering Roadmap</h2></div>
              <p>كل مرحلة تسجل وقت البداية، وقت الإيقاف والاستئناف، ووقت الإنجاز. إنهاء المرحلة مرتبط بمخرج عملي واضح وليس بمجرد إنهاء الفيديو.</p>
            </div>

            <div className="be-roadmap">
              {phases.map((phase) => {
                const progress = state.phaseProgress[String(phase.id)] || {};
                const status = progress.completedAt ? 'completed' : progress.activeSince ? 'active' : progress.startedAt ? 'paused' : 'planned';
                const classStatus = status === 'paused' ? 'active' : status;
                return (
                  <article className={`be-phase ${classStatus}`} key={phase.id}>
                    <div className="be-rail"><span>{String(phase.id).padStart(2, '0')}</span><i /></div>
                    <div className="be-phaseCard">
                      <button className="be-phaseHeader" onClick={() => setExpanded(expanded === phase.id ? null : phase.id)}>
                        <div>
                          <div className="be-phaseMeta">
                            <span>{phase.area}</span>
                            <b className={`status ${classStatus}`}>{status === 'completed' ? 'Completed' : status === 'active' ? 'Tracking' : status === 'paused' ? 'In progress' : 'Planned'}</b>
                            {progress.startedAt && <b className="be-timePill">{formatDuration(elapsed(progress, tick))}</b>}
                          </div>
                          <h3>{phase.title}</h3>
                          <p>{phase.summary}</p>
                        </div>
                        <ChevronDown className={expanded === phase.id ? 'open' : ''} size={18}/>
                      </button>

                      <div className="be-timestamps be-timestamps3">
                        <div><span><Play size={12}/> Started</span><b>{formatDateTime(progress.startedAt)}</b></div>
                        <div><span><Timer size={12}/> Tracked</span><b>{formatDuration(elapsed(progress, tick))}</b></div>
                        <div><span><CheckCircle2 size={12}/> Completed</span><b>{formatDateTime(progress.completedAt)}</b></div>
                      </div>

                      {expanded === phase.id && (
                        <div className="be-phaseBody">
                          <div className="be-scopeBlock">
                            <h4>Technical scope</h4>
                            <div className="be-scopeGrid">{phase.scope.map((item) => <span key={item}><Check size={12}/>{item}</span>)}</div>
                          </div>
                          <div className="be-evidence">
                            <small>COMPLETION EVIDENCE</small>
                            <p>{phase.evidence}</p>
                          </div>
                          <div className="be-phaseActions">
                            {phase.course && <a href={phase.course} target="_blank" rel="noreferrer">Course <ExternalLink size={13}/></a>}
                            {phase.course2 && <a className="secondary" href={phase.course2} target="_blank" rel="noreferrer">Official AWS course <ExternalLink size={13}/></a>}
                            {canEdit && !progress.startedAt && <button className="start" onClick={() => startPhase(phase.id)}><Play size={13}/> Start & track</button>}
                            {canEdit && progress.startedAt && !progress.completedAt && progress.activeSince && <button onClick={() => pausePhase(phase.id)}><Pause size={13}/> Pause</button>}
                            {canEdit && progress.startedAt && !progress.completedAt && !progress.activeSince && <button className="start" onClick={() => startPhase(phase.id)}><Play size={13}/> Resume</button>}
                            {canEdit && progress.startedAt && !progress.completedAt && <button className="complete" onClick={() => completePhase(phase.id)}><CheckCircle2 size={13}/> Complete phase</button>}
                            {canEdit && progress.completedAt && <button className="quiet" onClick={() => reopenPhase(phase.id)}><RotateCcw size={13}/> Reopen</button>}
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {tab === 'sprint' && (
          <section>
            <div className="be-sectionHead">
              <div><p>30-DAY EXECUTION SPRINT</p><h2>300-Hour Backend Sprint</h2></div>
              <p>الأوقات المكتوبة هي target schedule. الساعات والتواريخ في الـDashboard تعتمد على التايمر الفعلي: Start → Pause → Resume → Complete.</p>
            </div>

            <div className="be-sprintLive">
              <div><small>SPRINT STARTED</small><b>{formatDateTime(sprintStartedAt)}</b></div>
              <div><small>ACTUAL HOURS</small><b>{trackedHours.toFixed(1)} / 300h</b></div>
              <div><small>SPRINT COMPLETED</small><b>{formatDateTime(sprintCompletedAt)}</b></div>
            </div>

            <div className="be-rhythm">
              <div><Clock3 size={15}/><b>08:00–10:30</b><span>Session 01</span></div><small>30 min break</small>
              <div><Clock3 size={15}/><b>11:00–13:30</b><span>Session 02</span></div><small>60 min lunch / prayer</small>
              <div><Clock3 size={15}/><b>14:30–17:00</b><span>Session 03</span></div><small>30 min break</small>
              <div><Clock3 size={15}/><b>17:30–20:00</b><span>Session 04</span></div>
            </div>

            <div className="be-days">
              {sprintDays.map((day) => {
                const dayTimers = day.sessions.map((_, index) => state.sessionProgress[`${day.day}-s${index}`] || {});
                const done = dayTimers.filter((timer) => timer.completedAt || timer.importedDone).length;
                const dayStarted = earliest(dayTimers.map((timer) => timer.startedAt));
                const dayCompleted = done === 4 ? latest(dayTimers.map((timer) => timer.completedAt)) : undefined;
                return (
                  <article className={`be-day ${done === 4 ? 'done' : ''}`} key={day.day}>
                    <header>
                      <div className="be-dayNo"><span>DAY</span><b>{String(day.day).padStart(2,'0')}</b></div>
                      <div>
                        <small>PHASE {day.phase} · START {formatShort(dayStarted)} {dayCompleted ? `· DONE ${formatShort(dayCompleted)}` : ''}</small>
                        <h3>{day.title}</h3>
                      </div>
                      <strong>{done}/4</strong>
                    </header>
                    <div className="be-daySessions">
                      {day.sessions.map((session, index) => {
                        const key = `${day.day}-s${index}`;
                        const timer = state.sessionProgress[key] || {};
                        const finished = Boolean(timer.completedAt || timer.importedDone);
                        return (
                          <div className={`be-session be-sessionTimer ${finished ? 'checked' : ''} ${timer.activeSince ? 'running' : ''}`} key={key}>
                            <time>{sessionTimes[index]}</time>
                            <p>
                              <small>SESSION {String(index + 1).padStart(2,'0')}</small>
                              {session}
                              <span className="be-sessionMeta">{timer.importedDone ? 'Imported completion · historical time unavailable' : `${formatDuration(elapsed(timer, tick))} · ${timer.startedAt ? `started ${formatShort(timer.startedAt)}` : 'not started'}${timer.completedAt ? ` · completed ${formatShort(timer.completedAt)}` : ''}`}</span>
                            </p>
                            <div className="be-sessionControls">
                              {!finished && !timer.startedAt && canEdit && <button title="Start" onClick={() => startSession(day.day,index)}><Play size={14}/></button>}
                              {!finished && timer.startedAt && timer.activeSince && canEdit && <button title="Pause" onClick={() => pauseSession(day.day,index)}><Pause size={14}/></button>}
                              {!finished && timer.startedAt && !timer.activeSince && canEdit && <button title="Resume" onClick={() => startSession(day.day,index)}><Play size={14}/></button>}
                              {!finished && canEdit && <button className="doneBtn" title="Complete" onClick={() => completeSession(day.day,index)}><Check size={14}/></button>}
                              {finished && <span className="be-doneMark"><Check size={14}/></span>}
                              {finished && canEdit && <button className="reopenBtn" title="Reopen" onClick={() => reopenSession(day.day,index)}><RotateCcw size={12}/></button>}
                            </div>
                            {index < 3 && (
                              <div className={`be-break ${state.breakProgress[`${day.day}-b${index}`]?.completedAt ? 'checked' : ''}`}>
                                <span>{breaks[index]} {state.breakProgress[`${day.day}-b${index}`]?.completedAt ? `· ${formatShort(state.breakProgress[`${day.day}-b${index}`]?.completedAt)}` : ''}</span>
                                {canEdit && <button onClick={() => toggleBreak(day.day,index)}>{state.breakProgress[`${day.day}-b${index}`]?.completedAt ? 'Done' : 'Mark break'}</button>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {tab === 'progress' && (
          <section>
            <div className="be-sectionHead">
              <div><p>LIVE EXECUTION RECORD</p><h2>Progress & Timeline</h2></div>
              <p>هذا السجل يعرض التقدم المتزامن بين الأجهزة، التواريخ الفعلية، والوقت المسجل بالتايمر.</p>
            </div>

            <div className="be-progressGrid be-progressGridLive">
              <div className="be-progressPrimary"><Timer size={18}/><small>ACTUAL TRACKED TIME</small><strong>{trackedHours.toFixed(1)}h</strong><p>من كل Phase وSprint session بدون احتساب وقت الجدول تلقائيًا.</p><div className="be-bigBar"><i style={{width:`${Math.min(100,(trackedHours/300)*100)}%`}} /></div></div>
              <div className="be-progressStat"><CheckCircle2 size={17}/><small>PHASES COMPLETED</small><strong>{completedPhases}/20</strong><p>{startedPhases} currently in progress</p></div>
              <div className="be-progressStat"><Check size={17}/><small>SESSIONS COMPLETED</small><strong>{completedSessions}/120</strong><p>{sprintPercent}% of the execution sprint</p></div>
              <div className="be-progressStat"><Cloud size={17}/><small>CLOUD SYNC</small><strong>{syncStatus}</strong><p>{lastSyncedAt ? formatDateTime(lastSyncedAt) : 'No cloud timestamp yet'}</p></div>
            </div>

            <div className="be-timelineTable">
              {phases.map((phase) => {
                const progress = state.phaseProgress[String(phase.id)] || {};
                return (
                  <div key={phase.id}>
                    <span>{String(phase.id).padStart(2,'0')}</span>
                    <div><b>{phase.title}</b><small>{phase.area}</small></div>
                    <div><small>Started</small><b>{formatDateTime(progress.startedAt)}</b></div>
                    <div><small>Tracked</small><b>{formatDuration(elapsed(progress,tick))}</b></div>
                    <div><small>Completed</small><b>{formatDateTime(progress.completedAt)}</b></div>
                  </div>
                );
              })}
            </div>

            <div className="be-management be-cloudManagement">
              <div>
                <small>ACCESS & SYNC</small>
                <h3>{canEdit ? 'This device can edit and sync' : 'This device is read-only'}</h3>
                <p>{canEdit ? 'استخدمي Private device link مرة واحدة على أي جهاز جديد. بعدها يحفظ الجهاز صلاحية التعديل محليًا ويقرأ نفس Cloud state.' : 'التقدم العام متاح للمشاهدة فقط. رابط المالك الخاص مطلوب للتعديل.'}</p>
              </div>
              <div>
                <button onClick={syncNow}><RefreshCw size={13}/> Sync now</button>
                <button onClick={copyPublicLink}><Copy size={13}/> Copy public link</button>
                {canEdit && <button onClick={copyOwnerLink}><ShieldCheck size={13}/> Copy private device link</button>}
                {canEdit && <button onClick={forgetOwnerDevice}><WifiOff size={13}/> Remove edit access here</button>}
                {canEdit && <button className="danger" onClick={resetAll}><RotateCcw size={13}/> Reset progress</button>}
              </div>
            </div>
          </section>
        )}
      </div>

      <footer className="be-footer">
        <div><span>GHALA ALAMEER</span><strong>Backend Engineering Roadmap</strong></div>
        <p>TypeScript → Node.js → NestJS → PostgreSQL → Redis → Testing → Docker → CI/CD → AWS → Architecture</p>
      </footer>

      <div className={`be-toast ${toast ? 'show' : ''}`}>{toast}</div>
    </main>
  );
}
