import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";
import { UserProvider } from "@/components/providers/user-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return {
    title: {
      default: "CodeSnippet - Share & Discover Code Snippets",
      template: `%s | CodeSnippet`,
    },
    description:
      "A platform for developers to share, discover, and analyze code snippets with time complexity estimation. Browse snippets by language, tag, and complexity.",
    keywords: [
      "code snippets",
      "programming",
      "algorithms",
      "time complexity",
      "code sharing",
      "developer tools",
    ],
    authors: [{ name: "Vinh" }],
    creator: "Vinh",
    publisher: "Vinh",
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
    openGraph: {
      title: "CodeSnippet - Share & Discover Code Snippets",
      description:
        "A platform for developers to share, discover, and analyze code snippets with time complexity estimation.",
      url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
      siteName: "CodeSnippet",
      locale: lang,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "CodeSnippet - Share & Discover Code Snippets",
      description:
        "A platform for developers to share, discover, and analyze code snippets with time complexity estimation.",
    },
  };
}

export default async function Layout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  return (
    <html lang={(await params).lang}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextAuthProvider>
          <UserProvider>
            {children}
            <Toaster />
          </UserProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
