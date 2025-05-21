import { auth } from "@/auth";
import { getClassByAcademicSession } from "@/lib/queries";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const searchParams = request.nextUrl.searchParams;
  const academicSessionId = searchParams.get("academicSessionId");
  const teacherId = searchParams.get("teacherId");

  if (!academicSessionId) {
    return Response.json({ error: "Academic session ID is required" }, { status: 400 });
  }
  const classes = await getClassByAcademicSession(academicSessionId, teacherId || undefined);
  return Response.json(classes, { status: 200 });
}