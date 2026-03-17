import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PostType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") as PostType | null;
  const includeUnpublished = searchParams.get("all") === "true";

  let session;
  if (includeUnpublished) {
    session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }
  }

  const where: { type?: PostType; published?: boolean } = {};
  if (type && Object.values(PostType).includes(type)) {
    where.type = type;
  }
  if (!includeUnpublished) {
    where.published = true;
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return Response.json(posts, { status: 200 });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, content, type, eventDate, location, published } = await request.json();

    if (!title || !content || !type) {
      return Response.json({ message: "Title, content, and type are required" }, { status: 400 });
    }

    if (!Object.values(PostType).includes(type)) {
      return Response.json({ message: "Invalid post type" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        type,
        eventDate: eventDate ? new Date(eventDate) : null,
        location: location || null,
        published: published ?? false,
      },
    });

    revalidatePath('/');
    return Response.json(post, { status: 201 });
  } catch (error) {
    console.error("Create post error:", error);
    return Response.json({ message: "An error occurred" }, { status: 500 });
  }
}
