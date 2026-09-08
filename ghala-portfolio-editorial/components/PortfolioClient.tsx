"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowUpRight, Download, MapPin } from "./Icons";
import { Code2, Database, Server, Terminal, Braces, Network, Layers3, Cpu, Asterisk } from "lucide-react";
import ImagePlaceholder from "./ImagePlaceholder";
import ThemeToggle from "./ThemeToggle";
import type { Project, Section, SiteSettings } from "@/lib/types";

const ease = [0.16, 1, 0.3, 1] as const;
const reveal = { hidden: { opacity: 0, y: 38 }, show: { opacity: 1, y: 0 } };

function External({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  const disabled = !href || href.startsWith("YOUR_");
  return disabled ? <span className={`${className} disabled-link`}>{children}</span> : <a href={href} className={className} target="_blank" rel="noreferrer">{children}</a>;
}
function Reveal({ children, className="", id }: {children:React.ReactNode; className?:string; id?:string}) {
  return <motion.section id={id} className={className} variants={reveal} initial="hidden" whileInView="show" viewport={{once:true, amount:.12}} transition={{duration:.75, ease}}>{children}</motion.section>;
}
function Placeholder({hint, ratio="4 / 5"}:{hint:string;ratio?:string}) { return <ImagePlaceholder hint={hint} ratio={ratio}/>; }

function Hero({ section, settings }: { section: Section; settings: SiteSettings }) {
  return <section className="editorial-hero" id="home">
    <div className="hero-kicker"><span>SOFTWARE ENGINEER</span><span>CREATIVE DEVELOPER PORTFOLIO · 2026</span></div>
    <motion.div className="hero-display" initial={{opacity:0, y:50}} animate={{opacity:1,y:0}} transition={{duration:.9,ease}}>GHALA</motion.div>
    <div className="hero-left-copy"><span className="mini-label">I BUILD DIGITAL SYSTEMS THAT</span><h2>solve real problems<br/>and <em>ship.</em></h2><External href={settings.cv_url} className="outline-pill"><Download size={14}/> CV / RÉSUMÉ</External></div>
    <motion.div className="hero-portrait" initial={{opacity:0,scale:.94,y:35}} animate={{opacity:1,scale:1,y:0}} transition={{duration:.95,delay:.1,ease}}>
      {section.image_url ? <img src={section.image_url} alt="Ghala portrait"/> : <Placeholder hint="YOUR CUTOUT PHOTO · transparent PNG preferred · 4:5 portrait"/>}
    </motion.div>
    <div className="hero-right-copy"><span className="mini-label">BASED IN</span><strong>{settings.location}</strong><p>{section.body}</p><div className="availability"><i/> {settings.availability}</div></div>
    <div className="hero-socials"><External href={settings.github_url}><Github size={18}/></External><External href={settings.linkedin_url}><Linkedin size={18}/></External><External href={settings.email.startsWith("YOUR_")?"":`mailto:${settings.email}`}><Mail size={18}/></External></div>
    <div className="hero-scroll">SCROLL TO EXPLORE <span>↓</span></div>
  </section>;
}

function Projects({section,projects}:{section:Section;projects:Project[]}) {
  return <Reveal id="projects" className="portfolio-panel projects-panel">
    <header className="panel-title"><div><span>{section.eyebrow}</span><h2>{section.title}</h2></div><p>{section.body}</p></header>
    <div className="project-editorial-grid">{projects.map((p,i)=><motion.article className="editorial-project" key={p.slug} whileHover={{y:-8}} transition={{duration:.25}}>
      <div className="project-meta"><span>{String(i+1).padStart(2,"0")}</span><div><strong>{p.title}</strong><small>{p.subtitle}</small></div><External href={p.project_url||p.github_url||""} className="project-arrow"><ArrowUpRight size={18}/></External></div>
      <div className="project-image">{p.image_url?<img src={p.image_url} alt={p.title}/>:<Placeholder hint={`ADD ${p.title} COVER · dashboard / app screenshot · 16:10`} ratio="16 / 10"/>}</div>
      <p>{p.description}</p><div className="project-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>
    </motion.article>)}</div>
  </Reveal>;
}

function About({section}:{section:Section}) { return <Reveal id="about" className="portfolio-panel about-panel">
  <div className="about-copy"><span className="panel-index">ABOUT / 01</span><h2>{section.title}</h2><p>{section.body}</p><div className="big-quote">“Build it clean.<br/><em>Make it useful.</em>”</div></div>
  <div className="about-photo">{section.image_url?<img src={section.image_url} alt="About Ghala"/>:<Placeholder hint="ADD WORK / EVENT PHOTO · candid professional image · 4:3" ratio="4 / 3"/>}</div>
  <div className="about-facts"><div><strong>06+</strong><span>Systems & projects</span></div><div><strong>307+</strong><span>GitHub contributions</span></div><div><strong>B.Sc.</strong><span>Software Engineering</span></div></div>
</Reveal> }

function Experience({section}:{section:Section}) { return <Reveal id="experience" className="portfolio-panel experience-panel">
  <div className="panel-title compact"><div><span>{section.eyebrow}</span><h2>{section.title}</h2></div></div>
  <div className="timeline-row"><span className="timeline-no">01</span><div><small>TECHNICAL TRAINING</small><h3>Prince Sultan Aviation Academy</h3><p>{section.body}</p></div><span className="timeline-year">OPERATIONAL ENVIRONMENT</span></div>
  <div className="timeline-row muted"><span className="timeline-no">02</span><div><small>ENGINEERING PRACTICE</small><h3>Backend · Systems · Integration</h3><p>Designing databases, APIs, workflows, integrations and deployment paths across real-world project contexts.</p></div><span className="timeline-year">2025 — NOW</span></div>
</Reveal> }

function Skills({section}:{section:Section}) {
 const groups=[{icon:<Braces/>,n:"01",t:"BUILD",v:"JavaScript · TypeScript · Python · Java · React · Next.js · React Native"},{icon:<Database/>,n:"02",t:"DATA",v:"PostgreSQL · MySQL · Supabase · Firebase · SQL"},{icon:<Server/>,n:"03",t:"SYSTEMS",v:"Linux · VPS · Windows Server · Active Directory · Git"},{icon:<Network/>,n:"04",t:"INTEGRATE",v:"REST APIs · MQTT · OBD-II · TCP/IP · DNS · DHCP"}];
 return <Reveal id="skills" className="portfolio-panel skills-panel"><div className="panel-title"><div><span>{section.eyebrow}</span><h2>{section.title}</h2></div></div><div className="skill-modules">{groups.map(g=><div className="skill-module" key={g.n}><span>{g.n}</span>{g.icon}<h3>{g.t}</h3><p>{g.v}</p></div>)}</div></Reveal>
}

function Custom({section}:{section:Section}) { return <Reveal id={section.key} className={`portfolio-panel custom-panel custom-${section.layout}`}><div><span className="panel-index">{section.eyebrow||"CUSTOM"}</span><h2>{section.title}</h2><p>{section.body}</p></div>{section.image_url?<div className="custom-image"><img src={section.image_url} alt={section.title}/></div>:<div className="custom-image"><Placeholder hint="OPTIONAL SECTION IMAGE · upload from /admin" ratio="16 / 10"/></div>}</Reveal> }

function Contact({section,settings}:{section:Section;settings:SiteSettings}) { return <Reveal id="contact" className="portfolio-panel contact-panel"><div><span className="panel-index">{section.eyebrow}</span><h2>LET’S CREATE<br/><em>SOMETHING</em><br/>MEANINGFUL.</h2></div><div className="contact-copy"><p>{section.body}</p><External href={settings.email.startsWith("YOUR_")?"":`mailto:${settings.email}`} className="outline-pill light">SEND ME A MESSAGE <ArrowUpRight size={15}/></External></div><div className="contact-links"><External href={settings.linkedin_url}><Linkedin size={16}/> LinkedIn</External><External href={settings.github_url}><Github size={16}/> GitHub</External><span><MapPin size={16}/> {settings.location}</span></div></Reveal> }

export default function PortfolioClient({sections,projects,settings}:{sections:Section[];projects:Project[];settings:SiteSettings}) {
 const active=sections.filter(s=>s.enabled).sort((a,b)=>a.sort_order-b.sort_order); const hero=active.find(s=>s.type==="hero");
 return <main className="portfolio-page">
   <nav className="editorial-nav"><a href="#home" className="monogram">G.</a><div className="nav-center"><a href="#projects">Work</a><a href="#about">About</a><a href="#experience">Experience</a><a href="#skills">Stack</a></div><div className="nav-end"><ThemeToggle/><a href="#contact" className="nav-contact">CONTACT <ArrowUpRight size={14}/></a></div></nav>
   <div className="portfolio-frame">
    {hero&&<Hero section={hero} settings={settings}/>} 
    {active.filter(s=>s.type!=="hero").map(s=>s.type==="projects"?<Projects key={s.key} section={s} projects={projects}/>:s.type==="about"?<About key={s.key} section={s}/>:s.type==="experience"?<Experience key={s.key} section={s}/>:s.type==="skills"?<Skills key={s.key} section={s}/>:s.type==="contact"?<Contact key={s.key} section={s} settings={settings}/>:<Custom key={s.key} section={s}/>)}
    <footer className="editorial-footer"><span>© {new Date().getFullYear()} {settings.name}</span><span>DESIGNED TO BUILD · SOLVE · SHIP</span></footer>
   </div>
 </main>;
}
