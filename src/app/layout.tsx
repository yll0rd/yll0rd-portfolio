import type { Metadata } from "next"
import { Inter } from "next/font/google";
// @ts-ignore
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"

const inter = Inter({
  subsets: ["latin"],
  display: 'swap'
})

export const metadata: Metadata = {
  title: "Youmbi | Software Engineer",
  description: "Youmbi is a software engineer who loves creating web and mobile apps, and is keenly interested in developing innovative blockchain dApps.",
  keywords: ['yll0rd', 'yllord', 'youmbi', 'leo', 'lordson', 'yombi', 'blockchain', 'web3', 'Next.js', 'React', 'fullstack', 'frontend', 'backend', 'cyril', 'bandolo'],
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
      "Youmbi is a software engineer who loves creating web and mobile apps, and is keenly interested in developing innovative blockchain dApps.",
    url: "https://yll0rd.me",
    siteName: 'Youmbi Leo',
    locale: 'en_US',
    type: 'website',
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
    card: 'summary_large_image',
    title: {
      default: "Youmbi Leo",
      template: "%s | Youmbi Leo",
    },
    description:
      "Youmbi is a software engineer who loves creating web and mobile apps, and is keenly interested in developing innovative blockchain dApps.",
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
    canonical: "https://yll0rd.me"
  },
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', sizes: '96x96', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],

    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground relative">
            <div className="absolute inset-0 dotted-background" />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
} 