import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { z } from "zod";
const Settings=z.object({name:z.string(),role:z.string(),location:z.string(),email:z.string(),linkedin_url:z.string(),github_url:z.string(),cv_url:z.string(),availability:z.string()});
export async function POST(req:Request){
 if(!(await isAdmin()))return NextResponse.json({error:"Unauthorized"},{status:401});
 const db=getSupabaseAdmin(); if(!db)return NextResponse.json({error:"Connect Supabase first; demo data cannot be saved."},{status:503});
 const parsed=Settings.safeParse(await req.json()); if(!parsed.success)return NextResponse.json({error:"Invalid settings"},{status:400});
 const {error}=await db.from("site_settings").upsert({key:"main",value:parsed.data},{onConflict:"key"});
 if(error)return NextResponse.json({error:error.message},{status:400});
 return NextResponse.json({ok:true});
}
