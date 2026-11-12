// Textos da landing page pública (spec 002-landing-page-publica). Copiados literalmente da spec: FR-002, FR-004, FR-005, FR-008,
// FR-009 e a tabela "Textos de apoio" (aprovados pelo André em 10/11/2026). Nada de importação aqui: o arquivo é testado
// direto pelo `node --test` (tests/landing.test.mjs). Para mudar um texto, mude primeiro a spec e depois este arquivo.
// Links âncora da barra (FR-001). Cada `id` é o id da seção correspondente na página.
export const NAV_LINKS = [
  { id: "como-funciona", label: "Como funciona" },
  { id: "recursos", label: "Recursos" },
  { id: "planos", label: "Planos" },
  { id: "perguntas", label: "Perguntas" },
];
export const SECTION_IDS = ["como-funciona", "recursos", "planos", "perguntas"];
export const NAV_ACTIONS = { entrar: "Entrar", comecarGratis: "Começar grátis" };
// Topo (FR-002)
export const HERO = {
  titulo: "Entenda por que sua aplicação falhou",
  subtitulo:
    "O LhamaLog recebe os logs da sua aplicação por OpenTelemetry, agrupa os erros em ocorrências, mascara dados sensíveis, sugere a causa com IA e avisa a equipe certa.",
  botaoPrincipal: "Começar grátis",
  botaoSecundario: "Ver planos",
  oferta: "Plano grátis · Teste de 14 dias nos planos Starter e Pro mensais",
};
// Como funciona (FR-004)
export const HOW_IT_WORKS = {
  titulo: "Como funciona",
  cards: [
    {
      titulo: "Receba seus logs",
      texto: "Sua aplicação envia logs por OpenTelemetry (OTLP), com um token para cada produto.",
    },
    {
      titulo: "Ache os erros",
      texto:
        "O LhamaLog analisa os logs, mascara dados sensíveis e agrupa os erros em ocorrências.",
    },
    { titulo: "Entenda e avise", texto: "A IA sugere a causa e a equipe certa é avisada." },
  ],
};
export const FEATURES = [
  {
    id: "ocorrencias",
    titulo: "Erros agrupados em ocorrências",
    texto:
      "Em vez de muitas linhas de log, você vê cada problema uma vez, com a quantidade de vezes que ele aconteceu.",
    invertido: false,
  },
  {
    id: "sugestao-ia",
    titulo: "Sugestão de causa com IA",
    texto:
      "Cada ocorrência vem com uma hipótese de causa e uma sugestão de correção para você investigar.",
    invertido: true,
  },
  {
    id: "dados-mascarados",
    titulo: "Dados sensíveis mascarados",
    texto: "Os dados sensíveis dos logs são mascarados.",
    invertido: false,
  },
  {
    id: "alertas",
    titulo: "Aviso para a pessoa certa",
    texto: "A equipe é avisada por e-mail ou push, conforme a regra de alertas que você definir.",
    invertido: true,
  },
];
// Exemplo de configuração OTLP (FR-006): só marcadores, nunca endereço ou token reais. Fica numa lista própria porque o teste
// de "sem números" dos textos da página não vale para ele.
export const OTLP_EXAMPLE_LINES = [
  "OTEL_EXPORTER_OTLP_ENDPOINT=<ENDEREÇO_DO_LHAMALOG>",
  "OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf",
  "OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer <TOKEN_DO_PRODUTO>",
];
// Perguntas frequentes (FR-008)
export const FAQ = [
  {
    pergunta: "Como envio os logs da minha aplicação?",
    resposta:
      "Sua aplicação envia logs e traces por OpenTelemetry (OTLP), por HTTP ou gRPC. Cada produto tem um token, que vai no cabeçalho de autorização da requisição. O exemplo da seção de integração desta página mostra a configuração.",
  },
  {
    pergunta: "O que acontece com os dados sensíveis dos meus logs?",
    resposta: "O LhamaLog mascara os dados sensíveis dos logs.",
  },
  {
    pergunta: "O que acontece se eu passar da franquia?",
    resposta:
      "Nos planos pagos, os GB que passarem da franquia são cobrados pelo valor por GB a mais que aparece no card do plano. No plano Free, ao chegar na franquia, a ingestão pausa.",
  },
  {
    pergunta: "Posso cancelar quando quiser?",
    resposta:
      "Sim. Você cancela a assinatura dentro do sistema, e ela segue ativa até o fim do período já pago.",
  },
  {
    pergunta: "Quais formas de pagamento posso usar?",
    resposta:
      "Cartão de crédito, cartão de débito, Pix e boleto. Você escolhe a forma na hora de contratar. O teste de 14 dias vale nos planos Starter e Pro mensais, pagando com cartão de crédito.",
  },
];
// Chamada final (FR-009)
export const FINAL_CTA = {
  titulo: "Comece a entender suas falhas",
  frase: "Crie sua conta no plano grátis e envie os logs da sua aplicação por OpenTelemetry.",
  botao: "Começar grátis",
};
// Rodapé (FR-009, FR-027). Os endereços ficam em legalLinks.js e socialLinks.js.
// O ano do "©" é a única exceção à regra de números (FR-016, FR-027).
export const FOOTER = {
  termos: "Termos de Uso",
  politica: "Política de Privacidade",
  direitos: "© 2026 LhamaLog. Todos os direitos reservados.",
  redes: "Redes sociais",
};
// Textos de apoio (tabela "Textos de apoio" da spec, aprovados)
export const SUPPORT_TEXTS = {
  tituloRecursos: "Recursos",
  tituloIntegracao: "Integração",
  introIntegracao: "Configure o envio de logs por OpenTelemetry (OTLP) com o token do seu produto.",
  tituloPlanos: "Planos",
  introPlanos:
    "Escolha o plano e a periodicidade. A forma de pagamento você escolhe na hora de contratar.",
  tituloPerguntas: "Perguntas frequentes",
  contratarIndisponivel:
    "A contratação não está disponível no momento. Tente novamente mais tarde.",
  legendaTela: "Exemplo ilustrativo",
  telaOcorrencias: "Exemplo ilustrativo de uma lista de ocorrências com erros agrupados.",
  telaSugestaoIa:
    "Exemplo ilustrativo de uma ocorrência com hipótese de causa e sugestão de correção.",
  telaDadosMascarados: "Exemplo ilustrativo de um log com os dados sensíveis mascarados.",
  telaAlertas: "Exemplo ilustrativo de um aviso à equipe por e-mail ou push.",
  abrirMenu: "Abrir menu",
  fecharMenu: "Fechar menu",
  navegacaoPrincipal: "Navegação principal",
  carregando: "Carregando...",
  pausarAnimacao: "Pausar animação",
  retomarAnimacao: "Retomar animação",
};
// Janela dos logs do topo (FR-023): linhas fictícias aprovadas pelo André em 2026-11-12 (sem número e sem cliente real).
// A última é o erro que a IA explica; a causa e a correção vêm do exemplo "pedidos" de mocks/aiExamples.js.
export const LOG_LINES = [
  { nivel: "INFO", servico: "pedidos", mensagem: "Pedido recebido" },
  { nivel: "INFO", servico: "pagamentos", mensagem: "Cobrança enviada" },
  { nivel: "INFO", servico: "estoque", mensagem: "Estoque atualizado" },
  { nivel: "WARN", servico: "pedidos", mensagem: "Cliente sem cadastro" },
  { nivel: "INFO", servico: "catálogo", mensagem: "Produto consultado" },
  { nivel: "ERROR", servico: "pedidos", mensagem: "Valor vazio ao criar o pedido" },
];
