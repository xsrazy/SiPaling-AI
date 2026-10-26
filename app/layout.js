import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://sipaling.ai.id"),
  title: "SiPaling AI: Si Paling Bisa Semua",
  description: "SiPaling AI: chat sama AI, bikin gambar, download video TikTok, nonton drama sub Indo, baca komik, cari web. Buka, klik, langsung pake.",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32" },
      { url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    url: "https://sipaling.ai.id",
    siteName: "SiPaling AI",
    title: "SiPaling AI: Si Paling Bisa Semua",
    description: "Chat AI, bikin gambar, download TikTok, nonton drama, baca komik. Semua ngumpul di satu web.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "SiPaling AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SiPaling AI: Si Paling Bisa Semua",
    description: "Chat AI, bikin gambar, download TikTok, nonton drama, baca komik. Semua ngumpul di satu web.",
    images: ["/og-image.jpg"],
  },
  alternates: { canonical: "https://sipaling.ai.id" },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
