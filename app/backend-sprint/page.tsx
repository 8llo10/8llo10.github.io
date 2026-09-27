'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, ExternalLink, Flame, Gauge, Github, Play, RotateCcw, Target, Timer, Zap } from 'lucide-react';
import './roadmap.css';

type Phase = {
  id: number;
  title: string;
  label: string;
  why: string;
  learn: string[];
  deliverable: string;
  course?: string;
  course2?: string;
  accent: 'violet' | 'green' | 'blue' | 'amber';
};

type SprintDay = {
  day: number;
  title: string;
  phase: string;
  sessions: string[];
};

const phases: Phase[] = [
  { id:1,title:'System Design — الصورة الكبيرة',label:'FOUNDATION MAP',why:'تشوفين شكل الأنظمة الكبيرة قبل ما تدخلي التفاصيل. أول مشاهدة فهم عام فقط.',learn:['Single server & client/server','SQL vs NoSQL','Vertical / Horizontal scaling','Load Balancers & Health Checks','REST / GraphQL overview','Authentication vs Authorization'],deliverable:'اكتبي صفحة واحدة ترسمين فيها Request من المستخدم إلى السيرفر وقاعدة البيانات.',course:'https://www.youtube.com/watch?v=C842vFY5kRo',accent:'violet' },
  { id:2,title:'JavaScript من الصفر',label:'LANGUAGE CORE',why:'TypeScript مبني على JavaScript. نبي المنطق يثبت قبل الأنواع والفريموركس.',learn:['Variables & data types','Conditions & loops','Functions','Arrays & Objects','Scope & closures basics','Promises + async/await + error handling'],deliverable:'3 تمارين منطق + mini app بدون Framework وبدون نسخ كود.',course:'https://www.youtube.com/watch?v=jS4aFq5-91M',accent:'amber' },
  { id:3,title:'TypeScript',label:'PRIMARY LANGUAGE',why:'هذه لغتك الأساسية في مسار Node/NestJS وتخلي الكود أوضح وأأمن وأسهل للصيانة.',learn:['Types & inference','Interfaces & type aliases','Union & narrowing','Generics','Utility Types','Return types & typed async code'],deliverable:'حوّلي مشروع JavaScript السابق بالكامل إلى TypeScript.',course:'https://www.youtube.com/watch?v=SpwzRDUQ1GI',accent:'blue' },
  { id:4,title:'Git + GitHub',label:'ENGINEERING WORKFLOW',why:'من هذه النقطة كل مشروع لازم يكون له history حقيقي وbranches وREADME.',learn:['init / add / commit / log','push / pull / clone','Branches & merge','Conflicts','Undo safely','README & clean commits'],deliverable:'Repo كامل بمراحل commits واضحة وفرع feature وmerge.',course:'https://www.youtube.com/watch?v=RGOj5yH7evk',accent:'green' },
  { id:5,title:'Node.js من الداخل + Express',label:'RUNTIME + HTTP',why:'لا ندخل NestJS قبل ما تفهمين وش يصير تحت الفريمورك.',learn:['Node runtime & modules','npm & environment variables','File system','HTTP request/response','Event loop & streams basics','Express routes & middleware','REST API design + status codes'],deliverable:'REST API منظمة بـcontrollers/services + Postman collection.',course:'https://www.youtube.com/watch?v=Oe421EPjeBE',accent:'green' },
  { id:6,title:'Node.js — أربعة مشاريع للتثبيت',label:'REPETITION BLOCK',why:'نفس الأدوات في Domains مختلفة عشان الـBackend يصير عادة مو حفظ.',learn:['Task Manager API','Store API','JWT Basics','Jobs API','Validation','Error handling','Protected routes'],deliverable:'4 repos أو monorepo موثق — وكل مشروع يشتغل من الصفر.',course:'https://www.youtube.com/watch?v=qwfE7fSVaZM',accent:'violet' },
  { id:7,title:'SQL + PostgreSQL من الصفر',label:'DATA FOUNDATION',why:'ممنوع ORM بدون SQL. لازم تعرفين وش قاعدة البيانات تسوي فعلًا.',learn:['Tables & constraints','SELECT / INSERT / UPDATE / DELETE','Primary & Foreign Keys','JOINs','GROUP BY / HAVING','Relationships','Indexes basics','Transactions & normalization'],deliverable:'صممي Database لنظام حجز واكتبي 20 query يدويًا.',course:'https://www.youtube.com/watch?v=qw--VYLpxG4',accent:'blue' },
  { id:8,title:'NestJS + Prisma + PostgreSQL + Auth',label:'MAIN BACKEND PROJECT',why:'هذه قلب الخطة. هنا تجمعين الأساس في Backend إنتاجي منظم.',learn:['Modules / Controllers / Services','Dependency Injection','DTO + ValidationPipe','Prisma schema & migrations','JWT + Refresh Tokens','RBAC / Guards','Security + CORS + rate limiting','Swagger / API documentation','Users / Products / Cart / Orders / Payments'],deliverable:'E-Commerce Backend production-style تبنينه مع الكورس حرفيًا ثم تشرحين كل طبقة.',course:'https://www.youtube.com/watch?v=RjMvgpeoSuw',accent:'violet' },
  { id:9,title:'Redis',label:'CACHE + IN-MEMORY',why:'بعد قاعدة البيانات الدائمة تتعلمين متى نحتاج سرعة وكاش وTTL.',learn:['Strings / Hashes / Lists / Sets','TTL','Caching patterns','Transactions basics','Pub/Sub basics','Cache invalidation'],deliverable:'أضيفي Redis cache لقراءة المنتجات أو البيانات الثقيلة في مشروع NestJS.',course:'https://www.youtube.com/watch?v=XCsS_NVAa1g',accent:'amber' },
  { id:10,title:'Queues + Background Jobs',label:'ASYNC PROCESSING',why:'مو كل شغل لازم يخلص داخل HTTP request. هنا يبدأ Backend أقرب للأنظمة الحقيقية.',learn:['BullMQ + Redis','Producer / Worker','Retries','Delayed jobs','Events','Failure handling','Idempotency basics'],deliverable:'Email/notification job أو file-processing job بالخلفية.',course:'https://www.youtube.com/watch?v=BkaNpM7CqWM',accent:'green' },
  { id:11,title:'WebSockets / Real-Time',label:'REAL-TIME',why:'تفهمين الفرق بين request/response والاتصال المستمر.',learn:['NestJS Gateway','Socket.IO','Rooms','Connection lifecycle','Realtime notifications','Basic auth for sockets'],deliverable:'Chat صغير أو live notifications مرتبطة بمستخدمين.',course:'https://www.youtube.com/watch?v=atbdpX4CViM',accent:'blue' },
  { id:12,title:'Testing في NestJS',label:'QUALITY GATE',why:'الكود اللي ما تقدرين تختبرينه صعب تثقين فيه وتغيرينه.',learn:['Jest','Unit tests','Mocks','Integration tests','E2E with Supertest','Test database strategy','Coverage basics'],deliverable:'اختبارات Auth + Service + API E2E لمشروع NestJS.',course:'https://www.youtube.com/watch?v=GSoGVlG1MTQ&list=PLIGDNOJWiL1-8hpXEDlD1UrphjmZ9aMT1',accent:'green' },
  { id:13,title:'Linux Basics',label:'SERVER BASICS',why:'السيرفرات وDocker وAWS تصير أسهل لما الـterminal ما يكون غريب عليك.',learn:['Filesystem','Permissions basics','Processes','Networking basics','Packages','Environment variables','Logs & common commands'],deliverable:'تشغيل مشروع Node من terminal وإدارة env/process/logs يدويًا.',course:'https://www.youtube.com/watch?v=ROjZy1WbCIA',accent:'amber' },
  { id:14,title:'Docker من البداية إلى التطبيق الحقيقي',label:'CONTAINERS',why:'نبي مشروعك يشتغل بنفس البيئة عندك وعند أي شخص وفي السيرفر.',learn:['Images & Containers','Dockerfile','Volumes','Networks','Docker Compose','Registry','Production build basics'],deliverable:'NestJS + PostgreSQL + Redis كلهم يشتغلون بـDocker Compose.',course:'https://www.youtube.com/watch?v=3c-iBn73dDE',accent:'blue' },
  { id:15,title:'GitHub Actions + CI/CD',label:'DELIVERY PIPELINE',why:'كل push لازم يمر على بوابة جودة بدل نشر يدوي عشوائي.',learn:['Workflows / Jobs / Steps','Triggers','Secrets','Install → Test → Build','Docker image pipeline','Deployment gate'],deliverable:'Pipeline على main يشغل tests وbuild تلقائيًا.',course:'https://www.youtube.com/watch?v=R8_veQiYBjI',accent:'violet' },
  { id:16,title:'AWS',label:'CLOUD',why:'بعد Linux وDocker صار عندك أساس يخليك تفهمين Cloud بدل تحفظين أسماء خدمات.',learn:['IAM','EC2','S3','RDS','Networking basics','Security Groups','CloudWatch','Deployment','Logging & observability basics'],deliverable:'انشري Backend + DB وتابعي logs/health فعليًا.',course:'https://www.youtube.com/watch?v=YC9ZxTotkxk',course2:'https://explore.skillbuilder.aws/learn/courses/134/aws-cloud-practitioner-essentials',accent:'amber' },
  { id:17,title:'SOLID Principles بـTypeScript',label:'CODE DESIGN',why:'الآن عندك كود كفاية يخلي المبادئ منطقية بدل ما تكون تعريفات.',learn:['SRP','OCP','LSP','ISP','DIP','Refactoring smells'],deliverable:'خذي Service قديم من مشروعك واعملي له refactor مع شرح السبب.',course:'https://www.youtube.com/watch?v=eHjNjyvZBto',accent:'green' },
  { id:18,title:'Clean Architecture بـTypeScript',label:'ARCHITECTURE',why:'تفصلين business rules عن framework/database وتتعلمين حدود الطبقات.',learn:['Domain','Application / Use Cases','Infrastructure','Dependency direction','Repository abstraction','Framework as detail'],deliverable:'أعيدي تصميم Module واحد من NestJS بأسلوب Clean Architecture.',course:'https://www.youtube.com/watch?v=UMUJ2-w9LIM',accent:'blue' },
  { id:19,title:'System Design — المرة الثانية',label:'SECOND PASS',why:'الآن Load Balancer وCache وQueue وScaling صارت أشياء اشتغلتي عليها فعلًا.',learn:['Caching strategy','Queues','Database scaling','SPOF','Consistency trade-offs','Rate limiting','Observability','Designing for failure'],deliverable:'System Design لنظام Booking أو Notifications مع diagram وقرارات مكتوبة.',course:'https://www.youtube.com/watch?v=C842vFY5kRo',accent:'violet' },
  { id:20,title:'المشروع النهائي بدون مدرس',label:'PROOF OF SKILL',why:'هنا نعرف إن المعرفة صارت عندك مو عند الفيديو.',learn:['Requirements & scope','ERD + API contract','NestJS + Prisma + PostgreSQL','JWT/RBAC','Redis + BullMQ','WebSockets','Jest + E2E','Docker Compose','GitHub Actions','AWS deploy','Logging + README + architecture diagram'],deliverable:'Backend كامل من الصفر بدون اتباع فيديو: Booking / Hospital / Automation Platform.',accent:'green' },
];

const days: SprintDay[] = [
{day:1,title:'System Design overview + JS intro',phase:'01–02',sessions:['System Design: single server, DB, scaling, load balancer','JavaScript: variables + types + operators','Conditions + loops + functions','ارسم Request flow واكتب 10 تمارين JS']},
{day:2,title:'JavaScript Core',phase:'02',sessions:['Arrays + methods','Objects + destructuring','Functions + scope + closures basics','حل تمارين بدون فيديو']},
{day:3,title:'JavaScript Async + Mini Project',phase:'02',sessions:['Promises + async/await','try/catch + modules + npm','Mini project','إعادة المشروع من الذاكرة']},
{day:4,title:'TypeScript Core',phase:'03',sessions:['Types + inference','Interfaces + aliases','Unions + narrowing','تحويل كود JS إلى TS']},
{day:5,title:'TypeScript Advanced + Git Intro',phase:'03–04',sessions:['Generics + utility types','Typed async code + exercises','Git basics + commits','GitHub remote + push + README']},
{day:6,title:'Git Workflow + Node Intro',phase:'04–05',sessions:['Branches + merge + conflicts','Git challenge كامل','Node runtime + modules + npm','Filesystem + env + HTTP basics']},
{day:7,title:'Node Internals',phase:'05',sessions:['Event loop + promises','Events + streams basics','HTTP server يدوي','تمارين Node من الصفر']},
{day:8,title:'Express + REST',phase:'05',sessions:['Express routes + middleware','params/query/body + status codes','Error middleware + validation','REST API + Postman']},
{day:9,title:'Project: Task Manager',phase:'06',sessions:['Model + endpoints','CRUD implementation','Validation + errors','README + test + push']},
{day:10,title:'Project: Store API',phase:'06',sessions:['Products API','Filtering + sorting','Pagination + search','Refactor + Postman + push']},
{day:11,title:'Project: JWT',phase:'06',sessions:['Register + hashing','Login + JWT','Protected routes','Auth review + rebuild']},
{day:12,title:'Project: Jobs API',phase:'06',sessions:['Auth + ownership','Jobs CRUD','Error handling cleanup','Node/Express full review']},
{day:13,title:'SQL Foundations',phase:'07',sessions:['Tables + constraints','CRUD SQL','WHERE / ORDER / LIMIT','30 manual queries']},
{day:14,title:'SQL Relationships',phase:'07',sessions:['PK/FK + relationships','JOINs','GROUP BY + HAVING','Design Booking ERD']},
{day:15,title:'PostgreSQL Deeper',phase:'07',sessions:['Indexes','Transactions + ACID','Normalization','DB mini project + query review']},
{day:16,title:'NestJS Core',phase:'08',sessions:['Modules + Controllers','Services + DI','DTO + ValidationPipe','First CRUD module']},
{day:17,title:'NestJS + Prisma',phase:'08',sessions:['Prisma schema + migrations','Relations + queries','Nest integration','Swagger + config/env']},
{day:18,title:'Auth + Security + RBAC',phase:'08',sessions:['Register/Login + hashing','JWT + refresh concept','Guards + RBAC','CORS + rate limiting + validation + security review']},
{day:19,title:'E-Commerce Core',phase:'08',sessions:['Users','Products + categories','Relations + validation','Tests + refactor']},
{day:20,title:'E-Commerce Business Flow',phase:'08',sessions:['Cart','Orders','Payments flow','Error handling + API documentation']},
{day:21,title:'Redis',phase:'09',sessions:['Redis data structures','TTL + caching','NestJS Redis integration','Cache product endpoint + invalidation']},
{day:22,title:'BullMQ + Background Jobs',phase:'10',sessions:['Queue concepts','Producer + Worker','Retries + delayed jobs','Email/notification job']},
{day:23,title:'WebSockets + Realtime',phase:'11',sessions:['Gateway + Socket.IO','Rooms + lifecycle','Realtime notifications','Socket auth + mini chat']},
{day:24,title:'Testing',phase:'12',sessions:['Jest unit tests','Mocks + services','Integration tests','E2E Auth/API + coverage review']},
{day:25,title:'Linux + Docker',phase:'13–14',sessions:['Linux terminal/files/processes','Networking + env + logs','Dockerfile + images/containers','Docker Compose: Nest + Postgres + Redis']},
{day:26,title:'CI/CD + AWS',phase:'15–16',sessions:['GitHub Actions workflow','Test + build pipeline','AWS IAM/EC2/RDS/S3','Deploy + CloudWatch/logging']},
{day:27,title:'SOLID + Clean Architecture',phase:'17–18',sessions:['SOLID with TypeScript','Refactor existing service','Clean Architecture layers','Refactor one Nest module']},
{day:28,title:'System Design — Second Pass',phase:'19',sessions:['Scaling + cache + queues review','DB scaling + consistency','Rate limiting + observability + failure','Design Booking System + diagram']},
{day:29,title:'Final Project — Design & Core',phase:'20',sessions:['Scope + requirements + architecture','ERD + Prisma schema + API contract','Auth/RBAC + core modules','Redis/Queue plan + first implementation']},
{day:30,title:'Final Project — Production Finish',phase:'20',sessions:['WebSockets + background jobs','Unit/E2E tests','Docker + GitHub Actions + AWS deploy','README + architecture diagram + final audit']},
];

const breaks = ['10:30–11:00 بريك','13:30–14:30 غداء / صلاة','17:00–17:30 بريك'];
const times = ['08:00–10:30','11:00–13:30','14:30–17:00','17:30–20:00'];
const STORAGE = 'ghala-backend-roadmap-v4';

function todayISO(){
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0,10);
}
function addDays(date: string, amount: number){
  const d = new Date(`${date}T12:00:00`);
  d.setDate(d.getDate()+amount);
  return d.toISOString().slice(0,10);
}

export default function BackendSprintPage(){
  const [tab,setTab] = useState<'roadmap'|'sprint'|'dashboard'>('roadmap');
  const [completed,setCompleted] = useState<Record<number,boolean>>({});
  const [sessions,setSessions] = useState<Record<string,boolean>>({});
  const [breakDone,setBreakDone] = useState<Record<string,boolean>>({});
  const [start,setStart] = useState(todayISO());
  const [open,setOpen] = useState<number>(1);
  const [ready,setReady] = useState(false);

  useEffect(()=>{
    try{
      const raw = localStorage.getItem(STORAGE);
      if(raw){
        const data=JSON.parse(raw);
        setCompleted(data.completed||{});setSessions(data.sessions||{});setBreakDone(data.breakDone||{});setStart(data.start||todayISO());
      }
    }catch{}
    setReady(true);
  },[]);

  useEffect(()=>{
    if(!ready) return;
    localStorage.setItem(STORAGE,JSON.stringify({completed,sessions,breakDone,start}));
  },[completed,sessions,breakDone,start,ready]);

  const phaseDone = Object.values(completed).filter(Boolean).length;
  const sessionDone = Object.values(sessions).filter(Boolean).length;
  const totalSessions = days.length*4;
  const hours = sessionDone*2.5;
  const learningPct = Math.round((sessionDone/totalSessions)*100);
  const roadmapPct = Math.round((phaseDone/phases.length)*100);
  const end = addDays(start,29);
  const dayIndex = useMemo(()=>{
    const a=new Date(`${start}T12:00:00`).getTime();
    const b=new Date(`${todayISO()}T12:00:00`).getTime();
    return Math.floor((b-a)/86400000)+1;
  },[start]);
  const currentDay = dayIndex>=1&&dayIndex<=30?dayIndex:null;

  const reset=()=>{
    if(!confirm('تبغين تمسحين كل تقدمك في الخطة؟')) return;
    setCompleted({});setSessions({});setBreakDone({});setStart(todayISO());
  };

  return <main className="br-site" dir="rtl">
    <div className="br-noise" />
    <header className="br-hero" id="top">
      <div className="br-kicker"><span className="br-dot"/>GHALA // BACKEND ENGINEER ROADMAP</div>
      <div className="br-heroGrid">
        <div>
          <p className="br-overline">30 DAYS · 300 HOURS · ONE STACK</p>
          <h1>من الصفر إلى<br/><span>Backend Engineer.</span></h1>
          <p className="br-lead">خارطتي الشخصية للتأسيس المكثف في TypeScript + Node.js + NestJS + PostgreSQL ثم Production, Cloud وSystem Design — بدون تشتيت.</p>
          <div className="br-heroActions">
            <button onClick={()=>{setTab('sprint');setTimeout(()=>document.getElementById('content')?.scrollIntoView({behavior:'smooth'}),50)}}><Flame size={16}/> ابدأ خطة الـ30 يوم</button>
            <button className="ghost" onClick={()=>setTab('roadmap')}><Target size={16}/> عرض الـRoadmap</button>
          </div>
        </div>
        <aside className="br-terminal">
          <div className="br-terminalTop"><i/><i/><i/><span>career.config.ts</span></div>
          <code><b>target</b>: <em>Backend / Software Engineer</em><br/><b>market</b>: <em>Makkah + Jeddah</em><br/><b>primary</b>: <em>TypeScript · Node · NestJS</em><br/><b>database</b>: <em>PostgreSQL · Redis</em><br/><b>production</b>: <em>Docker · CI/CD · AWS</em><br/><b>deadline</b>: <em>30 days</em></code>
        </aside>
      </div>
      <div className="br-stack"><span>TypeScript</span><i>→</i><span>Node.js</span><i>→</i><span>NestJS</span><i>→</i><span>PostgreSQL</span><i>→</i><span>Redis</span><i>→</i><span>Docker</span><i>→</i><span>AWS</span></div>
    </header>

    <section className="br-progressStrip">
      <div><small>ROADMAP</small><strong>{phaseDone}<span>/20</span></strong><div className="br-miniBar"><i style={{width:`${roadmapPct}%`}}/></div></div>
      <div><small>SPRINT</small><strong>{sessionDone}<span>/120 sessions</span></strong><div className="br-miniBar"><i style={{width:`${learningPct}%`}}/></div></div>
      <div><small>DEEP WORK</small><strong>{hours}<span>/300h</span></strong><div className="br-miniBar"><i style={{width:`${learningPct}%`}}/></div></div>
    </section>

    <nav className="br-tabs" id="content">
      <button className={tab==='roadmap'?'active':''} onClick={()=>setTab('roadmap')}>Roadmap <span>20</span></button>
      <button className={tab==='sprint'?'active':''} onClick={()=>setTab('sprint')}>30-Day Sprint <span>300h</span></button>
      <button className={tab==='dashboard'?'active':''} onClick={()=>setTab('dashboard')}>Dashboard</button>
    </nav>

    {tab==='roadmap' && <section className="br-content">
      <div className="br-sectionHead"><div><p>THE EXACT ORDER</p><h2>خارطة الباك إند الثابتة</h2></div><p>لا تنتقلين للمرحلة التالية لأنك شفتي الفيديو. تنتقلين لما يطلع الـDeliverable بيدك.</p></div>
      <div className="br-gapCard"><Zap size={18}/><div><b>أشياء ما راح تسقط من الخطة</b><p>HTTP · REST/API Design · Auth/JWT/RBAC · Validation & Security · Swagger · Logging · Testing · Docker Compose · CI/CD · Observability</p></div></div>
      <div className="br-roadmap">
        {phases.map((p,idx)=>{
          const isOpen=open===p.id;
          return <article key={p.id} className={`br-phase ${p.accent} ${completed[p.id]?'done':''}`}>
            <div className="br-line"><span>{String(p.id).padStart(2,'0')}</span>{idx<phases.length-1&&<i/>}</div>
            <div className="br-phaseCard">
              <button className="br-phaseTop" onClick={()=>setOpen(isOpen?0:p.id)}>
                <div><small>{p.label}</small><h3>{p.title}</h3><p>{p.why}</p></div>
                <ChevronDown className={isOpen?'rot':''} size={20}/>
              </button>
              {isOpen&&<div className="br-phaseBody">
                <div><h4>وش لازم أعرف؟</h4><ul>{p.learn.map(x=><li key={x}><Check size={13}/>{x}</li>)}</ul></div>
                <div className="br-deliver"><small>EXIT GATE</small><b>المخرج المطلوب قبل الانتقال</b><p>{p.deliverable}</p></div>
                <div className="br-phaseActions">
                  {p.course&&<a href={p.course} target="_blank" rel="noreferrer"><Play size={14}/> فتح الكورس <ExternalLink size={12}/></a>}
                  {p.course2&&<a className="secondary" href={p.course2} target="_blank" rel="noreferrer">AWS الرسمي <ExternalLink size={12}/></a>}
                  <button className={completed[p.id]?'checked':''} onClick={()=>setCompleted(v=>({...v,[p.id]:!v[p.id]}))}><Check size={15}/>{completed[p.id]?'مكتملة':'علّميها مكتملة'}</button>
                </div>
              </div>}
            </div>
          </article>
        })}
      </div>
      <div className="br-finalGate">
        <div><p>HIRING READY GATE</p><h2>ما أعتبر نفسي خلصت إلا إذا...</h2></div>
        <div className="br-gateGrid">{['أبني REST API من الصفر بدون فيديو','أشرح Controller → Service → DB','أصمم PostgreSQL schema وعلاقات بنفسي','أسوي JWT/RBAC وأحمي الـAPI','أستخدم Redis وQueue لسبب واضح','أكتب Unit + E2E tests','أشغّل النظام بـDocker Compose','أسوي CI/CD وأنشر على AWS','أرسم System Design وأبرر قراراتي','عندي Final Project production-style'].map(x=><span key={x}><Check size={13}/>{x}</span>)}</div>
      </div>
    </section>}

    {tab==='sprint' && <section className="br-content">
      <div className="br-sectionHead"><div><p>10 HOURS / DAY</p><h2>الجدول القاسي — 30 يوم</h2></div><p>أربع جلسات Deep Work × 2.5 ساعة. البريكات ما تدخل في الـ300 ساعة.</p></div>
      <div className="br-dateCard">
        <div><label>تاريخ البداية</label><input type="date" value={start} onChange={e=>setStart(e.target.value)}/></div>
        <div className="br-arrow">←</div>
        <div><label>النهاية</label><strong>{end}</strong></div>
        <div className="br-todayBadge">{currentDay?`أنتِ في اليوم ${currentDay}`:'خارج نطاق الخطة حاليًا'}</div>
      </div>
      <div className="br-rhythm">
        <div><Timer size={17}/><b>08:00–10:30</b><span>جلسة 1</span></div><small>10:30–11:00 · بريك</small>
        <div><Timer size={17}/><b>11:00–13:30</b><span>جلسة 2</span></div><small>13:30–14:30 · غداء / صلاة</small>
        <div><Timer size={17}/><b>14:30–17:00</b><span>جلسة 3</span></div><small>17:00–17:30 · بريك</small>
        <div><Timer size={17}/><b>17:30–20:00</b><span>جلسة 4</span></div>
      </div>
      <div className="br-days">
        {days.map(d=>{
          const doneCount=d.sessions.filter((_,i)=>sessions[`${d.day}-${i}`]).length;
          return <article key={d.day} id={`day-${d.day}`} className={`br-day ${currentDay===d.day?'current':''} ${doneCount===4?'done':''}`}>
            <header><div className="br-dayNo">DAY <b>{String(d.day).padStart(2,'0')}</b></div><div><small>PHASE {d.phase}</small><h3>{d.title}</h3></div><strong>{doneCount}/4</strong></header>
            <div className="br-dayList">
              {d.sessions.map((s,i)=><div key={s} className={`br-session ${sessions[`${d.day}-${i}`]?'checked':''}`}>
                <time>{times[i]}</time><p><small>SESSION {i+1}</small>{s}</p><button aria-label="تم" onClick={()=>setSessions(v=>({...v,[`${d.day}-${i}`]:!v[`${d.day}-${i}`]}))}><Check size={17}/></button>
                {i<3&&<div className={`br-break ${breakDone[`${d.day}-${i}`]?'checked':''}`}><span>{breaks[i]}</span><button onClick={()=>setBreakDone(v=>({...v,[`${d.day}-${i}`]:!v[`${d.day}-${i}`]}))}>{breakDone[`${d.day}-${i}`]?'✓ تم':'تم؟'}</button></div>}
              </div>)}
            </div>
          </article>
        })}
      </div>
    </section>}

    {tab==='dashboard' && <section className="br-content">
      <div className="br-sectionHead"><div><p>PERSONAL CONTROL ROOM</p><h2>لوحة تقدمي</h2></div><p>كل البيانات تنحفظ محليًا على نفس المتصفح في جوالك.</p></div>
      <div className="br-dashGrid">
        <div className="br-bigStat"><Gauge/><small>SPRINT PROGRESS</small><strong>{learningPct}%</strong><p>{hours} من 300 ساعة دراسة فعلية</p><div className="br-bigBar"><i style={{width:`${learningPct}%`}}/></div></div>
        <div className="br-stat"><Target/><small>ROADMAP</small><strong>{phaseDone}/20</strong><p>مراحل مكتملة</p></div>
        <div className="br-stat"><Timer/><small>SESSIONS</small><strong>{sessionDone}/120</strong><p>جلسات Deep Work</p></div>
        <div className="br-stat"><Flame/><small>DEADLINE</small><strong>{end}</strong><p>نهاية الـ30 يوم</p></div>
      </div>
      <div className="br-nowCard">
        <p>NEXT ACTION</p><h3>{currentDay?`اليوم ${currentDay}: ${days[currentDay-1].title}`:'حددي تاريخ بداية مناسب'}</h3>
        {currentDay&&<button onClick={()=>{setTab('sprint');setTimeout(()=>document.getElementById(`day-${currentDay}`)?.scrollIntoView({behavior:'smooth'}),50)}}>افتح جدول اليوم</button>}
      </div>
      <div className="br-reset"><div><RotateCcw size={18}/><span><b>Reset</b><small>يمسح تقدم الموقع من هذا الجهاز فقط.</small></span></div><button onClick={reset}>إعادة ضبط كاملة</button></div>
      <a className="br-repo" href="https://github.com/8llo10" target="_blank" rel="noreferrer"><Github size={17}/> GitHub · 8llo10 <ExternalLink size={13}/></a>
    </section>}

    <footer className="br-footer"><span>GHALA // BACKEND ROADMAP</span><b>BUILD. BREAK. FIX. SHIP.</b><small>30 days · 300 focused hours</small></footer>

    <nav className="br-mobileNav">
      <button className={tab==='roadmap'?'active':''} onClick={()=>{setTab('roadmap');window.scrollTo({top:0,behavior:'smooth'})}}>Roadmap</button>
      <button className={tab==='sprint'?'active':''} onClick={()=>{setTab('sprint');window.scrollTo({top:0,behavior:'smooth'})}}>30 Days</button>
      <button className={tab==='dashboard'?'active':''} onClick={()=>{setTab('dashboard');window.scrollTo({top:0,behavior:'smooth'})}}>Progress</button>
    </nav>
  </main>;
}
