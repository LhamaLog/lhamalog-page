---
description: "Tarefas para inicializar a landing page do LhamaLog"
---

# Tasks: Inicialização da landing page

**Input**: Design documents from `/specs/001-init-landing-page/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Não há suíte automatizada. A spec e o plano medem o aceite pelo quickstart manual.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: arquivos na raiz e `src/` conforme `specs/001-init-landing-page/plan.md`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Arquivos iniciais que não sobem a página sozinhos

- [X] T001 Criar o diretório `src/` na raiz do repositório, sem subpastas `components`, `pages`, `public` ou `tests`
- [X] T002 [P] Criar `.gitignore` na raiz ignorando `node_modules` e `dist`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Página e servidor de desenvolvimento compartilhados pelos dois caminhos de início

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 [P] Criar `package.json` na raiz com nome `lhamalog-page`, dependências `react` e `react-dom`, dependências de desenvolvimento `vite` e `@vitejs/plugin-react`, e somente o script `dev` com valor `vite`; não incluir scripts `build` ou `preview` e não inventar números de versão
- [X] T004 [P] Criar `vite.config.js` na raiz com o plugin de React, `server.port` 3000, `server.strictPort` true, `server.host` true e `server.watch.usePolling` true
- [X] T005 [P] Criar `index.html` na raiz com título `lhamalog-page no ar`, um elemento raiz vazio e o módulo `/src/main.jsx`
- [X] T006 [P] Criar `src/main.jsx` renderizando somente o texto `lhamalog-page no ar`, sem CSS, imagem ou outro texto
- [X] T007 Gerar `package-lock.json` na raiz executando `npm install`, depois de `package.json` existir

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Iniciar pelo contêiner (Priority: P1) 🎯 MVP

**Goal**: Subir a página em desenvolvimento com um comando make, em Node 26, na porta 3000, sem banco nem página já construída

**Independent Test**: Com Docker em execução e make instalado, `make run` na raiz deixa `http://localhost:3000` no ar, mostra só `lhamalog-page no ar` e não inicia outro serviço

### Implementation for User Story 1

- [X] T008 [P] [US1] Criar `.dockerignore` na raiz excluindo `node_modules`, `dist` e `.git`
- [X] T009 [P] [US1] Criar `Dockerfile` na raiz a partir de `node:26`, com trabalho em `/app`, cópia só de `package.json` e `package-lock.json`, `npm ci`, porta 3000 e comando `npm run dev`; não copiar o código-fonte para a imagem
- [X] T010 [US1] Criar `docker-compose.yml` na raiz com um único serviço `page`, build do `Dockerfile`, imagem `lhamalog-page`, porta `3000:3000` e volumes `.:/app` e `/app/node_modules`
- [X] T011 [US1] Criar `Makefile` na raiz com `run` executando `docker compose up --build`, e `build` e `docker` executando `docker build -t lhamalog-page .`

**Checkpoint**: User Story 1 funciona sozinha por `make run`

---

## Phase 4: User Story 2 - Iniciar na máquina local (Priority: P2)

**Goal**: Subir a mesma página com npm, sem Docker, em Node 26 e na porta 3000

**Independent Test**: Com Docker parado, Node 26 e npm instalados, `npm install` e `npm run dev` na raiz mostram só `lhamalog-page no ar` em `http://localhost:3000`

### Implementation for User Story 2

- [X] T012 [US2] Declarar em `package.json` o campo `engines.node` como `26.x` e manter o único script de início como `dev`

**Checkpoint**: User Stories 1 e 2 funcionam de forma independente

---

## Phase 5: User Story 3 - Preparar a máquina pelo README (Priority: P3)

**Goal**: O README apresenta o projeto, os dois inícios e a instalação de Docker, make e Node 26

**Independent Test**: Uma pessoa nova, em Windows, Linux ou macOS, instala as ferramentas só com o README e conclui um dos dois inícios

### Implementation for User Story 3

- [X] T013 [US3] Escrever em `README.md` o que é o repositório e a frase exata `lhamalog-page no ar`
- [X] T014 [US3] Escrever em `README.md` os inícios `make run`, `docker compose up --build`, `npm install` seguido de `npm run dev`, e a construção da imagem com `make build`, todos iguais aos arquivos `Makefile`, `docker-compose.yml` e `package.json`
- [X] T015 [US3] Escrever em `README.md` a instalação de Docker, make e Node 26 em Windows, Linux e macOS, a porta 3000, a falha com Docker parado e a orientação de liberar a porta 3000 quando ela estiver ocupada

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Conferir a árvore e o quickstart sem acrescentar código de produto

- [X] T016 Conferir a raiz e `src/` contra a árvore em `specs/001-init-landing-page/plan.md` e remover pasta ou arquivo de exemplo que não esteja nessa árvore
- [X] T017 Executar `specs/001-init-landing-page/quickstart.md` e corrigir `README.md`, `Makefile`, `docker-compose.yml`, `Dockerfile`, `package.json`, `vite.config.js`, `index.html` ou `src/main.jsx` se algum passo falhar

---

## Phase 7: User Story 2 - Instalar dependências pelo make (Priority: P2)

**Goal**: Um alvo do `Makefile` instala as dependências da página na máquina local, sem subir a página e sem alterar `run`, `build` ou `docker`

**Independent Test**: Com Node 26 e make, `make install` na raiz executa a instalação das dependências de `package.json`. A porta 3000 não abre. `make run` continua só subindo o contêiner.

### Implementation for User Story 2

- [X] T018 [US2] Adicionar em `Makefile` o alvo `install` em `.PHONY`, executando `npm install` na raiz; manter `run`, `build` e `docker` como estão
- [X] T019 [P] [US3] Documentar em `README.md`, na seção da máquina local, o comando `make install` antes de `npm run dev`, e `npm install` como o mesmo passo sem make; deixar claro que `make install` não inicia a página e exige Node 26
- [X] T020 [P] [US2] Atualizar a seção 2 de `specs/001-init-landing-page/quickstart.md` para instalar com `make install` e citar `npm install` como equivalente sem make

**Checkpoint**: `make install` instala as dependências e os outros alvos do `Makefile` seguem iguais

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete
- **Instalar dependências (Phase 7)**: Depends on the existing `Makefile`, `package.json` and `README.md`. T019 and T020 wait for T018 and can run together

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Uses `package.json` da fundação e não depende do contêiner. O alvo `install` (Phase 7) também pertence a esta história e não depende do contêiner
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - O texto dos comandos deve citar os arquivos das histórias 1 e 2 quando eles já existirem

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T002 can run in parallel with T001
- T003, T004, T005 and T006 can run in parallel; T007 waits for T003
- T008 and T009 can run in parallel; T010 waits for T009; T011 waits for T010
- Once Foundational phase completes, User Story 1 and User Story 2 can start in parallel
- T019 and T020 can run in parallel after T018

---

## Parallel Example: User Story 1

```bash
# Arquivos diferentes, sem depender um do outro:
Task: "Criar .dockerignore na raiz excluindo node_modules, dist e .git"
Task: "Criar Dockerfile na raiz a partir de node:26, com npm ci e npm run dev"

# Depois, em sequência:
Task: "Criar docker-compose.yml na raiz com o serviço page"
Task: "Criar Makefile na raiz com run, build e docker"
```

---

## Parallel Example: Instalar dependências

```bash
# Depois do alvo install existir no Makefile:
Task: "Documentar make install em README.md"
Task: "Atualizar a seção 2 de specs/001-init-landing-page/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
3. Developer C writes User Story 3 after the commands of A and B exist
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
