import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Blog do Domínio Elétrico",
  keywords: ["blog", "domínio elétrico", "eletricidade", "engenharia elétrica"],
  authors: [{ name: "Nicholas Yukio" }],
  creator: "Nicholas Yukio",
  description: "Blog do Domínio Elétrico - Aprenda sobre eletricidade e engenharia elétrica",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
