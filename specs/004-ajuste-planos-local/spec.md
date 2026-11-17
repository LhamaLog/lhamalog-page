# Feature Specification: Ajuste local do catálogo de planos

**Feature Branch**: `LLT-272-Ajuste-de-planos-automatico`

**Created**: 2026-11-17

**Status**: Draft

**Input**: User description: "Crie uma nova branch "LLT-272 Ajuste de planos automático" realize a implementação da nova forma de ajuste de plano, no qual será utilizado um json, e um formulário que só pode ser utilizado em npm run dev"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver a oferta publicada, sem poder alterá-la (Priority: P1)

Uma pessoa abre a página pública, sem conta. Na seção de planos ela vê a oferta vigente: os cinco planos, o seletor de periodicidade e os cartões com preço, franquia e limites. Ela troca a periodicidade, lê o valor e segue para começar grátis ou contratar. Nada nessa página permite que ela mude o que as outras pessoas veem.

**Why this priority**: A página pública é o que o visitante usa para comparar e contratar. O ajuste do catálogo não pode abrir essa oferta para edição de quem apenas visita.

**Independent Test**: Abrir a página publicada, percorrer as três periodicidades e confirmar que os cartões batem com o catálogo vigente. Procurar, no menu, na seção de planos, no rodapé e no endereço do formulário, um jeito de salvar outra oferta. Nenhum caminho altera o catálogo que outro visitante vê.

**Acceptance Scenarios**:

1. **Given** nenhum ajuste válido foi salvo depois desta entrega, **When** um visitante abre a página publicada, **Then** vê Free, Starter, Pro, Business e Enterprise, nessa ordem, com os preços, franquias, limites, textos curtos e selos da oferta que a página já mostrava, e o Pro como único recomendado.
2. **Given** a seção de planos, **When** o visitante troca entre semanal, mensal e semestral, **Then** o preço de cada plano pago acompanha a periodicidade, o valor exibido é o do Pix, o boleto permanece igual ao Pix, e o desconto semestral só aparece quando o semestral fica mais barato que seis mensalidades.
3. **Given** a página publicada, **When** o visitante percorre o menu, a seção de planos, o rodapé e o endereço que abre o formulário no ambiente local, **Then** não encontra formulário, não encontra ação de salvar e o catálogo visto por outro visitante permanece o mesmo.
4. **Given** um plano pago, **When** o visitante escolhe "Contratar", **Then** segue para o cadastro com o código daquele plano e a periodicidade escolhida. Esse código continua um dos já usados hoje: Free, Starter, Pro, Business ou Enterprise. **Given** o plano Free, **When** escolhe "Começar grátis", **Then** segue para o cadastro, o cartão não mostra preço e informa que a ingestão pausa ao chegar na franquia.
5. **Given** um plano com membros ou produtos sem quantidade, **When** o visitante lê o cartão, **Then** esse limite aparece como ilimitado. **Given** qualquer cartão, **When** o visitante o lê, **Then** não encontra aviso de teste grátis.

---

### User Story 2 - Ajustar a oferta no ambiente local (Priority: P1)

Uma pessoa da equipe abre a página no ambiente local de desenvolvimento, antes de publicar. Ali existe um formulário da própria página para ajustar a oferta. Ela altera nome, texto curto, selo, plano recomendado, preços, franquia e limites, confere os cartões na mesma execução e salva. O site já publicado continua com a oferta anterior até a equipe publicar a página de novo.

**Why this priority**: O pedido existe para a equipe mudar a oferta sem alterar o desenho da página e sem depender de um serviço de fora. O formulário local é o meio desse ajuste.

**Independent Test**: No ambiente local, mudar o preço mensal no Pix e a franquia de um plano, salvar e ver os cartões atualizados. Abrir o site publicado antes da nova publicação e confirmar que ele ainda mostra a oferta anterior.

**Acceptance Scenarios**:

1. **Given** a página no ambiente local de desenvolvimento, **When** a pessoa da equipe abre o ajuste, **Then** vê um formulário com os cinco planos e os valores vigentes, e consegue alterar os campos de FR-004.
2. **Given** um preço mensal no Pix e uma franquia alterados de forma válida, **When** a pessoa salva, **Then** a seção de planos dessa execução local passa a mostrar os novos valores, e o catálogo guardado é o que a próxima publicação leva ao site.
3. **Given** um ajuste salvo apenas no ambiente local, **When** um visitante abre o site que ainda não foi publicado de novo, **Then** esse visitante continua vendo a oferta da publicação anterior.
4. **Given** a página no site publicado, **When** qualquer pessoa abre o endereço do formulário, **Then** o formulário não aparece e não há como salvar.

---

### User Story 3 - Recusar um catálogo que a página não pode mostrar (Priority: P2)

A pessoa da equipe erra um valor, ou o catálogo publicado chega incompleto. O ajuste inválido não substitui a oferta anterior. No site, a seção de planos explica a falha e oferece nova tentativa, e o restante da página continua utilizável.

**Why this priority**: Um preço negativo, um plano a menos ou um arquivo ilegível não pode apagar a oferta boa nem derrubar a página inteira.

**Independent Test**: Tentar salvar um preço negativo e confirmar que a oferta anterior permanece. Publicar um catálogo ilegível e confirmar o aviso com nova tentativa, com o topo, os recursos, as perguntas e a chamada final ainda utilizáveis.

**Acceptance Scenarios**:

1. **Given** um catálogo válido já guardado, **When** a pessoa salva um ajuste que fere FR-006, **Then** o catálogo guardado não muda e o formulário indica o que precisa ser corrigido.
2. **Given** o site publicado com um catálogo ausente ou ilegível, **When** o visitante chega à seção de planos, **Then** vê a falha ao carregar e uma ação de tentar de novo, e o restante da página segue utilizável.
3. **Given** o site publicado com um catálogo que a página não consegue interpretar, **When** o visitante usa o topo, "Como funciona", recursos, perguntas e a chamada final, **Then** essas partes respondem normalmente.

---

### Edge Cases

- Preço zero, preço negativo ou nome vazio: o salvamento é recusado e o catálogo anterior permanece.
- Plano pago sem preço em alguma periodicidade ou sem valor por GB a mais: o salvamento é recusado.
- Plano Free com preço ou com valor por GB a mais: o salvamento é recusado. No Free, a franquia continua por mês nas três periodicidades.
- Nenhum plano recomendado, ou mais de um: o salvamento é recusado. A oferta vigente começa com um único recomendado, o Pro.
- Código de plano renomeado, plano incluído ou plano removido: o salvamento é recusado. A ordem permanece Free, Starter, Pro, Business, Enterprise.
- Membros ou produtos em branco significam ilimitado. Zero nesses campos é recusado. Franquia e retenção precisam ser maiores que zero.
- Boleto diferente do Pix: o formulário não pede o boleto à parte e o valor salvo do boleto é o do Pix. Um catálogo em que eles diferem é tratado como inválido.
- Semestral igual ou mais caro que seis mensalidades: o catálogo pode ser salvo, e o aviso de desconto não aparece.
- Texto de descrição mais longo que o atual: o cartão mostra o texto inteiro, sem rolagem lateral na largura de 375 px.
- Duas pessoas ajustam no mesmo ambiente local, uma depois da outra: vale o último salvamento válido.
- A publicação nova ainda não ocorreu: o visitante do site publicado não vê o rascunho local.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A página pública MUST obter a oferta de um único catálogo que acompanha a própria página. A seção de planos MUST usar só esse catálogo. A página MUST NOT consultar um serviço de fora para buscar planos.
- **FR-002**: No site publicado, o visitante MUST NOT conseguir alterar o catálogo. A página publicada MUST NOT mostrar formulário de ajuste, MUST NOT oferecer ação de salvar e MUST NOT mudar a oferta que os outros visitantes veem quando alguém abre o endereço do formulário.
- **FR-003**: O formulário de ajuste MUST existir somente quando a página está em execução no ambiente local de desenvolvimento da equipe. Nesse ambiente, a pessoa da equipe MUST conseguir abrir o formulário, revisar os cinco planos e salvar. No site publicado, esse formulário MUST NOT existir.
- **FR-004**: O formulário MUST permitir ajustar, em cada plano já existente: nome, descrição curta do cartão, selo, se aquele plano é o recomendado, franquia em GB, retenção em dias, membros incluídos, produtos incluídos, chamadas de IA por mês, tipo de painel, recursos de análise já nomeados pela página, valor por GB a mais e valor do armazenamento extra. Para cada plano pago, MUST permitir informar o preço em reais nas periodicidades semanal, mensal e semestral, nos meios Pix, cartão de crédito e cartão de débito. O boleto MUST ficar igual ao Pix em cada periodicidade, sem um campo separado.
- **FR-005**: O catálogo inicial MUST repetir a oferta que a página mostra hoje, inclusive o Pro como único plano recomendado e os textos curtos e selos que os cartões já exibem. Enquanto ninguém salvar um ajuste válido, o visitante MUST ver essa mesma oferta.
- **FR-006**: Um salvamento MUST ser recusado, sem substituir o catálogo anterior, quando ocorrer qualquer um destes casos: nome vazio; mais de um plano recomendado ou nenhum; código diferente de Free, Starter, Pro, Business ou Enterprise; plano a mais ou a menos; ordem diferente da vigente; franquia ou retenção menor ou igual a zero; membros ou produtos igual a zero; plano Free com preço ou com valor por GB a mais; plano pago sem preço em alguma periodicidade ou meio editável, ou sem valor por GB a mais; preço menor ou igual a zero; boleto diferente do Pix; recurso de análise ou tipo de painel fora dos que a página já sabe nomear.
- **FR-007**: Depois de um salvamento válido no ambiente local, a seção de planos dessa execução MUST mostrar os valores salvos. O catálogo guardado MUST ser o que a publicação seguinte leva ao site. O site já publicado MUST continuar com a oferta anterior até essa publicação.
- **FR-008**: O desconto semestral MUST continuar calculado a partir do preço mensal e do preço semestral já informados. O formulário MUST NOT pedir esse desconto como campo. O cartão MUST continuar sem informar teste grátis.
- **FR-009**: O preço mostrado no cartão MUST continuar sendo o do Pix. "Começar grátis" MUST continuar no Free e "Contratar" MUST continuar nos planos pagos, levando o código e a periodicidade escolhidos. O desenho dos cartões e do seletor de periodicidade MUST permanecer o atual.
- **FR-010**: Com o catálogo ausente ou ilegível no site publicado, a seção de planos MUST mostrar a falha ao carregar e uma ação de tentar de novo. O topo, "Como funciona", os recursos, as perguntas frequentes e a chamada final MUST continuar utilizáveis.
- **FR-011**: Membros ou produtos sem quantidade MUST ser exibidos como ilimitados. O plano Free MUST informar que, ao chegar na franquia, a ingestão pausa. O plano pago MUST informar o valor por GB a mais que está no catálogo.
- **FR-012**: Os códigos que "Contratar" envia MUST permanecer Free, Starter, Pro, Business e Enterprise. Esta entrega MUST NOT incluir ou remover plano, MUST NOT mudar o valor cobrado no fluxo de contratação de outro projeto e MUST NOT criar conta, senha ou endereço público de edição.

### Key Entities

- **Catálogo de planos**: a oferta única que acompanha a página. Contém a moeda em reais e os cinco planos, na ordem Free, Starter, Pro, Business e Enterprise. É a única fonte da seção de planos.
- **Plano**: uma oferta com código estável, nome, descrição curta, selo opcional, indicação de recomendado, preços por periodicidade e meio, franquia, retenção, membros, produtos, chamadas de IA, tipo de painel, recursos de análise e valores de uso além da franquia. No Free, os preços e o valor por GB a mais ficam vazios.
- **Ajuste local**: a edição feita no formulário enquanto a página roda no ambiente local de desenvolvimento. Só um salvamento válido substitui o catálogo que a próxima publicação leva ao site.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Depois de alterar o preço e a franquia de um plano, salvar no ambiente local e publicar a página, a seção de planos mostra esses novos valores nas três periodicidades, iguais ao que foi salvo, em 100% dos planos alterados nessa publicação.
- **SC-002**: Em uma revisão do site publicado, nenhuma das tentativas pelo menu, pela seção de planos, pelo rodapé ou pelo endereço do formulário local encontra o formulário ou muda a oferta vista por outro visitante.
- **SC-003**: Uma pessoa da equipe conclui, no formulário local, a alteração de nome, preço mensal no Pix e franquia de um plano em menos de 3 minutos, e os cartões conservam o desenho anterior.
- **SC-004**: Com um catálogo ausente ou ilegível, a pessoa vê a falha e a nova tentativa na seção de planos, e ainda usa o topo, "Como funciona", os recursos, as perguntas e a chamada final sem recarregar a página para outra oferta.
- **SC-005**: Um salvamento inválido deixa a oferta anterior intacta em 100% das tentativas descritas em FR-006. Os códigos enviados em "Contratar" continuam Free, Starter, Pro, Business e Enterprise.

## Assumptions

- Quem ajusta é uma pessoa da equipe que já consegue abrir a página no ambiente local de desenvolvimento e publicar o site. Quem apenas visita o site publicado não ajusta a oferta.
- O pedido fixa o meio: um arquivo de catálogo que acompanha a página, e um formulário presente só nessa execução local. O site publicado não traz o formulário. Nenhum serviço externo guarda ou edita os planos.
- "Ambiente local de desenvolvimento" é a execução que a equipe já usa para ver a página na própria máquina antes de publicar. "Site publicado" é a página que o visitante abre no endereço público.
- O catálogo inicial é a oferta já mostrada hoje: cinco planos, preços, franquias, limites, textos curtos e selos atuais, com o Pro recomendado. Esta especificação não redefine esses números.
- O fluxo de contratação continua em outro projeto. Mudar o preço exibido não muda, por si, o valor cobrado lá. O código enviado em "Contratar" precisa continuar sendo um código que esse fluxo já reconhece.
- O boleto segue o Pix, como a página já informa ao visitante. O desconto semestral continua sendo uma conta sobre os preços informados, não um preço novo.
- Os recursos de análise que o formulário oferece são os que a página já sabe nomear: sugestões básicas, sugestões por IA, detecção de anomalias, investigação automática e rastreio de usuário. Os tipos de painel continuam Básico, Padrão e Personalizado.
- Incluir ou remover plano, reordenar os cartões, mudar o desenho da seção e criar um editor no site publicado ficam de fora desta entrega.
