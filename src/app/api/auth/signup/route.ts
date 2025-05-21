import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export async function POST(request: Request) {
  const { firstName, lastName, email, password, role } = await request.json();
  if (!firstName || !lastName) {
    return Response.json({ message: 'Missing required fields' }, { status: 400 });
  }
  let existingUser;
  try {
    if (email) {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });
    } else {
      existingUser = await prisma.user.findFirst({
        where: { firstName, lastName },
      });
    }
    if (existingUser) {
      const identifier = email ? `email ${email}` : `name ${firstName} ${lastName}`;
      return Response.json({ message: `$User already exists with ${identifier}` }, { status: 409 });
    }
    let hashedPassword;
    if (password && role !== Role.STUDENT) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const newUser = await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword, role: role || Role.STUDENT },
      select: { id: true, firstName: true, lastName: true, email: true, role: true },
    });

    return Response.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Signup error", error);
    return Response.json({ message: 'An error occured', error: true }, { status: 500 });
  }
}