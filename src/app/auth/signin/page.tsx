'use client';

import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/Card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import Image from "next/image";
import { useState } from "react";
import StudentForm from "./studentForm";
import TeacherForm from "./teacherForm";
import { useSearchParams } from "next/navigation";

export default function SignIn(){
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const [userType, setUserType] = useState(role !== "STUDENT" ? "teacher" : "student");

  return (
    <main className="h-screen flex items-center justify-center">
      <section className="container mx-auto max-w-md">
        <Card className="border-congress-blue-200 shadow-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center relative">
              <Image alt="G.O.M.A. Logo" src="/School Logo.jpg" width={100} height={100} className="object-contain" />
            </div>
            <CardTitle className="text-2xl text-center">Portal Login</CardTitle>
            <CardDescription className="text-center">Enter your credentials to access the portal</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={userType} onValueChange={setUserType} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
              </TabsList>
              <TabsContent value="student">
                <StudentForm />
              </TabsContent>
              <TabsContent value="teacher">
                <TeacherForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}