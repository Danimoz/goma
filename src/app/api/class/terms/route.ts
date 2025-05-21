import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  const searchParams = request.nextUrl.searchParams;
  const academicSessionId = searchParams.get("academicSessionId") || '';
  if (!academicSessionId) {
    return Response.json({ error: "academicSessionId is required" }, { status: 400 });
  }

  try {
    const terms = await prisma.term.findMany({
      where: { academicSessionId: academicSessionId }
    });
    return Response.json(terms);
  } catch (error) {
    console.error("Error fetching terms:", error);
    return Response.json({ error: "Failed to fetch terms" }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, academicSessionId } = body;

  if (!name || !academicSessionId) {
    return Response.json({ error: "name and academicSessionId are required" }, { status: 400 });
  }

  try {
    const term = await prisma.term.create({
      data: {
        name,
        academicSessionId
      }
    });
    return Response.json(term);
  } catch (error) {
    console.error("Error creating term:", error);
    return Response.json({ error: "Failed to create term" }, { status: 500 });
  }
}
