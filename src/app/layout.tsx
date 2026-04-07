import { Toaster } from "@/components/ui/sonner";
import { TRPCProviderClient } from "@/providers";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hyvmind | Pattern's Knowledge Platform",
  description:
    "Hyvmind is Pattern's internal AI learning and knowledge platform. Discover resources, learn from experts, and level up your skills.",
  icons: {
    icon: "/logo.svg",
  },
  category: "knowledge",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${dmSans.className} antialiased`}>
          <Toaster richColors />
          <TRPCProviderClient>{children}</TRPCProviderClient>
        </body>
      </html>
    </ClerkProvider>
  );
}
