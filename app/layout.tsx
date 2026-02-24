import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobBoard Pro | Find Your Next Role",
  description:
    "Browse thousands of job opportunities with advanced filtering, sorting, and export capabilities.",
  keywords: ["jobs", "careers", "employment", "job portal", "job listings"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
