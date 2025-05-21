'use client';

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function StudentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/portal";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const lastName = formData.get('lastName');
    const firstName = formData.get('firstName');
    
    const access = await signIn("credentials", {
      role: "STUDENT",
      identifier: `${firstName} ${lastName}`,
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
        <Label htmlFor="lastName">Surname</Label>
        <Input id='lastName' name="lastName" required />
      </div>
      <div>
        <Label htmlFor="firstName">First Name</Label>
        <Input id='firstName' name="firstName" required />
      </div>
      
      <Button type="submit" className="w-full bg-stark-white-600" disabled={isLoading}>
        {isLoading ? "Loading..." : "Sign In"}
      </Button>
    </form>
  )
}