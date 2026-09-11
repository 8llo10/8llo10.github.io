'use client';

import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Database, Github, Linkedin, Mail, MapPin, Phone, Plus, ServerCog, Sparkles, Star, Workflow, X } from 'lucide-react';
import { Project, supabase } from '../lib/supabase';

const fallback: Project[] = [
  {id:'tnabbah',title:'TNABBAH',subtitle:'Smart Vehicle Diagnostics',description:'Real-vehicle diagnostics with BLE OBD-II, live ECU telemetry, DTC analysis, maintenance workflows, multi-vehicle context and backend diagnostic services.',tags:['React Native','FastAPI','MQTT','PostgreSQL','BLE'],image_url:'/projects/tnabbah.jpg',featured:true,sort_order:1},
  {id:'madad',title:'MADAD',subtitle:'Field Operations Orchestration',description:'Operational command system for incidents, teams, resources and SLA-aware dispatch ranking with a real backend, database and realtime workflows.',tags:['Next.js','Express','Prisma','PostgreSQL','Realtime'],image_url:'/projects/madad.jpg',featured:true,sort_order:2},
  {id:'switchboard',title:'SWITCHBOARD',subtitle:'Visual IT Automation Builder',description:'Drag-and-drop IT workflows backed by an execution-engine architecture for HTTP, databases, PowerShell, SSH, approvals, conditions and scheduled triggers.',tags:['Next.js','Node.js','Docker','Automation'],image_url:'/projects/switchboard.jpg',featured:true,sort_order:3},
  {id:'hiremail',title:'HireMail AI',subtitle:'Intelligent Career Email Classification & Opportunity Tracking',description:'Gmail-integrated platform that classifies professional emails and organizes interviews, offers, assessments and career opportunities in one dashboard.',tags:['Next.js','Gmail API','OAuth','PostgreSQL'],image_url:'/projects/hiremail.jpg',live_url:'https://hiremail-ai-v2-omega.vercel.app',sort_order:4},
  {id:'proof',title:'PROOF',subtitle:'Decision Evidence Registry · سجل إثبات القرارات',description:'A verifiable decision-evidence platform for property and contractor workflows, turning approvals and important decisions into traceable records with parties, evidence and status.',tags:['Full-Stack','Workflow','Audit Trail','Decision Records'],image_url:'/projects/proof.jpg',live_url:'https://proof-verifiable-decision-platform.vercel.app/',sort_order:5},
];

const stack=['TypeScript','JavaScript','Python','React','Next.js','React Native','Node.js','Express','FastAPI','REST APIs','PostgreSQL','Supabase','Prisma','Docker','MQTT','OAuth','GitHub','Vercel'];
const commandCenter='https://project-command-center-l6qiq2x08-ghala-alameer-s-projects.vercel.app/admin';

function ProjectVisual({project}:{project:Project}){
  const [failed,setFailed]=useState(false);
  return <div className="posterVisual">
    {project.image_url && !failed ? <img src={project.image_url} alt={`${project.title} interface`} onError={()=>setFailed(true)}/> : <><div className="fakeWindow"><i/><i/><i/></div><span>ADD PROJECT VISUAL</span></>}
  </div>;
}

function PortraitVisual(){
  const [failed,setFailed]=useState(false);
  return <div className="portrait placeholder">
    {!failed ? <img src="/images/profile.jpg" alt="Ghala Al-Hashmi Al-Ameer" onError={()=>setFailed(true)}/> : <span>YOUR PHOTO<br/>GOES HERE</span>}
  </div>;
}

export default function Home(){
  const [projects,setProjects]=useState<Project[]>(fallback);
  const [open,setOpen]=useState(false);
  const [admin,setAdmin]=useState(false);
  const [login,setLogin]=useState(false);
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  useEffect(()=>{
    if(!supabase)return;
    supabase.from('projects').select('*').order('sort_order').then(({data})=>{if(data?.length)setProjects(data)});
    supabase.auth.getSession().then(({data})=>setAdmin(!!data.session));
  },[]);

  async function signIn(e:FormEvent){
    e.preventDefault();
    if(!supabase)return alert('Connect Supabase first.');
    const {error}=await supabase.auth.signInWithPassword({email,password});
    if(error)return alert(error.message);
    setAdmin(true);setLogin(false);
  }

  async function addProject(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(!supabase)return alert('Connect Supabase first.');
    const f=new FormData(e.currentTarget);
    const item={title:f.get('title'),subtitle:f.get('subtitle'),description:f.get('description'),image_url:f.get('image_url'),live_url:f.get('live_url'),github_url:f.get('github_url'),tags:String(f.get('tags')||'').split(',').map(x=>x.trim()).filter(Boolean),sort_order:projects.length+1};
    const {data,error}=await supabase.from('projects').insert(item).select().single();
    if(error)return alert(error.message);
    setProjects(p=>[...p,data]);setOpen(false);
  }

  return <main>
    <nav>
      <a className="mark" href="#top">G.</a>
      <div className="navlinks"><a href="#about">ABOUT</a><a href="#hub">OUR HUB</a><a href="#proof">ENGINEERING</a><a href="#experience">EXPERIENCE</a><a href="#contact">CONTACT</a></div>
      <button className="owner" onClick={()=>admin?setOpen(true):setLogin(true)}>{admin?<><Plus size={14}/> ADD PROJECT</>:'OWNER'}</button>
    </nav>

    <section id="top" className="hero">
      <div className="dotField"/><div className="orb orb1"/><div className="orb orb2"/>
      <div className="topline"><span>SOFTWARE ENGINEER · FULL-STACK · BACKEND</span><span>PORTFOLIO / 2026</span></div>
      <motion.div className="heroTitle" initial={{opacity:0,y:45}} animate={{opacity:1,y:0}} transition={{duration:.8}}><span>PORT</span><span>FOLIO</span></motion.div>
      <div className="heroCollage">
        <motion.div className="introCard stickerCard" initial={{rotate:-3,opacity:0}} animate={{rotate:-2,opacity:1}}><span className="tape tapeA"/><p className="eyebrow">HELLO, I&apos;M</p><h1>GHALA<br/><i>AL-HASHMI</i></h1><p className="introText">I build full-stack products with real backend logic, databases, integrations, authentication and deployment — not interface-only demos.</p><div className="scribble">build → test → ship ✦</div></motion.div>
        <motion.div className="portraitFrame" initial={{scale:.92,opacity:0}} animate={{scale:1,opacity:1}}><PortraitVisual/><div className="photoTag">SOFTWARE ENGINEER</div></motion.div>
        <div className="miniCard"><Sparkles size={18}/><b>BACKEND × FULL-STACK</b><small>REAL SYSTEMS · REAL DEPLOYMENTS</small></div>
        <div className="yearBadge"><span>BASED IN</span><strong>KSA</strong><span>BUILD · SHIP · SOLVE</span></div>
        <div className="scrollHint"><ArrowDownRight/> SCROLL TO EXPLORE</div>
      </div>
    </section>

    <section id="about" className="about paperTexture">
      <div className="sectionStamp">01 / PROFILE</div>
      <div className="aboutPoster">
        <div className="aboutLeft"><p className="eyebrow">A LITTLE ABOUT ME</p><h2>I MAKE<br/><span>COMPLEX THINGS</span><br/>FEEL SIMPLE.</h2><div className="quoteBox">“Not just interfaces — systems that actually do the work.”</div></div>
        <div className="aboutRight"><div className="infoBox"><span>ROLE</span><b>Software Engineer · Full-Stack Developer · Product Builder</b></div><div className="infoBox"><span>FOCUS</span><b>Backend · APIs · Databases · Integrations · Automation</b></div><p>I work across the complete product path: data modeling, backend services, authentication, APIs, realtime flows, frontend integration and deployment.</p><p>My projects include connected vehicle systems, field operations, workflow automation, Gmail integrations and decision evidence products.</p></div>
        <div className="spark s1">✦</div><div className="spark s2">✦</div>
      </div>
    </section>

    <section className="skillsBand"><div className="marquee">{[...stack,...stack].map((s,i)=><span key={i}>{s}<Star size={10} fill="currentColor"/></span>)}</div></section>

    <section id="hub" className="hub">
      <div className="hubHeader"><div><span className="sectionStamp light">02 / LIVE + BUILT WORK</span><h2>OUR <i>HUB</i></h2></div><div><p>A collection of systems I&apos;ve built and shipped. The command center links to the work currently in progress so the portfolio shows both finished systems and active building.</p><a className="progressLink" href={commandCenter} target="_blank">OPEN PROJECT COMMAND CENTER <ArrowUpRight size={15}/></a></div></div>
      <div className="projectMasonry">{projects.map((p,i)=><motion.article key={p.id} className={`projectPoster poster${(i%5)+1}`} initial={{opacity:0,y:45,rotate:i%2?2:-2}} whileInView={{opacity:1,y:0,rotate:i%2?1:-1}} viewport={{once:true,amount:.2}}><div className="posterNumber">{String(i+1).padStart(2,'0')}</div><ProjectVisual project={p}/><div className="posterCopy"><small>{p.subtitle}</small><h3>{p.title}</h3><p>{p.description}</p><div className="tags">{p.tags?.map(t=><span key={t}>{t}</span>)}</div><div className="links">{p.live_url&&<a href={p.live_url} target="_blank">VIEW LIVE <ArrowUpRight size={14}/></a>}{p.github_url&&<a href={p.github_url} target="_blank">GITHUB <Github size={14}/></a>}</div></div><div className="pin">✦</div></motion.article>)}</div>
    </section>

    <section id="proof" className="experienceSection paperTexture">
      <span className="sectionStamp">03 / ENGINEERING PROOF</span>
      <div className="experienceGrid">
        <div className="experienceMain"><h2>BEYOND<br/><i>THE UI.</i></h2><div className="timeline"><span className="line"/>
          <div className="timelineItem"><b>BACKEND ENGINEERING</b><small>FastAPI · Express · REST · Auth · OAuth</small><p>Designed server-side services for authentication, user flows, vehicle diagnostics, operational dispatch, Gmail ingestion and project workflows — including permission-aware logic and external integrations.</p></div>
          <div className="timelineItem proofItem"><b>DATA & SYSTEM DESIGN</b><small>PostgreSQL · Supabase · Prisma · SQL · RLS</small><p>Built relational schemas, ERDs, migrations, row-level security, repository/data-access layers and domain models that support actual system behavior rather than static screens.</p></div>
          <div className="timelineItem proofItem"><b>REALTIME + CONNECTED SYSTEMS</b><small>MQTT · BLE OBD-II · Realtime · Webhooks</small><p>Worked with live telemetry, hardware-connected vehicle data, event-driven updates and multi-service communication — proving full-stack work beyond CRUD dashboards.</p></div>
          <div className="timelineItem proofItem"><b>SHIP & OPERATE</b><small>Docker · VPS · Vercel · Render · GitHub</small><p>Integrated, tested and deployed systems end-to-end. The live projects in Our Hub are direct proof that the work reaches production, not just local prototypes.</p></div>
        </div></div>
        <div className="toolPoster"><span className="tape tapeB"/><p className="eyebrow">SYSTEM LAYERS I WORK ACROSS</p><div className="proofIcons"><ServerCog/><Database/><Workflow/></div><div className="toolCloud">{stack.map(s=><span key={s}>{s}</span>)}</div><div className="tinyNote">frontend is the surface. the system is underneath.</div></div>
      </div>
    </section>

    <section id="experience" className="experienceSection paperTexture">
      <span className="sectionStamp">04 / EXPERIENCE</span>
      <div className="experienceGrid"><div className="experienceMain"><h2>WORK THAT<br/><i>LEFT A MARK.</i></h2><div className="timeline"><span className="line"/><div className="timelineItem"><b>PRINCE SULTAN AVIATION ACADEMY</b><small>Maintenance & Simulators · Software Engineering Trainee</small><p>Digitized paper-heavy maintenance workflows, migrated legacy Microsoft Access data into Power Apps + Dataverse, automated operational calculations and delivered a unified interface deployed to the official server.</p></div></div></div><div className="toolPoster"><span className="tape tapeB"/><p className="eyebrow">CURRENT BUILD SPACE</p><h3>PROJECT<br/>COMMAND CENTER</h3><p>Follow the systems currently being built and their progress from one place.</p><a className="progressLink dark" href={commandCenter} target="_blank">VIEW OUR PROGRESS <ArrowUpRight size={15}/></a></div></div>
    </section>

    <footer id="contact"><div className="footerStar">✦</div><div><p className="script">Have something worth building?</p><h2>LET&apos;S MAKE<br/>IT REAL.</h2></div><div className="footerLinks"><a href="mailto:ghalaalameer8@gmail.com"><Mail/>ghalaalameer8@gmail.com</a><a href="tel:+966560602239"><Phone/>+966 56 060 2239</a><a href="https://github.com/8llo10" target="_blank"><Github/>github.com/8llo10</a><a href="https://www.linkedin.com/in/ghala-abdullah-alameer-541733373" target="_blank"><Linkedin/>LINKEDIN</a><span><MapPin/>MAKKAH · JEDDAH</span></div></footer>

    {(login||open)&&<div className="modalBack"><div className="modal"><button className="close" onClick={()=>{setLogin(false);setOpen(false)}}><X/></button>{login?<form onSubmit={signIn}><small>PRIVATE AREA</small><h3>Owner access</h3><input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><button>ENTER</button></form>:<form onSubmit={addProject}><small>OUR HUB / CMS</small><h3>Add a project</h3><input name="title" placeholder="Project title" required/><input name="subtitle" placeholder="Short subtitle"/><textarea name="description" placeholder="What did you build?" required/><input name="tags" placeholder="Tags, comma, separated"/><input name="image_url" placeholder="Image URL (optional)"/><input name="live_url" placeholder="Live project URL"/><input name="github_url" placeholder="GitHub URL"/><button>PUBLISH PROJECT</button></form>}</div></div>}
  </main>;
}
