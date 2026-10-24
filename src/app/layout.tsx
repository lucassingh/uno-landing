import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { fontVariables } from "@/lib/fonts";
import { LoaderProvider } from "@/components/ui/Loader";

const title = "más uno — diseño web + apps, a medida";
const description =
  "Webs que venden y apps a medida para ordenar tu negocio, con la infraestructura y el soporte incluidos. Sin plantillas ni relleno.";

export const metadata: Metadata = {
  title,
  description,
  icons: { icon: "/logo/favicon.svg" },
  // base para las URLs absolutas de og:image (WhatsApp/redes ignoran las relativas)
  metadataBase: new URL("https://masuno.io"),
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "más uno",
    locale: "es_AR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title, description },
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
