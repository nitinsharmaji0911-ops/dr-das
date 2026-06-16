import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Das Dental Clinic | Nagpur's Most Trusted Dental Specialists",
  description: "Pain-free treatments by MDS Gold Medalist specialists. Dental Implants, Invisalign, Braces & Smile Makeovers. Three clinics across Nagpur — Jaripatka, Sadar, and Indora.",
  keywords: "Dentist in Nagpur, Dental Clinic Nagpur, Implants Nagpur, Invisalign Nagpur, Braces Nagpur, Dr. Das Dental Clinic, Jaripatka, Sadar, Indora",
  openGraph: {
    title: "Das Dental Clinic | 15,000+ Smiles and Counting",
    description: "Nagpur's Most Trusted Dental Specialists. Pain-free treatments by MDS Gold Medalists.",
    url: "https://das-dental-clinic.vercel.app",
    siteName: "Das Dental Clinic",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
