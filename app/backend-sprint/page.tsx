'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Circle,
  Clock3,
  Copy,
  ExternalLink,
  Gauge,
  Play,
  RotateCcw,
  Target,
  TerminalSquare,
} from 'lucide-react';
import './roadmap.css';

type Phase = {
  id: number;
  title: string;
  area: string;
  summary: string;
  scope: string[];
  evidence: string;
  course?: string;
  course2?: string;
};

type PhaseProgress = { startedAt?: string; completedAt?: string };
type ProgressMap = Record<number, PhaseProgress>;
type SprintChecks = Record<string, boolean>;

type SprintDay = {
  day: number;
  title: string;
  phase: string;
  sessions: [string, string, string, string];
};

const phases: Phase[] = [
  {
    id: 1,
    title: 'System Design Foundations',
    area: 'Architecture Overview',
    summary: 'تكوين صورة ذهنية واضحة لكيف تتحرك الطلبات والبيانات داخل الأنظمة قبل الدخول في تفاصيل التنفيذ.',
    scope: ['Client–Server model', 'Single-server architecture', 'SQL vs NoSQL', 'Vertical & horizontal scaling', 'Load balancing & health checks', 'API styles: REST & GraphQL', 'Authentication vs authorization'],
    evidence: 'رسم Request Flow من المستخدم إلى API ثم قاعدة البيانات، مع شرح نقاط التوسع والمخاطر الأساسية.',
    course: 'https://www.youtube.com/watch?v=C842vFY5kRo',
  },
  {
    id: 2,
    title: 'JavaScript Fundamentals',
    area: 'Language Foundation',
    summary: 'بناء أساس لغوي ومنطقي قوي قبل الاعتماد على TypeScript أو أي Backend framework.',
    scope: ['Variables & data types', 'Conditions & loops', 'Functions', 'Arrays & objects', 'Scope & closures', 'Promises', 'Async/await', 'Error handling'],
    evidence: 'حل تمارين منطقية وبناء mini application بدون framework وبدون نسخ الحل.',
    course: 'https://www.youtube.com/watch?v=jS4aFq5-91M',
  },
  {
    id: 3,
    title: 'TypeScript',
    area: 'Primary Language',
    summary: 'اعتماد TypeScript كلغة رئيسية للمسار لرفع وضوح الكود وسلامة الأنواع وقابلية الصيانة.',
    scope: ['Type inference', 'Interfaces & type aliases', 'Union types & narrowing', 'Generics', 'Utility types', 'Typed async code', 'Return types'],
    evidence: 'إعادة بناء المشروع السابق بـTypeScript مع إزالة الأنواع الضمنية غير الضرورية.',
    course: 'https://www.youtube.com/watch?v=SpwzRDUQ1GI',
  },
  {
    id: 4,
    title: 'Git & GitHub Workflow',
    area: 'Engineering Workflow',
    summary: 'استخدام Git كسجل هندسي فعلي للمشروع وليس فقط وسيلة رفع ملفات.',
    scope: ['Commits & history', 'Remote repositories', 'Branches', 'Merge workflows', 'Conflict resolution', 'Safe undo', 'README & repository hygiene'],
    evidence: 'Repository يحتوي على feature branch وmerge واضح وcommits مرتبة وREADME قابل للمراجعة.',
    course: 'https://www.youtube.com/watch?v=RGOj5yH7evk',
  },
  {
    id: 5,
    title: 'Node.js, HTTP & Express',
    area: 'Runtime & API Fundamentals',
    summary: 'فهم بيئة Node.js وبروتوكول HTTP قبل الانتقال إلى abstraction أعلى مثل NestJS.',
    scope: ['Node runtime', 'Modules & npm', 'Environment variables', 'Filesystem', 'HTTP request/response lifecycle', 'Event loop', 'Streams basics', 'Express routing', 'Middleware', 'REST conventions', 'Status codes'],
    evidence: 'REST API منظمة إلى controllers/services مع error handling وPostman collection.',
    course: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
  },
  {
    id: 6,
    title: 'Backend Practice Projects',
    area: 'Applied Repetition',
    summary: 'تثبيت المفاهيم عبر أربعة Domains مختلفة بنفس الأدوات بدل حفظ خطوات مشروع واحد.',
    scope: ['Task Manager API', 'Store API', 'JWT Basics', 'Jobs API', 'Validation', 'Error handling', 'Protected routes', 'Ownership rules'],
    evidence: 'أربعة مشاريع قابلة للتشغيل وموثقة، مع القدرة على إعادة بناء كل واحد من الصفر.',
    course: 'https://www.youtube.com/watch?v=qwfE7fSVaZM',
  },
  {
    id: 7,
    title: 'SQL & PostgreSQL',
    area: 'Data Foundation',
    summary: 'إتقان SQL ونمذجة البيانات قبل استخدام ORM، حتى تكون قرارات قاعدة البيانات مفهومة وليست مخفية خلف مكتبة.',
    scope: ['DDL & constraints', 'CRUD queries', 'Primary & foreign keys', 'JOINs', 'GROUP BY / HAVING', 'Relationships', 'Indexes', 'Transactions & ACID', 'Normalization'],
    evidence: 'تصميم قاعدة بيانات لنظام حجز وكتابة 20+ query يدويًا تشمل joins وaggregations وtransactions.',
    course: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
  },
  {
    id: 8,
    title: 'NestJS Production Backend',
    area: 'Core Backend Stack',
    summary: 'تجميع الأساسيات داخل Backend منظم وقابل للتوسع باستخدام NestJS وPrisma وPostgreSQL.',
    scope: ['Modules / controllers / services', 'Dependency injection', 'DTOs & ValidationPipe', 'Prisma schema & migrations', 'JWT & refresh tokens', 'RBAC & guards', 'CORS & rate limiting', 'Swagger / OpenAPI', 'Users, products, cart, orders & payments'],
    evidence: 'E-commerce backend production-style مع توثيق API وقدرة على شرح كل طبقة وقرار معماري.',
    course: 'https://www.youtube.com/watch?v=RjMvgpeoSuw',
  },
  {
    id: 9,
    title: 'Redis & Caching',
    area: 'Performance',
    summary: 'إضافة caching وبيانات قصيرة العمر بعد فهم قاعدة البيانات الدائمة ومتى تكون القراءة المتكررة مكلفة.',
    scope: ['Strings / hashes / lists / sets', 'TTL', 'Caching patterns', 'Cache invalidation', 'Transactions basics', 'Pub/Sub basics'],
    evidence: 'إضافة Redis cache فعلي إلى endpoint كثيف القراءة مع توضيح invalidation strategy.',
    course: 'https://www.youtube.com/watch?v=XCsS_NVAa1g',
  },
  {
    id: 10,
    title: 'Queues & Background Processing',
    area: 'Asynchronous Workloads',
    summary: 'فصل الأعمال الثقيلة أو غير الفورية عن دورة HTTP request باستخدام queue وworkers.',
    scope: ['BullMQ', 'Redis-backed queues', 'Producers & workers', 'Retries', 'Delayed jobs', 'Failure handling', 'Idempotency basics', 'Events'],
    evidence: 'Background job حقيقي مثل email/notification أو file processing مع retry strategy.',
    course: 'https://www.youtube.com/watch?v=BkaNpM7CqWM',
  },
  {
    id: 11,
    title: 'WebSockets & Real-Time',
    area: 'Realtime Systems',
    summary: 'فهم الاتصال المستمر وتحديثات الزمن الحقيقي خارج نمط request/response التقليدي.',
    scope: ['NestJS gateways', 'Socket.IO', 'Connection lifecycle', 'Rooms', 'Realtime notifications', 'Socket authentication'],
    evidence: 'Chat أو live notifications مرتبطة بمستخدمين وصلاحيات واضحة.',
    course: 'https://www.youtube.com/watch?v=atbdpX4CViM',
  },
  {
    id: 12,
    title: 'Backend Testing',
    area: 'Quality Engineering',
    summary: 'بناء ثقة في التغييرات عبر طبقات اختبار تغطي business logic وintegration وHTTP behavior.',
    scope: ['Jest', 'Unit tests', 'Mocks', 'Integration tests', 'E2E with Supertest', 'Test database strategy', 'Coverage basics'],
    evidence: 'اختبارات Auth + Service + E2E لمشروع NestJS مع سيناريوهات نجاح وفشل.',
    course: 'https://www.youtube.com/watch?v=GSoGVlG1MTQ&list=PLIGDNOJWiL1-8hpXEDlD1UrphjmZ9aMT1',
  },
  {
    id: 13,
    title: 'Linux Fundamentals',
    area: 'Server Environment',
    summary: 'امتلاك الحد الأدنى العملي لإدارة تطبيق Backend داخل بيئة Linux وفهم الملفات والعمليات والشبكة والسجلات.',
    scope: ['Filesystem', 'Permissions basics', 'Processes', 'Packages', 'Environment variables', 'Networking basics', 'Logs & common shell commands'],
    evidence: 'تشغيل مشروع Node من terminal وإدارة process/env/logs بدون واجهة رسومية.',
    course: 'https://www.youtube.com/watch?v=ROjZy1WbCIA',
  },
  {
    id: 14,
    title: 'Docker & Containerization',
    area: 'Runtime Packaging',
    summary: 'توحيد بيئة التشغيل بحيث يعمل النظام بنفس الطريقة محليًا وفي CI وعلى السيرفر.',
    scope: ['Images & containers', 'Dockerfile', 'Volumes', 'Networks', 'Docker Compose', 'Registry basics', 'Production image practices'],
    evidence: 'تشغيل NestJS + PostgreSQL + Redis معًا باستخدام Docker Compose.',
    course: 'https://www.youtube.com/watch?v=3c-iBn73dDE',
  },
  {
    id: 15,
    title: 'CI/CD with GitHub Actions',
    area: 'Delivery Automation',
    summary: 'تحويل الاختبار والبناء والنشر إلى pipeline قابلة للتكرار بدل تنفيذها يدويًا.',
    scope: ['Workflows / jobs / steps', 'Triggers', 'Secrets', 'Install → test → build', 'Docker image pipeline', 'Deployment gates'],
    evidence: 'Pipeline على main تشغل tests وbuild تلقائيًا وتمنع نشر build فاشل.',
    course: 'https://www.youtube.com/watch?v=R8_veQiYBjI',
  },
  {
    id: 16,
    title: 'AWS Cloud Deployment',
    area: 'Cloud Infrastructure',
    summary: 'نشر Backend وقاعدة البيانات ومتابعة الصحة والسجلات داخل بيئة Cloud فعلية.',
    scope: ['IAM', 'EC2', 'S3', 'RDS', 'Networking basics', 'Security Groups', 'CloudWatch', 'Deployment', 'Logging & observability'],
    evidence: 'Backend منشور على AWS مع database وخطوات deployment موثقة وhealth/log monitoring.',
    course: 'https://www.youtube.com/watch?v=YC9ZxTotkxk',
    course2: 'https://explore.skillbuilder.aws/learn/courses/134/aws-cloud-practitioner-essentials',
  },
  {
    id: 17,
    title: 'SOLID & Refactoring',
    area: 'Code Design',
    summary: 'تحسين تصميم الكود بعد امتلاك مشروع كبير بما يكفي لإظهار مشاكل coupling والمسؤوليات المتداخلة.',
    scope: ['SRP', 'OCP', 'LSP', 'ISP', 'DIP', 'Code smells', 'Refactoring decisions'],
    evidence: 'Refactor لخدمة قديمة مع مقارنة before/after وشرح سبب كل تغيير.',
    course: 'https://www.youtube.com/watch?v=eHjNjyvZBto',
  },
  {
    id: 18,
    title: 'Clean Architecture',
    area: 'Application Architecture',
    summary: 'فصل business rules عن framework/database وبناء حدود واضحة بين طبقات النظام.',
    scope: ['Domain layer', 'Application / use cases', 'Infrastructure', 'Dependency direction', 'Repository abstraction', 'Framework as implementation detail'],
    evidence: 'إعادة تصميم Module واحد من NestJS بأسلوب Clean Architecture مع diagram للdependencies.',
    course: 'https://www.youtube.com/watch?v=UMUJ2-w9LIM',
  },
  {
    id: 19,
    title: 'System Design — Applied Pass',
    area: 'Architecture & Scale',
    summary: 'إعادة System Design بعد التطبيق العملي حتى تصبح قرارات cache وqueue وscaling مبنية على خبرة تنفيذية.',
    scope: ['Caching strategy', 'Queues', 'Database scaling', 'SPOF', 'Consistency trade-offs', 'Rate limiting', 'Observability', 'Designing for failure'],
    evidence: 'System Design كامل لنظام Booking أو Notifications مع diagram وtrade-offs وfailure scenarios.',
    course: 'https://www.youtube.com/watch?v=C842vFY5kRo',
  },
  {
    id: 20,
    title: 'Capstone Backend System',
    area: 'Independent Delivery',
    summary: 'إثبات القدرة على تحويل requirements إلى Backend كامل بدون اتباع فيديو أو مشروع جاهز.',
    scope: ['Requirements & scope', 'ERD & API contract', 'NestJS + Prisma + PostgreSQL', 'JWT/RBAC', 'Redis + BullMQ', 'WebSockets', 'Jest + E2E', 'Docker Compose', 'GitHub Actions', 'AWS deployment', 'Logging & observability', 'Technical documentation'],
    evidence: 'Backend كامل مستقل: Booking / Hospital / Automation Platform مع README وarchitecture diagram ونشر فعلي.',
  },
];

const sprintDays: SprintDay[] = [
  { day:1,title:'System Design overview + JavaScript intro',phase:'01–02',sessions:['System Design: request flow, databases, scaling & load balancing','JavaScript: variables, types & operators','Conditions, loops & functions','رسم request flow + تمارين JavaScript'] },
  { day:2,title:'JavaScript Core',phase:'02',sessions:['Arrays & methods','Objects & destructuring','Functions, scope & closures','تمارين بدون الرجوع للفيديو'] },
  { day:3,title:'JavaScript Async + Mini Project',phase:'02',sessions:['Promises & async/await','Error handling + modules + npm','Mini project','إعادة المشروع من الذاكرة'] },
  { day:4,title:'TypeScript Core',phase:'03',sessions:['Types & inference','Interfaces & aliases','Unions & narrowing','تحويل مشروع JS إلى TypeScript'] },
  { day:5,title:'TypeScript Advanced + Git',phase:'03–04',sessions:['Generics & utility types','Typed async code','Git commits & history','Remote repo + README'] },
  { day:6,title:'Git Workflow + Node.js Intro',phase:'04–05',sessions:['Branches, merge & conflicts','Git workflow challenge','Node runtime, modules & npm','Filesystem, env & HTTP basics'] },
  { day:7,title:'Node.js Internals',phase:'05',sessions:['Event loop & promises','Events & streams basics','HTTP server without framework','Node exercises'] },
  { day:8,title:'Express + REST APIs',phase:'05',sessions:['Routes & middleware','Params, query, body & status codes','Validation & error middleware','REST API + Postman'] },
  { day:9,title:'Project — Task Manager API',phase:'06',sessions:['Domain model & endpoints','CRUD implementation','Validation & errors','README + manual test + push'] },
  { day:10,title:'Project — Store API',phase:'06',sessions:['Products API','Filtering & sorting','Pagination & search','Refactor + Postman + push'] },
  { day:11,title:'Project — JWT Authentication',phase:'06',sessions:['Register + password hashing','Login + JWT','Protected routes','Auth rebuild from memory'] },
  { day:12,title:'Project — Jobs API',phase:'06',sessions:['Auth + ownership','Jobs CRUD','Error handling cleanup','Node/Express review'] },
  { day:13,title:'SQL Foundations',phase:'07',sessions:['Tables & constraints','CRUD SQL','WHERE / ORDER / LIMIT','30 manual queries'] },
  { day:14,title:'SQL Relationships',phase:'07',sessions:['Primary & foreign keys','JOINs','GROUP BY + HAVING','Booking ERD'] },
  { day:15,title:'PostgreSQL Deeper',phase:'07',sessions:['Indexes','Transactions + ACID','Normalization','Database mini project'] },
  { day:16,title:'NestJS Core',phase:'08',sessions:['Modules + controllers','Services + dependency injection','DTO + ValidationPipe','First CRUD module'] },
  { day:17,title:'NestJS + Prisma',phase:'08',sessions:['Prisma schema','Migrations & relations','Repository/data access flow','Integrate PostgreSQL'] },
  { day:18,title:'Authentication & Security',phase:'08',sessions:['Register/login + hashing','JWT + refresh tokens','RBAC + guards','CORS, validation & rate limiting'] },
  { day:19,title:'E-Commerce Domain I',phase:'08',sessions:['Users & profiles','Products','Categories','Swagger / OpenAPI documentation'] },
  { day:20,title:'E-Commerce Domain II',phase:'08',sessions:['Cart','Orders','Payments flow','Error handling + logging review'] },
  { day:21,title:'Redis & Caching',phase:'09',sessions:['Redis data structures','TTL & caching','Cache invalidation','Integrate cache into NestJS'] },
  { day:22,title:'Queues & Background Jobs',phase:'10',sessions:['BullMQ setup','Producer + worker','Retries + failures','Email/notification background job'] },
  { day:23,title:'WebSockets & Real-Time',phase:'11',sessions:['Gateway + Socket.IO','Connection lifecycle + rooms','Socket authentication','Realtime notification feature'] },
  { day:24,title:'Testing',phase:'12',sessions:['Jest unit tests','Mocks','Integration tests','E2E with Supertest'] },
  { day:25,title:'Linux Fundamentals',phase:'13',sessions:['Filesystem & permissions','Processes + env','Networking basics','Run backend + inspect logs'] },
  { day:26,title:'Docker & Compose',phase:'14',sessions:['Images + containers','Dockerfile','Networks + volumes','NestJS + PostgreSQL + Redis Compose'] },
  { day:27,title:'CI/CD',phase:'15',sessions:['GitHub Actions fundamentals','Test + build workflow','Secrets & deployment gates','Run pipeline end-to-end'] },
  { day:28,title:'AWS Deployment',phase:'16',sessions:['IAM + EC2','RDS + networking','Deploy backend','CloudWatch + health/log review'] },
  { day:29,title:'SOLID + Clean Architecture',phase:'17–18',sessions:['SOLID principles','Refactor existing service','Clean Architecture layers','Redesign one NestJS module'] },
  { day:30,title:'System Design + Capstone Definition',phase:'19–20',sessions:['System Design second pass','Design a production system','Capstone scope + ERD + API contract','Create repo, milestones & first implementation plan'] },
];

const sessionTimes = ['08:00–10:30', '11:00–13:30', '14:30–17:00', '17:30–20:00'];
const breaks = ['10:30–11:00 · Break', '13:30–14:30 · Lunch / Prayer', '17:00–17:30 · Break'];
const STORAGE_KEY = 'ghala-backend-engineering-roadmap-v4';

function formatDateTime(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(value));
}

function dateOnly(value: Date) {
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, '0');
  const d = String(value.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(value: string, amount: number) {
  const d = new Date(`${value}T12:00:00`);
  d.setDate(d.getDate() + amount);
  return d;
}

function encodeSnapshot(data: unknown) {
  const bytes = new TextEncoder().encode(JSON.stringify(data));
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function decodeSnapshot(value: string) {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

export default function BackendRoadmapPage() {
  const [tab, setTab] = useState<'roadmap' | 'sprint' | 'progress'>('roadmap');
  const [expanded, setExpanded] = useState<number | null>(1);
  const [phaseProgress, setPhaseProgress] = useState<ProgressMap>({});
  const [sprintChecks, setSprintChecks] = useState<SprintChecks>({});
  const [programStart, setProgramStart] = useState(dateOnly(new Date()));
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState('');
  const [snapshotMode, setSnapshotMode] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const snapshot = params.get('snapshot');
      if (snapshot) {
        const data = decodeSnapshot(snapshot);
        setPhaseProgress(data.phaseProgress || {});
        setSprintChecks(data.sprintChecks || {});
        if (data.programStart) setProgramStart(data.programStart);
        setSnapshotMode(true);
      } else {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        if (saved.phaseProgress) setPhaseProgress(saved.phaseProgress);
        if (saved.sprintChecks) setSprintChecks(saved.sprintChecks);
        if (saved.programStart) setProgramStart(saved.programStart);
      }
    } catch {
      // Keep defaults if a saved snapshot is invalid.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready || snapshotMode) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ phaseProgress, sprintChecks, programStart }));
  }, [phaseProgress, sprintChecks, programStart, ready, snapshotMode]);

  const completedPhases = phases.filter((p) => phaseProgress[p.id]?.completedAt).length;
  const startedPhases = phases.filter((p) => phaseProgress[p.id]?.startedAt && !phaseProgress[p.id]?.completedAt).length;
  const roadmapPercent = Math.round((completedPhases / phases.length) * 100);
  const checkedSessions = Object.entries(sprintChecks).filter(([key, value]) => value && key.includes('-s')).length;
  const sprintHours = checkedSessions * 2.5;
  const sprintPercent = Math.round((checkedSessions / 120) * 100);
  const projectedEnd = addDays(programStart, 29);

  const orderedEvents = useMemo(() => {
    const values: string[] = [];
    Object.values(phaseProgress).forEach((entry) => {
      if (entry.startedAt) values.push(entry.startedAt);
      if (entry.completedAt) values.push(entry.completedAt);
    });
    return values.sort((a, b) => +new Date(a) - +new Date(b));
  }, [phaseProgress]);

  const roadmapStartedAt = orderedEvents[0];
  const lastUpdateAt = orderedEvents[orderedEvents.length - 1];
  const roadmapCompletedAt = completedPhases === phases.length
    ? phases.map((p) => phaseProgress[p.id]?.completedAt).filter(Boolean).sort((a, b) => +new Date(a!) - +new Date(b!)).at(-1)
    : undefined;
  const currentPhase = phases.find((p) => phaseProgress[p.id]?.startedAt && !phaseProgress[p.id]?.completedAt)
    || phases.find((p) => !phaseProgress[p.id]?.completedAt)
    || phases[phases.length - 1];

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  }

  function startPhase(id: number) {
    if (snapshotMode) return notify('هذا رابط عرض فقط — افتحي الرابط الأساسي لتعديل التقدم');
    setPhaseProgress((prev) => ({
      ...prev,
      [id]: { ...prev[id], startedAt: prev[id]?.startedAt || new Date().toISOString() },
    }));
    notify('تم تسجيل وقت بدء المرحلة');
  }

  function completePhase(id: number) {
    if (snapshotMode) return notify('هذا رابط عرض فقط — افتحي الرابط الأساسي لتعديل التقدم');
    const now = new Date().toISOString();
    setPhaseProgress((prev) => ({
      ...prev,
      [id]: { startedAt: prev[id]?.startedAt || now, completedAt: now },
    }));
    notify('تم تسجيل وقت إنجاز المرحلة');
  }

  function reopenPhase(id: number) {
    if (snapshotMode) return;
    setPhaseProgress((prev) => ({ ...prev, [id]: { ...prev[id], completedAt: undefined } }));
    notify('تمت إعادة فتح المرحلة');
  }

  function resetPhase(id: number) {
    if (snapshotMode) return;
    setPhaseProgress((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    notify('تم مسح تواريخ المرحلة');
  }

  function toggleSession(day: number, index: number) {
    if (snapshotMode) return;
    const key = `${day}-s${index}`;
    setSprintChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function toggleBreak(day: number, index: number) {
    if (snapshotMode) return;
    const key = `${day}-b${index}`;
    setSprintChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function copySnapshot() {
    const snapshot = encodeSnapshot({ phaseProgress, sprintChecks, programStart });
    const url = `${window.location.origin}${window.location.pathname}?snapshot=${encodeURIComponent(snapshot)}`;
    await navigator.clipboard.writeText(url);
    notify('تم نسخ رابط يعرض نفس تقدمك وتواريخك');
  }

  function resetAll() {
    if (snapshotMode) return;
    if (!window.confirm('مسح جميع تواريخ التقدم والجلسات؟')) return;
    setPhaseProgress({});
    setSprintChecks({});
    setProgramStart(dateOnly(new Date()));
    localStorage.removeItem(STORAGE_KEY);
    notify('تمت إعادة ضبط الخطة');
  }

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
            <p className="be-eyebrow">PROFESSIONAL DEVELOPMENT PLAN</p>
            <h1>Backend Engineering<br /><span>Roadmap</span></h1>
            <p className="be-lead">
              خطة تنفيذية مكثفة لتطوير مهارات هندسة الباك إند من أساسيات اللغة وHTTP وقواعد البيانات،
              إلى الاختبارات والبنية السحابية وتصميم الأنظمة. كل مرحلة مرتبطة بمخرج عملي قابل للمراجعة.
            </p>
            <div className="be-stack">
              {['TypeScript','Node.js','NestJS','PostgreSQL','Redis','Docker','AWS'].map((item) => <span key={item}>{item}</span>)}
            </div>
            <div className="be-actions">
              <button className="primary" onClick={() => setTab('roadmap')}><Target size={15}/> عرض الـRoadmap</button>
              <button onClick={copySnapshot}><Copy size={15}/> نسخ رابط التقدم</button>
            </div>
          </div>

          <aside className="be-currentCard">
            <div className="be-cardLabel">CURRENT FOCUS</div>
            <strong>{String(currentPhase.id).padStart(2, '0')}</strong>
            <h2>{currentPhase.title}</h2>
            <p>{currentPhase.area}</p>
            <div className="be-currentMeta">
              <div><span>Started</span><b>{formatDateTime(phaseProgress[currentPhase.id]?.startedAt)}</b></div>
              <div><span>Last update</span><b>{formatDateTime(lastUpdateAt)}</b></div>
            </div>
          </aside>
        </div>
      </header>

      {snapshotMode && (
        <div className="be-snapshotBanner">
          <CheckCircle2 size={16}/>
          <span>Public progress snapshot — يعرض حالة التقدم والتواريخ وقت إنشاء الرابط.</span>
        </div>
      )}

      <section className="be-overview">
        <div><small>ROADMAP PROGRESS</small><strong>{roadmapPercent}%</strong><span>{completedPhases} / 20 completed</span><i><b style={{width:`${roadmapPercent}%`}} /></i></div>
        <div><small>SPRINT PROGRESS</small><strong>{sprintHours}<em>h</em></strong><span>{sprintPercent}% of 300 hours</span><i><b style={{width:`${sprintPercent}%`}} /></i></div>
        <div><small>ROADMAP STARTED</small><strong className="dateValue">{roadmapStartedAt ? formatDateTime(roadmapStartedAt) : 'Not started'}</strong><span>{startedPhases ? `${startedPhases} phase in progress` : 'No active phase'}</span></div>
        <div><small>ROADMAP COMPLETED</small><strong className="dateValue">{roadmapCompletedAt ? formatDateTime(roadmapCompletedAt) : 'In progress'}</strong><span>20 engineering stages</span></div>
      </section>

      <nav className="be-tabs">
        <button className={tab === 'roadmap' ? 'active' : ''} onClick={() => setTab('roadmap')}>Roadmap <span>20 stages</span></button>
        <button className={tab === 'sprint' ? 'active' : ''} onClick={() => setTab('sprint')}>30-Day Sprint <span>300 hours</span></button>
        <button className={tab === 'progress' ? 'active' : ''} onClick={() => setTab('progress')}>Progress <span>timeline</span></button>
      </nav>

      <div className="be-content">
        {tab === 'roadmap' && (
          <section>
            <div className="be-sectionHead">
              <div><p>ENGINEERING PATH</p><h2>Backend Engineering Roadmap</h2></div>
              <p>المراحل مرتبة حسب الاعتماد المعرفي. لا تُعتبر المرحلة منتهية بمجرد مشاهدة المحتوى؛ الإنهاء مرتبط بمخرج عملي واضح.</p>
            </div>

            <div className="be-roadmap">
              {phases.map((phase) => {
                const progress = phaseProgress[phase.id] || {};
                const status = progress.completedAt ? 'completed' : progress.startedAt ? 'active' : 'planned';
                return (
                  <article className={`be-phase ${status}`} key={phase.id}>
                    <div className="be-rail"><span>{String(phase.id).padStart(2, '0')}</span><i /></div>
                    <div className="be-phaseCard">
                      <button className="be-phaseHeader" onClick={() => setExpanded(expanded === phase.id ? null : phase.id)}>
                        <div>
                          <div className="be-phaseMeta"><span>{phase.area}</span><b className={`status ${status}`}>{status === 'completed' ? 'Completed' : status === 'active' ? 'In progress' : 'Planned'}</b></div>
                          <h3>{phase.title}</h3>
                          <p>{phase.summary}</p>
                        </div>
                        <ChevronDown className={expanded === phase.id ? 'open' : ''} size={18}/>
                      </button>

                      <div className="be-timestamps">
                        <div><span><Play size={12}/> Started</span><b>{formatDateTime(progress.startedAt)}</b></div>
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
                            {!progress.startedAt && <button className="start" onClick={() => startPhase(phase.id)}><Play size={13}/> بدء المرحلة الآن</button>}
                            {progress.startedAt && !progress.completedAt && <button className="complete" onClick={() => completePhase(phase.id)}><CheckCircle2 size={13}/> تسجيل الإنجاز</button>}
                            {progress.completedAt && <button onClick={() => reopenPhase(phase.id)}>إعادة فتح المرحلة</button>}
                            {(progress.startedAt || progress.completedAt) && <button className="quiet" onClick={() => resetPhase(phase.id)}><RotateCcw size={12}/> مسح التواريخ</button>}
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
              <div><p>EXECUTION SPRINT</p><h2>30 days · 300 focused hours</h2></div>
              <p>تقسيم تنفيذي قاسٍ للخطة إلى أربع جلسات دراسة يومية. التقدم هنا منفصل عن حالة مراحل الـRoadmap.</p>
            </div>

            <div className="be-dateControl">
              <div><label>Program start date</label><input type="date" value={programStart} disabled={snapshotMode} onChange={(e) => setProgramStart(e.target.value)}/></div>
              <ArrowUpRight size={18}/>
              <div><label>Projected completion</label><strong>{new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',year:'numeric'}).format(projectedEnd)}</strong></div>
            </div>

            <div className="be-rhythm">
              <div><Clock3 size={15}/><b>08:00–10:30</b><span>Session 01</span></div><small>30 min break</small>
              <div><Clock3 size={15}/><b>11:00–13:30</b><span>Session 02</span></div><small>60 min lunch / prayer</small>
              <div><Clock3 size={15}/><b>14:30–17:00</b><span>Session 03</span></div><small>30 min break</small>
              <div><Clock3 size={15}/><b>17:30–20:00</b><span>Session 04</span></div>
            </div>

            <div className="be-days">
              {sprintDays.map((day) => {
                const done = day.sessions.filter((_, i) => sprintChecks[`${day.day}-s${i}`]).length;
                const dayDate = addDays(programStart, day.day - 1);
                return (
                  <article className={`be-day ${done === 4 ? 'done' : ''}`} key={day.day}>
                    <header>
                      <div className="be-dayNo"><span>DAY</span><b>{String(day.day).padStart(2,'0')}</b></div>
                      <div><small>PHASE {day.phase} · {new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short'}).format(dayDate)}</small><h3>{day.title}</h3></div>
                      <strong>{done}/4</strong>
                    </header>
                    <div className="be-daySessions">
                      {day.sessions.map((session, index) => (
                        <div className={`be-session ${sprintChecks[`${day.day}-s${index}`] ? 'checked' : ''}`} key={session}>
                          <time>{sessionTimes[index]}</time>
                          <p><small>SESSION {String(index + 1).padStart(2,'0')}</small>{session}</p>
                          <button disabled={snapshotMode} onClick={() => toggleSession(day.day,index)}>{sprintChecks[`${day.day}-s${index}`] ? <Check size={15}/> : <Circle size={14}/>}</button>
                          {index < 3 && <div className={`be-break ${sprintChecks[`${day.day}-b${index}`] ? 'checked' : ''}`}><span>{breaks[index]}</span><button disabled={snapshotMode} onClick={() => toggleBreak(day.day,index)}>{sprintChecks[`${day.day}-b${index}`] ? 'Done' : 'Break'}</button></div>}
                        </div>
                      ))}
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
              <div><p>PROGRESS RECORD</p><h2>Execution timeline</h2></div>
              <p>سجل واضح للبدء والإنجاز. عند مشاركة Snapshot link تظهر للمراجع نفس الحالة والتواريخ الموجودة هنا.</p>
            </div>

            <div className="be-progressGrid">
              <div className="be-progressPrimary">
                <Gauge size={20}/><small>ROADMAP COMPLETION</small><strong>{roadmapPercent}%</strong><p>{completedPhases} completed · {startedPhases} in progress · {20 - completedPhases - startedPhases} planned</p><i><b style={{width:`${roadmapPercent}%`}}/></i>
              </div>
              <div className="be-progressStat"><CalendarDays size={18}/><small>STARTED</small><strong>{roadmapStartedAt ? formatDateTime(roadmapStartedAt) : '—'}</strong></div>
              <div className="be-progressStat"><Clock3 size={18}/><small>LAST UPDATE</small><strong>{lastUpdateAt ? formatDateTime(lastUpdateAt) : '—'}</strong></div>
              <div className="be-progressStat"><TerminalSquare size={18}/><small>SPRINT HOURS</small><strong>{sprintHours} / 300 h</strong></div>
            </div>

            <div className="be-history">
              {phases.map((phase) => {
                const progress = phaseProgress[phase.id] || {};
                return <div className="be-historyRow" key={phase.id}>
                  <b>{String(phase.id).padStart(2,'0')}</b>
                  <div><strong>{phase.title}</strong><span>{phase.area}</span></div>
                  <div className="be-historyDates"><span>Started <b>{formatDateTime(progress.startedAt)}</b></span><span>Completed <b>{formatDateTime(progress.completedAt)}</b></span></div>
                </div>;
              })}
            </div>

            {!snapshotMode && <div className="be-management">
              <div><small>PUBLIC REVIEW</small><h3>Share a progress snapshot</h3><p>ينشئ رابطًا يحتوي على حالة الـRoadmap وتواريخ البدء والإنجاز الحالية، ليظهر للمراجع بنفس الشكل من أي جهاز.</p></div>
              <button onClick={copySnapshot}><Copy size={15}/> نسخ رابط التقدم</button>
              <button className="danger" onClick={resetAll}><RotateCcw size={15}/> إعادة ضبط الكل</button>
            </div>}
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
