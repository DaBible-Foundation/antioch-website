import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import { GoogleTagManager } from '@next/third-parties/google'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Antioch - Welcome to Antioch",
  description: "Where a little one becomes a thousand, and a small one becomes a strong nation. Join us for a life transforming experience in the Word.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge"></meta>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* <GoogleTagManager gtmId="GTM-5S7K5XS" /> */}
        {/* Google Tag Manager */}
        {/* <script dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','AW-431305064');
          `,
        }} /> */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
        {/* Google Tag Manager (noscript) */}
        {/* <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=AW-431305064"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript> */}
        {/* End Google Tag Manager (noscript) */}
      <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
