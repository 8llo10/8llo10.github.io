import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { z } from "zod";

const ProjectSchema=z.object({id:z.number().optional(),slug:z.string().min(1),title:z.string().min(1),subtitle:z.string().optional().default(""),description:z.string().min(1),image_url:z.string().optional().default(""),project_url:z.string().optional().default(""),github_url:z.string().optional().default(""),tags:z.array(z.string()).default([]),featured:z.boolean().optional().default(true),sort_order:z.number().optional().default(1)});

export async function POST(req:Request){
  if(!(await isAdmin())) return NextResponse.json({error:"Unauthorized"},{status:401});
  const db=getSupabaseAdmin(); if(!db) return NextResponse.json({error:"Connect Supabase first; demo data cannot be saved."},{status:503});
  const body=await req.json();
  if(body.action==="delete"){
    let q=db.from("projects").delete();
    q=body.id?q.eq("id",body.id):q.eq("slug",String(body.slug||""));
    const {error}=await q; if(error)return NextResponse.json({error:error.message},{status:400});
    return NextResponse.json({ok:true});
  }
  const parsed=ProjectSchema.safeParse(body.project); if(!parsed.success)return NextResponse.json({error:"Invalid project data"},{status:400});
  const project=parsed.data; const {id,...row}=project;
  const result=id?await db.from("projects").update(row).eq("id",id).select().single():await db.from("projects").upsert(row,{onConflict:"slug"}).select().single();
  if(result.error)return NextResponse.json({error:result.error.message},{status:400});
  return NextResponse.json({project:result.data});
}
