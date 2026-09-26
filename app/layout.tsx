import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next } from "next/font/google";
import { Cabecalho } from "@/app/components/cabecalho";
import { Rodape } from "@/app/components/rodape";
import { Providers } from "@/app/providers";
import "./globals.css";

const THEME_INIT_SCRIPT = `(function(){try{var k="prisma-theme";var s=localStorage.getItem(k);var t=s==="dark"||s==="light"?s:(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

const atkinson = Atkinson_Hyperlegible_Next({
  variable: "--font-atkinson",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: "PRISMA",
  description:
    "Classificação de viés político de notícias e comparação de perspectivas por entidade.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      suppressHydrationWarning
      className={`${atkinson.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Cabecalho />
        <main className="flex flex-1 flex-col">
          <Providers>{children}</Providers>
        </main>
        <Rodape />
      </body>
    </html>
  );
}
