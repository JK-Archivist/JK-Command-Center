import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Mission Control for OpenClaw",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/tasks", label: "Tasks" },
    { href: "/content", label: "Content" },
    { href: "/calendar", label: "Calendar" },
    { href: "/memory", label: "Memory" },
    { href: "/team", label: "Team" },
    { href: "/office", label: "Office" },
  ];
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900`}>
        <header className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center gap-4">
            <div className="font-semibold">Mission Control</div>
            <nav className="flex gap-3 text-sm text-slate-700">
              {links.map(l => (
                <Link key={l.href} href={l.href} className="hover:underline">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">{children}</main>
      </body>
    </html>
  );
}
