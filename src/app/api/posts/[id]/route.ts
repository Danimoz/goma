import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PostType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { title, content, type, eventDate, location, published } = await request.json();

    if (!title || !content || !type) {
      return Response.json({ message: "Title, content, and type are required" }, { status: 400 });
    }

    if (!Object.values(PostType).includes(type)) {
      return Response.json({ message: "Invalid post type" }, { status: 400 });
    }

    const post = await prisma.post.update({
      where: { id },
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
    return Response.json(post, { status: 200 });
  } catch (error) {
    console.error("Update post error:", error);
    return Response.json({ message: "An error occurred" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath('/');
    return Response.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete post error:", error);
    return Response.json({ message: "An error occurred" }, { status: 500 });
  }
}
