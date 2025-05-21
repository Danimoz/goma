import { auth } from "@/auth";
import { getTeachers } from "@/lib/queries";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  // Check if the request is authenticated
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const searchParams = request.nextUrl.searchParams
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;
  const search = searchParams.get("search") || '';

  const teachers = await getTeachers(page, pageSize, search);

  return Response.json(teachers, { status: 200 });

}