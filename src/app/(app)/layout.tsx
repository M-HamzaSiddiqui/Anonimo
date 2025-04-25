import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Anonylytics | Build Forms. Gain Insights. Stay Anonymous.",
  description:
    "Create quizzes, feedback forms, and surveys with ease. Get smart visual insights across form categories — all while keeping responses anonymous.",
  keywords:
    "anonylytics, anonymous forms, feedback tool, quiz builder, survey analytics, form insights, response analytics, data visualization",
  authors: [{ name: "Anonylytics Team" }],
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <Navbar />
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
