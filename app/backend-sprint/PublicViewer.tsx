'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, CheckCircle2, ChevronDown, Circle, Clock3, ExternalLink, RefreshCw, ShieldCheck, Timer } from 'lucide-react';
import { phases, sprintDays } from './roadmapData';
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
  version?: number;
  phaseProgress?: Record<string, TimerProgress>;
  sessionProgress?: Record<string, TimerProgress>;
  breakProgress?: Record<string, { completedAt?: string }>;
};

const SYNC_URL = 'https://ovtnbytzbahokxlwbmkm.supabase.co/functions/v1/backend-roadmap-sync';
const PUBLISHABLE_KEY = 'sb_publishable_qG1fKvyXeWgoFYqcBqCp2Q__6CxVAVe';

function fmt(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(value));
}

function duration(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
}

function elapsed(timer: TimerProgress | undefined, now: number) {
  if (!timer) return 0;
  let value = timer.accumulatedSeconds || 0;
  if (timer.activeSince) value += Math.max(0, (now - new Date(timer.activeSince).getTime()) / 1000);
  return value;
}

function earliest(values: Array<string | undefined>) {
  const list = values.filter(Boolean).map((v) => new Date(v as string).getTime()).filter(Number.isFinite);
  return list.length ? new Date(Math.min(...list)).toISOString() : undefined;
}

function latest(values: Array<string | undefined>) {
  const list = values.filter(Boolean).map((v) => new Date(v as string).getTime()).filter(Number.isFinite);
  return list.length ? new Date(Math.max(...list)).toISOString() : undefined;
}

export default function PublicViewer() {
  const [tab, setTab] = useState<'roadmap' | 'sprint' | 'progress'>('roadmap');
  const [expanded, setExpanded] = useState<number | null>(1);
  const [state, setState] = useState<AppState>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | undefined>();
  const [tick, setTick] = useState(Date.now());

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(SYNC_URL, { method: 'GET', headers: { apikey: PUBLISHABLE_KEY }, cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = await response.json();
      setState(body.state || {});
      setUpdatedAt(body.updatedAt || undefined);
    } catch {
      setError('Cloud progress is temporarily unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const phaseProgress = state.phaseProgress || {};
  const sessionProgress = state.sessionProgress || {};
  const completed = phases.filter((p) => phaseProgress[String(p.id)]?.completedAt).length;
  const active = phases.filter((p) => phaseProgress[String(p.id)]?.startedAt && !phaseProgress[String(p.id)]?.completedAt).length;
  const roadmapPercent = Math.round((completed / phases.length) * 100);
  const trackedSeconds = useMemo(
    () => Object.values(sessionProgress).reduce((sum, timer) => sum + elapsed(timer, tick), 0),
    [sessionProgress, tick],
  );
  const trackedHours = trackedSeconds / 3600;
  const sprintPercent = Math.min(100, Math.round((trackedHours / 300) * 100));
  const startedAt = earliest([
    ...Object.values(phaseProgress).map((v) => v.startedAt),
    ...Object.values(sessionProgress).map((v) => v.startedAt),
  ]);
  const completedAt = completed === phases.length
    ? latest(Object.values(phaseProgress).map((v) => v.completedAt))
    : undefined;
  const currentPhase = phases.find((p) => phaseProgress[String(p.id)]?.startedAt && !phaseProgress[String(p.id)]?.completedAt)
    || phases.find((p) => !phaseProgress[String(p.id)]?.completedAt)
    || phases[phases.length - 1];

  if (loading) return <main className="be-site"><div className="be-loading">Loading live roadmap…</div></main>;

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
            <p className="be-eyebrow">ENGINEERING DEVELOPMENT RECORD</p>
            <h1>Backend Engineering<br /><span>Roadmap</span></h1>
            <p className="be-lead">
              سجل تنفيذي حي لمسار تطوير مهارات هندسة الباك إند، من الأساسيات البرمجية وHTTP وقواعد البيانات
              إلى الاختبارات، البنية السحابية وتصميم الأنظمة. حالة كل مرحلة مبنية على تنفيذ فعلي ووقت متتبع.
            </p>
            <div className="be-stack">
              {['TypeScript','Node.js','NestJS','PostgreSQL','Redis','Testing','Docker','CI/CD','AWS','System Design'].map((x) => <span key={x}>{x}</span>)}
            </div>
            <div className="sync-banner readonly"><ShieldCheck size={15}/><div><b>PUBLIC VIEW · READ ONLY</b><span>هذه الصفحة للعرض فقط ولا تحتوي على أي صلاحيات تعديل.</span></div></div>
          </div>

          <aside className="be-currentCard">
            <div className="be-cardLabel">CURRENT FOCUS</div>
            <strong>{String(currentPhase.id).padStart(2,'0')}</strong>
            <h2>{currentPhase.title}</h2>
            <p>{currentPhase.area}</p>
            <div className="be-currentMeta">
              <div><span>STATUS</span><b>{phaseProgress[String(currentPhase.id)]?.startedAt ? 'IN PROGRESS' : 'PLANNED'}</b></div>
              <div><span>STARTED</span><b>{fmt(phaseProgress[String(currentPhase.id)]?.startedAt)}</b></div>
              <div><span>TRACKED</span><b>{duration(elapsed(phaseProgress[String(currentPhase.id)], tick))}</b></div>
            </div>
          </aside>
        </div>
      </header>

      {error && <div className="be-snapshotBanner"><RefreshCw size={14}/>{error}</div>}

      <section className="be-overview">
        <div><small>ROADMAP PROGRESS</small><strong>{roadmapPercent}%</strong><span>{completed} / {phases.length} completed</span><i><b style={{width:`${roadmapPercent}%`}} /></i></div>
        <div><small>ACTUAL TRACKED TIME</small><strong>{trackedHours.toFixed(1)}<em>h</em></strong><span>{sprintPercent}% of 300h target</span><i><b style={{width:`${sprintPercent}%`}} /></i></div>
        <div><small>ROADMAP STARTED</small><strong className="dateValue">{startedAt ? fmt(startedAt) : 'Not started'}</strong><span>{active ? `${active} active stage` : 'No active stage'}</span></div>
        <div><small>LAST CLOUD UPDATE</small><strong className="dateValue">{updatedAt ? fmt(updatedAt) : '—'}</strong><span>{completedAt ? `Completed ${fmt(completedAt)}` : 'Live progress record'}</span></div>
      </section>

      <nav className="be-tabs">
        <button className={tab === 'roadmap' ? 'active' : ''} onClick={() => setTab('roadmap')}>Roadmap <span>20 stages</span></button>
        <button className={tab === 'sprint' ? 'active' : ''} onClick={() => setTab('sprint')}>30-Day Sprint <span>live record</span></button>
        <button className={tab === 'progress' ? 'active' : ''} onClick={() => setTab('progress')}>Progress <span>timeline</span></button>
      </nav>

      <div className="be-content">
        {tab === 'roadmap' && <section>
          <div className="be-sectionHead"><div><p>ENGINEERING PATH</p><h2>Backend Engineering Roadmap</h2></div><p>كل مرحلة لها نطاق تقني ومخرج عملي. التواريخ والوقت المعروض هنا تأتي من سجل التنفيذ الفعلي.</p></div>
          <div className="be-roadmap">
            {phases.map((phase) => {
              const progress = phaseProgress[String(phase.id)] || {};
              const status = progress.completedAt ? 'completed' : progress.startedAt ? 'active' : 'planned';
              return <article className={`be-phase ${status}`} key={phase.id}>
                <div className="be-rail"><span>{String(phase.id).padStart(2,'0')}</span><i /></div>
                <div className="be-phaseCard">
                  <button className="be-phaseHeader" onClick={() => setExpanded(expanded === phase.id ? null : phase.id)}>
                    <div><div className="be-phaseMeta"><span>{phase.area}</span><b className={`status ${status}`}>{status === 'completed' ? 'Completed' : status === 'active' ? 'In progress' : 'Planned'}</b></div><h3>{phase.title}</h3><p>{phase.summary}</p></div>
                    <ChevronDown className={expanded === phase.id ? 'open' : ''} size={18}/>
                  </button>
                  <div className="be-timestamps">
                    <div><span><Clock3 size={12}/> Started</span><b>{fmt(progress.startedAt)}</b></div>
                    <div><span><Timer size={12}/> Actual time</span><b>{duration(elapsed(progress, tick))}</b></div>
                    <div><span><CheckCircle2 size={12}/> Completed</span><b>{fmt(progress.completedAt)}</b></div>
                  </div>
                  {expanded === phase.id && <div className="be-phaseBody">
                    <div className="be-scopeBlock"><h4>Technical scope</h4><div className="be-scopeGrid">{phase.scope.map((item) => <span key={item}><Check size={12}/>{item}</span>)}</div></div>
                    <div className="be-evidence"><small>COMPLETION EVIDENCE</small><p>{phase.evidence}</p></div>
                    <div className="be-phaseActions">{phase.course && <a href={phase.course} target="_blank" rel="noreferrer">Course <ExternalLink size={13}/></a>}{phase.course2 && <a className="secondary" href={phase.course2} target="_blank" rel="noreferrer">Official course <ExternalLink size={13}/></a>}</div>
                  </div>}
                </div>
              </article>;
            })}
          </div>
        </section>}

        {tab === 'sprint' && <section>
          <div className="be-sectionHead"><div><p>EXECUTION RECORD</p><h2>30-Day Intensive Sprint</h2></div><p>الخطة المستهدفة 300 ساعة. الإنجاز هنا يعتمد على الوقت الفعلي المسجل لكل جلسة، وليس على الوقت المجدول فقط.</p></div>
          <div className="be-days">
            {sprintDays.map((day) => {
              const done = day.sessions.filter((_, i) => sessionProgress[`${day.day}-s${i}`]?.completedAt).length;
              const seconds = day.sessions.reduce((sum, _, i) => sum + elapsed(sessionProgress[`${day.day}-s${i}`], tick), 0);
              return <article className={`be-day ${done === 4 ? 'done' : ''}`} key={day.day}>
                <header><div className="be-dayNo"><span>DAY</span><b>{String(day.day).padStart(2,'0')}</b></div><div><small>PHASE {day.phase}</small><h3>{day.title}</h3></div><strong>{done}/4 · {duration(seconds)}</strong></header>
                <div className="be-daySessions">{day.sessions.map((session, index) => {
                  const timer = sessionProgress[`${day.day}-s${index}`];
                  const status = timer?.completedAt ? 'DONE' : timer?.activeSince ? 'RUNNING' : timer?.startedAt ? 'PAUSED' : 'PENDING';
                  return <div className={`be-session ${timer?.completedAt ? 'checked' : ''}`} key={`${day.day}-${index}`}>
                    <time>{status}</time><p><small>SESSION {String(index + 1).padStart(2,'0')} · {duration(elapsed(timer, tick))}</small>{session}</p><span>{timer?.completedAt ? <Check size={15}/> : <Circle size={14}/>}</span>
                  </div>;
                })}</div>
              </article>;
            })}
          </div>
        </section>}

        {tab === 'progress' && <section>
          <div className="be-sectionHead"><div><p>LIVE TIMELINE</p><h2>Execution History</h2></div><p>ملخص قابل للمراجعة لتواريخ البداية والإنجاز والوقت الفعلي لكل مرحلة.</p></div>
          <div className="timeline-list">
            {phases.map((phase) => {
              const p = phaseProgress[String(phase.id)] || {};
              const status = p.completedAt ? 'Completed' : p.startedAt ? 'In progress' : 'Planned';
              return <div className="timeline-row" key={phase.id}><span className="timeline-index">{String(phase.id).padStart(2,'0')}</span><div><b>{phase.title}</b><small>{status}</small></div><div className="timeline-times"><span>Started <b>{fmt(p.startedAt)}</b></span><span>Time <b>{duration(elapsed(p,tick))}</b></span><span>Completed <b>{fmt(p.completedAt)}</b></span></div></div>;
            })}
          </div>
        </section>}
      </div>

      <footer className="be-footer"><div><span>GHALA ALAMEER</span><strong>Backend Engineering Roadmap</strong></div><p>Public read-only engineering development record · Cloud synced</p></footer>
    </main>
  );
}
