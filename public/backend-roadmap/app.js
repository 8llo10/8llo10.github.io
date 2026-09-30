const STORAGE='backend-launchpad-v1';
const statusOptions=['لم أقدم','جهزت التقديم','قدمت','متابعة','مقابلة','عرض','مرفوضة','مغلقة'];
const defaults={
  phases:[
    {id:'p1',period:'28 Sep – 7 Oct',title:'System Design overview + JavaScript + TypeScript + Git',tech:'نبني الأساس بسرعة بدون غرق في التفاصيل.',job:'Future Skills + تمهير + تقديم فوري على الفرص الحالية',tasks:[
      {id:'p1t1',title:'System Design overview',proof:'افهمي Single Server · DB types · scaling · load balancer · APIs — مشاهدة وفهم فقط',done:false},
      {id:'p1t2',title:'JavaScript fundamentals',proof:'Functions · arrays · objects · loops · async basics مع تمارين مكتوبة بيدك',done:false},
      {id:'p1t3',title:'TypeScript fundamentals',proof:'Types · interfaces · generics · narrowing وتحويل مشروع JS صغير إلى TS',done:false},
      {id:'p1t4',title:'Git + GitHub workflow',proof:'Commits نظيفة · branches · README · push لمشروع حقيقي',done:false},
      {id:'p1t5',title:'سجلي في Future Skills + تمهير',proof:'الحسابات جاهزة والملف مكتمل بدل الانتظار',done:false},
      {id:'p1t6',title:'قدمي على flyadeal / Medical Data / Koraspond',proof:'التقديم يبدأ بالموجود قبل اكتمال الرودماب',done:false}
    ]},
    {id:'p2',period:'8 – 15 Oct',title:'Node.js + Express + HTTP + REST + Auth',tech:'أول Backend API حقيقي منشور.',job:'Software Engineer · API · Application roles',tasks:[
      {id:'p2t1',title:'Node.js runtime + modules + async model',proof:'فهم event loop واستخدام env/modules بدون نسخ أعمى',done:false},
      {id:'p2t2',title:'HTTP + REST + status codes',proof:'request/response · headers · params · query · body',done:false},
      {id:'p2t3',title:'Express API',proof:'Routes · middleware · controllers · centralized errors',done:false},
      {id:'p2t4',title:'Authentication basics',proof:'password hashing + JWT + protected route',done:false},
      {id:'p2t5',title:'Project #1: Production-style API',proof:'README + Postman collection + validation + deploy',done:false},
      {id:'p2t6',title:'قدمي يوميًا على Backend / API / App Dev',proof:'لا تربطين التقديم بإنهاء المشروع 100%',done:false}
    ]},
    {id:'p3',period:'16 – 23 Oct',title:'PostgreSQL + SQL + NestJS + Prisma',tech:'قاعدة بيانات حقيقية + Backend منظم.',job:'استهداف Salla / Bupa / Lucidya ومراسلة Engineers وRecruiters',tasks:[
      {id:'p3t1',title:'SQL قبل ORM',proof:'SELECT · JOIN · GROUP BY · constraints · transactions',done:false},
      {id:'p3t2',title:'PostgreSQL schema design',proof:'relations · indexes basics · normalization',done:false},
      {id:'p3t3',title:'NestJS fundamentals',proof:'modules · controllers · services · DI · DTOs',done:false},
      {id:'p3t4',title:'Prisma + migrations',proof:'schema · relations · migrations · queries',done:false},
      {id:'p3t5',title:'Project #2: NestJS + PostgreSQL',proof:'Auth + CRUD + relations + documented API',done:false},
      {id:'p3t6',title:'10 رسائل Networking موجهة',proof:'Recruiters / Engineers داخل الشركات المستهدفة برسالة قصيرة محترمة',done:false}
    ]},
    {id:'p4',period:'24 – 31 Oct',title:'JWT/RBAC + Testing + Redis + Docker',tech:'ننقل المشروع من “يشتغل” إلى “يشبه production”.',job:'CV جديد + مشروع Backend منشور فعليًا',tasks:[
      {id:'p4t1',title:'JWT + RBAC',proof:'roles · guards · permissions · ownership rules',done:false},
      {id:'p4t2',title:'Testing',proof:'unit + integration/API tests للحالات المهمة',done:false},
      {id:'p4t3',title:'Redis fundamentals',proof:'caching strategy + TTL + invalidation basics',done:false},
      {id:'p4t4',title:'Docker',proof:'Dockerfile + compose محلي للتطبيق وقاعدة البيانات عند الحاجة',done:false},
      {id:'p4t5',title:'Deploy Project #2',proof:'Live URL + env management + health endpoint',done:false},
      {id:'p4t6',title:'تحديث CV وLinkedIn',proof:'Backend identity + مشاريع قابلة للقياس وروابط مباشرة',done:false}
    ]},
    {id:'p5',period:'1 – 15 Nov',title:'BullMQ + WebSockets + CI/CD + AWS',tech:'مهارات أنظمة عملية تعطيك فرق عن Fresh Grad عادي.',job:'مقابلات تقنية + System Design basics + استمرار التقديم',tasks:[
      {id:'p5t1',title:'Background jobs with BullMQ',proof:'queue · worker · retry · delayed job',done:false},
      {id:'p5t2',title:'WebSockets',proof:'real-time event flow + reconnect/error handling basics',done:false},
      {id:'p5t3',title:'CI/CD',proof:'pipeline يبني ويختبر قبل النشر',done:false},
      {id:'p5t4',title:'AWS basics',proof:'compute/storage/networking/IAM على مستوى مطلوب للخريج',done:false},
      {id:'p5t5',title:'Mock Interview #1',proof:'JS/TS + Node + REST + SQL + مشروعك',done:false},
      {id:'p5t6',title:'استمرار التقديم والمتابعة',proof:'متابعة الطلبات القديمة + فرص جديدة يوميًا',done:false}
    ]},
    {id:'p6',period:'16 – 30 Nov',title:'System Design pass 2 + Capstone مستقل',tech:'نربط كل القطع في نظام واحد تدافعين عنه بالمقابلة.',job:'Mock interviews + أقوى موجة تقديم',tasks:[
      {id:'p6t1',title:'System Design pass 2',proof:'scaling · caching · queues · DB choices · load balancing على ضوء خبرتك الجديدة',done:false},
      {id:'p6t2',title:'اختاري Capstone يحل مشكلة فعلية',proof:'متطلبات واضحة + architecture + backlog',done:false},
      {id:'p6t3',title:'ابني Capstone بدون اعتماد كامل على AI',proof:'أنتِ تشرحين كل قرار وكل endpoint وكل table',done:false},
      {id:'p6t4',title:'Production polish',proof:'tests · Docker · CI/CD · logging · docs · deploy',done:false},
      {id:'p6t5',title:'Mock Interview #2 و #3',proof:'Behavioral + backend + system design basics',done:false},
      {id:'p6t6',title:'أقوى موجة تقديم',proof:'Backend + Software Engineer + API + Integration + Technical trainee',done:false}
    ]}
  ],
  jobs:[
    {id:'j1',company:'مهارات المستقبل — MCIT',role:'مسار دعم التوظيف + تدريب تقني',city:'Online / KSA',type:'أولوية قصوى',priority:'hot',state:'لم أقدم',url:'https://futureskills.mcit.gov.sa/ar/seekers-faq',note:'يستهدف حديثي التخرج أو المنقطعين عن العمل 3 أشهر فأكثر في تخصصات ICT.',personal:''},
    {id:'j2',company:'تمهير — هدف',role:'Graduate Development / فرص تقنية',city:'مكة + جدة',type:'أولوية قصوى',priority:'hot',state:'لم أقدم',url:'https://www.hrdf.org.sa/products-and-services/programs/individuals/training/graduate-development/',note:'3–6 أشهر ومكافأة 3000 ريال؛ قدمي على أكثر من فرصة في نفس الوقت.',personal:''},
    {id:'j3',company:'flyadeal',role:'Graduate Development Program – Tamheer',city:'جدة',type:'مفتوح على صفحة الوظائف',priority:'hot',state:'لم أقدم',url:'https://careers.flyadeal.com/?langcode=en',note:'البرنامج يشمل Information Technology & Cybersecurity ضمن الأقسام.',personal:''},
    {id:'j4',company:'Medical Data Ltd.',role:'JavaScript Developer',city:'جدة · On-site',type:'Entry Level',priority:'hot',state:'لم أقدم',url:'https://sa.linkedin.com/jobs/view/javascript-developer-at-medical-data-ltd-4469433716',note:'Frontend + back-end services + APIs + integrations + testing + Git. قدمي الآن.',personal:''},
    {id:'j5',company:'Lucidya',role:'Frontend Software Engineer — Saudi Only',city:'جدة · Hybrid',type:'Engineering Team',priority:'hot',state:'لم أقدم',url:'https://apply.workable.com/lucidya/j/8120FF802B/',note:'مو Backend صريح، لكنه Software Engineering حقيقي مع REST وWebSockets وTypeScript.',personal:''},
    {id:'j6',company:'Koraspond / Kodeflix',role:'Junior Technology Solutions & Project Coordinator',city:'مكة / جدة',type:'Fresh Graduate',priority:'hot',state:'لم أقدم',url:'https://sa.linkedin.com/jobs/view/junior-technology-solutions-project-coordinator-at-koraspond-360%C2%B0-marketing-and-technology-company-4467331779',note:'Web · Mobile · AI · Cloud · Cybersecurity مع تنسيق تقني وPre-sales.',personal:''},
    {id:'j7',company:'Salla',role:'Technology openings + APM/DBA Tamheer watch',city:'مكة + جدة',type:'Target طويل المدى',priority:'watch',state:'لم أقدم',url:'https://salla-carrer.webflow.io/',note:'راقبي Backend/Database/Engineering openings باستمرار. السلم التقني موجود محليًا.',personal:''},
    {id:'j8',company:'Bupa Arabia',role:'Technology Tamheer Watchlist',city:'جدة',type:'Watchlist',priority:'watch',state:'لم أقدم',url:'https://careers.bupa.com.sa/en/company/bupa-arabia-1975070/',note:'إعلان API Development السابق مغلق؛ راقبي فرص API/Web/System/Data الجديدة بدل التقديم على إعلان منتهي.',personal:''}
  ]
};

function clone(x){return JSON.parse(JSON.stringify(x))}
function load(){try{const x=JSON.parse(localStorage.getItem(STORAGE)||'null');return x&&x.phases&&x.jobs?x:clone(defaults)}catch{return clone(defaults)}}
let state=load();
function save(){localStorage.setItem(STORAGE,JSON.stringify(state));render()}
function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function safeUrl(v=''){try{const u=new URL(v,location.href);return ['http:','https:'].includes(u.protocol)?u.href:'#'}catch{return '#'}}
function id(){return 'x'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1800)}

function stats(){
  const tasks=state.phases.flatMap(p=>p.tasks); const done=tasks.filter(t=>t.done).length; const pct=tasks.length?Math.round(done/tasks.length*100):0;
  const apps=state.jobs.filter(j=>['قدمت','متابعة','مقابلة','عرض','مرفوضة'].includes(j.state)).length;
  const interviews=state.jobs.filter(j=>['مقابلة','عرض'].includes(j.state)).length;
  const next=tasks.find(t=>!t.done);
  return {tasks,done,pct,apps,interviews,next};
}

function render(){
  const s=stats();
  document.getElementById('overallMetric').textContent=s.pct+'%';
  document.getElementById('doneMetric').textContent=`${s.done} من ${s.tasks.length} مهمة مكتملة`;
  document.getElementById('applicationsMetric').textContent=s.apps;
  document.getElementById('interviewsMetric').textContent=s.interviews;
  document.getElementById('pct').textContent=s.pct+'%';
  document.getElementById('ring').style.setProperty('--p',s.pct);
  document.getElementById('bar').style.width=s.pct+'%';
  document.getElementById('nextTitle').textContent=s.next?s.next.title:'الرودماب مكتمل — ركزي على المقابلات والتقديم';
  document.getElementById('nextDesc').textContent=s.next?s.next.proof:'كل المهام التقنية في النسخة الحالية من الخطة مكتملة.';

  const tl=document.getElementById('timeline'); tl.innerHTML=state.phases.map((p,pi)=>{
    const d=p.tasks.filter(t=>t.done).length, pct=p.tasks.length?Math.round(d/p.tasks.length*100):0;
    return `<article class="card phase">
      <div class="phaseTop"><div class="period"><b>${esc(p.period)}</b><small>المرحلة ${pi+1}</small></div><div class="phaseTitle"><h3>${esc(p.title)}</h3><p>${esc(p.tech)}</p><div class="phaseGoal"><b>هدف التوظيف:</b> ${esc(p.job)}</div></div><div class="phasePct"><strong>${pct}%</strong><small>${d}/${p.tasks.length}</small></div></div>
      <div class="tasks">${p.tasks.map(t=>`<div class="task ${t.done?'done':''}"><button class="check" data-action="toggle" data-p="${p.id}" data-t="${t.id}" aria-label="تبديل حالة المهمة">${t.done?'✓':'○'}</button><div class="taskText"><b>${esc(t.title)}</b><small>${esc(t.proof)}</small></div><div class="miniActions"><button class="iconBtn" data-action="edit-task" data-p="${p.id}" data-t="${t.id}" title="تعديل">✎</button><button class="iconBtn" data-action="delete-task" data-p="${p.id}" data-t="${t.id}" title="حذف">×</button></div></div>`).join('')}</div>
      <div class="phaseFooter"><span>تقدرين تعدلين المهام أو تضيفين عليها حسب تقدمك الحقيقي.</span><div><button class="btn" data-action="add-task" data-p="${p.id}">+ مهمة</button> <button class="btn" data-action="edit-phase" data-p="${p.id}">تعديل المرحلة</button></div></div>
    </article>`
  }).join('');

  const grid=document.getElementById('jobsGrid'); grid.innerHTML=state.jobs.map(j=>`<article class="card job ${['قدمت','متابعة','مقابلة','عرض'].includes(j.state)?'saved':''}">
    <div class="jobHead"><div><h3>${esc(j.company)}</h3><div class="role">${esc(j.role)}</div></div><div class="badges"><span class="badge ${j.priority==='hot'?'hot':'watch'}">${esc(j.type)}</span><span class="badge">${esc(j.city)}</span></div></div>
    <p>${esc(j.note)}</p>
    <div class="jobControls"><select data-job-state="${j.id}">${statusOptions.map(o=>`<option ${o===j.state?'selected':''}>${esc(o)}</option>`).join('')}</select><a class="open" target="_blank" rel="noopener" href="${safeUrl(j.url)}">فتح الرابط ↗</a></div>
    <textarea data-job-note="${j.id}" placeholder="ملاحظتي: تاريخ التقديم، اسم Recruiter، موعد المتابعة...">${esc(j.personal||'')}</textarea>
    <div class="jobMeta"><button class="iconBtn" data-action="edit-job" data-j="${j.id}">✎</button> <button class="iconBtn" data-action="delete-job" data-j="${j.id}">×</button> · الحالة تحفظ تلقائيًا</div>
  </article>`).join('');
}

function ask(label,current=''){const v=prompt(label,current);return v===null?null:v.trim()}
function phaseBy(id){return state.phases.find(p=>p.id===id)}
function jobBy(id){return state.jobs.find(j=>j.id===id)}

document.addEventListener('click',e=>{
  const el=e.target.closest('[data-action]'); if(!el)return;
  const a=el.dataset.action;
  if(a==='toggle'){const p=phaseBy(el.dataset.p),t=p?.tasks.find(x=>x.id===el.dataset.t);if(t){t.done=!t.done;save()}}
  if(a==='add-task'){const p=phaseBy(el.dataset.p);if(!p)return;const title=ask('اسم المهمة الجديدة');if(!title)return;const proof=ask('وش الدليل/المخرج المطلوب من المهمة؟','');p.tasks.push({id:id(),title,proof:proof||'',done:false});save()}
  if(a==='edit-task'){const p=phaseBy(el.dataset.p),t=p?.tasks.find(x=>x.id===el.dataset.t);if(!t)return;const title=ask('عدلي اسم المهمة',t.title);if(title===null||!title)return;const proof=ask('عدلي المطلوب/الدليل',t.proof);if(proof===null)return;t.title=title;t.proof=proof;save()}
  if(a==='delete-task'){const p=phaseBy(el.dataset.p);if(!p||!confirm('تحذفين هذه المهمة؟'))return;p.tasks=p.tasks.filter(x=>x.id!==el.dataset.t);save()}
  if(a==='edit-phase'){const p=phaseBy(el.dataset.p);if(!p)return;const period=ask('الفترة',p.period);if(period===null)return;const title=ask('عنوان المرحلة',p.title);if(title===null||!title)return;const tech=ask('الهدف التقني',p.tech);if(tech===null)return;const job=ask('هدف التوظيف',p.job);if(job===null)return;Object.assign(p,{period,title,tech,job});save()}
  if(a==='edit-job'){const j=jobBy(el.dataset.j);if(!j)return;const company=ask('الشركة',j.company);if(company===null||!company)return;const role=ask('المسمى/الهدف',j.role);if(role===null)return;const city=ask('المدينة',j.city);if(city===null)return;const url=ask('الرابط',j.url);if(url===null)return;Object.assign(j,{company,role,city,url});save()}
  if(a==='delete-job'){if(!confirm('تحذفين هذه الفرصة من اللوحة؟'))return;state.jobs=state.jobs.filter(x=>x.id!==el.dataset.j);save()}
});

document.addEventListener('change',e=>{if(e.target.matches('[data-job-state]')){const j=jobBy(e.target.dataset.jobState);if(j){j.state=e.target.value;save()}}});
document.addEventListener('input',e=>{if(e.target.matches('[data-job-note]')){const j=jobBy(e.target.dataset.jobNote);if(j){j.personal=e.target.value;localStorage.setItem(STORAGE,JSON.stringify(state))}}});

document.getElementById('addPhaseBtn').onclick=()=>{const period=ask('الفترة (مثال: 1–7 Dec)');if(!period)return;const title=ask('عنوان المرحلة');if(!title)return;const tech=ask('الهدف التقني','');if(tech===null)return;const job=ask('هدف التوظيف','');if(job===null)return;state.phases.push({id:id(),period,title,tech,job,tasks:[]});save()};
document.getElementById('addJobBtn').onclick=()=>{const company=ask('اسم الشركة');if(!company)return;const role=ask('المسمى أو نوع الفرصة','');if(role===null)return;const city=ask('المدينة','جدة');if(city===null)return;const url=ask('رابط الفرصة','https://');if(url===null)return;state.jobs.push({id:id(),company,role,city,type:'مخصصة',priority:'watch',state:'لم أقدم',url,note:'فرصة أضفتها يدويًا.',personal:''});save()};
document.getElementById('shareBtn').onclick=async()=>{try{await navigator.clipboard.writeText(location.href.split('#')[0]);toast('تم نسخ رابط الموقع')}catch{prompt('انسخي الرابط',location.href.split('#')[0])}};
document.getElementById('exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='backend-launchpad-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);toast('تم تصدير نسخة من تقدمك')};
document.getElementById('importInput').onchange=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x.phases||!x.jobs)throw 0;state=x;save();toast('تم استيراد النسخة')}catch{alert('الملف غير صالح')}};r.readAsText(f);e.target.value=''};
document.getElementById('resetBtn').onclick=()=>{if(confirm('ترجعين الخطة للوضع الأصلي؟ راح ينمسح التشييك والملاحظات المحلية.')){state=clone(defaults);save();toast('تمت إعادة الضبط')}};
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.go)?.scrollIntoView({behavior:'smooth'}));
render();
