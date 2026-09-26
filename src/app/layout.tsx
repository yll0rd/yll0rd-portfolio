import type { Metadata } from "next";
import { IBM_Plex_Sans, Newsreader } from "next/font/google";
// @ts-ignore
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import Navbar from "@/components/navbar";

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-sans",
});
const serif = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  adjustFontFallback: false,
  fallback: ["Georgia", "serif"],
});

export const metadata: Metadata = {
  title: "Youmbi Leo | AI/ML Engineer",
  description:
    "Youmbi Leo is an AI/ML engineer with a full-stack background, building machine learning models and LLM-powered applications that ship in real products.",
  keywords: [
    "yll0rd",
    "yllord",
    "youmbi",
    "leo",
    "lordson",
    "yombi",
    "AI engineer",
    "machine learning engineer",
    "ML engineer",
    "LLM",
    "generative AI",
    "PyTorch",
    "Python",
    "Next.js",
    "React",
    "fullstack",
    "cyril",
    "bandolo",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: {
      default: "Youmbi Leo",
      template: "%s | Youmbi Leo",
    },
    description:
      "Youmbi Leo is an AI/ML engineer with a full-stack background, building machine learning models and LLM-powered applications that ship in real products.",
    url: "https://yll0rd.me",
    siteName: "Youmbi Leo",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: `https://yll0rd.me/myself.jpg`, // Must be an absolute URL
        width: 3050,
        height: 3812,
        alt: "Youmbi Leo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Youmbi Leo",
      template: "%s | Youmbi Leo",
    },
    description:
      "Youmbi Leo is an AI/ML engineer with a full-stack background, building machine learning models and LLM-powered applications that ship in real products.",
    images: [
      {
        url: `https://yll0rd.me/myself.jpg`, // Must be an absolute URL
        width: 3050,
        height: 3812,
        alt: "Youmbi Leo",
      },
    ],
  },
  alternates: {
    canonical: "https://yll0rd.me",
  },
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", sizes: "96x96", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],

    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sans.className} ${sans.variable} ${serif.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <a
              href="#main-content"
              className="fixed -top-[100px] left-5 z-[100] bg-primary px-5 py-3 text-primary-foreground focus:top-3"
            >
              Skip to content
            </a>
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
