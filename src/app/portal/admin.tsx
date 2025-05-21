import AdminsList from "@/components/admin-list";
import CreateUserForm from "@/components/create-user-form";
import StudentsList from "@/components/students-list";
import TeachersList from "@/components/teachersList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { TabsContent } from "@radix-ui/react-tabs";

export default function AdminPage() {
  return (
    <section className="container mx-auto my-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Create and manage user accounts</CardDescription>
            </div>
            <CreateUserForm />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="teachers">
            <TabsList>
              <TabsTrigger value="teachers">Teacher</TabsTrigger>
              <TabsTrigger value="students">Student</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>
            <TabsContent value="teachers">
              <TeachersList />
            </TabsContent>
            <TabsContent value="students">
              <StudentsList />
            </TabsContent>
            <TabsContent value="admins">
              <AdminsList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}