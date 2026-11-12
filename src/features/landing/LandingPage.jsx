import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/poppins/800.css";
import { FEATURES, SUPPORT_TEXTS } from "./content";
import { landingSection, landingText } from "./landingTokens";
import { Faq } from "./components/Faq";
import { FeatureBlock } from "./components/FeatureBlock";
import { FinalCta } from "./components/FinalCta";
import { FloatingNav } from "./components/FloatingNav";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { IntegrationSection } from "./components/IntegrationSection";
import { AiSuggestionMock } from "./components/mocks/AiSuggestionMock";
import { AlertsMock } from "./components/mocks/AlertsMock";
import { MaskedDataMock } from "./components/mocks/MaskedDataMock";
import { OccurrencesMock } from "./components/mocks/OccurrencesMock";
import { PlansSection } from "./components/PlansSection";
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
// Landing page pública: barra, topo, "Como funciona", recursos, integração, planos, perguntas, chamada final e rodapé.
// Fundos alternados: branco (Como funciona), azul bem claro
// (recursos), branco (integração), [azul bem claro: planos], branco (perguntas), azul-marinho (chamada final), branco (rodapé).
export function LandingPage() {
  return (
    <div className="min-h-dvh bg-white text-[#141826]" style={{ fontFamily: FONT }}>
      <FloatingNav />
      <main>
        <Hero />
        <HowItWorks />
        <section
          id="recursos"
          aria-labelledby="recursos-titulo"
          className={`${landingSection.anchor} ${landingSection.spacing} bg-[#F2F2F2]`}
        >
          <div className={landingSection.container}>
            <h2 id="recursos-titulo" className={`${landingText.sectionTitle} text-center`}>
              {SUPPORT_TEXTS.tituloRecursos}
            </h2>
            <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-24">
              {FEATURES.map((feature) => (
                <FeatureBlock
                  key={feature.id}
                  titulo={feature.titulo}
                  texto={feature.texto}
                  invertido={feature.invertido}
                >
                  {SCREENS[feature.id]}
                </FeatureBlock>
              ))}
            </div>
          </div>
        </section>
        <IntegrationSection />
        <PlansSection />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
