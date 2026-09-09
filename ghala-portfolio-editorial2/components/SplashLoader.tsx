"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function SplashLoader(){
  const [show,setShow]=useState(true);
  useEffect(()=>{
    const t=window.setTimeout(()=>setShow(false),1450);
    return ()=>window.clearTimeout(t);
  },[]);
  return <AnimatePresence>{show&&(
    <motion.div className="splash-loader" initial={{opacity:1}} exit={{opacity:0}} transition={{duration:.35}} aria-label="Loading portfolio">
      <div className="discord-g-mark" aria-hidden="true">
        <div className="g-core">G</div>
        <span className="orbit-dot d1"/><span className="orbit-dot d2"/><span className="orbit-dot d3"/>
        <span className="orbit-ring"/>
      </div>
      <div className="splash-copy"><strong>GHALA</strong><span>LOADING PORTFOLIO</span></div>
    </motion.div>
  )}</AnimatePresence>;
}
