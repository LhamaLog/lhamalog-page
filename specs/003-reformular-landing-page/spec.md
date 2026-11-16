# Feature Specification: Reformular a landing page do LhamaLog

**Feature Branch**: `003-reformular-landing-page`

**Created**: 2026-11-16

**Status**: Draft

**Input**: User description: "Reformular totalmente a landing page. A implementação atual está falha e desorganizada. Criar do zero uma página nova, de tela única, parecida no desenho com a página atual, com código novo e simples. Não criar backend. Não integrar o Asaas nesta fase. Não inventar dados: informações do projeto e planos só com o que estiver documentado. Em dúvida, o Drive prevalece sobre as outras fontes; se ainda houver dúvida, consultar o solicitante. Aceites: a página apresenta o projeto, contém as informações do projeto e contém os planos documentados no Drive."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entender o que é o LhamaLog (Priority: P1)

Uma pessoa que nunca usou o LhamaLog abre a página, sem conta e sem login. Na primeira leitura ela vê o nome do produto, a frase de apresentação, o que o produto faz e de qual projeto acadêmico ele faz parte. Em seguida entende a proposta de valor e as capacidades do produto, todas com o mesmo sentido dos documentos do projeto.

**Why this priority**: Sem essa leitura a página não apresenta o projeto. É o primeiro aceite desta reformulação.

**Independent Test**: Abrir a página sem conta e conferir nome, frase, parágrafo, instituição, equipe, proposta de valor e a lista de capacidades, comparando cada frase com as fontes citadas em Assumptions.

**Acceptance Scenarios**:

1. **Given** um visitante sem conta, **When** abre a página, **Then** vê "LhamaLog", a frase "Seus logs analisados por IA: problemas encontrados, dados sensíveis mascarados e alertas para quem precisa saber." e o parágrafo de apresentação descrito em FR-002.
2. **Given** a página aberta, **When** o visitante procura de quem é o projeto, **Then** vê que é um projeto da Escola de TI da UniCesumar, curso de Engenharia de Software, e vê os seis nomes de equipe listados em FR-002.
3. **Given** a página aberta, **When** o visitante lê a proposta de valor e as funcionalidades, **Then** encontra os três resultados da frase de apresentação e as sete capacidades de FR-004, inclusive o aviso na aplicação web e por e-mail.
4. **Given** a página aberta, **When** o visitante procura aviso por push ou aplicativo móvel como canal disponível, **Then** esse canal não é oferecido.
5. **Given** a página aberta no navegador, **When** o visitante olha o título da página e a descrição usada ao compartilhá-la, **Then** o título é "LhamaLog" e a descrição é a frase de apresentação de FR-002.
6. **Given** o rodapé, **When** o visitante o lê, **Then** vê o LhamaLog, a Escola de TI da UniCesumar, o curso de Engenharia de Software e o ano 2026, sem e-mail, telefone, rede social, razão social, CNPJ ou endereço.

---

### User Story 2 - Comparar os planos documentados (Priority: P1)

O visitante chega à seção de planos e vê os cinco planos, do mais barato ao mais caro, com o preço público da periodicidade e da forma de pagamento escolhidas. Pode trocar entre semanal, mensal e semestral, e entre Pix, cartão de crédito, cartão de débito e boleto. Franquia, retenção, limites, recursos de análise e o preço do uso além da franquia acompanham a escolha e batem com a tabela pública.

**Why this priority**: Os planos documentados no Drive são aceite explícito desta reformulação. A página deixa de cumprir o pedido se o preço ou o limite divergir da fonte.

**Independent Test**: Abrir a seção de planos, percorrer as três periodicidades e as quatro formas de pagamento, e comparar cada preço e cada limite com as tabelas de FR-006 e FR-007.

**Acceptance Scenarios**:

1. **Given** a seção de planos ao abrir, **When** o visitante ainda não mexeu nos seletores, **Then** a periodicidade exibida é Mensal, a forma de pagamento é Pix, e os cinco planos aparecem nesta ordem: Free, Starter, Pro, Business e Enterprise.
2. **Given** um plano pago, **When** o visitante troca a periodicidade ou a forma de pagamento, **Then** o preço desse plano passa a ser exatamente o da célula correspondente em FR-006, e o preço do GB a mais e do armazenamento extra passa a ser o de FR-007.
3. **Given** o plano Free em qualquer combinação de seletores, **When** o visitante o lê, **Then** o preço é R$ 0,00, não há preço de GB a mais e a franquia continua 1 GB, com a regra de pausa de FR-009.
4. **Given** qualquer combinação de periodicidade e forma de pagamento, **When** o visitante lê os cartões, **Then** nenhum plano informa teste grátis.
5. **Given** a periodicidade selecionada, **When** o visitante lê a nota da seção, **Then** a nota é a daquela periodicidade em FR-008.

---

### User Story 3 - Percorrer a página única até os planos (Priority: P2)

O visitante usa a página inteira num celular ou num computador, com mouse ou só com teclado. A chamada para ação leva à seção de planos na mesma página. Não há segunda página, cadastro, login nem pagamento.

**Why this priority**: A página precisa ser utilizável para os dois primeiros percursos terem valor. O pagamento fica para uma fase posterior e não pode aparecer no lugar desta apresentação.

**Independent Test**: Na mesma página, acionar a chamada para ação, os links de seção e os dois seletores por teclado; repetir a leitura em tela de 375 px e de 1440 px de largura; confirmar que nenhum controle abre pagamento, cadastro ou outra página.

**Acceptance Scenarios**:

1. **Given** o visitante no início da página, **When** aciona "Ver planos", **Then** a seção de planos fica visível e o título dela não fica escondido atrás da navegação.
2. **Given** a página aberta, **When** o visitante aciona cada link da navegação, **Then** chega à seção correspondente sem abrir outro endereço.
3. **Given** uma tela de 375 px ou de 1440 px de largura, **When** a página é lida até o fim, **Then** não surge rolagem horizontal e os cinco planos continuam legíveis.
4. **Given** uso só por teclado, **When** o visitante percorre a página, **Then** alcança a navegação, a chamada para ação, os dois seletores e o conteúdo de cada seção, com foco visível.
5. **Given** qualquer controle da página, **When** o visitante o aciona, **Then** nada inicia pagamento, cria conta, pede login ou abre outro endereço.
6. **Given** a página aberta, **When** o visitante procura valor líquido, custo, margem, linguagem, fornecedor, depoimento ou quantidade de clientes, **Then** esse conteúdo não aparece.
7. **Given** a seção de planos sem nenhum plano com preço, **When** ela é exibida, **Then** mostra "não há planos disponíveis no momento" e o restante da página continua legível.
8. **Given** texto e fundo de cada trecho da página, **When** o contraste é medido, **Then** ele é de pelo menos 4,5 para 1.

---

### Edge Cases

- Plano Free na periodicidade semanal: a franquia é 1 GB por semana e zera no fim da semana. Nas periodicidades mensal e semestral, ao chegar em 1 GB a ingestão pausa até o mês virar ou até a conta mudar de plano. Em todos os casos, o Free não cobra.
- Periodicidade semestral: o valor exibido é uma cobrança só, adiantada, referente a 6 meses. A franquia continua mensal. GB a mais e armazenamento extra não estão embutidos nesse valor.
- Periodicidade semanal nos planos pagos: a franquia de GB é a mesma quantidade da franquia mensal, contada por semana. O GB a mais da semana entra na cobrança semanal. O armazenamento extra segue o mês de uso.
- GB a mais e armazenamento extra mudam com a forma de pagamento. Boleto usa os mesmos valores de Pix.
- Um plano sem preço público para a combinação escolhida não aparece. Se nenhum plano tiver preço, a seção mostra exatamente: "não há planos disponíveis no momento".
- A página não mostra os valores líquidos da tabela "Planos Base", nem custo, margem, imposto ou infra do plano de monetização.
- A página não mostra quantidade de clientes, depoimento, logo de cliente, percentual de melhoria nem prazo de diagnóstico.
- A página não oferece push nem aplicativo móvel como canal disponível.
- A página não apresenta Termos de Uso nem Política de Privacidade como documentos publicados. A política existente no Drive ainda tem trechos pendentes de publicação.
- Texto longo de preço, nome de plano ou nota de periodicidade não provoca rolagem horizontal nas larguras de 375 px e 1440 px.
- Se a navegação ficar fixa durante a rolagem, ela não cobre o título da seção de destino.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A página MUST ser uma única tela contínua, no endereço principal, com estas partes em ordem: apresentação, proposta de valor, funcionalidades, planos, chamada para ação já na apresentação e rodapé. Ela MUST NOT ter segunda página de planos, área logada, cadastro, login nem pagamento.
- **FR-002**: A apresentação MUST mostrar, com estes textos: o nome "LhamaLog"; a frase "Seus logs analisados por IA: problemas encontrados, dados sensíveis mascarados e alertas para quem precisa saber."; o parágrafo "O LhamaLog recebe logs e traces das aplicações dos clientes pelo protocolo aberto OpenTelemetry (OTLP), varre esses dados em busca de erros e comportamentos anômalos, mascara informações sensíveis, abre ocorrências e usa IA generativa para sugerir causas e correções. Cada cliente (tenant) tem seus produtos, papéis e regras de alerta isolados."; a linha "Projeto da Escola de TI da UniCesumar, curso de Engenharia de Software."; e a equipe Michel Bocchi Junior, João Pedro Souza Peixoto Saraiva, Pedro, Andre Felipe, Vinicius Ferrarini e Peng.
- **FR-003**: A proposta de valor MUST destacar, de forma separada da frase completa, os três resultados documentados: problemas encontrados, dados sensíveis mascarados e alertas para quem precisa saber. Também MUST dizer que o LhamaLog é uma plataforma de análise de logs com inteligência artificial, baseada em OpenTelemetry.
- **FR-004**: As funcionalidades MUST informar, em linguagem de quem vai usar o produto, estas sete capacidades e nenhuma outra: (1) a aplicação do cliente envia logs e traces por OpenTelemetry (OTLP), com um token por produto; (2) o LhamaLog procura erros e comportamentos anômalos; (3) informações sensíveis são mascaradas; (4) os problemas encontrados viram ocorrências; (5) a IA generativa sugere causas e correções; (6) produtos, papéis e regras de alerta de cada cliente ficam isolados; (7) o aviso às pessoas certas é na aplicação web e por e-mail. A página MUST NOT apresentar push ou aplicativo móvel como canal disponível.
- **FR-005**: A seção de planos MUST listar os planos ativos do mais barato para o mais caro: Free, Starter, Pro, Business e Enterprise. MUST haver um seletor de periodicidade com Semanal, Mensal e Semestral, e um seletor de forma de pagamento com Pix, cartão de crédito, cartão de débito e boleto. A combinação inicial MUST ser Mensal e Pix. Os valores MUST ser reais, com duas casas decimais. A página MUST NOT calcular taxa, acréscimo ou desconto sobre esses valores.
- **FR-006**: O preço público de cada plano MUST ser exatamente o da tabela abaixo. O boleto repete o Pix porque a tabela de preços públicos ainda não tem coluna de boleto e a decisão de 27/10/2026 igualou os dois.

| Plano | Periodicidade | Pix | Cartão de crédito | Cartão de débito | Boleto |
| --- | --- | --- | --- | --- | --- |
| Free | Semanal, mensal e semestral | R$ 0,00 | R$ 0,00 | R$ 0,00 | R$ 0,00 |
| Starter | Semanal | R$ 20,23 | R$ 19,30 | R$ 18,94 | R$ 20,23 |
| Starter | Mensal | R$ 80,99 | R$ 81,95 | R$ 80,88 | R$ 80,99 |
| Starter | Semestral | R$ 475,99 | R$ 489,12 | R$ 483,49 | R$ 475,99 |
| Pro | Semanal | R$ 94,07 | R$ 95,42 | R$ 94,21 | R$ 94,07 |
| Pro | Mensal | R$ 400,99 | R$ 411,81 | R$ 407,05 | R$ 400,99 |
| Pro | Semestral | R$ 2.395,99 | R$ 2.468,30 | R$ 2.440,48 | R$ 2.395,99 |
| Business | Semanal | R$ 345,84 | R$ 354,95 | R$ 350,83 | R$ 345,84 |
| Business | Mensal | R$ 1.491,99 | R$ 1.536,43 | R$ 1.519,07 | R$ 1.491,99 |
| Business | Semestral | R$ 8.941,99 | R$ 9.216,05 | R$ 9.112,58 | R$ 8.941,99 |
| Enterprise | Semanal | R$ 622,76 | R$ 640,41 | R$ 633,09 | R$ 622,76 |
| Enterprise | Mensal | R$ 2.691,99 | R$ 2.773,42 | R$ 2.742,18 | R$ 2.691,99 |
| Enterprise | Semestral | R$ 16.141,99 | R$ 16.637,97 | R$ 16.451,28 | R$ 16.141,99 |

- **FR-007**: Cada plano MUST mostrar a franquia, a retenção, os recursos de análise e IA, as chamadas de IA por mês, o dashboard, os membros e os produtos da tabela abaixo. "Ilimitados" MUST aparecer escrito dessa forma. O preço do GB a mais e do armazenamento extra MUST ser o da forma de pagamento selecionada. O Free MUST NOT mostrar preço de GB a mais nem de armazenamento extra.

| Plano | Franquia | Retenção | Recursos de análise e IA | Chamadas de IA por mês | Dashboard | Membros | Produtos | Ao passar da franquia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Free | 1 GB | 7 dias | Sugestões básicas | 10 | Básico | 1 | 1 | Pausa a ingestão, sem cobrança |
| Starter | 10 GB | 15 dias | Sugestões IA | 100 | Padrão | 3 | 3 | Cobra o GB a mais |
| Pro | 100 GB | 30 dias | Detecção de anomalias + sugestões IA | 1.000 | Padrão | 10 | 10 | Cobra o GB a mais |
| Business | 500 GB | 90 dias | Investigação automática + anomalias | 5.000 | Padrão | 25 | ilimitados | Cobra o GB a mais |
| Enterprise | 1.000 GB | 90 dias | Investigação automática + rastreio de usuário | 15.000 | Personalizado | ilimitados | ilimitados | Cobra o GB a mais |

| Item | Pix e boleto | Cartão de crédito | Cartão de débito |
| --- | --- | --- | --- |
| GB a mais do Starter | R$ 6,00 | R$ 6,19 | R$ 6,12 |
| GB a mais do Pro | R$ 4,50 | R$ 4,64 | R$ 4,59 |
| GB a mais do Business | R$ 3,50 | R$ 3,61 | R$ 3,57 |
| GB a mais do Enterprise | R$ 2,80 | R$ 2,89 | R$ 2,86 |
| Armazenamento extra, por GB-mês retido acima da franquia | R$ 0,10 | R$ 0,11 | R$ 0,11 |

- **FR-008**: A seção de planos MUST explicar a periodicidade selecionada com um único texto visível. Mensal: "A franquia de GB vale por mês e zera no fim do mês. O que não for usado não acumula. Os GB além da franquia e o armazenamento extra do mês que fechou entram na mesma cobrança da mensalidade seguinte." Semestral: "A mensalidade dos 6 meses é paga de uma vez, adiantada. A franquia de GB continua valendo por mês e zera no fim de cada mês. Os GB além da franquia e o armazenamento extra são cobrados todo mês, numa cobrança separada." Semanal: "A cobrança é toda semana. A franquia de GB vale por semana, com a mesma quantidade de GB da franquia mensal, e zera no fim da semana. O que não for usado não acumula. Os GB além da franquia da semana entram na mesma cobrança semanal. O armazenamento extra segue o mês de uso e entra na primeira cobrança semanal depois que o mês fecha."
- **FR-009**: No Free, a página MUST informar que nada é cobrado. Nas periodicidades mensal e semestral, MUST informar que, ao chegar em 1 GB, a ingestão pausa até o mês virar ou até a conta mudar de plano. Na periodicidade semanal, MUST informar que a franquia de 1 GB vale por semana e zera no fim da semana. A seção MUST informar, em todas as periodicidades: "GB é o tamanho do log recebido, não o tamanho do pacote de transmissão."
- **FR-010**: A página MUST NOT informar teste grátis, prazo de teste nem direito a teste em nenhum plano, periodicidade ou forma de pagamento. A página MUST NOT iniciar um teste, contratar o plano nem decidir se uma pessoa tem direito a ele.
- **FR-011**: A apresentação MUST ter uma chamada para ação com o rótulo "Ver planos". Acioná-la MUST levar à seção de planos na mesma página, com o título da seção visível. Nenhum controle da página MUST iniciar assinatura, checkout, cadastro ou login.
- **FR-012**: A navegação MUST mostrar o nome LhamaLog e MUST alcançar Proposta de valor, Funcionalidades e Planos. Em tela estreita, esses links MUST continuar acionáveis sem rolagem horizontal da página.
- **FR-013**: O rodapé MUST identificar o LhamaLog, repetir a instituição e o curso de FR-002 e mostrar o ano 2026 junto do nome do projeto. MUST NOT publicar e-mail, telefone, rede social, razão social, CNPJ ou endereço, porque esses dados não estão definidos para publicação.
- **FR-014**: O título da página MUST ser "LhamaLog" e a descrição resumida usada ao compartilhar ou listar a página MUST ser a frase de apresentação de FR-002. Os títulos visíveis MUST seguir a ordem da página, sem pular nível: o nome do produto primeiro e, depois, Proposta de valor, Funcionalidades e Planos.
- **FR-015**: Toda a página MUST ser utilizável só com teclado, com foco visível e nome compreensível em cada controle. Imagem, se existir, MUST ter texto alternativo. Texto e fundo MUST ter contraste de pelo menos 4,5 para 1. A página MUST permanecer compreensível sem animação.
- **FR-016**: A página MUST ser legível, sem rolagem horizontal, nas larguras de 375 px e de 1440 px. Os cinco planos MUST poder ser lidos nas duas larguras.
- **FR-017**: A página MUST NOT exibir número de clientes, depoimento, logo de cliente, meta de desempenho, prazo de resultado, valor líquido, custo, margem, imposto ou dado de infraestrutura. MUST NOT descrever as partes internas do produto, as linguagens usadas para construí-lo nem os fornecedores.
- **FR-018**: Se não houver plano com preço para mostrar, a seção de planos MUST mostrar exatamente "não há planos disponíveis no momento" e o restante da página MUST continuar legível.

### Key Entities *(include if feature involves data)*

- **Projeto**: o nome LhamaLog, a frase de apresentação, o parágrafo do que o produto faz, a instituição, o curso e a equipe. É informação de leitura, estável nesta página.
- **Plano**: nome, franquia de GB, retenção em dias, recurso de análise e IA, chamadas de IA por mês, dashboard, membros, produtos e o que acontece ao passar da franquia. Os cinco planos ativos se relacionam com um preço público para cada periodicidade e forma de pagamento.
- **Preço público**: o valor que o visitante vê para uma combinação de plano, periodicidade (semanal, mensal ou semestral) e forma de pagamento (Pix, cartão de crédito, cartão de débito ou boleto). Não é o valor líquido.
- **Uso além da franquia**: preço do GB a mais e preço do armazenamento extra, por forma de pagamento. O Free não possui esses preços.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em até 1 minuto no topo da página, um visitante que não conhece o produto identifica o nome LhamaLog, que ele analisa logs com inteligência artificial e que é um projeto da Escola de TI da UniCesumar.
- **SC-002**: Os 60 preços públicos (5 planos, 3 periodicidades e 4 formas de pagamento) conferem 100% com a tabela de FR-006, inclusive os zeros do Free e o boleto igual ao Pix.
- **SC-003**: Ao trocar periodicidade e forma de pagamento, o visitante vê o novo preço de cada plano na mesma seção, sem sair da página e sem conta.
- **SC-004**: Uma pessoa usando só o teclado alcança a apresentação, as funcionalidades, os planos e os dois seletores, e consegue ler o plano resultante da combinação escolhida.
- **SC-005**: Nas larguras de 375 px e de 1440 px, a página inteira é lida sem rolagem horizontal e os cinco planos permanecem legíveis.
- **SC-006**: Nenhum controle da página inicia pagamento, cadastro, login ou outra página. A chamada "Ver planos" termina na seção de planos da própria página.
- **SC-007**: Uma revisão frase a frase, contra as fontes de Assumptions, não encontra preço, limite, canal de aviso ou afirmação sobre o produto que essas fontes não contenham.

## Assumptions

- O pedido desta fase é a página de apresentação. Pagamento, provedor de cobrança, cadastro, login, área logada e servidor da página ficam fora. A tarefa de pagamento continua sendo uma fase seguinte e não faz parte dos aceites desta especificação.
- A aparência deve lembrar a página pública atual: uma página só, lida de cima para baixo, com navegação entre as seções e planos lado a lado para comparação. Não há guia de marca no Drive consultado, então cor, fonte e animação não são requisito. Telas ilustrativas, animação de logs e perguntas frequentes da página atual também não entram: o card da landing não as pede, e o texto delas não está nas fontes abaixo.
- A frase do topo da página atual ("Entenda por que sua aplicação falhou") não aparece nos documentos do Drive consultados. A frase exigida aqui é a do README do projeto, de 17/10/2026.
- O README de 17/10/2026 ainda desenha o aviso como e-mail ou push. Prevalecem as fontes mais novas: os casos de uso revistos (USID_010 em espera e USID_012.1, planilha atualizada em 31/10/2026) e o cronograma de 12/11/2026, tarefa de notificações web e e-mail, com o push junto do aplicativo móvel em espera. Por isso a página fala em aplicação web e e-mail.
- Os preços e os limites comerciais vêm da aba "Planos Ajustado" e da aba "Planos Base" da planilha "Plano de Monetização v4 - OpenObserve MGC". A última gravação consultada é de 25/10/2026, 21:57 (America/Sao_Paulo). Na tela entra o preço público da aba "Planos Ajustado". A aba "Planos Base" só informa franquia, retenção, limites e o comportamento ao passar da franquia; o valor líquido dela não entra na página.
- O documento "LhamaLog - LLT-230 - Ver planos disponíveis - Requisitos", versão v7 de 27/10/2026, é a regra de leitura para o visitante. Ele manda usar o preço público, oferecer semanal, mensal e semestral, e Pix, cartão de crédito, cartão de débito e boleto. O boleto fica igual ao Pix porque a planilha ainda não tem essa coluna. A franquia semanal usa a mesma quantidade de GB da franquia mensal, por semana, por decisão desse documento; as descrições da planilha ainda dizem "GB/mês".
- A regra do Free que fala em pausar "até o mês virar" permanece para as periodicidades mensal e semestral. Na semanal, esta especificação aplica o zeramento semanal da v7 também ao Free. Essa leitura junta as duas frases do mesmo documento; se a pausa semanal do Free for outra, o solicitante precisa dizer qual é.
- A página não informa teste grátis. A combinação inicial Mensal + Pix é padrão de leitura: a mensal é a base da tabela e o Pix é a primeira coluna de preço público.
- O contraste mínimo de 4,5 para 1 é o critério mensurável adotado porque o card da landing cita contraste e deixa o nível detalhado em aberto.
- A chamada para ação só leva aos planos porque esta fase não tem destino de cadastro nem de pagamento confirmado no Drive. O card LLT-272 marca esse destino como ainda a decidir. Se o destino for outro, o solicitante indica o endereço antes do planejamento.
- Os recursos de IA de cada plano são o texto literal da planilha v4. A página não promete data de entrega e não remove recurso que esteja nessa tabela.
- Fontes usadas, com o Drive prevalecendo quando houve diferença:
  - README do projeto, arquivo `README-perfil-organizacao.md` de 17/10/2026: https://drive.google.com/file/d/1u7rgE7BbEvAXN0QfJNaRB-t5c-mQlCnw/view
  - Plano de Monetização v4 - OpenObserve MGC: https://docs.google.com/spreadsheets/d/1Bw1CUcKRp2pJpVpHEEPbwZ29d5hSy2NLOoeeefYgTNs/edit
  - LLT-230, requisitos v7 de 27/10/2026: https://docs.google.com/document/d/1Gp50lueI-F0CG18PWkveHZSAAWM3kCDbXFH4EaolXS4/edit
  - Casos de uso, planilha atualizada em 31/10/2026: https://docs.google.com/spreadsheets/d/1JObvNfZAJvCPjG4urP4OZKHVhKFNyCeVq1w2w8agRb0/edit
  - Cronograma do projeto (versão de 12/11/2026): https://docs.google.com/spreadsheets/d/1h3BDRHCcRNl2SaLE7Ce1g3L0uF70rgLl0zq4dWbvzzU/edit
  - Política de Privacidade de 17/10/2026, consultada só para saber que ainda não está pronta para publicação: https://docs.google.com/document/d/1tDrwVk2H8rJwCgAGlCFGm2p7TN126w_rYU3tnpJy4sw/edit
  - Jira LLT-272 "Criar Landing Page" e épico LLT-274: https://logviewer2026.atlassian.net/browse/LLT-272
