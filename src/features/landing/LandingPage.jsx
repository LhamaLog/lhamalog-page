import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import { Faq } from "./components/Faq";
import { FinalCta } from "./components/FinalCta";
import { FloatingNav } from "./components/FloatingNav";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { AiSuggestionMock } from "./components/mocks/AiSuggestionMock";
import { AlertsMock } from "./components/mocks/AlertsMock";
import { MaskedDataMock } from "./components/mocks/MaskedDataMock";
import { OccurrencesMock } from "./components/mocks/OccurrencesMock";
import { PlansSection } from "./components/PlansSection";
import { ResourcesSection } from "./components/ResourcesSection";
// Mesma fonte (Poppins da marca) das telas de assinatura.
const FONT = "'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif";
// Tela de exemplo de cada bloco de recursos.
const SCREENS = {
  ocorrencias: <OccurrencesMock />,
  // Outro serviço e outro erro que os do topo (que usa o exemplo "pedidos"), para a mesma tela não se repetir.
  "sugestao-ia": <AiSuggestionMock example="faturas" />,
  "dados-mascarados": <MaskedDataMock />,
  alertas: <AlertsMock />,
};
// Landing page pública: barra, topo, "Como funciona", recursos, planos, perguntas, chamada final e rodapé.
// Fundos alternados (FR-026): branco (Como funciona), cinza (recursos), cinza (planos), branco (perguntas), escuro (chamada final e rodapé).
export function LandingPage() {
  return (
    <div className="min-h-dvh bg-white text-[#141826]" style={{ fontFamily: FONT }}>
      <FloatingNav />
      <main>
        <Hero />
        <HowItWorks />
        <ResourcesSection screens={SCREENS} />
        <PlansSection />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
