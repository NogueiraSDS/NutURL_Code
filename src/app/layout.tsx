import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

import { AuthProvider } from "@/context/AuthContext";

import { I18nProvider } from "@/context/I18nContext";

export const metadata: Metadata = {
  title: "NutURL - Premium Link-in-Bio & URL Shortener",
  description: "Crie páginas de links personalizadas e encurte URLs com métricas de acesso em tempo real e redirecionamentos inteligentes.",
  keywords: ["encurtador de url", "link tree", "link na bio", "linktree gratis", "nuturl", "analytics links", "monetizacao de links"],
  authors: [{ name: "NutURL Team" }],
  openGraph: {
    title: "NutURL - Premium Link-in-Bio & URL Shortener",
    description: "Crie páginas de links personalizadas e encurte URLs com métricas de acesso em tempo real.",
    url: "https://nuturl.com",
    siteName: "NutURL",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutURL - Premium Link-in-Bio & URL Shortener",
    description: "Crie páginas de links personalizadas e encurte URLs com métricas de acesso em tempo real.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <I18nProvider>
          <AuthProvider>
            <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              {children}
            </main>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
