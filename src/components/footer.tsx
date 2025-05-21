'use client'

import Image from "next/image"
import Link from "next/link"

import schoolLogo from '../../public/School Logo.jpg'

const footerLinks = [
  { name: 'Home', href: '/' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Apply', href: '/apply' },
  { name: 'Contact', href: '/contact' },
  { name: 'Admin Login', href: '/auth/signin?role=ADMIN' },
]

export default function Footer() {
  const now = new Date()

  return (
    <footer className="py-8 border-t">
      <div className="mx-4 md:container md:mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="h-56 w-56">
          <Image
            alt="G.O.M.A. Logo"
            src={schoolLogo}
            className="object-contain"
          />
        </div>
        <div>
          <h3 className="font-bold text-congress-blue-700 mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-gray-600 text-sm  hover:text-congress-blue-500 transition-colors duration-200">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold text-navy-800 mb-4">Contact Us</h3>
          <address className="not-italic">
            <p className="text-sm text-gray-600 mb-2">
              100 Bible College Road, 7up Glass, <br />
              Osusu-Umuikpeghi, Obingwa LGA, Abia State
            </p>
            <p className="text-sm text-gray-600 mb-2">Phone: +234 803 469 5473</p>
            <p className="text-sm text-gray-600">Email: godsownmodelacademy01@gmail.com</p>
          </address>
        </div>

        <div>
          <h3 className="font-bold text-navy-800 mb-4">Connect</h3>
          <div className="flex gap-4">
            <Link href="/portal" className="text-sm font-medium text-navy-600 hover:underline">
              Student Portal
            </Link>
            <Link href="/apply" className="text-sm font-medium text-navy-600 hover:underline">
              Apply Now
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 mt-8 pt-6 text-center">
        <p className="text-sm text-gray-600">
          © {now.getFullYear()} God&apos;s Own Model Academy. All rights reserved.
        </p>
      </div>
    </footer>
  )
}