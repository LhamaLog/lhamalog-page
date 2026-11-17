# Implementation Plan: Ajuste local do catálogo de planos

**Branch**: `LLT-272-Ajuste-de-planos-automatico` (feature `004-ajuste-planos-local`) | **Date**: 2026-11-17 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/004-ajuste-planos-local/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

A oferta de planos deixa de morar em `src/features/subscription/mocks/plans.js` e passa a ser um único arquivo, `public/planos.json`, que acompanha a página. A seção de planos busca esse arquivo. Nome, descrição, selo, plano recomendado, preços e limites vêm dele. O desenho dos cartões e o endereço de "Contratar" permanecem.

Quem roda a página na própria máquina (`npm run dev` ou `make run`, aberto em localhost) vê o formulário em `/#ajustar-planos`. Salvar grava o mesmo JSON, depois de uma validação única. O site gerado por `npm run build` não contém o formulário nem o endereço de gravação. Um visitante em lhamalog.com não altera o catálogo.

## Technical Context

**Language/Version**: JavaScript (JSX), React 19.3.1, Vite 8.3.7, Node 26.x

**Primary Dependencies**: React, React DOM, Tailwind 4.3.3 (`@tailwindcss/vite`). Nenhum pacote novo.

**Storage**: arquivo `public/planos.json` versionado com a página. Sem banco e sem serviço externo.

**Testing**: `node --test tests/*.test.mjs` para a validação pura e para o desconto semestral lendo o JSON; `npm run build`; roteiro manual do [quickstart.md](quickstart.md). Sem biblioteca nova de teste de componente.

**Target Platform**: navegador. Desenvolvimento local na porta 3000. Publicação pelo resultado de `npm run build` (`dist/`).

**Project Type**: página web estática (SPA de uma tela)

**Performance Goals**: um arquivo pequeno, lido uma vez ao abrir a seção. O restante da landing não espera essa leitura para aparecer.

**Constraints**: formulário e gravação só no servidor de desenvolvimento e só com o navegador em localhost, 127.0.0.1 ou ::1; códigos enviados em "Contratar" continuam `FREE`, `STARTER`, `PRO`, `BUSINESS`, `ENTERPRISE`; boleto igual ao Pix; desconto semestral calculado, não digitado; cartões sem aviso de teste grátis; sem pacote novo; sem serviço externo.

**Scale/Scope**: 5 planos fixos, 1 arquivo de catálogo, 1 formulário local, 1 validação compartilhada. Não inclui nem remove plano.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` continua o modelo em branco, sem princípio ratificado. Os gates saem da spec 004, do README e do que a página já faz.

| Gate | Situação |
|---|---|
| Uma oferta só, sem serviço externo | Passa: `public/planos.json` é a fonte; a página não chama API |
| Visitante do site publicado não grava | Passa: gravação só no `configureServer` do Vite, e só para localhost |
| Formulário só no ambiente local | Passa: o módulo do formulário entra no pacote só com `import.meta.env.DEV` e hostname local |
| Códigos e desenho dos cartões | Passa: `format.js`, classes do cartão e `contractUrl` não mudam de regra |
| Sem pacote novo | Passa |
| Teste do que é regra | Passa: validação e desconto em `node --test` |

Reavaliação após o desenho (Fase 1): os contratos e o modelo usam o mesmo arquivo e a mesma validação. Nenhuma violação.

## Project Structure

### Documentation (this feature)

```text
specs/004-ajuste-planos-local/
├── plan.md              # este arquivo
├── research.md          # Fase 0
├── data-model.md        # Fase 1
├── quickstart.md        # Fase 1
├── contracts/
│   ├── catalogo.md      # arquivo público e validação
│   └── ajuste-local.md  # formulário e gravação locais
├── checklists/requirements.md
└── tasks.md             # criado por /speckit-tasks, não por este comando
```

### Source Code (repository root)

```text
public/planos.json                                         # NOVO: catálogo vigente
src/features/subscription/catalogo.js                      # NOVO: validação pura e conversão de reais
src/features/subscription/hooks/usePlans.js                # EDITA: busca /planos.json
src/features/subscription/mocks/plans.js                   # REMOVE: deixa de ser fonte
src/features/subscription/screens/public/PlansCatalog.jsx  # EDITA: recomendado vem do plano
src/features/subscription/screens/public/PublicPlanCard.jsx # EDITA: descrição e selo vêm do plano
src/features/subscription/screens/dev/AjustePlanos.jsx     # NOVO: formulário, só importado em dev local
vite.planos.js                                             # NOVO: gravação só no servidor de desenvolvimento
vite.config.js                                             # EDITA: registra o plugin
tests/catalogo.test.mjs                                    # NOVO: casos de FR-006 e conversão
tests/plan-savings.test.mjs                                # EDITA: lê o JSON em vez de fakePlans()
```

**Structure Decision**: a regra fica em `catalogo.js`, sem JSX, para o teste e o plugin do Vite importarem o mesmo módulo. O formulário fica fora de `screens/public` para não parecer página publicada. `format.js` e `appLinks.js` permanecem.

## Complexity Tracking

Nenhuma violação a justificar.
