import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import Link from "next/link";
import ContactForm from "./form";

export default function ContactPage() {
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
            Contact <span className="text-congress-blue-500">G.O.M.A.</span>
          </h1>
          <p className="text-gray-700 text-xl max-w-3xl text-center">
            We&apos;d love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="px-4 mx-auto max-w-5xl gap-8 grid grid-cols-1 md:grid-cols-2">
          <ContactForm />

          <div className="space-y-8">
            <Card className="border-congress-blue-200 shadow-md">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Here&apos;s how you can reach us directly.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 text-navy-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-sm text-gray-500">
                      100 Bible College Road, 7up Glass, <br />
                      Osusu-Umuikpeghi, Obingwa LGA, Abia State
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 text-navy-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-sm text-gray-500">+234 803 469 5473</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-100 text-navy-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-sm text-gray-500">godsownmodelacademy01@gmail.com</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-congress-blue-200 shadow-md">
              <CardHeader>
                <CardTitle>School Hours</CardTitle>
                <CardDescription>Our operating hours during the school year.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Friday</span>
                  <span className="text-gray-500">7:30 AM - 3:30 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday</span>
                  <span className="text-gray-500">9:00 AM - 12:00 PM (Admin only)</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday</span>
                  <span className="text-gray-500">Closed</span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Note: The administrative office is open from 8:00 AM to 4:00 PM on weekdays.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-4 md:container md:mx-auto">
        <Card className="border-congress-blue-200 shadow-md">
          <CardHeader>
            <CardTitle>Our Location</CardTitle>
            <CardDescription>Find us on the map and plan your visit.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-[16/9] overflow-hidden rounded-lg">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d6278.876036585464!2d7.384342678376905!3d5.141368066828264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sosusu%20umuikpeghi!5e0!3m2!1sen!2sng!4v1745331489292!5m2!1sen!2sng" 
                className="w-full h-full border border-congress-blue-300"
                style={{ border: 0}} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" 
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}