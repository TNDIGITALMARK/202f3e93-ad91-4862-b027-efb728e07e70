import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryProvider } from "@/components/query-provider";
import { PokemonProvider } from "@/contexts/pokemon-context";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Pokédex - Comprehensive Pokemon Database",
  description: "Explore the complete Pokemon universe with detailed information, evolution chains, type effectiveness, and more.",
  keywords: "pokemon, pokedex, evolution, types, stats, abilities",
  authors: [{ name: "Pokédex Team" }],
  openGraph: {
    title: "Pokédex - Comprehensive Pokemon Database",
    description: "Explore the complete Pokemon universe with detailed information, evolution chains, type effectiveness, and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${montserrat.variable} antialiased`}
      >
        <script src="/phoenix-tracking.js" async></script>

        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <PokemonProvider>
              <TooltipProvider>
                {children}
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </PokemonProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
