'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { programs } from "./page.constants";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/TextArea";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";

export default function Apply() {
  return (
    <main>
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-r from-stark-white-400 to-stark-white-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-congress-blue-500/[0.03] bg-[size:20px_20px]" />
        <div className="mx-4 md:container md:mx-auto flex flex-col justify-center items-center space-y-4">
          <Link
            href='/'
            className=' z-10 inline-flex items-center rounded-full border border-congress-blue-500/20  px-3 py-1 text-sm text-congress-blue-500 shadow-sm bg-white  hover:bg-congress-blue-100 transition-colors duration-200'
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-wider md:text-5xl text-congress-blue-700">
            Apply to <span className="text-congress-blue-500">G.O.M.A.</span>
          </h1>
          <p className="text-gray-700 text-xl max-w-3xl text-center">
            Take the first step towards providing your child with a quality education that nurtures both mind and
            spirit.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="px-4 mx-auto max-w-5xl space-y-8">
          <Card className="border-congress-blue-200 shadow-md">
            <CardHeader>
              <CardTitle>Student Application Form</CardTitle>
              <CardDescription>
                Please fill out all the required information to apply for admission to God&apos;s Own Model Academy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Program Selection</h3>
                    <p className="text-sm text-gray-500">Select the program you are applying for</p>
                  </div>
                  <RadioGroup defaultValue="primary" name="program" className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {programs.map((program, index) => (
                      <div key={index}>
                        <RadioGroupItem value={program.value} id={program.value} className="peer sr-only" />
                        <Label
                          htmlFor={program.value}
                          className="flex flex-col items-center justify-between rounded-md border-2 border-[#F1F5F9] bg-white p-4 hover:bg-[#F1F5F9] hover:text-accent-foreground peer-data-[state=checked]:border-congress-blue-500 [&:has([data-state=checked])]:border-congress-blue-500"
                        >
                          <program.icon className="mb-3 h-6 w-6" />
                          <span className="font-medium capitalize">{program.value} School</span>
                          <span className="text-xs text-gray-500">{program.ages}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Student Information</h3>
                    <p className="text-sm text-gray-500">Enter the student&apos;s personal details</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" name="firstName" placeholder="Enter first name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" name="lastName" placeholder="Enter last name" />
                    </div>
                    <div className="space-y-2 w-full">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" name="dateOfBirth" type="date" className="" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select name="gender">
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Home Address</Label>
                      <Textarea id="address" name="address" placeholder="Enter home address" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Parent/Guardian Information</h3>
                    <p className="text-sm text-gray-500">Enter the parent or guardian&apos;s contact details</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="parent-name">Full Name</Label>
                      <Input id="parent-name" name="parentName" placeholder="Enter parent/guardian name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship to Student</Label>
                      <Input id="relationship" name="relationship" placeholder="E.g. Mother, Father, Guardian" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" placeholder="Enter phone number" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" placeholder="Enter email address" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Previous School Information</h3>
                    <p className="text-sm text-gray-500">If applicable, provide details about the previous school</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="prev-school">Previous School Name</Label>
                      <Input id="prev-school" name="previousSchool" placeholder="Enter previous school name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Last Grade Completed</Label>
                      <Input id="grade" name="lastGrade" placeholder="Enter last grade completed" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="reason">Reason for Leaving</Label>
                      <Textarea id="reason" name="reasonForLeaving" placeholder="Enter reason for leaving previous school" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Additional Information</h3>
                    <p className="text-sm text-gray-500">
                      Please provide any additional information that may be relevant
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additional">Additional Information</Label>
                    <Textarea
                      id="additional"
                      name="additionalInfo"
                      placeholder="Enter any additional information"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Submit Application</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  )
}