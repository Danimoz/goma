import { auth } from "@/auth";
import { getStudents } from "@/lib/queries";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || '';
  const excludeClassId = searchParams.get("excludeClassId") || undefined;

  const students = await getStudents(page, pageSize, search, excludeClassId);

  return Response.json(students, { status: 200 });
}