import type { Metadata } from "next";
import { Navbar, CtaFinal, Footer } from "@/components/sections";
import {
    SystemHero,
    SystemMapa,
    SystemAsistente,
    SystemMulticanal,
    SystemCrm,
    SystemStock,
    SystemRubro,
    SystemEquipo,
    SystemVsErp,
    SystemCaso,
    SystemPrecios,
    SystemFaq,
} from "@/components/sections/system";

export const metadata: Metadata = {
    title: "el sistema +uno, por dentro — más uno",
    description:
        "El asistente con IA que filtra y atiende, el mini-CRM que ordena cada lead y el módulo de stock que ordena tu inventario — todo el Sistema +uno, explicado a fondo.",
};

export default function SystemPage() {
    return (
        <>
            <Navbar />
            <main>
                <SystemHero />
                <SystemMapa />
                <SystemAsistente />
                <SystemMulticanal />
                <SystemCrm />
                <SystemStock />
                <SystemRubro />
                <SystemEquipo />
                <SystemVsErp />
                <SystemCaso />
                <SystemPrecios />
                <SystemFaq />
            </main>
            <CtaFinal />
            <Footer />
        </>
    );
}
