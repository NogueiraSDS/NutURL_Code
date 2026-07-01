import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Video Downloader | Save Videos in MP4 Fast | NutURL',
  description: 'Download your favorite videos from TikTok, Instagram, YouTube, and more for free. No software, no registration, and no ads. Save videos in high-quality MP4 instantly with NutURL.',
  keywords: [
    'online video downloader', 
    'free video downloader', 
    'save video online', 
    'TikTok video downloader', 
    'save YouTube videos', 
    'online MP4 downloader',
    'instagram video downloader',
    'baixar video online',
    'baixar video tiktok',
    'baixar video youtube'
  ],
  openGraph: {
    title: 'Fast Online Video Downloader: Save Any Video for Free | NutURL',
    description: 'Download videos, audio, and images from any social media link in seconds. Fast, free, and secure.',
    url: 'https://nuturl.com/downloader',
    siteName: 'NutURL',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fast Online Video Downloader: Save Any Video for Free | NutURL',
    description: 'Download videos, audio, and images from any social media link in seconds. Fast, free, and secure.',
  }
};

export default function DownloaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
