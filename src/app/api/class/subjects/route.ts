import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }
  
  try {
    const subjects = await prisma.subject.findMany({});
    return Response.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return Response.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}