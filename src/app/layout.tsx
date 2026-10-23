import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

import { AuthProvider } from "@/context/AuthContext";

import { I18nProvider } from "@/context/I18nContext";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nuturl.com"),
  title: "NutURL — Link na Bio, Encurtador de URL (wnet.me) e Downloader de Vídeos",
  description: "A plataforma completa para criadores e afiliados: crie sua página de Link na Bio grátis, encurte links com o domínio exclusivo wnet.me e baixe vídeos sem anúncios.",
  keywords: [
    "link na bio",
    "alternativa ao linktree",
    "encurtador de url",
    "encurtador de link whatsapp",
    "wnet.me",
    "wnut.me",
    "nuturl",
    "baixar videos",
    "downloader de midia",
    "agrupador de links",
    "download tiktok",
    "download reels"
  ],
  authors: [{ name: "NutURL Team" }],
  alternates: {
    canonical: "https://nuturl.com/",
  },
  openGraph: {
    title: "NutURL — Bio Link, Encurtador (wnet.me) e Downloader em 1 só lugar",
    description: "Crie sua página de links, encurte URLs com domínio ultra-curto (wnet.me) e baixe vídeos das redes sociais rapidamente.",
    url: "https://nuturl.com/",
    siteName: "NutURL",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutURL — Bio Link, Encurtador (wnet.me) e Downloader",
    description: "Substitua 3 ferramentas por 1. Link na Bio, encurtador wnet.me e download de vídeos sem anúncios.",
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
        {/* Google Analytics (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-H5WL9D44X9"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-H5WL9D44X9');
          `}
        </Script>

        <I18nProvider>
          <AuthProvider>
            <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              {children}
            </main>
            <CookieConsent />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
