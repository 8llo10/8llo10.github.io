import { NextResponse } from "next/server";
import { createAdminToken, setAdminCookie } from "@/lib/auth";

export async function POST(req: Request){
  const form=await req.formData();
  const username=String(form.get("username")||"");
  const password=String(form.get("password")||"");
  if(!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD){
    return NextResponse.json({error:"Admin credentials are not configured yet. Add them to .env.local / Vercel Environment Variables."},{status:500});
  }
  if(username!==process.env.ADMIN_USERNAME || password!==process.env.ADMIN_PASSWORD){
    await new Promise(r=>setTimeout(r,450));
    return NextResponse.json({error:"Wrong username or password."},{status:401});
  }
  await setAdminCookie(createAdminToken());
  return NextResponse.json({ok:true});
}
