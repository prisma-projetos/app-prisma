import type { Metadata } from "next";
import { Atkinson_Hyperlegible_Next } from "next/font/google";
import { Cabecalho } from "@/app/components/cabecalho";
import { Rodape } from "@/app/components/rodape";
import { Providers } from "@/app/providers";
import { SCRIPT_TEMA_INICIAL } from "@/app/lib/tema";
import "./globals.css";


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
          dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA_INICIAL }}
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
