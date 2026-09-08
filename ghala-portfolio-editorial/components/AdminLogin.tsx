"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  return <main className="login-page"><form className="login-card" onSubmit={async e=>{e.preventDefault();setBusy(true);setError("");const fd=new FormData(e.currentTarget);const res=await fetch('/api/admin/login',{method:'POST',body:fd});if(res.ok){location.href='/admin'}else{const d=await res.json().catch(()=>({}));setError(d.error||'Login failed');setBusy(false)}}}>
    <div className="login-g">G</div><p>OWNER ACCESS</p><h1>Portfolio Admin</h1><span>Only you can edit the public website.</span>
    <label>Username<input name="username" autoComplete="username" required/></label>
    <label>Password<input name="password" type="password" autoComplete="current-password" required/></label>
    {error&&<div className="login-error">{error}</div>}
    <button disabled={busy}>{busy?'Signing in…':'Enter dashboard'}</button>
    <a href="/">← Back to portfolio</a>
  </form></main>
}
