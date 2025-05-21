import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import Image1 from '@images/gallery1.jpg';
import Image2 from '@images/gallery2.jpg';
import Image3 from '@images/gallery3.jpg';
import Image4 from '@images/gallery4.jpg';
import Image5 from '@images/gallery5.jpg';
import Image6 from '@images/gallery6.jpg';
import Image from "next/image";

const images = [
  Image1,
  Image2,
  Image3,
  Image4,
  Image5,
  Image6
];


export default function Gallery() {
  return (
    <main>
      <section className="py-12 md:py-24 lg:py-32 bg-gradient-to-r from-stark-white-400 to-stark-white-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-congress-blue-500/[0.03] bg-[size:20px_20px]" />
        <div className="mx-4 md:container md:mx-auto flex flex-col justify-center items-center space-y-4">
          <Link
            href='/'
            className=' z-10 inline-flex items-center rounded-full border border-congress-blue-500/20  px-3 py-1 text-sm text-congress-blue-500 shadow-sm bg-white  hover:bg-congress-blue-100 transition-colors duration-200'
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold tracking-wider md:text-5xl text-congress-blue-700">
            School <span className="text-congress-blue-500">Gallery</span>
          </h1>
          <p className="text-gray-700 text-xl max-w-3xl text-center">
            Explore our campus, classrooms, and student activities through our photo gallery.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="mx-4 md:container md:mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {images.map((image, index) => (
            <div 
              key={index}
              className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-[16/9] relative">
                <Image
                  src={image.src}
                  alt={`Gallery Image ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}