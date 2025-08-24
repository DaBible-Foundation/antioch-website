"use client";

import Image from "next/image";
// import { Button } from "@/components/ui/button";
import { 
  //ChevronDown, Heart,
  //  ShoppingCart, 
   Menu } from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function Header() {
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    if (showProductsDropdown) {
      setShowProductsDropdown(false);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 bg-white shadow-sm ${isScrolled ? 'shadow-md' : ''} transition-shadow duration-300`}>
      <div className="container mx-auto px-4 py-4 relative">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Image
              src="/svg/antioch.svg"
              alt="Antioch Logo"
              width={120}
              height={40}
              className="mr-8"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-x-12">
            <button
              onClick={() => navigate("/")}
              className={`${pathname === "/" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 cursor-pointer`}
            >
              Home
            </button>

            <button
              onClick={() => navigate("#register")}
              className={`${pathname === "/register" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 cursor-pointer`}
            >
              Register <span className="text-gray-500">(Free)</span>
            </button>

            {/* <button
              onClick={() => navigate("/about")}
              className={`${pathname === "/about" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 cursor-pointer`}
            >
              About Us
            </button>
            <div className="relative group">
              <button
                className={`${pathname.includes("/products") ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 flex items-center cursor-pointer`}
                onClick={() => setShowProductsDropdown(!showProductsDropdown)}
              >
                Products <ChevronDown className={`ml-0.5 ${pathname.includes("/products") ? "text-[#6B051F]" : ""}`} />
              </button>
              {showProductsDropdown && (
                <div className="absolute left-0 mt-3 w-48 bg-white border rounded-md shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => navigate("/products/solar-audio-bible")}
                      className={`block w-full text-left px-4 py-2 text-sm ${pathname === "/products/solar-audio-bible" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:bg-gray-100 cursor-pointer`}
                    >
                      Solar Audio Bible
                    </button>
                    <button
                      onClick={() => navigate("/products/yoruba-audio-bible")}
                      className={`block w-full text-left px-4 py-2 text-sm ${pathname === "/products/yoruba-audio-bible" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:bg-gray-100 cursor-pointer`}
                    >
                      Yoruba Audio Bible
                    </button>
                    <button
                      onClick={() => navigate("/products/pidgin-audio-bible")}
                      className={`block w-full text-left px-4 py-2 text-sm ${pathname === "/products/pidgin-audio-bible" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:bg-gray-100 cursor-pointer`}
                    >
                      Pidgin Audio Bible
                    </button>
                    <button
                      onClick={() => navigate("/products/hausa-audio-bible")}
                      className={`block w-full text-left px-4 py-2 text-sm ${pathname === "/products/hausa-audio-bible" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:bg-gray-100 cursor-pointer`}
                    >
                      Hausa Audio Bible
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => navigate("/blog")}
              className={`${pathname === "/blog" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 cursor-pointer`}
            >
              Blog
            </button>
            <button
              onClick={() => navigate("/antioch")}
              className={`${pathname === "/antioch" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 cursor-pointer`}
            >
              Bible Study
            </button> */}
            {/* <button
              onClick={() => navigate("/shop")}
              className={`${pathname === "/shop" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 cursor-pointer`}
            >
              Shop
            </button> */}
          </nav>

          {/* Mobile Navigation */}
          <div className={`lg:hidden fixed inset-0 bg-white z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="p-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-4 right-4 text-gray-600 cursor-pointer"
              >
                ✕
              </button>
              <nav className="mt-12 flex flex-col space-y-4 items-center">
                <button
                  onClick={() => navigate("/")}
                  className={`${pathname === "/" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 py-2 cursor-pointer`}
                >
                  Home
                </button>
                <button
                  onClick={() => navigate("#register")}
                  className={`${pathname === "/about" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 py-2 cursor-pointer`}
                >
                  Register
                </button>
                {/* <button
                  onClick={() => navigate("/about")}
                  className={`${pathname === "/about" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 py-2 cursor-pointer`}
                >
                  About Us
                </button>
                <button
                  onClick={() => setShowProductsDropdown(!showProductsDropdown)}
                  className={`${pathname.includes("/products") ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 py-2 flex items-center cursor-pointer`}
                >
                  Products <ChevronDown className={`ml-2 ${pathname.includes("/products") ? "text-[#6B051F]" : ""}`} />
                </button>
                {showProductsDropdown && (
                  <div className="pl-4 space-y-2">
                    <button
                      onClick={() => navigate("/products/solar-audio-bible")}
                      className={`block w-full text-left py-2 text-sm ${pathname === "/products/solar-audio-bible" ? "text-[#6B051F] font-semibold" : "text-gray-700"} cursor-pointer`}
                    >
                      Solar Audio Bible
                    </button>
                    <button
                      onClick={() => navigate("/products/yoruba-audio-bible")}
                      className={`block w-full text-left py-2 text-sm ${pathname === "/products/yoruba-audio-bible" ? "text-[#6B051F] font-semibold" : "text-gray-700"} cursor-pointer`}
                    >
                      Yoruba Audio Bible
                    </button>
                    <button
                      onClick={() => navigate("/products/pidgin-audio-bible")}
                      className={`block w-full text-left py-2 text-sm ${pathname === "/products/pidgin-audio-bible" ? "text-[#6B051F] font-semibold" : "text-gray-700"} cursor-pointer`}
                    >
                      Pidgin Audio Bible
                    </button>
                    <button
                      onClick={() => navigate("/products/hausa-audio-bible")}
                      className={`block w-full text-left py-2 text-sm ${pathname === "/products/hausa-audio-bible" ? "text-[#6B051F] font-semibold" : "text-gray-700"} cursor-pointer`}
                    >
                      Hausa Audio Bible
                    </button>
                  </div>
                )}
                <button
                  onClick={() => navigate("/blog")}
                  className={`${pathname === "/blog" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 py-2 cursor-pointer`}
                >
                  Blog
                </button>
                <button
                  onClick={() => navigate("/antioch")}
                  className={`${pathname === "/antioch" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 py-2 cursor-pointer`}
                >
                  Bible Study
                </button> */}
                {/* <button
                  onClick={() => navigate("/shop")}
                  className={`${pathname === "/shop" ? "text-[#6B051F] font-semibold" : "text-gray-700"} hover:text-gray-900 py-2 cursor-pointer`}
                >
                  Shop
                </button> */}
              </nav>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* <Button
              variant="outline"
              className="flex items-center border-2 border-[#023E8A] text-[#023E8A] cursor-pointer"
              onClick={() => navigate("/shop")}
            >
              <ShoppingCart className="h-4 w-4 mr-1 text-[#023E8A]" />
              <span className="hidden sm:inline">CART</span>
            </Button> */}
            {/* <Button
              onClick={() => navigate("https://donate.dabible.com")}
              className="bg-[#C8385E] hover:bg-[#C8385E]/90 text-white cursor-pointer"
            >
              <span className="hidden sm:inline">DONATE</span>
              <span className="sm:hidden">
                <Heart className="h-4 w-4" />
              </span>
            </Button> */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
