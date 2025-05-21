import EnrollmentBanner from "@/components/enrollment-banner";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Star, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { missions, programs, testimonials } from "./page.constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

import schoolBuilding from "@images/goma-building.jpg";
import studentsImg from "@images/goma-students.jpg";

export default function Home() {
  return (
    <main>
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-r from-stark-white-400 to-stark-white-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-congress-blue-500/[0.03] bg-[size:20px_20px]" />
        <div className="mx-4 md:container md:mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <EnrollmentBanner />
            <h1 className="text-3xl font-bold tracking-wide md:text-5xl lg:text-6xl text-congress-blue-700">
              Welcome to <span className="text-congress-blue-500">G.O.M.A.</span>
            </h1>
            <p className="max-w-[600px] text-gray-700 text-xl">
              <span className="font-semibold">God&apos;s Own Model Academy</span> - Nurturing minds, building character, and preparing leaders for tomorrow&apos;s challenges.
            </p>

            <div className="flex flex-col md:flex-row gap-4">
              <Button asChild size="lg" className="z-50">
                <Link href="/apply">
                  Enroll Today <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="z-50">
                <Link href="/#about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>

          <div className="w-full aspect-video rounded-xl shadow-2xl">
            <Image
              alt="G.O.M.A. School Building"
              src={schoolBuilding}
              className="object-cover object-center rounded-xl"
            />
          </div>
        </div>
      </section>

      <section id="about" className="w-full py-12 md:py-24 lg:py-32">
        <div className="mx-auto max-w-5xl pb-6">
          <div className="space-y-2 text-center">
            <p className="inline-block rounded-lg bg-stark-white-400 px-3 py-1 text-sm text-congress-blue-500 font-medium">
              About Us
            </p>
            <h2 className="text-3xl font-bold tracking-wide md:text-5xl text-congress-blue-700">Our Mission & Vision</h2>
            <p className="text-gray-500 md:text-xl/relaxed">
              At God&apos;s Own Model Academy, we are committed to providing quality education in a nurturing environment that fosters academic excellence, character development, and spiritual growth.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mt-8">
          <div className="aspect-video rounded-xl shadow-lg overflow-hidden">
            <Image
              alt="Students in School"
              className="object-cover object-center rounded-xl"
              src={studentsImg}
            />
          </div>
          <ul className="gap-6 flex flex-col justify-center">
            {missions.map((mission, index) => (
              <li key={index}>
                <div className="flex gap-4">
                  <span className="flex justify-center items-center h-8 w-8 rounded-full bg-congress-blue-200 text-congress-blue-500">
                    <mission.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-semibold">{mission.title}</h3>
                </div>
                <p className="text-gray-500 pl-14">{mission.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      
      <section id="academics" className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-stark-white-400 to-stark-white-500">
        <div className="mx-auto max-w-5xl pb-6 px-4">
          <div className="space-y-2 text-center">
            <p className="inline-block rounded-lg bg-congress-blue-100 px-3 py-1 text-sm text-congress-blue-500 font-medium">
              Our Programs
            </p>
            <h2 className="text-3xl font-bold tracking-wide md:text-5xl text-congress-blue-700">Educational Programs</h2>
            <p className="text-gray-500 md:text-xl/relaxed">
              We offer comprehensive educational programs designed to meet the needs of students at every stage of their academic journey.           
             </p>
          </div>
        </div>
        <div className="mx-auto max-w-5xl grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 mt-8">
          {programs.map((program, index) => (
            <Card key={index} className="border-congress-blue-200 bg-white shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-4">
                  <span className="flex justify-center items-center h-10 w-10 rounded-full bg-congress-blue-200 text-congress-blue-500">
                    <program.icon className="h-5 w-5" />
                  </span>
                  <h3 className="text-xl font-semibold">{program.title}</h3>
                </CardTitle>
                <CardDescription>{program.ages}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-sm">{program.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href="/apply"
                    className="text-congress-blue-500 text-sm font-medium hover:underline inline-flex items-center"
                  >
                    Learn more <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id='testimonials' className="w-full py-12 md:py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-congress-blue-500/[0.02] bg-[size:20px_20px]" />
        <div className="px-4 md:mx-auto max-w-5xl pb-4">
          <div className="space-y-2 text-center">
            <p className="inline-block rounded-lg bg-stark-white-400 px-3 py-1 text-sm text-congress-blue-500 font-medium">
              Testimonials
            </p>
            <h2 className="text-3xl font-bold tracking-wide md:text-5xl text-congress-blue-700">What Parents Say</h2>
            <p className="text-gray-500 md:text-xl/relaxed">
              Hear from our parents about their experiences with God&apos;s Own Model Academy and how we have made a difference in their children&apos;s lives.
            </p>
          </div>
          <div className="py-12 grid max-w-5xl mx-auto md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-stark-white-400 shadow-md">
                <CardContent className="pt-6 space-y-6">
                  <div className="flex gap-1 text-yellow-400">
                    {Array.from({ length: testimonial.rating }, (_, i) => (
                      <Star key={i} fill='yellow' />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm mt-2">{testimonial.testimonial}</p>
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-gray-100 p-1">
                      <Users className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-stark-white-400 to-stark-white-600">
        <div className="px-4 space-y-2 text-center pb-6">
          <h2 className="text-3xl font-bold tracking-wide md:text-5xl text-congress-blue-700">Join Us Today!</h2>
          <p className="text-gray-500 md:text-xl/relaxed max-w-5xl mx-auto">
            Experience the difference at God&apos;s Own Model Academy. Enroll your child today and watch them thrive in a nurturing and supportive environment.
          </p>
        </div>
        <div className="px-4 flex flex-col gap-4 md:flex-row justify-center">
          <Button asChild size="lg">
            <Link href="/apply">
              Enroll Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
