

import Image from "next/image";

export default function AntiochPage() {
  
  return (
    <div className="w-full">
      <section className="bg-[#fef9f4] py-16 px-6 md:px-20 flex flex-col-reverse lg:flex-row items-center gap-10 relative overflow-hidden">
        {/* Left Text Content */}
        <div className="absolute inset-0 w-full bg-[url('/designs/bible-girl.jpg')] bg-top-left lg:bg-top-right bg-no-repeat z-1"></div>
        <div className="absolute w-full bg-gradient-to-t from-20% from-white to-transparent z-2 bottom-0 left-0 h-32"></div>
        <div className="absolute inset-0 w-full bg-[url('/svg/polygon-1.svg')] bg-top-left lg:bg-bottom-left bg-no-repeat z-1"></div>


        <div className="w-full mt-0 lg:mt-18 md:w-2xl lg:w-5xl self-center container mx-auto text-center z-3">
            {/* <h1 className="text-5xl md:text-8xl lg:text-6xl xl:text-8xl font-extrabold text-[#1e1e1e] leading-tight font-montserrat">
                Just Got <span className="text-white bg-red-500 px-3 py-1 rounded-full">Born</span> Again?
            </h1>
            <div className="bg-[url('/svg/line-break.svg')] inset-0 w-full h-[25px]  bg-size-[25px] bg-repeat my-14"></div>
            <p className="text-3xl mx-auto lg:text-6xl mt-6 text-gray-800 font-bold font-montserrat md:max-w-lg">
                Confused about <span className="text-red-500 font-extrabold underline">where</span> to start?
            </p>
            <p className="text-lg md:text-lg lg:text-2xl mt-2 md:mt-8 max-w-xl !mx-auto lg:mx-0 text-gray-700 font-proza-libre font-medium text-center">
            We now have an online bible study platform.
            </p>

            <div className="bg-[url('/svg/line-break-2.svg')] w-full h-[20px] bg-center bg-contain bg-no-repeat my-8 mx-auto"></div> */}
            
            <Image
            src="/svg/antioch.svg"
            alt="Bible Study Logo"
            className="w-2/3 max-w-md h-auto object-contain mx-auto mt-4"
            width={500}
            height={500}
            />
            <p className="text-md md:text-xl lg:text-2xl font-medium text-gray-800">Congratulations!</p>
            <p className="text-lg md:text-xl text-gray-700 mt-4 font-proza-libre max-w-2xl mx-auto">
              Before you begin your Bible study journey, There is a 1:1 onboarding session to walk you through how we study the Bible together as a community.
            </p>
            <p className="text-lg md:text-xl text-gray-700 mt-4 font-proza-libre max-w-2xl mx-auto">
              The next onboarding session will be announced on our Onboarding WhatsApp group
            </p>
            <a
              href="https://chat.whatsapp.com/FGA9UkTb1mY0MnFGCgHTGc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Join the WhatsApp Group
            </a>
            <p className="font-comforter text-6xl lg:text-8xl mt-8">Join our</p>
            <p className="text-4xl text-[#111556] -mt-4 font-extrabold font-montserrat lg:text-5xl uppercase">WhatsApp Group</p>
        </div>

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
                    UPCOMING
                </span>
                <h2 className="text-3xl md:text-5xl text-gray-900 mb-4 font-montserrat font-extrabold">
                    Onboarding Session
                </h2>
                <p className="text-gray-700 text-base md:text-lg mb-6">
                    Join us in our next onboarding session to connect with us, ask questions, get a sneak preview, and then get you started!
                </p>

                {/* What Will Happen */}
                <h3 className="text-xl mb-4 text-gray-900 font-montserrat font-extrabold">Agenda:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 text-md text-gray-800 font-medium">
                    <div className="flex items-center gap-2">1. Brief Introduction</div>
                    <div className="flex items-center gap-2">2. Introduce Yourself</div>
                    <div className="flex items-center gap-2">3. What we believe in</div>
                    <div className="flex items-center gap-2">4. How we Study and Pray</div>
                    <div className="flex items-center gap-2">5. Your Expectations</div>
                    <div className="flex items-center gap-2">6. FAQ</div>
                </div>
                </div>
            </div>
            </section>


       

        {/* Watch and Join Online Section */}
        <section className="bg-gray-100 py-16 px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 font-domine">
                Have more questions?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto font-mada">
                Don’t worry! You can contact us on the WhatsApp group or join us for the next onboarding session.
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6">
                <a
                href="https://chat.whatsapp.com/FGA9UkTb1mY0MnFGCgHTGc"
                target="_blank"
                rel="noopener noreferrer"
                className=" bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                >
                Join WhatsApp Group
                </a>

                <a
                href="https://meet.google.com/your-meeting-id"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                >
                Contact Us
                </a>
            </div>

            <p className="text-sm text-gray-500 mt-6">
                Streaming begins 10 minutes before each session. Please be on time!
            </p>
        </section>


    </div>
  );
}
