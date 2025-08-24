"use client";

import Image from "next/image";
import Link from "next/link";
import { Gift, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import "animate.css";
import DownloadButtons from "@/components/DownloadButtons";
import { testimonials } from "@/lib/testimony";
import { 
  // use,
   useEffect, useState } from "react";
import VideoModal from "@/components/VideoModal";
import ProductHoverCard from "@/components/ProductHoverCard";
import SolarVideoDemo from "@/components/Solar-Video-Demo";

export default function DonationPage() {
  // Hero carousel logic
  const heroSlides = [
    {
      id: 1,
      title: "AUDIO BIBLE IN YORUBA LANGUAGE",
      description:
        "Our mission is to provide the Bible in African languages, support children orphaned by religious terrorism in Nigeria, providing them with shelter, education, and care to rebuild their futures.",
      highlight: "YORUBA",
      bgImage: "/png/home-hero-1.png",
      textColor: "text-[#7B0423]",
      themeColor: "text-[#7B0423]",
      gradientColor: "from-[#FFF7FA] via-[#FFF7FA]]/100 to-transparent",
      showGradient: true,
      totalUsers: "54,138",
      rating: "4.6",
      playstoreLink:
        "https://play.google.com/store/apps/details?id=net.yorubabible.audiobible",
      appleLink:
        "https://apps.apple.com/us/app/yoruba-audio-bible/id1079050631",
    },
    {
      id: 2,
      title: "AUDIO BIBLE IN HAUSA LANGUAGE",
      description:
        "Listen to the Word of God in Hausa anywhere you are. The complete Old and New Testaments are available offline.",
      highlight: "HAUSA",
      bgImage: "/png/home-hero-2.png",
      textColor: "text-[#19832F]",
      themeColor: "text-[#19832F]",
      gradientColor: "from-[#E0FFE4] via-[#E0FFE4]/90 to-transparent",
      showGradient: true,
      totalUsers: "12,098",
      rating: "4.4",
      appleLink: "https://apps.apple.com/us/app/hausa-audio-bible/id6739508818",
      playstoreLink:
        "https://play.google.com/store/apps/details?id=com.dabible.hausa&hl=en_US",
    },
    {
      id: 3,
      title: "AUDIO BIBLE IN PIDGIN LANGAUGE",
      description:
        "Na God Word wey dey make sense! Download our Pidgin Bible app and hear the message in your heart language.",
      highlight: "PIDGIN",
      bgImage: "/png/home-hero-3.png",
      textColor: "text-[#3EA7F7]",
      themeColor: "text-[#3EA7F7]",
      gradientColor: "from-[#E3F2FD] via-[#E3F2FD]/90 to-transparent",
      showGradient: true,
      totalUsers: "15,232",
      rating: "4.5",
      appleLink:
        "https://apps.apple.com/us/app/pidgin-audio-bible/id1492872631?ls=1",
      playstoreLink:
        "https://play.google.com/store/apps/details?id=com.dabible.pidgin",
    },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        const next = (currentSlide + 1) % heroSlides.length;
        setCurrentSlide(next);
        setFade(true);
      }, 500); // Halfway fade-out, then switch
    }, 6000);
    return () => clearInterval(interval);
  }, [currentSlide, paused, heroSlides.length]);

  // const [setShowVideoModal] = useState(false);

  useEffect(() => {
    const handleEsc = () => {
  
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        // key={fadeKey}
        // className="relative bg-no-repeat bg-right bg-contain transition-all duration-1000 animate-fade"
        className={`relative bg-no-repeat bg-right transition-all duration-1000 bg-cover overflow-hidden ${
          fade ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url('${heroSlides[currentSlide].bgImage}')`,
        }}
      >
        <div className="relative 2xl:max-h-[550px] z-10 lg:container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-24 flex flex-col md:flex-row items-center transition-all duration-700 ease-in-out">
          <div className="w-full md:w-1/2 lg:2/5 z-10 bg-transparent text-center md:text-left">
            <p className="text-navy-800 font-semibold mb-2 text-sm sm:text-base">
              WE PROVIDE
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4">
              AUDIO BIBLE IN{" "}
              <span className={heroSlides[currentSlide].textColor}>
                {heroSlides[currentSlide].highlight}
              </span>{" "}
              LANGUAGE
            </h1>
            <p className="text-gray-700 mb-6 sm:mb-8 text-sm sm:text-base max-w-lg">
              {heroSlides[currentSlide].description}
            </p>
            <div className="text-left md:text-center">
              <DownloadButtons
                AppStoreLink={heroSlides[currentSlide].appleLink}
                PlayStoreLink={heroSlides[currentSlide].playstoreLink}
              />
            </div>
            
            <div className="flex w-fit px-3 sm:px-2 sm:pr-4 py-1 rounded-full items-center space-x-2 text-xs sm:text-sm bg-[#E7F2FF] mt-4 sm:mt-0 mx-auto md:mx-0">
              <div className="flex items-center">
                {testimonials.slice(0, 5).map((user) =>
                  user.avatar ? (
                    <Image
                      key={user.id}
                      width={24}
                      height={24}
                      alt={user.name}
                      src={user.avatar}
                      className="rounded-full -mr-2 sm:w-[30px] sm:h-[30px]"
                    />
                  ) : (
                    <div
                      key={user.id}
                      className={`flex items-center justify-center text-white font-semibold text-xs sm:text-sm rounded-full w-[24px] h-[24px] sm:w-[30px] sm:h-[30px] -mr-2 bg-${user.avatarObj.color}-600`}
                    >
                      {user.avatarObj.initial}
                    </div>
                  )
                )}
              </div>
              <div className="ml-2 flex mr-0">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 text-[#023E8A] fill-[#023E8A]" />
              </div>
              <span className="font-semibold text-[#023E8A]">
                {" "}
                {heroSlides[currentSlide].rating}
              </span>
              <span className="text-[#023E8A] font-semibold text-xs sm:text-sm">
                {heroSlides[currentSlide].totalUsers} Happy Users
              </span>
            </div>
          </div>
          {heroSlides[currentSlide].showGradient && (
            <div
              className={`absolute lg:-left-60 inset-0 bg-white/80 md:bg-transparent md:bg-gradient-to-r ${heroSlides[currentSlide].gradientColor} z-0`}
            ></div>
          )}
          {/* Navigation Buttons and Dots */}
          <div className="flex justify-between items-center w-full lg:w-[100%] xl:w-[105%] 2xl:w-[110%] md:left-0 lg:left-0 xl:-left-20 2xl:-left-25 z-10 absolute bottom-1/2 transform mx-auto">
            <button
              onClick={() => {
                const prev =
                  (currentSlide - 1 + heroSlides.length) % heroSlides.length;
                setCurrentSlide(prev);
                setFade(true);
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer rounded-full bg-white shadow-md flex items-center justify-center text-gray-800 hover:bg-gray-100 transition"
              aria-label="Previous slide"
            >
              ←
            </button>
            <button
              onClick={() => {
                const next = (currentSlide + 1) % heroSlides.length;
                setCurrentSlide(next);
                setFade(true);
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 cursor-pointer rounded-full bg-white shadow-md flex items-center justify-center text-gray-800 hover:bg-gray-100 transition"
              aria-label="Next slide"
            >
              →
            </button>
          </div>
          <div className="flex space-x-2 mt-4 absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i === currentSlide ? "bg-blue-600" : "bg-gray-300"
                }`}
                onClick={() => {
                  setCurrentSlide(i);
                  setFade(true);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-8 sm:py-12 md:py-16" id="download">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8 gap-x-12 align-center content-stretch">
          <div className="w-full md:w-1/2 max-w-[780px] mb-0 order-2 md:order-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gradient-blue mb-4">
              Download The App And Enjoy Full Access On Offline Mode.
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#121212] font-mada font-medium mb-6 sm:mb-8">
              Download our mobile app, you can also download any of the Bible
              Books to your phone memory so that you don&apos;t need internet to
              listen to the audio anymore.
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-8">
              <div className="flex flex-col items-start">

                <div className="text-left mb-2">
                  <Image
                  src="/svg/app-card-1.svg"
                  alt="Yoruba Audio Bible"
                  width={180}
                  height={180}
                  className="w-full"
                />
                </div>
                <div className="flex flex-col text-center md:text-left w-full">
                  <Link
                    href="https://apps.apple.com/us/app/yoruba-audio-bible/id1079050631"
                    target="_blank"
                    className="text-[#023E8A] text-xs sm:text-sm underline mb-1 cursor-pointer"
                  >
                    Download for iOS
                  </Link>
                  <Link
                    href="https://play.google.com/store/apps/details?id=net.yorubabible.audiobible"
                    target="_blank"
                    className="text-[#023E8A] text-xs sm:text-sm underline cursor-pointer"
                  >
                    Download for Android
                  </Link>
                </div>
               
              </div>

              <div className="flex flex-col items-start">

                <div className="text-left mb-2">
                  <Image
                  src="/svg/app-card-2.svg"
                  alt="Hausa Audio Bible"
                  width={180}
                  height={180}
                  className="w-full"
                />
                </div>
                <div className="flex flex-col text-center md:text-left w-full">
                  <Link
                    href="https://apps.apple.com/us/app/hausa-audio-bible/id6739508818"
                    target="_blank"
                    className="text-[#023E8A] text-xs sm:text-sm underline mb-1"
                  >
                    Download for iOS
                  </Link>
                  <Link
                    href="https://play.google.com/store/apps/details?id=com.dabible.hausa&hl=en_US"
                    target="_blank"
                    className="text-[#023E8A] text-xs sm:text-sm underline"
                  >
                    Download for Android
                  </Link>
                </div>
              </div>

              <div className="flex flex-col items-start">
                
                <div className="text-left mb-2">
                  <Image
                  src="/svg/app-card-3.svg"
                  alt="Pidgin Audio Bible"
                  width={180}
                  height={180}
                  className="w-full"
                />
                </div>
              <div className="flex flex-col text-center md:text-left w-full">
                <Link
                  href="https://apps.apple.com/us/app/pidgin-audio-bible/id1492872631?ls=1"
                  target="_blank"
                  className="text-[#023E8A] text-center lg:text-left text-xs sm:text-sm underline mb-1"
                >
                  Download for iOS
                </Link>
                <Link
                  href="https://play.google.com/store/apps/details?id=com.dabible.pidgin"
                  target="_blank"
                  className="text-[#023E8A] text-center lg:text-left text-xs sm:text-sm underline"
                >
                  Download for Android
                </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-70 md:h-70 lg:h-auto  md:w-1/2 px-4 order-1 md:order-2">
            <div className="relative w-auto h-full text-center">
              <Image
                src="/videos/solar_home_1.gif"
                alt="App Interface"
                unoptimized
                width={320}
                height={540}
                className="rounded-3xl shadow-xl h-full w-auto mx-auto animate__animated animate__fadeIn animate__delay-1s"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-8 sm:py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-center font-mada mb-8 sm:mb-12">
            Our Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Solar Audio Bible */}
            <ProductHoverCard 
              Image1={"/svg/ripple-circle.svg"}
              Alt1={"Solar Audio Bible Device"}
              Image2={"/png/prod1.png"}
              Alt2={"Solar Audio Bible Device"}
              Image3={"/png/rectangle-blur-bg-1.png"}
              ProductName={"Solar"}
              ProductTag={"Audio Bible"}
              BackgroundColor={"#B42D50"}
              TextPrimaryColor={"#fff"}
              ButtonTextColor={"#B42D50"} 
              ButtonBackgroundColor={"#fff"} 
              ProductionDescription={"The Solar Audio Bible is for elderly people who cannot use mobile apps. We invite you to join us in funding this project to provide this elderly-friendly device at no cost to elderly people living in remote villages; leading many souls into a growing relationship with Jesus Christ."}
              Feature1={"The elderly people reside in remote villages"}
              Feature2={"They cannot operate mobile phones."}
              Feature3={"Even when given a bible, they cannot read due to old age or illiteracy."}
              Feature4={"Some are labeled as witches and wizards."}  
              LearnMoreLink={"/products/solar-audio-bible"}          
            />

            <ProductHoverCard 
              Image1={"/svg/ripple-circle2.svg"}
              Alt1={"Solar Audio Bible Device"}
              Image2={"/png/prod2.png"}
              Alt2={"Solar Audio Bible Device"}
              Image3={"/png/rectangle-blur-bg-2.png"}
              ProductName={"YORÙBÁ"}
              ProductTag={"Audio Bible"}
              BackgroundColor={"#FEE4EA"}
              TextPrimaryColor={"#7B0423"}
              ButtonTextColor={"#B42D50"} 
              ButtonBackgroundColor={"#fff"} 
              ProductionDescription={"Inspired by God, recorded in Ibadan, Nigeria. The first and only old & new testament bible in the Yoruba language. You can easily switch between Yoruba and English without affecting the audio player."}
              Feature1={"Listen to old and new testament from Genesis to Revelation."}
              Feature2={"Available for offline usage without internet connection all the time."}
              Feature3={"Enjoy the bible in simplified Yoruba language to make scriptures personal."} 
              Feature4={""} 
              LearnMoreLink="/products/yoruba-audio-bible"          
            />

            <ProductHoverCard 
              Image1={"/svg/ripple-circle2.svg"}
              Alt1={"Hausa Audio Bible Device"}
              Image2={"/png/prod3.png"}
              Alt2={"Hausa Audio Bible Device"}
              Image3={"/png/rectangle-blur-bg-3.png"}
              ProductName={"HAUSA"}
              ProductTag={"Audio Bible"}
              BackgroundColor={"#E0FFE4"}
              TextPrimaryColor={"#19832F"}
              ButtonTextColor={"#19832F"} 
              ButtonBackgroundColor={"#fff"} 
              ProductionDescription={"First and ONLY Old & New Testament Bible in Hausa language available on Android devices. Inspired by God, transcribed and recorded in Jos, Nigeria."}
              Feature1={"Listen to old and new testament from Genesis to Revelation."}
              Feature2={"Enjoy the bible in simplified Hausa language to make scriptures personal."}
              Feature3={"Available for offline usage without internet connection all the time."}
              Feature4={""}
              LearnMoreLink="/products/hausa-audio-bible"
            />

            <ProductHoverCard 
              Image1={"/svg/ripple-circle2.svg"}
              Alt1={"Pidgin Audio Bible Device"}
              Image2={"/png/prod4.png"}
              Alt2={"Pidgin Audio Bible Device"}
              Image3={"/png/rectangle-blur-bg-4.png"}
              ProductName={"PIDGIN"}
              ProductTag={"Audio Bible"}
              BackgroundColor={"#E3F2FD"}
              TextPrimaryColor={"#3EA7F7"}
              ButtonTextColor={"#3EA7F7"} 
              ButtonBackgroundColor={"#fff"} 
              ProductionDescription={"First and ONLY Old & New Testament Bible in Pidgin language available on Android devices. Inspired by God, transcribed and recorded in Jos, Nigeria."}
              Feature1={"Listen to old and new testament from Genesis to Revelation."}
              Feature2={"Enjoy the bible in simplified Pidgin language to make scriptures personal."}
              Feature3={"Available for offline usage without internet connection all the time."}
              Feature4={""}
              LearnMoreLink="/products/pidgin-audio-bible"
            />
          </div>
        </div>
      </section>


      <SolarVideoDemo backgroundColor="bg-white" textColor="text-black" videoSrc="/videos/solar_2.mp4" />

      {/* Support Our Mission Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden font-mada">
            <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 lg:p-12">
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-6">
                Support Our Mission
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-4 sm:mb-6 md:mb-8">
                Watch our latest video to learn more about our mission and how you can help us reach more people with the Word of God. We also have a YouTube channel where we share updates, testimonies, and more. Your support is crucial in helping us continue our work.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="https://donate.dabible.com" className="cursor-pointer">
                  <Button className="bg-[#7B0423] hover:bg-red-900 text-xl py-6 w-full sm:w-auto">
                    <Gift className="mr-1" />
                    DONATE
                  </Button>
                </Link>
                <Link
                  href="https://www.youtube.com/@dabible-foundation"
                  target="_blank"
                  className="cursor-pointer"
                >
                  <Button
                    variant="outline"
                    className="border-[#7B0423] cursor-pointer text-xl text-[#7B0423] hover:bg-red-50  py-6 w-full sm:w-auto"
                  >
                    <Play className="mr-1" /> VISIT OUR YOUTUBE CHANNEL
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/2 relative h-[300px] md:h-[400px] lg:h-[600px]">
              <VideoModal
                videoUrl="https://www.youtube.com/embed/ZD-2IKVCOfI"
                backgroundImageUrl="/png/watch.png"
              />
            </div>
            
            
            
          </div>
        </div>
      </section>

      {/* Empower Missionaries Section */}
      <section className="py-8 sm:py-12 md:py-16 font-mada text-[#06244B]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h3 className="text-base sm:text-lg md:text-xl font-medium mb-1 sm:mb-2">
              Join Us To
            </h3>
            <h2 className="text-3xl lg:text-4xl font-bold">
              Empower Missionaries
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {/* Mission Field Card */}
            <Link href="https://donate.dabible.com/agan-mission-field/" className="cursor-pointer">
            <div className="bg-[#F7F9FC] rounded-lg sm:rounded-xl overflow-hidden shadow-md px-4 sm:px-5">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#023E8A] text-center py-3 sm:py-4">
                Zam Mission Field
              </h3>
              <div className="relative h-40 sm:h-48 md:h-56 lg:h-64">
                <Image
                  src="/png/agan-1.jpg"
                  alt="Mission Field"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="p-3 sm:p-4 md:p-6 md:px-2 text-center">
                <p className="text-[#023E8A] text-xs sm:text-sm md:text-base">
                  Zam <span className="italic text-small font-bold">(real community name is withheld for security reasons)</span> in Northern Nigeria with over 250 children who have never been to school.
                </p>
              </div>
            </div>
            </Link>

            {/* School Fee Card */}
            <Link href="https://donate.dabible.com/dabible-partners/" className="cursor-pointer">
            <div className="bg-[#F7F9FC] rounded-lg sm:rounded-xl overflow-hidden shadow-md px-4 sm:px-5">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#023E8A] text-center py-3 sm:py-4">
                DaBible Monthly Partners
              </h3>
              <div className="relative h-40 sm:h-48 md:h-56 lg:h-64">
                <Image
                  src="/png/agan-2.jpg"
                  alt="School Fee"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="p-3 sm:p-4 md:p-6 text-center">
                <p className="text-[#023E8A] text-xs sm:text-sm md:text-base">
                  Your donations to our organization as a partner will enable us to record more languages in different languages.
                </p>
              </div>
            </div>
            </Link>

            {/* Crusade Card */}
            <Link href="https://donate.dabible.com/solar-audio-bible/" className="cursor-pointer">
            <div className="bg-[#F7F9FC] rounded-lg sm:rounded-xl overflow-hidden shadow-md px-4 sm:px-5">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#023E8A] text-center py-3 sm:py-4">
                Solar Audio Bible Cause
              </h3>
              <div className="relative h-40 sm:h-48 md:h-56 lg:h-64">
                <Image
                  src="/png/solar-banner.png"
                  alt="Crusade"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div className="p-3 sm:p-4 md:p-6 text-center">
                <p className="text-[#023E8A] text-xs sm:text-sm md:text-base">
                  Join us to distribute free solar audio bibles for elderly people in remote villages.
                </p>
              </div>
            </div>
            </Link>

          </div>
        </div>
      </section>
    </main>
  );
}
