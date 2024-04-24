import "./globals.css";
import type { Metadata } from "next";
import { IBM_Plex_Sans_Condensed } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/providers/AuthProvider";
import { ModalProvider } from "@/components/providers/ModalProvider";
import SellerProvider from "@/components/providers/SellerProvider";
import HubProvider from "@/components/providers/HubProvider";
import { LoadingProvider } from "@/components/providers/LoadingProvider";
import { cn } from "@/lib/utils";
import { DrawerProvider } from "@/components/providers/DrawerProvider";
import KycProvider from "@/components/providers/KycProvider";

const inter = IBM_Plex_Sans_Condensed({
  subsets: ["cyrillic-ext"],
  weight: "500"
});

export const metadata: Metadata = {
  title: "Home | Lorrigo",
  description: "Lorrigo is a platform for managing your logistics business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", inter.className)}>
        <LoadingProvider>
          <AuthProvider>
            <SellerProvider>
              <HubProvider>
                <KycProvider>
                  <Toaster />
                  <ModalProvider />
                  <DrawerProvider />
                  {children}
                </KycProvider>
              </HubProvider>
            </SellerProvider>
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
