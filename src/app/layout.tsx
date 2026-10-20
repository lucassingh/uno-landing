import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { LoaderProvider } from "@/components/ui/Loader";

export const metadata: Metadata = {
  title: "más uno — diseño web + automatización, a medida",
  description: "Landing en reconstrucción bajo la nueva dirección visual de +uno.",
  icons: { icon: "/logo/favicon.svg" },
  metadataBase: new URL("https://masuno.example"),
  openGraph: {
    title: "más uno — diseño web + automatización, a medida",
    description: "Landing en reconstrucción bajo la nueva dirección visual de +uno.",
    type: "website",
  },
  // verificación del dominio en Meta Business (la pide la verificación del negocio para WhatsApp)
  verification: {
    other: { "facebook-domain-verification": "9r5bzye9cvxwr4c5fbrf7g1u1jdxqt" },
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={fontVariables}>
      <body>
        <LoaderProvider>{children}</LoaderProvider>
      </body>
    </html>
  );
}
