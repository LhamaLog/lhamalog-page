# Feature Specification: Inicialização da landing page

**Feature Branch**: `001-init-landing-page`

**Created**: 2026-11-10

**Status**: Draft

**Input**: User description: "Inicializar o repositório lhamalog-page como projeto React da landing page do LhamaLog, iniciável por Docker ou por npm na máquina local, com make no padrão do lhamalog-finder. O contêiner contém só o necessário para iniciar a página. O README apresenta o projeto, a inicialização e a instalação das ferramentas. Há estrutura de pastas para o desenvolvimento web e arquivos de inicialização. Ficam de fora o código de front-end do produto e pastas sem função."

## Clarifications

### Session 2026-11-10

- Q: Ao abrir o endereço documentado, o que confirma que o projeto está no ar? → A: Uma frase fixa de que o projeto está no ar, sem conteúdo do produto.
- Q: Qual versão do Node os dois caminhos de início devem usar? → A: Node 26, fixo.
- Q: Em qual porta local a página deve ficar no ar nos dois caminhos? → A: Porta 3000.
- Q: O contêiner deve iniciar a página em desenvolvimento, como o npm na máquina, ou deve servir a página já construída? → A: Desenvolvimento nos dois caminhos, com o mesmo comportamento.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Iniciar pelo contêiner (Priority: P1)

Uma pessoa do time, na raiz do repositório, sobe a landing page com um comando make, usando o contêiner. A máquina não precisa ter o Node instalado. O contêiner usa Node 26 e inicia a página em desenvolvimento, com o mesmo comportamento do npm na máquina. O que sobe é somente a página. Não há banco nem outra ferramenta de backend. A página já construída não é o modo de início.

**Why this priority**: É o caminho principal de inicialização, alinhado ao padrão já usado no módulo Finder, e entrega um projeto que realmente inicia.

**Independent Test**: Com Docker em execução e make instalado, executar o comando documentado na raiz e confirmar que a página está no ar na porta 3000, sem outro serviço acompanhando.

**Acceptance Scenarios**:

1. **Given** Docker em execução e make instalado, **When** a pessoa executa o comando de início documentado na raiz, **Then** a página fica no ar na porta 3000 em desenvolvimento, com o mesmo comportamento do npm local, e nenhum banco ou ferramenta de backend é iniciado.
2. **Given** a página iniciada pelo contêiner, **When** a pessoa abre a porta 3000, **Then** ela vê somente a frase fixa escrita no README, informando que o projeto está no ar, sem planos, funcionalidades ou descrição do produto.
3. **Given** make indisponível e Docker em execução, **When** a pessoa segue os comandos equivalentes do README, **Then** a página sobe do mesmo modo que pelo make.
4. **Given** o comando de construção da imagem documentado, **When** a pessoa o executa, **Then** a imagem da página é gerada e continua contendo só o necessário para iniciar a página.
5. **Given** o repositório depois desta entrega, **When** a pessoa lista as pastas e procura conteúdo do produto, **Then** cada pasta serve à inicialização ou ao trabalho web futuro, e não há tela, seção ou texto de planos, funcionalidades ou descrição.

---

### User Story 2 - Iniciar na máquina local (Priority: P2)

Uma pessoa do time inicia o mesmo projeto na própria máquina com npm, sem Docker. O resultado é o mesmo do contêiner: desenvolvimento, página no ar na porta 3000, sem conteúdo do produto.

**Why this priority**: O pedido exige os dois caminhos. O caminho local é independente do contêiner e permite desenvolver sem Docker.

**Independent Test**: Sem Docker, com Node 26 e o npm instalados, executar os comandos locais documentados e confirmar a página no ar na porta 3000.

**Acceptance Scenarios**:

1. **Given** Node 26 e o npm instalados e o Docker parado ou ausente, **When** a pessoa executa os comandos locais documentados, **Then** a página fica no ar na porta 3000 em desenvolvimento, sem servir uma página já construída.
2. **Given** a página iniciada localmente, **When** a pessoa abre a porta 3000, **Then** ela vê somente a mesma frase fixa escrita no README, informando que o projeto está no ar, sem planos, funcionalidades ou descrição do produto.
3. **Given** os dois caminhos documentados, **When** a pessoa compara README, imagem e comandos locais, **Then** os dois usam Node 26, e o README declara Node 26.

---

### User Story 3 - Preparar a máquina pelo README (Priority: P3)

Uma pessoa nova no repositório lê o README, entende que este repositório é a landing page do LhamaLog e instala as ferramentas antes de iniciar. O README explica como obter Docker, make e, para o caminho local, Node 26 com npm, em Windows, Linux e macOS.

**Why this priority**: Sem o guia, os comandos de início não são reproduzíveis. A apresentação do projeto e o modo de baixar as ferramentas são critérios de aceite.

**Independent Test**: Uma pessoa sem as ferramentas segue só o README, instala o que falta para um dos caminhos e conclui a inicialização correspondente.

**Acceptance Scenarios**:

1. **Given** o README, **When** a pessoa o lê, **Then** ela encontra o que é o repositório (landing page para apresentação futura de planos, funcionalidades e descrição do LhamaLog), como iniciar pelos dois caminhos e como instalar as ferramentas.
2. **Given** Windows, Linux ou macOS, **When** a pessoa segue a seção de instalação, **Then** ela obtém Docker e make; no caminho local, também Node 26 e o npm.
3. **Given** o README e os arquivos do repositório, **When** a pessoa compara os comandos com os arquivos de início, **Then** cada comando citado existe e faz o que o texto descreve.

---

### Edge Cases

- Docker instalado, porém parado: o início por contêiner falha de forma visível. Nenhum banco ou ferramenta de backend é criado por causa dessa falha. O README informa que o Docker precisa estar em execução.
- Caminho local sem Node 26 ou sem npm: o início local não é apresentado como disponível. Outra versão principal do Node não substitui Node 26. O README aponta a instalação de Node 26.
- Porta 3000 já ocupada por outro processo: o início falha de forma visível e o README informa que é preciso liberar a porta 3000.
- Pessoa habituada ao Finder procura um comando que sobe banco ou observabilidade: este repositório não oferece esse comando.
- Revisão do repositório depois da inicialização: não há tela, seção ou texto de planos, funcionalidades ou descrição do produto, e não há pasta sem função na estrutura web.
- Página em branco, página de exemplo da ferramenta ou qualquer outro texto na porta 3000: a confirmação de projeto no ar falha. O único texto visível aceito é a frase fixa escrita no README.
- Início pelo contêiner servindo uma página já construída, ou início local com comportamento diferente do contêiner: o aceite falha. Uma alteração nos arquivos do projeto aparece na porta 3000 nos dois caminhos sem gerar uma página construída à parte.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O repositório MUST poder ser iniciado como o projeto React da landing page do LhamaLog.
- **FR-002**: Uma pessoa MUST conseguir iniciar o projeto por contêiner com um comando make na raiz, no mesmo estilo de inicialização do lhamalog-finder (um comando documentado, com o equivalente sem make no README).
- **FR-003**: Uma pessoa MUST conseguir iniciar o projeto na máquina local com npm, sem Docker, em desenvolvimento.
- **FR-004**: Os dois caminhos MUST deixar a página no ar na porta 3000 da máquina local. O README MUST declarar a porta 3000.
- **FR-005**: O ambiente em contêiner MUST conter somente o necessário para iniciar a página. MUST NOT incluir banco de dados nem outras ferramentas de backend.
- **FR-006**: O comando de início padrão MUST NOT subir banco, fila, observabilidade ou qualquer serviço que não seja a página.
- **FR-007**: O README MUST apresentar o projeto, explicar os dois modos de iniciar e explicar como instalar Docker, make e, para o caminho local, Node 26 com npm, em Windows, Linux e macOS.
- **FR-008**: Os comandos do README MUST corresponder aos arquivos de inicialização presentes no repositório.
- **FR-009**: O repositório MUST incluir os arquivos de inicialização e de execução local: definição da imagem, composição local e arquivo de comandos make.
- **FR-010**: O repositório MUST ter uma estrutura de pastas para o desenvolvimento web posterior, restrita a pastas que participam da inicialização ou que existem para receber o trabalho web futuro.
- **FR-011**: A entrega MUST NOT incluir código de front-end do produto: telas, seções ou textos de planos, funcionalidades ou descrição do LhamaLog.
- **FR-012**: Ao abrir a porta 3000, a página MUST exibir somente uma frase fixa informando que o projeto está no ar. Essa frase MUST estar escrita no README e MUST ser a mesma nos dois caminhos de início. A página MUST NOT exibir outro texto.
- **FR-013**: A entrega MUST NOT incluir pastas sem função, nem pastas de backend, banco ou ferramentas alheias à página.
- **FR-014**: O contêiner e o caminho local MUST usar Node 26. O README MUST declarar Node 26. Outra versão principal MUST NOT ser usada em nenhum dos dois caminhos.
- **FR-015**: MUST haver um comando make, e o equivalente sem make, para construir a imagem da página.
- **FR-016**: Os dois caminhos MUST iniciar a página em desenvolvimento, com o mesmo comportamento. O início MUST NOT servir uma página já construída. Uma alteração nos arquivos do projeto MUST aparecer na porta 3000 nos dois caminhos sem gerar uma página construída à parte.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Pelo caminho em contêiner, uma pessoa inicia a página com um único comando na raiz e, na porta 3000, vê somente a frase fixa de que o projeto está no ar.
- **SC-002**: Pelo caminho local, sem o contêiner, uma pessoa inicia a página com os comandos documentados e vê a mesma frase fixa na porta 3000.
- **SC-003**: Uma pessoa nova, em Windows, Linux ou macOS, instala as ferramentas de um dos caminhos usando somente o README e, em seguida, conclui a inicialização desse caminho.
- **SC-004**: Na inicialização padrão, a única coisa em execução atribuível a este repositório é a página. A contagem de bancos e de ferramentas de backend iniciadas por esse fluxo é zero.
- **SC-005**: A revisão do repositório encontra zero telas, seções ou textos de planos, funcionalidades ou descrição do produto, e toda pasta presente tem função na inicialização ou na estrutura web descrita.
- **SC-006**: Cada comando citado no README existe nos arquivos de inicialização e produz o efeito descrito no texto.
- **SC-007**: Nos dois caminhos a página inicia em desenvolvimento. Nenhum dos dois serve uma página já construída. Uma alteração nos arquivos do projeto aparece na porta 3000 nos dois caminhos sem uma construção à parte da página.

## Assumptions

- O propósito futuro do repositório é a landing page pública do LhamaLog, com planos, funcionalidades e descrição. Esse conteúdo não faz parte desta entrega; o README apenas declara esse propósito.
- O padrão de inicialização de referência é o repositório local lhamalog-finder: README com pré-requisitos, instalação de Docker e make em Windows, Linux e macOS, início por make e os mesmos passos sem make. Os alvos de infraestrutura (banco, fila, observabilidade) e os alvos de teste em Go desse módulo não se aplicam aqui.
- "Arquivos de inicialização/deploy" significa a definição da imagem, a composição local e o arquivo de comandos make, suficientes para construir a imagem e rodar a página em desenvolvimento na máquina de quem desenvolve. O comando de início não serve uma página já construída. Não foi encontrada, no Jira nem no Drive, uma decisão de hospedagem remota ou de pipeline. Publicação em ambiente remoto fica fora desta entrega.
- A confirmação de projeto no ar é uma única frase fixa, escrita no README, informando que o projeto está no ar. Não há outro texto na página. Essa frase não é a interface do produto.
- Os dois caminhos usam Node 26, fixado na clarificação de 2026-11-10. O plano de inicialização dos módulos no Drive não define essa versão; a decisão desta sessão prevalece. O README e a imagem declaram Node 26.
- A pasta Drive "Dependências específicas dos módulos" não tem documento de dependências do lhamalog-page. Nenhuma biblioteca de interface é escolhida nesta especificação. Dependências além do necessário para iniciar o projeto React ficam para uma entrega posterior, depois de consulta.
- O site Atlassian acessível (logviewer2026.atlassian.net) não tem Confluence. A busca no Jira por landing, lhamalog-page e página não retornou issues.
- Documentos do Drive sobre planos (LLT-230 a LLT-235) tratam de ver, contratar, alterar e reembolsar assinatura no produto. Não são a especificação desta landing page e não foram usados como conteúdo.
- Este repositório não tem constituição em `.specify/memory/constitution.md`. A constituição do Finder não foi aplicada, porque rege outro módulo.
- O README atual do repositório contém só o título. Esta entrega o substitui pelo guia descrito acima.
- Os dois caminhos escutam a porta 3000 na máquina local, fixada na clarificação de 2026-11-10. O README declara essa porta. Não havia porta definida no Drive nem no Jira.
