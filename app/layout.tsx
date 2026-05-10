import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeRegistry from "@/components/ThemeRegistry";
import ClientLayout from "@/components/ClientLayout";

export const viewport: Viewport = {
  themeColor: '#9c27b0',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "MyWeb - 个人主页系统",
  description: "待办事项、习惯打卡、日常记录管理系统",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MyWeb",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <ThemeRegistry>
          <ClientLayout>
            {children}
          </ClientLayout>
        </ThemeRegistry>
      </body>
    </html>
  );
}