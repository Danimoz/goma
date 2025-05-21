import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminPage from "./admin";
import TeacherPortal from "./teacher";
import StudentsPortal from "./students";

export default async function Portal() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/signin");
  }

  switch (session.user.role) {
    case "ADMIN":
      return <AdminPage />;
    case "TEACHER":
      return <TeacherPortal />;
    case "STUDENT":
      return <StudentsPortal />
    default:
      return null;
  }
}