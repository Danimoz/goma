'use client'

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TeacherForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/portal";
  const role = searchParams.get("role") || "TEACHER";
    
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const access = await signIn("credentials", {
      role: role,
      identifier: email,
      password: password,
      redirect: false,
    })
    if (access?.error) {
      alert("Invalid credentials");
      setIsLoading(false);
      return;
    }
    replace(callbackUrl);
    setIsLoading(false);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id='email'type="email" name="email" required />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id='password' type='password' name="password" required />
      </div>

      <Button type="submit" className="w-full  bg-stark-white-600" disabled={isLoading}>Sign In</Button>
    </form>
  )
}