import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AdminGuard from "@/components/AdminGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NutURL Admin Dashboard",
  description: "Painel administrativo de controle de usuários e métricas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-slate-950 text-slate-100 min-h-screen antialiased`}>
        <AuthProvider>
          <AdminGuard>
            {children}
          </AdminGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
