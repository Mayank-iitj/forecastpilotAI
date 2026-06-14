import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: "ForecastPilot AI — AI-Powered Revenue Forecasting",
  description:
    "Forecast revenue, ROAS, risk and budget allocation before spending a single dollar. The AI-powered Marketing CFO for ecommerce growth teams.",
  keywords: [
    "marketing forecasting",
    "ROAS prediction",
    "budget optimization",
    "ecommerce analytics",
    "AI marketing",
    "revenue forecasting",
  ],
  authors: [{ name: "ForecastPilot AI" }],
  openGraph: {
    title: "ForecastPilot AI — AI-Powered Revenue Forecasting",
    description:
      "Forecast revenue, ROAS, risk and budget allocation before spending a single dollar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased">
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
