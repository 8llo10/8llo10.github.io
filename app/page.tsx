'use client';

import { FormEvent, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Github, Linkedin, Mail, MapPin, Plus, Sparkles, Star, X } from 'lucide-react';
import { Project, supabase } from '../lib/supabase';

const fallback: Project[] = [
  {id:'tnabbah',title:'TNABBAH',subtitle:'Smart Vehicle Diagnostics',description:'Real-vehicle diagnostics, live OBD-II telemetry, intelligent reports, maintenance wallet and a vehicle-aware assistant.',tags:['React Native','FastAPI','MQTT','PostgreSQL'],featured:true,sort_order:1},
  {id:'madad',title:'MADAD',subtitle:'Field Operations Orchestration',description:'Incident management, intelligent dispatch ranking, teams, resources, SLA-aware operations and real-time command dashboards.',tags:['Next.js','Express','Prisma','PostgreSQL'],featured:true,sort_order:2},
  {id:'switchboard',title:'SWITCHBOARD',subtitle:'Visual IT Automation Builder',description:'Drag-and-drop IT workflows backed by a real execution engine for HTTP, databases, PowerShell, SSH, approvals and more.',tags:['Next.js','Node.js','Docker','Automation'],featured:true,sort_order:3},
  {id:'inboxa',title:'INBOXA',subtitle:'Recruitment Inbox Filter',description:'A bilingual recruitment inbox that detects professional opportunities, classifies messages and extracts useful details.',tags:['Next.js','Gmail API','PostgreSQL','OAuth'],sort_order:4},
  {id:'nexus',title:'NEXUS',subtitle:'IT Infrastructure & Operations Center',description:'Enterprise IT lab combining identity, network services, monitoring, assets, security logs, backup and PowerShell automation.',tags:['Windows Server','Active Directory','PowerShell','Monitoring'],sort_order:5},
];

const stack = ['TypeScript','JavaScript','Python','React','Next.js','React Native','Node.js','Express','FastAPI','PostgreSQL','Supabase','Docker','PowerShell','Windows Server','MQTT','GitHub','Vercel'];

export default function Home(){
 const [projects,setProjects]=useState<Project[]>(fallback); const [open,setOpen]=useState(false); const [admin,setAdmin]=useState(false); const [login,setLogin]=useState(false); const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
 useEffect(()=>{ if(!supabase)return; supabase.from('projects').select('*').order('sort_order').then(({data})=>{if(data?.length)setProjects(data)}); supabase.auth.getSession().then(({data})=>setAdmin(!!data.session)); },[]);
 async function signIn(e:FormEvent){e.preventDefault(); if(!supabase)return alert('Connect Supabase first.'); const {error}=await supabase.auth.signInWithPassword({email,password}); if(error)return alert(error.message); setAdmin(true);setLogin(false)}
 async function addProject(e:FormEvent<HTMLFormElement>){e.preventDefault(); if(!supabase)return alert('Connect Supabase first.'); const f=new FormData(e.currentTarget); const item={title:f.get('title'),subtitle:f.get('subtitle'),description:f.get('description'),image_url:f.get('image_url'),live_url:f.get('live_url'),github_url:f.get('github_url'),tags:String(f.get('tags')||'').split(',').map(x=>x.trim()).filter(Boolean),sort_order:projects.length+1}; const {data,error}=await supabase.from('projects').insert(item).select().single(); if(error)return alert(error.message); setProjects(p=>[...p,data]);setOpen(false)}

 return <main>
  <nav><a className="mark" href="#top">G.</a><div className="navlinks"><a href="#about">ABOUT</a><a href="#hub">OUR HUB</a><a href="#experience">EXPERIENCE</a><a href="#contact">CONTACT</a></div><button className="owner" onClick={()=>admin?setOpen(true):setLogin(true)}>{admin?<><Plus size={14}/> ADD PROJECT</>:'OWNER'}</button></nav>

  <section id="top" className="hero">
   <div className="dotField"/><div className="orb orb1"/><div className="orb orb2"/>
   <div className="topline"><span>SOFTWARE ENGINEER · PRODUCT BUILDER</span><span>PORTFOLIO / 2026</span></div>
   <motion.div className="heroTitle" initial={{opacity:0,y:45}} animate={{opacity:1,y:0}} transition={{duration:.8}}><span>PORT</span><span>FOLIO</span></motion.div>
   <div className="heroCollage">
    <motion.div className="introCard stickerCard" initial={{rotate:-3,opacity:0}} animate={{rotate:-2,opacity:1}} transition={{delay:.2}}>
      <span className="tape tapeA"/><p className="eyebrow">HELLO, I&apos;M</p><h1>GHALA<br/><i>AL-HASHMI</i></h1><p className="introText">I build real systems that connect software, automation and operations — from backend platforms to connected products and IT infrastructure.</p><div className="scribble">build → test → ship ✦</div>
    </motion.div>
    <motion.div className="portraitFrame" initial={{scale:.92,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.25}}><div className="portrait placeholder"><span>YOUR PHOTO<br/>GOES HERE</span></div><div className="photoTag">SOFTWARE ENGINEER</div></motion.div>
    <div className="miniCard"><Sparkles size={18}/><b>MAKKAH · JEDDAH</b><small>OPEN TO BUILDING USEFUL THINGS</small></div>
    <div className="yearBadge"><span>EST.</span><strong>2026</strong><span>SAUDI ARABIA</span></div>
    <div className="scrollHint"><ArrowDownRight/> SCROLL TO EXPLORE</div>
   </div>
  </section>

  <section id="about" className="about paperTexture">
    <div className="sectionStamp">01 / PROFILE</div>
    <div className="aboutPoster">
      <div className="aboutLeft"><p className="eyebrow">A LITTLE ABOUT ME</p><h2>I MAKE<br/><span>COMPLEX THINGS</span><br/>FEEL SIMPLE.</h2><div className="quoteBox">“Not just interfaces — systems that actually do the work.”</div></div>
      <div className="aboutRight">
        <div className="infoBox"><span>ROLE</span><b>Software Engineer · Full-Stack Developer · Product Builder</b></div>
        <div className="infoBox"><span>FOCUS</span><b>Backend · Automation · IT Operations · Connected Systems</b></div>
        <p>My work sits between product engineering and real operations. I like problems with moving parts: users, permissions, infrastructure, integrations, data and deployment.</p>
        <p>I&apos;ve built vehicle diagnostics, operational dashboards, automation builders, recruitment tools and enterprise workflow systems — always aiming for something people can actually use.</p>
      </div>
      <div className="spark s1">✦</div><div className="spark s2">✦</div><div className="spark s3">✦</div>
    </div>
  </section>

  <section className="skillsBand"><div className="marquee">{[...stack,...stack].map((s,i)=><span key={i}>{s}<Star size={10} fill="currentColor"/></span>)}</div></section>

  <section id="hub" className="hub">
    <div className="hubHeader"><div><span className="sectionStamp light">02 / SELECTED WORK</span><h2>OUR <i>HUB</i></h2></div><p>Not a gallery of mockups. A collection of systems, products and experiments built to run.</p></div>
    <div className="projectMasonry">{projects.map((p,i)=><motion.article key={p.id} className={`projectPoster poster${(i%5)+1}`} initial={{opacity:0,y:45,rotate:i%2?2:-2}} whileInView={{opacity:1,y:0,rotate:i%2?1:-1}} viewport={{once:true,amount:.2}} transition={{duration:.5}}>
      <div className="posterNumber">{String(i+1).padStart(2,'0')}</div><div className="posterVisual">{p.image_url?<img src={p.image_url} alt=""/>:<><div className="fakeWindow"><i/><i/><i/></div><span>ADD PROJECT VISUAL</span></>}</div>
      <div className="posterCopy"><small>{p.subtitle}</small><h3>{p.title}</h3><p>{p.description}</p><div className="tags">{p.tags?.map(t=><span key={t}>{t}</span>)}</div><div className="links">{p.live_url&&<a href={p.live_url} target="_blank">VIEW LIVE <ArrowUpRight size={14}/></a>}{p.github_url&&<a href={p.github_url} target="_blank">GITHUB <Github size={14}/></a>}</div></div>
      <div className="pin">✦</div>
    </motion.article>)}</div>
  </section>

  <section id="experience" className="experienceSection paperTexture">
   <span className="sectionStamp">03 / EXPERIENCE</span><div className="experienceGrid">
    <div className="experienceMain"><h2>WORK THAT<br/><i>LEFT A MARK.</i></h2><div className="timeline"><span className="line"/><div className="timelineItem"><b>PRINCE SULTAN AVIATION ACADEMY</b><small>Maintenance & Simulators · Software Engineering Trainee</small><p>Digitized paper-heavy maintenance workflows, migrated legacy Microsoft Access data into Power Apps + Dataverse, automated operational calculations and delivered a unified interface deployed to the official server.</p></div></div></div>
    <div className="toolPoster"><span className="tape tapeB"/><p className="eyebrow">MY TOOLKIT</p><div className="toolCloud">{stack.map(s=><span key={s}>{s}</span>)}</div><div className="tinyNote">tools change. problem solving stays.</div></div>
   </div>
  </section>

  <footer id="contact"><div className="footerStar">✦</div><div><p className="script">Have something worth building?</p><h2>LET&apos;S MAKE<br/>IT REAL.</h2></div><div className="footerLinks"><a href="mailto:ghalaalameer8@gmail.com"><Mail/>EMAIL</a><a href="https://github.com/8llo10" target="_blank"><Github/>GITHUB</a><a href="#"><Linkedin/>LINKEDIN</a><span><MapPin/>MAKKAH · JEDDAH</span></div></footer>

  {(login||open)&&<div className="modalBack"><div className="modal"><button className="close" onClick={()=>{setLogin(false);setOpen(false)}}><X/></button>{login?<form onSubmit={signIn}><small>PRIVATE AREA</small><h3>Owner access</h3><input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/><input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/><button>ENTER</button></form>:<form onSubmit={addProject}><small>OUR HUB / CMS</small><h3>Add a project</h3><input name="title" placeholder="Project title" required/><input name="subtitle" placeholder="Short subtitle"/><textarea name="description" placeholder="What did you build?" required/><input name="tags" placeholder="Tags, comma, separated"/><input name="image_url" placeholder="Image URL (optional)"/><input name="live_url" placeholder="Live project URL"/><input name="github_url" placeholder="GitHub URL"/><button>PUBLISH PROJECT</button></form>}</div></div>}
 </main>
}
