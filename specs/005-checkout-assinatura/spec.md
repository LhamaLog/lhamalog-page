# Feature Specification: Checkout de assinatura ao contratar

**Feature Branch**: `LLT-273-aplicar-logica-de-pagamento`

**Created**: 2026-11-17

**Status**: Draft

**Input**: User description: "Implementar a lógica de pagamento da LLT-273, na branch LLT-273-aplicar-logica-de-pagamento, a partir da LLT-272. Ao clicar em Contratar, criar um checkout de assinatura no Asaas com as informações do plano publicado, em vez de redirecionar para app.lhamalog.com. A configuração real de acesso não entra no histórico compartilhado; só o exemplo. Não alterar o desenho. Usar somente o Asaas. Onde o pedido, o Jira e o Drive divergirem, vale o Drive."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Contratar o plano na página do Asaas (Priority: P1)

Uma pessoa compara os planos na página pública, escolhe semanal, mensal ou semestral e clica em Contratar num plano pago. Ela sai da landing e chega à página de pagamento do Asaas para assinar aquele plano, na periodicidade que estava selecionada, pelo preço de cartão de crédito do catálogo. Ela não passa por app.lhamalog.com nesse passo. O desenho dos cartões, do seletor e dos textos permanece o que ela já via.

**Why this priority**: O pedido existe para a contratação começar no pagamento, com o plano que a pessoa acabou de escolher, em vez de mandá-la para o cadastro do aplicativo.

**Independent Test**: Publicar a página com o catálogo vigente e a configuração de acesso de testes. Em cada plano pago, trocar a periodicidade, clicar em Contratar e conferir na página do Asaas o plano, a periodicidade e o preço de cartão de crédito do catálogo. Confirmar que o endereço de destino é do Asaas e que os cartões continuam iguais aos de antes.

**Acceptance Scenarios**:

1. **Given** a página com o catálogo publicado e o acesso ao Asaas configurado no ambiente de testes, **When** o visitante escolhe a periodicidade mensal e clica em Contratar no Pro, **Then** chega à página de pagamento do Asaas de uma assinatura do Pro mensal, no valor de cartão de crédito do Pro mensal que está no catálogo, e o endereço não é app.lhamalog.com.
2. **Given** o mesmo catálogo, **When** o visitante repete Contratar no Starter semanal, no Business semestral e no Enterprise mensal, **Then** cada página de pagamento corresponde ao plano e à periodicidade que estavam selecionados, sempre pelo preço de cartão de crédito daquela combinação.
3. **Given** a seção de planos, **When** o visitante compara a página antes e depois desta entrega, **Then** os cinco cartões, a ordem, o seletor de periodicidade, o preço de Pix exibido, os textos, os selos e os botões "Contratar" e "Começar grátis" continuam com o mesmo desenho.
4. **Given** o plano Free, **When** o visitante escolhe "Começar grátis", **Then** segue para o cadastro como hoje e nenhuma página de pagamento se abre.
5. **Given** um plano pago, **When** a página de pagamento abre, **Then** o item identifica o plano e a periodicidade e o nome curto desse item tem no máximo 30 caracteres.

---

### User Story 2 - Pagar sem entregar o cartão nem a chave de acesso (Priority: P1)

A pessoa paga na página do Asaas. A landing não pede número de cartão, documento, telefone nem endereço. A chave que abre o checkout não aparece na página que ela recebe e não vai no histórico compartilhado do projeto. Se ela volta para a landing, a página não diz que o pagamento foi feito e não muda o que os planos mostram.

**Why this priority**: A chave de acesso e os dados de cartão não podem ficar com quem apenas visita a página. Voltar do pagamento também não pode ser tratado como prova de que a assinatura existe.

**Independent Test**: Abrir o que a página entrega ao visitante e o histórico compartilhado do projeto e procurar uma chave de acesso utilizável. Clicar em Contratar, pagar ou desistir na página do Asaas, voltar à landing e confirmar que nada nela afirma que o plano foi ativado.

**Acceptance Scenarios**:

1. **Given** a página publicada, **When** o visitante percorre a landing e o que o navegador recebe, **Then** não encontra campo de cartão, de documento, de telefone ou de endereço, nem uma chave de acesso utilizável do Asaas.
2. **Given** o projeto compartilhado, **When** uma pessoa da equipe procura a chave real de acesso, **Then** não a encontra. O exemplo que acompanha o projeto mostra quais configurações são necessárias e usa apenas valores de exemplo.
3. **Given** o visitante foi à página de pagamento e voltou à landing, por ter pago, desistido ou fechado a página, **When** a landing carrega de novo, **Then** ela não confirma pagamento, não mostra plano ativo e a seção de planos segue igual à de quem nunca clicou em Contratar.
4. **Given** a empresa ainda não tem CNPJ, **When** o visitante abre um checkout por esta página, **Then** a página de pagamento é a de testes do Asaas e nenhum dinheiro real é cobrado.

---

### User Story 3 - Seguir na página quando o checkout não abre (Priority: P2)

O acesso ao Asaas não está configurado, o catálogo do plano pago não tem preço de cartão de crédito, ou o Asaas não abre o checkout. A pessoa permanece na landing, vê que a contratação não está disponível e pode tentar de novo. O restante da página continua utilizável. Nenhum clique em Contratar a manda para app.lhamalog.com.

**Why this priority**: Uma falha de pagamento não pode derrubar a página nem reabrir o caminho antigo de cadastro como se a contratação tivesse seguido.

**Independent Test**: Tirar a configuração de acesso, clicar em Contratar e confirmar a mensagem já usada de contratação indisponível, com o topo e as outras seções ainda utilizáveis. Repor a configuração e confirmar que Contratar volta a abrir o Asaas.

**Acceptance Scenarios**:

1. **Given** a chave de acesso ou o ambiente do Asaas ausente, **When** o visitante clica em Contratar num plano pago, **Then** permanece na landing, vê que a contratação não está disponível no momento e não é enviado a app.lhamalog.com.
2. **Given** um plano pago sem preço de cartão de crédito na periodicidade selecionada, **When** o visitante clica em Contratar, **Then** o checkout não abre e a mesma indisponibilidade aparece.
3. **Given** o Asaas recusa ou não responde ao pedido de checkout, **When** o visitante clica em Contratar, **Then** permanece na landing com a contratação indisponível e pode tentar de novo.
4. **Given** a contratação indisponível, **When** o visitante usa o topo, "Como funciona", os recursos, as perguntas e a chamada final, **Then** essas partes respondem normalmente.
5. **Given** um checkout em abertura, **When** o visitante clica em Contratar de novo antes de sair da landing, **Then** essa repetição não abre um segundo checkout.

---

### Edge Cases

- Periodicidade trocada no seletor e, em seguida, Contratar: o checkout usa a periodicidade que está selecionada na hora do clique, não a anterior.
- Preço exibido no cartão é o do Pix; o checkout cobra o preço de cartão de crédito do mesmo plano e da mesma periodicidade. Os dois podem ser diferentes. O cartão não passa a exibir o preço do cartão.
- Semestral com aviso de desconto calculado sobre o Pix: o valor do checkout é o preço semestral de cartão de crédito do catálogo, não o valor riscado nem a economia mostrada no cartão.
- Plano Free, "Começar grátis" e "Acessar Página": continuam no cadastro ou no acesso de hoje. Nenhum deles abre checkout.
- Plano pago com preço de cartão zerado, negativo ou ausente: o checkout não abre e a contratação fica indisponível.
- Visitante volta da página de pagamento, atualiza a landing ou abre de novo o mesmo endereço: a landing não confirma o pagamento.
- Dois planos pagos em sequência, cada um com seu clique concluído: cada clique que chega a abrir o pagamento corresponde ao plano daquele clique.
- Catálogo da página ausente ou ilegível: a seção de planos continua tratando essa falha como já faz hoje; Contratar não inventa um plano.
- Ambiente de testes no lugar do de produção, ou o contrário: o checkout segue o ambiente configurado. Enquanto não houver CNPJ, o configurado é o de testes.
- Nome do plano longo: o item na página de pagamento ainda identifica o plano e a periodicidade dentro do limite de 30 caracteres.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Em plano pago, Contratar MUST abrir um checkout de assinatura na página de pagamento do Asaas para o plano e a periodicidade selecionados. O destino MUST ser a página do Asaas. Contratar MUST NOT enviar o visitante a app.lhamalog.com.
- **FR-002**: O valor do checkout MUST ser o preço de cartão de crédito do catálogo publicado da página, para aquele plano e aquela periodicidade. O checkout MUST NOT usar o preço de Pix, de débito nem de boleto. O preço que o cartão exibe MUST continuar sendo o do Pix.
- **FR-003**: A periodicidade do checkout MUST ser a que está selecionada no seletor no momento do clique: semanal, mensal ou semestral. O plano MUST ser um dos planos pagos já publicados: Starter, Pro, Business ou Enterprise.
- **FR-004**: O plano Free MUST NOT abrir checkout. "Começar grátis" e "Acessar Página" MUST continuar levando ao cadastro e ao acesso como hoje.
- **FR-005**: A landing MUST NOT pedir nem guardar número de cartão, documento, telefone ou endereço. O pagamento MUST acontecer na página do Asaas.
- **FR-006**: A chave de acesso ao Asaas MUST NOT aparecer na página que o visitante recebe nem no histórico compartilhado do projeto. Um exemplo MUST acompanhar o projeto, listar as configurações necessárias para abrir o checkout e usar só valores de exemplo, sem chave utilizável.
- **FR-007**: Enquanto a empresa não tiver CNPJ, o checkout aberto por esta página MUST usar o ambiente de testes do Asaas e MUST NOT cobrar dinheiro real. Com a empresa constituída e o ambiente de produção configurado, o mesmo Contratar MUST abrir o ambiente de produção.
- **FR-008**: Voltar da página de pagamento para a landing MUST NOT ser tratado como pagamento confirmado. A landing MUST NOT informar que a assinatura está ativa nem alterar a seção de planos por causa dessa volta.
- **FR-009**: O nome curto do item na página de pagamento MUST identificar o plano e a periodicidade e MUST ter no máximo 30 caracteres.
- **FR-010**: Se a configuração de acesso estiver ausente, se o preço de cartão de crédito da combinação escolhida estiver ausente ou for inválido, ou se o Asaas não abrir o checkout, a landing MUST manter o visitante na página, MUST mostrar a mensagem de contratação indisponível que a página já usa e MUST NOT enviá-lo a app.lhamalog.com. O topo, "Como funciona", os recursos, as perguntas e a chamada final MUST continuar utilizáveis.
- **FR-011**: Enquanto um checkout ainda está sendo aberto, um novo clique em Contratar MUST NOT abrir um segundo checkout. Se o navegador restaurar a página pelo cache de voltar, o botão MUST voltar a responder.
- **FR-012**: O desenho da página MUST permanecer o atual. Esta entrega MUST NOT mudar cartões, seletor, textos, selos, ordem dos planos nem o preço de Pix exibido. Esta entrega MUST NOT acrescentar seletor de forma de pagamento, formulário de cadastro nem aviso de teste grátis.
- **FR-013**: Pix, débito, boleto, teste de 14 dias, ativação de conta, nota fiscal, reembolso, upgrade e cancelamento MUST NOT fazer parte desta entrega. O checkout de assinatura desta página é o de cartão de crédito.
- **FR-014**: A rota que abre o checkout MUST aceitar só JSON, MUST recusar origem de outro site e MUST limitar tentativas pelo IP do visitante. Atrás de um proxy de rede privada, ou listado em `CONTRATACAO_PROXIES`, esse IP é o último salto de `X-Forwarded-For`. Fora isso, é o IP do socket. O registro da tentativa MUST NOT incluir a chave de acesso. O preço enviado pelo navegador MUST ser ignorado.
- **FR-015**: Enquanto a base configurada for a de testes, Contratar MUST abrir checkout só em `localhost`, `127.0.0.1` ou `::1`. Num host público, MUST mostrar a contratação indisponível e MUST NOT criar checkout de testes.

### Key Entities

- **Plano publicado**: uma oferta da página, com código estável, nome, periodicidade selecionada e preço de cartão de crédito. A origem continua sendo o catálogo que a própria página já publica. O Free não tem preço e não gera checkout.
- **Checkout de assinatura**: a página de pagamento do Asaas aberta para um plano pago, uma periodicidade e o preço de cartão de crédito correspondente. Identifica o plano e a periodicidade. Não é, por si, a confirmação do pagamento.
- **Configuração de acesso**: o ambiente do Asaas (testes ou produção) e a chave que permite abrir o checkout. A chave real fica fora do histórico compartilhado. O exemplo descreve essas configurações sem valor utilizável.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Nos quatro planos pagos e nas três periodicidades, o visitante que clica em Contratar chega à página de pagamento do Asaas em menos de 5 segundos quando o acesso está configurado e o Asaas responde, e o valor mostrado lá é o preço de cartão de crédito do catálogo naquela combinação, em 100% desses doze casos.
- **SC-002**: Em nenhuma dessas doze combinações o destino é app.lhamalog.com. "Começar grátis" continua abrindo o cadastro e não abre pagamento.
- **SC-003**: Uma revisão da página recebida pelo visitante e do histórico compartilhado do projeto não encontra chave de acesso utilizável. O exemplo que acompanha o projeto não contém chave real.
- **SC-004**: Depois de ir à página de pagamento e voltar, 100% das voltas deixam a landing sem mensagem de pagamento confirmado e sem mudança na seção de planos.
- **SC-005**: Com a configuração ausente, com preço de cartão inválido ou com o Asaas indisponível, o visitante permanece na landing, vê a contratação indisponível e ainda usa o topo, "Como funciona", os recursos, as perguntas e a chamada final sem recarregar a página para outro destino.
- **SC-006**: A comparação visual da seção de planos, antes e depois, não mostra diferença de desenho. O preço escrito no cartão continua o do Pix em 100% dos planos pagos.

## Assumptions

- A tarefa de origem é a LLT-273, dependente da landing já criada na LLT-272. O catálogo de planos é o que essa landing já publica. Esta especificação não redefine preços, franquias, nomes nem códigos.
- Divergência registrada com o card da LLT-273: o card pede a lógica sem um backend próprio e com camadas `domain`, `application`, `infrastructure` e `presentation`, e deixava o provedor em aberto. O Drive fechou o Asaas. Criar o checkout do Asaas exige a chave secreta, e essa chave não pode ir no pacote que o visitante recebe. Por isso esta entrega abre o checkout num processo servidor que já serve a página (desenvolvimento na máquina, preview na imagem), sem essas quatro camadas e sem um backend de produto separado. Levar a rota para o Core continua possível numa entrega seguinte. Esta nota é a decisão explícita desta spec; o card do Jira ainda precisa ser atualizado pelo time para não divergir em silêncio.
- O pagamento desta página não se liga a uma conta do LhamaLog. A referência enviada ao Asaas é só o código do plano e a periodicidade. Não há e-mail, cliente nem webhook aqui. Ativar a assinatura numa conta fica para o fluxo do produto (LLT-231) e exige um identificador de pessoa que esta entrega não coleta. Antes de apontar a chave de produção, esse elo precisa existir. "Começar grátis" e "Acessar Página" continuam indo ao app; "Contratar" deixa de mandar o plano no endereço de retorno do cadastro.
- O provedor é o Asaas. O card da LLT-273 deixava o provedor em aberto; a decisão do Drive (ADR_163, revisão de 27/10/2026, e os requisitos da LLT-231) fecha o Asaas como único gateway. O pedido desta entrega diz o mesmo.
- O checkout recorrente do Asaas aceita somente cartão de crédito. Pix, débito e boleto são outro caminho, no fluxo de contratação do produto, e ficam de fora deste botão. Por isso o Contratar desta página abre só o checkout de cartão, embora os textos já publicados continuem dizendo que a forma de pagamento é escolhida na hora de contratar. Esses textos não mudam, porque o desenho fica como está.
- O preço cobrado é o de cartão de crédito do catálogo, não o de Pix que o cartão mostra. O Drive separa o preço por forma de pagamento. O desenho atual mostra o Pix e não ganha texto novo para explicar a diferença; a página do Asaas é onde o visitante vê o valor que será cobrado.
- A chave de acesso fica só na configuração da equipe, nunca na página recebida pelo visitante e nunca no histórico compartilhado. O guia do Asaas no Drive e o card da LLT-273 dizem a mesma coisa. O exemplo lista o ambiente e a chave como configurações necessárias, com valores de exemplo.
- Enquanto a empresa não tiver CNPJ, só o ambiente de testes está liberado. Checkout aberto por esta página, nesse período, não cobra dinheiro real. A landing não ganha um aviso visual de teste, porque o desenho não muda.
- Voltar da página de pagamento não ativa conta, não emite nota e não comprova pagamento. Quem confirma o pagamento é o Asaas, no fluxo do produto. Esta página não recebe esse aviso e não cria conta.
- A landing não pede documento, telefone nem endereço, porque isso mudaria o desenho e pertence ao fluxo de contratação do produto. Se o Asaas não abrir o checkout sem esses dados, o visitante vê a contratação indisponível e permanece na página.
- O teste de 14 dias não começa neste checkout. A página não mostra teste grátis e não pede o documento que limita o teste a uma vez por pessoa. Essa regra continua no fluxo de contratação do produto.
- "Começar grátis" e "Acessar Página" não mudam de destino. Só Contratar, nos planos pagos, passa a abrir o Asaas.
- A mensagem de falha é a que a página já usa: a contratação não está disponível no momento e a pessoa pode tentar mais tarde.
