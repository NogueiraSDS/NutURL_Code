import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "NutURL - Premium URL Shortener",
  description: "Encurte seus links e acompanhe as métricas de acesso.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
