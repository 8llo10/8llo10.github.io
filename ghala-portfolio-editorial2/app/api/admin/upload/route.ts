import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req:Request){
  if(!(await isAdmin())) return NextResponse.json({error:"Unauthorized"},{status:401});
  const db=getSupabaseAdmin(); if(!db)return NextResponse.json({error:"Connect Supabase before uploading images."},{status:503});
  const form=await req.formData(); const file=form.get("file");
  if(!(file instanceof File))return NextResponse.json({error:"No image received"},{status:400});
  if(!file.type.startsWith("image/"))return NextResponse.json({error:"Only images are allowed"},{status:400});
  if(file.size>6*1024*1024)return NextResponse.json({error:"Image must be 6 MB or smaller"},{status:400});
  const ext=(file.name.split(".").pop()||"jpg").replace(/[^a-z0-9]/gi,"");
  const path=`uploads/${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const bucket=process.env.SUPABASE_STORAGE_BUCKET||"portfolio-images";
  const {error}=await db.storage.from(bucket).upload(path,Buffer.from(await file.arrayBuffer()),{contentType:file.type,upsert:false});
  if(error)return NextResponse.json({error:error.message},{status:400});
  const {data}=db.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({url:data.publicUrl});
}
