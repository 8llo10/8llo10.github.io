import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { z } from "zod";

const SectionSchema=z.object({id:z.number().optional(),key:z.string().min(1),type:z.enum(["hero","projects","about","experience","skills","contact","custom"]),title:z.string().min(1),eyebrow:z.string().optional().default(""),body:z.string().optional().default(""),image_url:z.string().optional().default(""),layout:z.enum(["split","bento","editorial","grid","full"]),sort_order:z.number(),enabled:z.boolean(),config:z.record(z.string(),z.unknown()).optional().default({})});

export async function POST(req:Request){
  if(!(await isAdmin())) return NextResponse.json({error:"Unauthorized"},{status:401});
  const db=getSupabaseAdmin(); if(!db)return NextResponse.json({error:"Connect Supabase first; demo data cannot be saved."},{status:503});
  const body=await req.json();
  if(body.action==="delete"){
    let q=db.from("sections").delete(); q=body.id?q.eq("id",body.id):q.eq("key",String(body.key||""));
    const {error}=await q; if(error)return NextResponse.json({error:error.message},{status:400});
    return NextResponse.json({ok:true});
  }
  const parsed=SectionSchema.safeParse(body.section); if(!parsed.success)return NextResponse.json({error:"Invalid section data"},{status:400});
  const section=parsed.data; const {id,...row}=section;
  const result=id?await db.from("sections").update(row).eq("id",id).select().single():await db.from("sections").upsert(row,{onConflict:"key"}).select().single();
  if(result.error)return NextResponse.json({error:result.error.message},{status:400});
  return NextResponse.json({section:result.data});
}
