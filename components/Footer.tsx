import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Phone, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#202020] text-white md:h-[577px] font-mada">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 lg:col-span-1 space-y-16">
            <Image
              src="/svg/antioch.svg"
              alt="DaBible Foundation"
              width={200}
              height={60}
              className="mb-4"
            />
            <p className="text-white text-sm mb-6">
              This is where a little one becomes a thousand, and a small one becomes a strong nation.
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-wrap gap-2">
              
              <Link href="https://apps.apple.com/us/developer/sanmi-ajanaku/id1079050270" className="inline-block hover:underline">
                <Image
                  src="/png/store.png"
                  alt="Download on the App Store"
                  width={153}
                  height={40}
                  className="border border-gray-600 rounded"
                />
              </Link>
              <Link href="https://play.google.com/store/apps/dev?id=6126149451407039432" className="inline-block hover:underline">
                <Image
                  src="/png/play.png"
                  alt="Get it on Google Play"
                  width={153}
                  height={40}
                  className="border border-gray-600 rounded"
                />
              </Link>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4 mt-6">
              <Link
                href="https://www.facebook.com/dabiblefoundation/"
                className="bg-white text-blue-950 p-2 rounded-full hover:bg-gray-200 transition-colors hover:underline"
              >
                <Facebook size={18} />
              </Link>
              <Link
                href="https://www.youtube.com/@antioch_live"
                className="bg-white text-blue-950 p-2 rounded-full hover:bg-gray-200 transition-colors hover:underline"
              >
                <Youtube size={18} />
              </Link>
              <Link
                href="https://www.instagram.com/antiochbelievers/"
                className="bg-white text-blue-950 p-2 rounded-full hover:bg-gray-200 transition-colors hover:underline"
              >
                <Instagram size={18} />
              </Link>
            </div>
          </div>

          {/* Visit Us */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">VISIT US</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="https://www.youtube.com/@antioch_live"
                  target="_blank"
                  className="flex items-center text-white hover:text-white transition-colors hover:underline"
                >
                  <Youtube size={18} className="mr-2" />
                  YouTube Channel
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.facebook.com/dabiblefoundation/"
                  target="_blank"
                  className="flex items-center text-white hover:text-white transition-colors hover:underline"
                >
                  <Facebook size={18} className="mr-2" />
                  Facebook Page
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.instagram.com/antiochbelievers/"
                  target="_blank"
                  className="flex items-center text-white hover:text-white transition-colors hover:underline"
                >
                  <Instagram size={18} className="mr-2" />
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="https://wa.me/12566179644"
                  target="_blank"
                  className="flex items-center text-white hover:text-white transition-colors hover:underline"
                >
                  <Phone size={18} className="mr-2" />
                  1-256-617-9644
                </Link>
              </li> 
            </ul>
          </div>

          {/* Resources */}
          {/* <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">RESOURCES</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-white hover:text-white transition-colors hover:underline"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-white hover:text-white transition-colors hover:underline"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="https://support.dabible.com"
                  className="text-white hover:text-white transition-colors hover:underline"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Company */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">MORE</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-white hover:text-white transition-colors hover:underline"
                >
                  DaBible Foundation
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white hover:text-white transition-colors hover:underline"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-white hover:text-white transition-colors hover:underline"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-white hover:text-white transition-colors hover:underline"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          {/* <p className="text-white text-base text-center">
            DABIBLE FOUNDATION IS A DBA (DOING BUSINESS AS) OF KERYGMA
            FOUNDATION, A REGISTERED 501(C)(3) NON-PROFIT ORGANIZATION IN THE
            USA AND NIGERIA. ALL RIGHTS RESERVED
          </p> */}
        </div>
      </div>
    </footer>
  );
}
