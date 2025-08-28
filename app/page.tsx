// "use client"
import BibleStudyForm from "@/components/BibleStudyForm";
import Image from "next/image";
import type { Metadata } from 'next'
import CountryTimeSelector from "@/components/CountryTimeSelector";

export const metadata: Metadata = {
  title: "Antioch Online Bible Study | DaBible Foundation",
  description: "Join our interactive online Bible Study every weekday. Grow with other believers, study the Word, and experience spiritual transformation.",
  openGraph: {
    title: "Antioch Online Bible Study | DaBible Foundation",
    description: "Join our interactive online Bible Study every weekday. Grow with other believers, study the Word, and experience spiritual transformation.",
    images: [
      {
        url: "https://welcometoantioch.com/png/antioch-large.png",
        width: 1200,
        height: 630,
        alt: "Antioch Online Bible Study",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Antioch Online Bible Study | DaBible Foundation",
    description: "Join our interactive online Bible Study every weekday. Grow with other believers, study the Word, and experience spiritual transformation.",
    images: ["https://welcometoantioch.com/png/antioch-large.png"],
  },
};

export default function AntiochPage() {

  return (
    <div className="w-full">
      <section className="bg-[#fef9f4] py-16 px-6 md:px-20 flex flex-col-reverse lg:flex-row items-center gap-10 relative overflow-hidden">
        {/* Left Text Content */}
        <div className="absolute inset-0 w-full bg-[url('/designs/bible-girl.jpg')] bg-top-left lg:bg-top-right bg-no-repeat z-1"></div>
        <div className="absolute w-full bg-gradient-to-t from-20% from-white to-transparent z-2 bottom-0 left-0 h-32"></div>
        <div className="absolute inset-0 w-full bg-[url('/svg/polygon-1.svg')] bg-top-left lg:bg-bottom-left bg-no-repeat z-1"></div>


        <div className="w-full mt-0 lg:mt-18 md:w-2xl lg:w-5xl self-center container mx-auto text-center z-3">
            <h1 className="text-5xl md:text-8xl lg:text-6xl xl:text-8xl font-extrabold text-[#1e1e1e] leading-tight font-montserrat">
                Just Got <span className="text-white bg-red-500 px-4 py-1 rounded-4xl italic">Born</span> Again?
            </h1>
            <div className="bg-[url('/svg/line-break.svg')] inset-0 w-full h-[25px]  bg-size-[25px] bg-repeat my-14"></div>
            <p className="text-3xl mx-auto lg:text-6xl mt-6 text-gray-800 font-bold font-montserrat md:max-w-lg">
                Confused about <span className="text-red-500 font-extrabold underline">where</span> to start?
            </p>
            <p className="text-lg md:text-lg lg:text-2xl mt-2 md:mt-8 max-w-xl !mx-auto lg:mx-0 text-gray-700 font-proza-libre font-medium text-center">
            We now have an online bible study platform.
            </p>

            <div className="bg-[url('/svg/line-break-2.svg')] w-full h-[20px] bg-center bg-contain bg-no-repeat my-8 mx-auto"></div>
            
            <Image
            src="/svg/antioch.svg"
            alt="Bible Study Logo"
            className="w-2/3 max-w-md h-auto object-contain mx-auto mt-4"
            width={500}
            height={500}
            />
            <p className="text-md md:text-xl lg:text-2xl font-medium -mt-4 text-gray-800">where you can grow with other believers in the Word of God every day.</p>
            {/* <p className="font-comforter text-6xl lg:text-8xl">Join our</p>
            <p className="text-4xl text-[#111556] -mt-4 font-extrabold font-montserrat lg:text-8xl uppercase">Online Bible Study</p> */}
        </div>

        {/* Right Image */}
        {/* <div className="flex-1 w-full max-w-md"> */}
        {/* <Image
            src="/designs/bible-girl.jpg"
            alt="Woman holding Bible"
            className="w-2/3 h-auto object-contain absolute top-0 right-0"
            width={500}
            height={500}
            /> */}
        {/* </div> */}

        {/* Decorative background elements can be added here */}
        </section>

        <section className="bg-white py-0 md:py-16 px-6 md:px-20">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
                {/* Speaker Image */}
                <div className="flex-1">
                <Image
                    src="/designs/sanmi.jpg"
                    alt="Bible Study Testimonial Speaker"
                    className="w-full max-w-sm mx-auto rounded-lg"
                    width={500}
                    height={500}
                />
                </div>

                {/* Description */}
                <div className="flex-1 text-center lg:text-left">
                <span className="bg-gray-200 text-sm px-3 py-1 rounded-full uppercase font-semibold tracking-wide mb-4 inline-block">
                    Live
                </span>
                <h2 className="text-3xl md:text-5xl text-gray-900 mb-4 font-montserrat font-extrabold">
                    Daily Bible Study
                </h2>
                <p className="text-gray-700 text-base md:text-lg mb-6">
                    Join a community of believers who meet together every night from Monday to Friday to study the bible, pray and intercede.
                </p>

                {/* What Will Happen */}
                <h3 className="text-xl mb-4 text-gray-900 font-montserrat font-extrabold">What Will Happen</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-md text-gray-800 font-medium">
                    <div className="flex items-center gap-2">🕊️ Encounter with The Holy Spirit</div>
                    <div className="flex items-center gap-2">📖 Revelation of the Word</div>
                    <div className="flex items-center gap-2">🔥 Intense Prayers</div>
                    <div className="flex items-center gap-2">🧑🏾‍🤝‍🧑🏽 Guest Ministers</div>
                    <div className="flex items-center gap-2">🌱 Spiritual Growth</div>
                    <div className="flex items-center gap-2">✨ Total Transformation</div>
                </div>
                </div>
            </div>
            </section>

        <section className="bg-[#fff7f2] py-16 px-6 md:px-20">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10">
                {/* Left Image */}
                <div className="flex-1">
                    <h3 className="text-3xl md:text-5xl text-gray-900 mb-4 font-montserrat font-extrabold">
                    How To Participate
                </h3>
                <p className="text-md md:text-lg text-gray-700 mb-6">
                    We meet together <strong>Monday to Friday</strong> on Google Meet for <strong>1 hour</strong> of interactive Bible Study.
                </p>

                <Image
                    width={500}
                    height={500}
                    src="/svg/antioch-participants.svg"
                    alt="Bible Study Participants"
                    className="w-full rounded-lg shadow-md"
                />
                </div>

                {/* Right Content */}
                <div className="flex-1">
                
                <p className="text-lg max-w-4xl text-gray-600 mx-auto mb-8">
                    Join our interactive Bible Study live on Google Meet, while the session is also livestreamed on YouTube and Instagram.
                </p>
                <ul className="">
                    <li className="text-lg text-gray-800 mb-4 flex items-start gap-3"><span className="font-semibold">📍 Location:</span> Google Meet</li>
                    <li className="text-lg text-gray-800 mb-4 flex items-start gap-3"><span className="font-semibold">🕒 Time:</span> 9:00 PM CST</li>
                    <li className="text-lg text-gray-800 mb-4 flex items-start gap-3"><span className="font-semibold">🌐 Livestream:</span> YouTube & Instagram</li>
                </ul>

                <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Steps to join:</h4>
                    <ol className="list-decimal list-inside pl-2">
                        <li className="text-gray-800 mb-2 leading-relaxed">Register for the session on our website.</li>
                        <li className="text-gray-800 mb-2 leading-relaxed">Join WhatsApp Onboarding group.</li>
                        <li className="text-gray-800 mb-2 leading-relaxed">Join the Onboarding session.</li>
                        <li className="text-gray-800 mb-2 leading-relaxed">Join the Bible Study group.</li>
                    </ol>
                    <p className="text-gray-600 text-lg mt-8">The online experience is designed to be engaging and participatory!</p>
                </div>  
                </div>
            </div>
        </section>
        

        <section className="py-16 px-6 md:px-20">
            <div className="max-w-6xl mx-auto">
                <CountryTimeSelector />
                <div className="bg-[url('/svg/line-break.svg')] inset-0 w-full h-[25px]  bg-size-[25px] bg-repeat mt-14"></div>
            </div>
        </section>

        

        <section id="register" className="bg-white py-16 px-6 md:px-20">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-8xl lg:text-6xl xl:text-8xl font-extrabold text-[#1e1e1e] leading-tight font-montserrat">
                        Join <span className="text-white bg-red-500 px-8 py-1 rounded-2xl italic">Us</span>
                    </h1>
                </div>

            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 content-stretch items-center">
                
                {/* Form Content */}
                
                <BibleStudyForm/>

                {/* Right Poster */}
                <div className="w-full  mx-auto items-stretch lg:h-full text-center justify-center">
                <h3 className="text-2xl md:text-4xl text-gray-900 mb-4 font-montserrat font-extrabold">
                        Current Session:
                    </h3>
                    <p className="text-md md:text-lg text-gray-700 mb-6">
                    We are studying the book of Hebrews, and its interesting!
                </p>
                <Image
                    width={500}
                    height={500}
                    src="/designs/hebrews.jpg"
                    alt="Book of Hebrews Poster"
                    className="w-full h-full object-cover rounded-lg shadow-lg"
                />
                </div>
            </div>
        </section>

        {/* Watch and Join Online Section */}
        {/* <section className="bg-gray-100 py-16 px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 font-domine">
                Can’t Attend in Person?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto font-mada">
                Don’t worry! You can join us live from anywhere in the world via YouTube or Google Meet.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6">
                <a
                href="https://youtube.com/@dabible"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                >
                Watch on YouTube
                </a>

                <a
                href="https://meet.google.com/your-meeting-id"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                >
                Join on Google Meet
                </a>
            </div>

            <p className="text-sm text-gray-500 mt-6">
                Streaming begins 10 minutes before each session. Please be on time!
            </p>
        </section> */}


    </div>
  );
}
