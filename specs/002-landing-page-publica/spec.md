# Feature Specification: Landing page pública do LhamaLog

**Feature Branch**: `002-landing-page-publica` (sem Git neste diretório; nome só de referência)

**Created**: 2026-11-09

**Status**: Draft

**Input**: User description: "Criar a landing page pública do produto na rota /, para visitantes sem login, no estilo de landing de SaaS (barra flutuante, topo com título grande, seções com telas do produto montadas em código, planos, perguntas frequentes e chamada final). Referência de estrutura: https://pluglead.com/ (sem copiar textos, imagens nem números). RF01 a RF10 e critérios de aceitação conforme o pedido original."

## Clarifications

### Session 2026-11-10

- Q: Qual título e subtítulo devem aparecer no topo da landing? → A: Título "Entenda por que sua aplicação falhou". Subtítulo "O LhamaLog recebe os logs da sua aplicação por OpenTelemetry, agrupa os erros em ocorrências, mascara dados sensíveis, sugere a causa com IA e avisa a equipe certa." (textos exatos, definidos pelo André)
- Q: Quais textos devem aparecer nos 3 cards de "Como funciona"? → A: Opção A com ajuste do André no card 2 ("analisa" no lugar de "varre"): (1) "Receba seus logs" - "Sua aplicação envia logs por OpenTelemetry (OTLP), com um token para cada produto."; (2) "Ache os erros" - "O LhamaLog analisa os logs, mascara dados sensíveis e agrupa os erros em ocorrências."; (3) "Entenda e avise" - "A IA sugere a causa e a equipe certa é avisada."
- Q: Quais textos devem aparecer nos 4 blocos de recursos? → A: Opção A com ajuste do André no bloco 3: (1) "Erros agrupados em ocorrências" - "Em vez de muitas linhas de log, você vê cada problema uma vez, com a quantidade de vezes que ele aconteceu."; (2) "Sugestão de causa com IA" - "Cada ocorrência vem com uma hipótese de causa e uma sugestão de correção para você investigar."; (3) "Dados sensíveis mascarados" - "Os dados sensíveis dos logs são mascarados." (sem citar e-mail, CPF ou senha); (4) "Aviso para a pessoa certa" - "A equipe é avisada por e-mail ou push, conforme a regra de alertas que você definir."
- Q: Para onde devem levar os links "Termos de Uso" e "Política de Privacidade" no rodapé? → A: Opção C: nesta entrega os dois links aparecem desativados, com o aviso "em breve", até a equipe da LGPD publicar os documentos. O endereço de cada documento fica em um único ponto de configuração, para ser trocado depois sem mexer no layout.
- Q: O que o botão "Contratar" da landing deve fazer nesta pasta, já que o fluxo de contratar fica em outro projeto? → A: Opção A: "Contratar" leva ao cadastro ou login levando o plano e a periodicidade escolhidos no endereço de retorno, para a pessoa seguir direto para a contratação desse plano no fluxo existente. O endereço do fluxo de contratar fica em uma configuração do ambiente, porque ele está em outro projeto. A landing não decide nada sobre o teste de 14 dias. "Começar grátis" leva ao cadastro.
- Q: Que pergunta e que resposta devem aparecer na pergunta frequente "Como enviar logs?" → A: Opção A com ajuste do André na última frase. Pergunta: "Como envio os logs da minha aplicação?" Resposta: "Sua aplicação envia logs e traces por OpenTelemetry (OTLP), por HTTP ou gRPC. Cada produto tem um token, que vai no cabeçalho de autorização da requisição. O exemplo da seção de integração desta página mostra a configuração."
- Q: Que pergunta e que resposta devem aparecer na pergunta frequente sobre dados sensíveis? → A: Texto do André (opção própria). Pergunta: "O que acontece com os dados sensíveis dos meus logs?" Resposta: "O LhamaLog mascara os dados sensíveis dos logs."
- Q: Que pergunta e que resposta devem aparecer na pergunta frequente sobre passar da franquia? → A: Opção A. Pergunta: "O que acontece se eu passar da franquia?" Resposta: "Nos planos pagos, os GB que passarem da franquia são cobrados pelo valor por GB a mais que aparece no card do plano. No plano Free, ao chegar na franquia, a ingestão pausa." Premissa do André: todo plano pago tem valor por GB a mais definido (só o Free não tem), então a resposta fica consistente com o card.
- Q: Que pergunta e que resposta devem aparecer na pergunta frequente sobre cancelar? → A: Opção A. Pergunta: "Posso cancelar quando quiser?" Resposta: "Sim. Você cancela a assinatura dentro do sistema, e ela segue ativa até o fim do período já pago." (a regra "segue ativa até o fim do período já pago" vem da PoC de pagamento e ainda precisa da confirmação do PO)
- Q: Que pergunta e que resposta devem aparecer na pergunta frequente sobre formas de pagamento? → A: Opção A com ajuste do André ("mensais"). Pergunta: "Quais formas de pagamento posso usar?" Resposta: "Cartão de crédito, cartão de débito, Pix e boleto. Você escolhe a forma na hora de contratar. O teste de 14 dias vale nos planos Starter e Pro mensais, pagando com cartão de crédito."
- Q: Que título e que frase devem aparecer na chamada final da landing? → A: Opção A. Título "Comece a entender suas falhas"; frase "Crie sua conta no plano grátis e envie os logs da sua aplicação por OpenTelemetry." Botão "Começar grátis" (leva ao cadastro).
- Correções do André em 2026-11-10 (sem pergunta), a partir do checklist de qualidade: (CHK038) o selo do teste só aparece quando o teste vale, na landing e em `/planos` (FR-022); (CHK036) "Contratar" leva ao cadastro, e quem já tem conta entra pelo link da tela de cadastro (FR-010; a resposta da pergunta sobre "Contratar" acima, que dizia "cadastro ou login", fica substituída por esta); (CHK037) FR-019 e FR-020; (CHK016) numeração da User Story 3; (CHK018) SC-002 vira revisão com 3 pessoas da equipe; (CHK042) "milhares de linhas de log" virou "muitas linhas de log" (inclusive no registro do bloco 1); (CHK025) o texto "em breve" também tem contraste de 4,5:1 (FR-014, SC-005); (CHK011) FR-021 e caso de borda da sessão lenta ou com falha.
- Aprovações do André em 2026-11-10 (sem pergunta): (a) todos os "Textos de apoio" aprovados, com a mensagem de "Contratar" indisponível passando a "A contratação não está disponível no momento. Tente novamente mais tarde."; (CHK003) o menu compacto abaixo de 768 px é requisito (FR-001); (CHK007) a mensagem de indisponibilidade inclui "Tente novamente mais tarde."; (CHK008) os "2 cliques" contam a partir da abertura da página inicial (SC-001); (CHK026 e CHK027) a ordem de leitura segue a ordem visual e a sanfona anuncia aberta ou fechada (FR-013).
- Ajustes visuais do André em 2026-11-10 (sem pergunta): (a) a faixa "Baseado em OpenTelemetry" foi removida da página (FR-003 removido); (b) os links da barra ficaram maiores e mais escuros e "Entrar" virou botão de contorno; por isso o menu compacto passa a valer abaixo de 1024 px (antes 768 px), porque os links maiores não cabem em uma linha entre 768 e 1023 px sem gerar rolagem lateral (FR-001, FR-012); (c) o título do topo ficou em azul-marinho em negrito forte e o fundo do topo ganhou degradê com brilhos azuis translúcidos.
- Ajuste direto do André (sem pergunta): a linha do topo passa a ser "Plano grátis · Teste de 14 dias nos planos Starter e Pro mensais", igual à resposta das perguntas frequentes (FR-002 e User Story 1).
- Ajuste direto do André (sem pergunta): na spec, "redirect_url" virou "endereço de retorno" e "variável de ambiente" virou "configuração do ambiente" (inclusive nos registros acima). Os documentos do plano (research, data-model, contratos e quickstart) continuam citando os nomes técnicos, porque ali é desenho.
- Ajuste do André (sem pergunta), 2026-11-10, a partir da crítica do topo: a tela de exemplo da sugestão por IA passa a aparecer também no topo, ao lado do texto a partir de 1024 px e abaixo dele no celular, sem texto novo (FR-002, FR-005, User Story 2); a legenda "Exemplo ilustrativo" e o texto de leitor de tela valem também para ela, e o texto de leitor de tela aparece duas vezes na página (FR-020); a ordem de leitura do topo é título, subtítulo, botões, linha de oferta e tela (FR-013); o topo em duas colunas entra nas verificações de largura (FR-012, SC-003); os dados fictícios do topo e os do bloco 2 são diferentes.

### Session 2026-11-12

- Q: Onde fica a animação dos logs? → A: No lugar da tela estática do topo. A janela do topo passa a mostrar linhas de log descendo, uma linha de erro em destaque e, em seguida, a hipótese de causa e a sugestão de correção da IA (FR-002, FR-023). A tela estática da sugestão por IA continua no bloco 2 de recursos (FR-005).
- Q: Como a animação dos logs se comporta? → A: Repete em ciclo, com um botão para pausar e retomar (FR-023, FR-024).
- Q: Como usar a paleta da marca (#141826, #033473, #0C70F2, #0D65D9, #F2F2F2)? → A: #0D65D9 nos botões cheios (texto branco, contraste 5,41:1); #0C70F2 só em destaques (brilho, linhas, ícones), nunca como texto sobre #F2F2F2 (4,06:1) nem sobre #141826 (3,88:1); #141826 é o fundo da janela dos logs; #033473 segue nos títulos; #F2F2F2 é fundo de seção (FR-018).
- Q: Qual a intensidade da animação dos botões? → A: Discreta: ao passar o mouse o botão sobe de 1 a 2 px, escurece um pouco e ganha sombra; ao clicar, afunda levemente (FR-025).
- Q: Como ficam os fundos das seções, que estavam variados (cinza, azulado, branco)? → A: As seções do meio alternam branco e #F2F2F2, na ordem: "Como funciona" branco, "Recursos" cinza, "Integração" branco, "Planos" cinza, "Perguntas frequentes" branco. Só o topo e a chamada final têm fundo próprio (FR-026).
- Q: Que cor e tamanho têm os parágrafos? → A: #141826 (o "preto" da paleta) e 18 px; títulos seguem em #033473; a fonte continua Poppins (FR-026).
- Q: A chamada final estava difícil de ler. Como fica? → A: Fundo #141826, sem os brilhos azuis, e a frase em branco e maior (FR-009).
- Q: Como fica o rodapé? → A: No estilo do rodapé da dash0.com (referência de concorrente, sem copiar textos nem marca): fundo escuro #141826, logo maior, ícones de redes sociais (as da referência, GitHub, LinkedIn, X e YouTube, mais Instagram e Facebook, citadas pelo André), a linha "© 2026 LhamaLog. Todos os direitos reservados." e os Termos e a Política. Sem o aviso "em breve": enquanto a equipe da LGPD não publicar, Termos e Política aparecem como texto simples, sem link (FR-009, FR-027). Só o GitHub tem endereço (a organização LhamaLog já existe); as outras redes ficam sem link até a conta existir, com o endereço em um único ponto de configuração.
- Ajuste do André (sem pergunta), 2026-11-12: o rodapé fica com uma só linha divisória (a de cima do "©") e a logo passa a ter versão para fundo escuro, sem o fundo branco (FR-027). Os fundos das seções ficam como estão (alternando branco e cinza, FR-026).
- Ajuste do André (sem pergunta), 2026-11-12, a pedido do JP: a tela de exemplo do bloco "Erros agrupados em ocorrências" passa a seguir a tela "Ocorrências" do sistema desenhado no Figma (https://www.figma.com/design/e88SaMez3hQZ0nmmC3uEtm/LhamaLog): barra lateral azul-marinho #033473 com o símbolo e a navegação (Dashboard, Ocorrências, Produtos, Empresa), título, campo de busca e lista com quadrado colorido por tipo. Os dados continuam fictícios e os textos de leitor de tela e a legenda não mudam (FR-005, FR-020). Depois, a pedido do André ("sim, nas outras"), as outras três telas de exemplo (sugestão por IA, dados mascarados e alertas) passam a usar a mesma moldura do sistema (`SystemShell.jsx`), com a navegação Dashboard, Ocorrências, Logs, Avisos, Produtos e Empresa e o item da própria tela destacado. A janela dos logs do topo continua sendo um terminal.
- Q: Quais textos a animação dos logs mostra? → A: Aprovados pelo André: as linhas da tabela "Textos de apoio" (sem número e sem cliente real), a hipótese de causa e a sugestão de correção do exemplo que já estava no topo, e os rótulos "Pausar animação" e "Retomar animação".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender o produto e começar grátis (Priority: P1)

Uma pessoa que nunca ouviu falar do LhamaLog (por exemplo, quem desenvolve ou lidera uma equipe técnica) abre o endereço principal sem estar logada. Em poucos segundos entende que o LhamaLog recebe logs da aplicação dela, acha erros, mascara dados sensíveis, abre ocorrências, sugere causas com IA e avisa a equipe. Ela vê os botões "Começar grátis" e "Ver planos" e a linha "Plano grátis · Teste de 14 dias nos planos Starter e Pro mensais". Ao clicar em "Começar grátis", chega ao cadastro.

**Why this priority**: É o objetivo da página: transformar visitante em cadastro. Sem o topo e o caminho até o cadastro, a página não entrega valor.

**Independent Test**: Abrir `/` sem login, ler o topo (título, subtítulo, botões, linha de oferta) e clicar em "Começar grátis"; a pessoa deve cair na tela de cadastro.

**Acceptance Scenarios**:

1. **Given** um visitante sem login, **When** abre `/`, **Then** vê a barra de navegação flutuante, o topo com título, subtítulo, os botões "Começar grátis" e "Ver planos" e a linha "Plano grátis · Teste de 14 dias nos planos Starter e Pro mensais".
2. **Given** o visitante na página, **When** clica em "Começar grátis" (no topo, na barra ou na chamada final), **Then** é levado ao cadastro.
3. **Given** o visitante no topo da página, **When** clica em "Ver planos", **Then** a página rola até a seção de planos.
4. **Given** o visitante, **When** clica em "Entrar" na barra, **Then** é levado à tela de login.

---

### User Story 2 - Conhecer como funciona e os recursos (Priority: P2)

O visitante rola a página e entende o fluxo em três passos (receber logs; achar erros e agrupar em ocorrências; sugerir causa com IA e avisar a equipe). Depois vê quatro blocos alternados, cada um com um texto à esquerda ou à direita e uma tela ilustrativa do produto: ocorrências, sugestão por IA, dados sensíveis mascarados e alertas. Vê também uma seção de integração com um exemplo curto de configuração OTLP. A tela da sugestão por IA já aparece no topo da página, ao lado do título (e abaixo dele no celular), com dados fictícios diferentes dos do bloco 2.

**Why this priority**: Dá confiança e explica o valor antes de pedir cadastro ou pagamento; sem isso o visitante só tem o topo.

**Independent Test**: Rolar a página até o fim das seções de conteúdo e conferir que os 3 cards, os 4 blocos alternados com suas telas e o exemplo OTLP aparecem, sem nenhuma imagem de terceiros.

**Acceptance Scenarios**:

1. **Given** a página aberta, **When** o visitante passa do topo, **Then** vê a seção "Como funciona" com 3 cards na ordem descrita.
2. **Given** a seção de recursos, **When** o visitante rola, **Then** vê 4 blocos (ocorrências, sugestão por IA, dados sensíveis mascarados, alertas) alternando o lado do texto e da tela.
3. **Given** a tela de dados sensíveis, **When** o visitante a observa, **Then** vê valores fictícios já mascarados, nunca dados reais.
4. **Given** a seção de integração, **When** o visitante a lê, **Then** vê um exemplo curto de configuração OTLP, com o token do produto indicado por um valor de exemplo.
5. **Given** qualquer tela do produto na página, **When** inspecionada, **Then** é composta com elementos da própria página, sem imagens, logos ou capturas de terceiros.

---

### User Story 3 - Ver planos e contratar (Priority: P2)

O visitante chega à seção de planos e vê os mesmos cards e o mesmo seletor de periodicidade da página pública `/planos`, com os mesmos preços e regras. Ao clicar em "Contratar" num plano pago, segue o fluxo que já existe: vai ao cadastro (quem já tem conta entra pelo link da própria tela de cadastro) e depois à contratação. O selo "Teste grátis de 14 dias" do card só aparece quando o teste vale (ver FR-022).

**Why this priority**: É a conversão em receita, mas depende de a página existir e de o fluxo de contratação já funcionar (já existe).

**Independent Test**: Na seção de planos da landing, trocar a periodicidade e comparar valores com `/planos`; clicar em "Contratar" sem login e conferir que o fluxo existente começa.

**Acceptance Scenarios**:

1. **Given** a seção de planos da landing, **When** o visitante troca a periodicidade, **Then** os valores exibidos são idênticos aos de `/planos` para a mesma periodicidade.
2. **Given** uma alteração de preço ou de regra de exibição de planos feita uma única vez, **When** as duas páginas são abertas, **Then** ambas refletem a alteração (sem regra duplicada).
3. **Given** um visitante sem login, **When** clica em "Contratar" num plano com uma periodicidade escolhida, **Then** é levado ao cadastro, com o plano e a periodicidade escolhidos no endereço de retorno; quem já tem conta entra pelo link da própria tela de cadastro e, depois de entrar, segue direto para a contratação desse plano no fluxo existente.
4. **Given** o endereço do fluxo de contratar não está configurado (ele fica em outro projeto) ou não é do mesmo site da página, **When** o visitante clica em "Contratar", **Then** a página não quebra nem leva a um endereço inválido: mostra a mensagem de indisponibilidade da tabela "Textos de apoio" ("A contratação não está disponível no momento. Tente novamente mais tarde.").
5. **Given** a lista de planos ainda carregando, vazia ou com falha, **When** a seção é exibida, **Then** mostra o mesmo estado de carregamento, de lista vazia ou de erro (com nova tentativa) de `/planos`, sem quebrar o resto da página.

---

### User Story 4 - Tirar dúvidas e fechar (Priority: P3)

O visitante abre as perguntas frequentes em sanfona (como enviar logs, dados sensíveis, passar da franquia, cancelar, formas de pagamento), e termina em uma chamada final e um rodapé com links para Termos de Uso e Política de Privacidade.

**Why this priority**: Reduz dúvidas e fecha a página, mas a página já converte sem isso.

**Independent Test**: Abrir e fechar cada pergunta com mouse e teclado; clicar nos links do rodapé.

**Acceptance Scenarios**:

1. **Given** a seção de perguntas, **When** o visitante ativa uma pergunta, **Then** a resposta abre; ativando de novo, fecha.
2. **Given** o rodapé enquanto os documentos não foram publicados, **When** o visitante o vê, **Then** "Termos de Uso" e "Política de Privacidade" aparecem como texto simples (não clicáveis, sem levar a lugar nenhum e sem aviso).
3. **Given** o endereço de um documento passa a ser informado no ponto único de configuração, **When** a página é aberta, **Then** o link correspondente fica ativo e leva ao documento, sem alteração de layout.
4. **Given** a chamada final, **When** o visitante clica em "Começar grátis", **Then** é levado ao cadastro.

---

### User Story 5 - Quem já está logado (Priority: P2)

Uma pessoa já logada abre `/` e é levada direto para dentro do sistema, sem ver a landing.

**Why this priority**: Evita mostrar propaganda a quem já é cliente e mantém o comportamento atual de quem entra pelo endereço principal.

**Independent Test**: Logar, abrir `/` e conferir que a pessoa cai na área interna.

**Acceptance Scenarios**:

1. **Given** uma pessoa com sessão ativa, **When** abre `/`, **Then** é levada para dentro do sistema.
2. **Given** a verificação de sessão ainda em andamento, **When** `/` é aberto, **Then** aparece um indicador de carregamento, sem mostrar a landing a uma pessoa logada nem a área interna a um visitante.
3. **Given** a verificação de sessão passa do tempo limite definido no plano ou falha, **When** `/` é aberto, **Then** a landing aparece para o visitante, sem tela em branco.

---

### Edge Cases

- Tela de 375 px: barra flutuante, título longo, blocos alternados, cards de planos e exemplo de código não geram rolagem lateral; os links âncora da barra continuam acessíveis pelo menu compacto (ver FR-001).
- Visitante com preferência de movimento reduzido: nenhuma animação roda.
- Link âncora para uma seção: a barra flutuante não cobre o título da seção de destino.
- Falha ao carregar os planos: o restante da página continua utilizável.
- Navegação só por teclado: todo conteúdo e toda ação continuam alcançáveis.
- Exemplo OTLP e telas do produto usam apenas dados fictícios; nunca token, e-mail ou dado real.
- Verificação de sessão lenta ou com falha: o visitante vê a landing, nunca uma tela em branco.
- "Contratar" com destino de outro site ou sem destino configurado: mensagem de indisponibilidade, sem levar a lugar nenhum.
- Rota desconhecida: continua indo para `/` (e, daí, landing ou área interna conforme a sessão).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001** (RF01): A página MUST exibir uma barra de navegação flutuante e arredondada com o logo, os links âncora "Como funciona", "Recursos", "Planos" e "Perguntas", e as ações "Entrar" e "Começar grátis". Abaixo de 1024 px, os links âncora ficam em um menu compacto, aberto e fechado por um botão (com teclado, e fechando também com Esc e ao escolher um link). Nesse tamanho, "Começar grátis" continua visível na barra e "Entrar" fica no menu.
- **FR-002** (RF02): A página MUST exibir um topo com o título grande "Entenda por que sua aplicação falhou", o subtítulo "O LhamaLog recebe os logs da sua aplicação por OpenTelemetry, agrupa os erros em ocorrências, mascara dados sensíveis, sugere a causa com IA e avisa a equipe certa.", os botões "Começar grátis" e "Ver planos" e a linha "Plano grátis · Teste de 14 dias nos planos Starter e Pro mensais". O topo MUST trazer também a janela animada dos logs de FR-023, que termina na sugestão por IA (com a legenda e o texto de leitor de tela de FR-020): a partir de 1024 px ela fica ao lado do texto (texto à esquerda, tela à direita, alinhados pelo centro); abaixo de 1024 px fica abaixo do texto, em uma coluna centralizada.
- **FR-003** (RF03): *Removido em 2026-11-10 por decisão do André (a faixa "Baseado em OpenTelemetry" saiu da página). O número fica reservado para não mudar as outras referências.*
- **FR-004** (RF04): A página MUST ter a seção "Como funciona" com 3 cards, com estes textos exatos: (1) "Receba seus logs" - "Sua aplicação envia logs por OpenTelemetry (OTLP), com um token para cada produto."; (2) "Ache os erros" - "O LhamaLog analisa os logs, mascara dados sensíveis e agrupa os erros em ocorrências."; (3) "Entenda e avise" - "A IA sugere a causa e a equipe certa é avisada."
- **FR-005** (RF05): A página MUST ter 4 blocos alternados de texto + tela do produto, para ocorrências, sugestão por IA, dados sensíveis mascarados e alertas, com estes textos exatos: (1) "Erros agrupados em ocorrências" - "Em vez de muitas linhas de log, você vê cada problema uma vez, com a quantidade de vezes que ele aconteceu."; (2) "Sugestão de causa com IA" - "Cada ocorrência vem com uma hipótese de causa e uma sugestão de correção para você investigar."; (3) "Dados sensíveis mascarados" - "Os dados sensíveis dos logs são mascarados."; (4) "Aviso para a pessoa certa" - "A equipe é avisada por e-mail ou push, conforme a regra de alertas que você definir."; as telas são montadas com os próprios elementos da página, sem imagens de terceiros, com dados fictícios. A tela da sugestão por IA também aparece no topo (FR-002); os dados fictícios do topo e os do bloco 2 MUST ser diferentes (outro serviço e outro erro), para a mesma tela não se repetir.
- **FR-006** (RF06): A página MUST ter uma seção de integração com um exemplo curto de configuração OTLP, usando valores de exemplo (sem token real).
- **FR-007** (RF07): A página MUST ter uma seção de planos que reaproveita os cards e o seletor de periodicidade da página `/planos`, de modo que preços, periodicidades e textos de plano venham de uma única fonte, sem regra de preço duplicada.
- **FR-008** (RF08): A página MUST ter perguntas frequentes em sanfona cobrindo: como enviar logs, dados sensíveis, passar da franquia, cancelar e formas de pagamento. Texto aprovado da pergunta 1: pergunta "Como envio os logs da minha aplicação?"; resposta "Sua aplicação envia logs e traces por OpenTelemetry (OTLP), por HTTP ou gRPC. Cada produto tem um token, que vai no cabeçalho de autorização da requisição. O exemplo da seção de integração desta página mostra a configuração." Texto aprovado da pergunta 2: pergunta "O que acontece com os dados sensíveis dos meus logs?"; resposta "O LhamaLog mascara os dados sensíveis dos logs." Texto aprovado da pergunta 3: pergunta "O que acontece se eu passar da franquia?"; resposta "Nos planos pagos, os GB que passarem da franquia são cobrados pelo valor por GB a mais que aparece no card do plano. No plano Free, ao chegar na franquia, a ingestão pausa." Texto aprovado da pergunta 4: pergunta "Posso cancelar quando quiser?"; resposta "Sim. Você cancela a assinatura dentro do sistema, e ela segue ativa até o fim do período já pago." Texto aprovado da pergunta 5: pergunta "Quais formas de pagamento posso usar?"; resposta "Cartão de crédito, cartão de débito, Pix e boleto. Você escolhe a forma na hora de contratar. O teste de 14 dias vale nos planos Starter e Pro mensais, pagando com cartão de crédito." Cada resposta MUST ser coerente com as regras vigentes do produto (ver Assumptions).
- **FR-009** (RF09): A página MUST ter uma chamada final, com o título "Comece a entender suas falhas", a frase "Crie sua conta no plano grátis e envie os logs da sua aplicação por OpenTelemetry." e o botão "Começar grátis", e um rodapé com "Termos de Uso" e "Política de Privacidade". Enquanto a equipe da LGPD não publicar os documentos, os dois itens aparecem como texto simples, sem link e sem aviso (decisão de 2026-11-12; antes havia o aviso "em breve"). O endereço de cada documento MUST ficar em um único ponto de configuração; quando preenchido, o item vira link ativo sem mudar o layout. A chamada final MUST ter fundo #141826, sem brilhos, com a frase em branco.
- **FR-010** (RF10): "Começar grátis" (em qualquer ponto da página) MUST levar ao cadastro; "Contratar" MUST levar ao cadastro com o plano e a periodicidade escolhidos no endereço de retorno (quem já tem conta entra pelo link da própria tela de cadastro), para seguir direto à contratação no fluxo existente, que fica em outro projeto; o endereço desse fluxo MUST vir de uma configuração do ambiente. A landing MUST NOT decidir nada sobre o teste de 14 dias (cartão, Starter e Pro mensal, uma vez por CPF/CNPJ), que é regra do fluxo de contratar; uma pessoa logada que abre `/` MUST ser levada para dentro do sistema.
- **FR-011**: Os links âncora MUST levar à seção correspondente e deixar o título visível, sem ficar atrás da barra flutuante.
- **FR-012**: A página MUST funcionar sem rolagem lateral nas larguras 1672, 1440, 1024 e 375 px, com o topo em duas colunas (texto e tela de exemplo) a partir de 1024 px e em uma coluna abaixo disso.
- **FR-013**: Toda ação e toda sanfona MUST ser operável só por teclado, com ordem de foco lógica e foco visível; elementos interativos MUST ter nome acessível. A ordem de leitura por leitor de tela MUST seguir a ordem visual (nos blocos alternados, o texto vem antes da tela, em qualquer lado; no topo, a ordem é título, subtítulo, botões, linha de oferta e só depois a tela de exemplo, nas duas disposições). A sanfona MUST anunciar cada pergunta como aberta ou fechada.
- **FR-014**: Texto e elementos de interface MUST ter contraste mínimo de 4,5:1 com o fundo, inclusive os textos do rodapé escuro.
- **FR-015**: Animações e transições MUST ocorrer apenas quando a pessoa não pediu redução de movimento; com redução, o conteúdo aparece completo e estático (na janela dos logs: todas as linhas, o erro em destaque, a hipótese de causa e a sugestão de correção, sem movimento e sem o botão de pausar).
- **FR-026**: As seções entre o topo e a chamada final MUST alternar fundo branco e #F2F2F2 ("Como funciona" branco, "Recursos" cinza, "Integração" branco, "Planos" cinza, "Perguntas frequentes" branco). Os parágrafos MUST usar #141826 com 18 px (introduções de seção com 18 px no celular e 20 px a partir de 640 px); a fonte é Poppins.
- **FR-027**: O rodapé MUST ter fundo #141826, a logo em versão para fundo escuro (sem o retângulo branco, texto em branco) com pelo menos 40 px de altura, uma única linha divisória (logo acima do "©"; sem linha entre a chamada final e o rodapé), os ícones de GitHub, LinkedIn, X, YouTube, Instagram e Facebook e a linha "© 2026 LhamaLog. Todos os direitos reservados.", além de Termos e Política (FR-009). Cada ícone com endereço vira link para a rede, com nome acessível, abrindo em outra aba; sem endereço, o ícone aparece sem link e com o nome da rede para leitor de tela. Os endereços ficam em um único ponto de configuração; só o GitHub (https://github.com/LhamaLog) tem endereço nesta entrega. O ano do "©" é a única exceção à regra de números de FR-016.
- **FR-016**: A página MUST NOT conter número de clientes, logos de clientes, depoimentos nem resultados inventados. Metas do projeto (por exemplo, diagnóstico 80% mais rápido, até 5 minutos da falha à notificação) só podem aparecer se identificadas explicitamente como "meta".
- **FR-017**: A estrutura de seções pode se inspirar na referência indicada, mas textos, imagens e números dela MUST NOT ser copiados.
- **FR-018**: A página MUST usar o logo e a paleta da marca: #141826, #033473, #0C70F2, #0D65D9 e #F2F2F2. Botões cheios MUST usar #0D65D9 com texto branco. #0C70F2 MUST NOT ser usado como cor de texto sobre #F2F2F2 nem sobre #141826 (contraste abaixo de 4,5:1); nesses fundos ele só aparece em detalhes sem texto.
- **FR-019**: O "Contratar" MUST aceitar como destino só um endereço do mesmo site da página; um destino de outro site MUST ser recusado, com a mesma mensagem de indisponibilidade de quando o destino não está configurado.
- **FR-020**: Cada uma das 4 telas de exemplo (FR-005), e também a tela de exemplo do topo (FR-002), MUST trazer a legenda visível "Exemplo ilustrativo". A tela do topo usa o mesmo texto de leitor de tela da tela de sugestão por IA da tabela "Textos de apoio", então esse texto aparece duas vezes na página (no topo e no bloco 2).
- **FR-021**: Se a verificação de sessão passar do tempo limite definido no plano ou falhar, a página MUST mostrar a landing ao visitante, sem tela em branco; enquanto a verificação está em andamento, MUST aparecer um indicador de carregamento, nunca uma tela vazia. Conta como falha: o serviço de login não responder ou devolver erro ao verificar a sessão.
- **FR-022**: O selo "Teste grátis de 14 dias" do card de plano MUST aparecer só quando o teste vale (planos Starter e Pro, periodicidade mensal, pagando no cartão), tanto na landing quanto em `/planos`.
- **FR-023**: A janela de exemplo do topo MUST mostrar, em ciclo, linhas de log fictícias descendo (as linhas da tabela "Textos de apoio", com o nível INFO, WARN ou ERROR e o nome do serviço), parar na linha de erro em destaque e, em seguida, mostrar a hipótese de causa e a sugestão de correção da IA; depois de uma pausa com o resultado à mostra, o ciclo recomeça. Os dados são fictícios: sem número, sem nome de cliente e sem dado real. O fundo da janela é #141826 e todo texto dela tem contraste de 4,5:1 ou mais.
- **FR-024**: A janela dos logs MUST ter um botão visível, operável por teclado, para pausar e retomar a animação, com os rótulos "Pausar animação" e "Retomar animação". Pausada, a janela fica parada no ponto em que estava. O texto que corre MUST ficar escondido do leitor de tela, que lê só o texto de leitor de tela da tela de sugestão por IA (FR-020).
- **FR-025**: Os botões da página (cheios e de contorno) MUST ter uma animação discreta, só com movimento permitido (FR-015): ao passar o mouse, sobem de 1 a 2 px, escurecem um pouco e ganham sombra; ao clicar, afundam levemente. A animação MUST NOT mudar o tamanho do botão nem empurrar o que está em volta.

### Textos de apoio (aprovados pelo André em 2026-11-10)

Textos que os requisitos acima não trazem, todos aprovados pelo André (a mensagem de "Contratar" indisponível foi ajustada por ele). Usam só frases que já existem no projeto ou nos textos aprovados, sem número e sem promessa nova.

| Onde | Texto proposto | Status |
|---|---|---|
| Título da seção de recursos | "Recursos" | aprovado |
| Título da seção de integração | "Integração" | aprovado |
| Introdução da seção de integração | "Configure o envio de logs por OpenTelemetry (OTLP) com o token do seu produto." | aprovado |
| Título da seção de planos | "Planos" | aprovado |
| Introdução da seção de planos | "Escolha o plano e a periodicidade. A forma de pagamento você escolhe na hora de contratar." (mesma frase de `/planos`) | aprovado |
| Título da seção de perguntas | "Perguntas frequentes" | aprovado |
| Mensagem de "Contratar" indisponível | "A contratação não está disponível no momento. Tente novamente mais tarde." | aprovado |
| Leitor de tela: tela de ocorrências | "Exemplo ilustrativo de uma lista de ocorrências com erros agrupados." | aprovado |
| Leitor de tela: tela de sugestão por IA | "Exemplo ilustrativo de uma ocorrência com hipótese de causa e sugestão de correção." | aprovado |
| Leitor de tela: tela de dados mascarados | "Exemplo ilustrativo de um log com os dados sensíveis mascarados." | aprovado |
| Leitor de tela: tela de alertas | "Exemplo ilustrativo de um aviso à equipe por e-mail ou push." | aprovado |
| Rótulo do botão do menu compacto | "Abrir menu" (fechado) e "Fechar menu" (aberto) | aprovado |
| Rótulo da navegação | "Navegação principal" | aprovado |
| Texto de carregamento da página | "Carregando..." | aprovado |
| Janela dos logs: linhas fictícias (nível, serviço, mensagem) | INFO pedidos "Pedido recebido"; INFO pagamentos "Cobrança enviada"; INFO estoque "Estoque atualizado"; WARN pedidos "Cliente sem cadastro"; INFO catálogo "Produto consultado"; ERROR pedidos "Valor vazio ao criar o pedido" | aprovado em 2026-11-12 |
| Botão da janela dos logs | "Pausar animação" (rodando) e "Retomar animação" (pausada) | aprovado em 2026-11-12 |

### Key Entities *(include if feature involves data)*

- **Plano**: oferta exibida na seção de planos (nome, preço por periodicidade, franquia, se tem teste de 14 dias); já existe e é a mesma fonte usada em `/planos`.
- **Periodicidade**: escolha de ciclo de cobrança exibida no seletor; já existe.
- **Pergunta frequente**: pergunta e resposta de texto fixo exibidas na sanfona.
- **Seção da página**: bloco nomeado e navegável por âncora (Como funciona, Recursos, Planos, Perguntas).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um visitante novo consegue, a partir da abertura da página inicial (`/`), chegar ao cadastro em até 2 cliques (sem contar a rolagem).
- **SC-002**: Em uma revisão com 3 pessoas da equipe (passo manual do roteiro de verificação, o quickstart), pelo menos 2 das 3 pessoas explicam, em uma frase, o que o LhamaLog faz depois de ver só o topo e a seção "Como funciona".
- **SC-003**: Nas quatro larguras de verificação (1672, 1440, 1024 e 375 px), a largura total da página não passa da largura da janela (medido por script) e nenhum texto ou botão fica cortado ou sobreposto (conferência visual nas quatro larguras, incluindo o topo em duas colunas em 1672, 1440 e 1024 px e em uma coluna em 375 px).
- **SC-004**: 100% das ações e das sanfonas funcionam só com teclado, em ordem lógica, com foco sempre visível.
- **SC-005**: 100% dos pares de texto e fundo da página, incluindo os textos do rodapé escuro, atingem contraste de 4,5:1 ou mais.
- **SC-006**: Com movimento reduzido ativado, 0 animações rodam; com ele desativado, as animações não impedem a leitura nem a ação.
- **SC-007**: Os valores de planos e periodicidades da landing são idênticos aos de `/planos` em 100% das combinações; uma mudança de preço feita em um único lugar aparece nas duas páginas (garantido pela estrutura: as duas páginas usam a mesma fonte e o mesmo componente de planos).
- **SC-008**: 0 números de clientes, logos de clientes, depoimentos ou resultados inventados; 100% das metas citadas estão marcadas como "meta".
- **SC-009**: Quando a verificação de sessão termina dentro do tempo limite, a pessoa logada que abre `/` chega à área interna sem ver a landing em 100% dos casos testados; visitante sem login nunca vê a área interna. Sem a chave do serviço de login, este critério fica registrado como "não testado".

- **SC-010**: Com movimento permitido, a janela dos logs completa o ciclo (linhas, erro, causa e correção) e recomeça; o botão de pausar para e retoma o ciclo em 100% das vezes, pelo mouse e pelo teclado; com movimento reduzido, a janela mostra o resultado completo e parado.

## Assumptions

- A página substitui o comportamento atual de `/` (hoje redireciona para a área interna); a rota `/planos` continua existindo como está.
- O cadastro e o login já existem no projeto; esta entrega só aponta para eles. Os Termos de Uso e a Política de Privacidade ainda não têm endereço publicado (versão 0.2 só como número); por isso aparecem como texto simples, sem link (ver Clarifications).
- Os planos e a periodicidade vêm da mesma fonte de `/planos` (dados falsos em desenvolvimento, Core real quando existir). Nenhum preço é definido nesta página.
- Regras vigentes que as respostas das perguntas frequentes devem seguir: cobrança por uso (mensalidade base, franquia de GB e valor por GB excedente), periodicidades semanal, mensal e semestral, formas de pagamento cartão, Pix, débito e boleto, teste de 14 dias só no cartão e nos planos Starter e Pro, plano Free sem cobrança. Valores em reais não são citados nas respostas; os textos exatos são revisados com o PO antes da publicação.
- O fluxo de contratar (e a regra do teste de 14 dias) fica em outro projeto; esta pasta só entrega o plano e a periodicidade escolhidos até lá (ver Clarifications).
- Todo plano pago tem valor por GB a mais definido; só o Free não tem (premissa do André; a resposta da pergunta frequente sobre franquia depende disso).
- Ao cancelar um plano pago, a assinatura segue ativa até o fim do período já pago (regra da PoC de pagamento; falta confirmação do PO antes da publicação).
- A página é em português do Brasil.
- O logo e a paleta azul já estão no projeto; não há nova identidade visual.
- Fora de escopo: blog, página de contato, lista de espera, multilíngue, tema escuro dedicado, analytics, app mobile, depoimentos e casos de clientes.
- Tecnologia, biblioteca de animação e estrutura de arquivos não são decididas aqui; ficam para o plano.
