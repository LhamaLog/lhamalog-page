# Implementation Plan: Checkout de assinatura ao contratar

**Branch**: `LLT-273-aplicar-logica-de-pagamento` (feature `005-checkout-assinatura`) | **Date**: 2026-11-17 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/005-checkout-assinatura/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Contratar, num plano pago, deixa de abrir o cadastro em app.lhamalog.com. O navegador pede à própria página um checkout de assinatura. O processo Node que já serve a landing (o `npm run dev` do Dockerfile e o `vite preview`) lê o preço de cartão de crédito em `public/planos.json`, chama o Asaas com Axios e devolve só o endereço da página de pagamento. A chave fica em variável de ambiente, sem o prefixo que o Vite publica no navegador, e o exemplo no repositório não tem chave utilizável.

O desenho dos cartões não muda. "Começar grátis" e "Acessar Página" continuam no aplicativo. Voltar do Asaas não mostra pagamento confirmado. Pix, débito, boleto, teste de 14 dias e ativação de conta ficam de fora.

## Technical Context

**Language/Version**: JavaScript (JSX), React 19.3.1, Vite 8.3.7, Node 26.x

**Primary Dependencies**: React, React DOM, Tailwind 4.3.3. Uma dependência nova: Axios, importado só pelo processo que fala com o Asaas.

**Storage**: o catálogo continua em `public/planos.json`. O checkout não é gravado. A chave e o ambiente ficam em variável de ambiente (arquivo local ignorado pelo Git, ou o ambiente do container).

**Testing**: `node --test tests/*.test.mjs` para o pedido ao Asaas, o nome de até 30 caracteres, o preço de cartão e o endereço de pagamento, sem rede. `npm run build` seguido de busca em `dist/` para garantir que a chave e o caminho antigo de Contratar não entram no pacote. Roteiro manual do [quickstart.md](quickstart.md).

**Target Platform**: navegador, servido pelo Node na porta 3000 (`npm run dev`, inclusive o Docker) ou por `vite preview`. Um hospedeiro que só entrega a pasta `dist/`, sem esse processo, não consegue abrir o checkout: a chave não pode ir no pacote, e Contratar mostra a indisponibilidade que a página já usa.

**Project Type**: página web de uma tela, com a chamada ao Asaas no mesmo processo que a serve.

**Performance Goals**: com o Asaas respondendo, o visitante chega à página de pagamento em menos de 5 segundos (SC-001). A chamada espera no máximo 8 segundos e, depois disso, mostra a contratação indisponível.

**Constraints**: chave fora de `src/` e de `dist/`; sem prefixo `VITE_` nessa chave; só cartão de crédito recorrente; valor lido do catálogo, nunca do navegador; sem formulário novo; sem aviso de teste grátis; sem webhook e sem gravar o identificador do checkout; ambiente padrão de testes (`https://api-sandbox.asaas.com/v3`).

**Scale/Scope**: quatro planos pagos, três periodicidades, um endereço na própria página, uma chamada ao Asaas por clique concluído.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` continua o modelo em branco, sem princípio ratificado. Os gates saem da spec 005, do README e do que a página já faz.

| Gate | Situação |
|---|---|
| Contratar abre o Asaas e não o app | Passa: `PlansSection` deixa de usar `contractUrl`; o destino é a página do Asaas |
| Chave fora da página e do Git | Passa: variável sem `VITE_`; `.gitignore` já ignora `.env*` e preserva `.env.example` |
| Preço de cartão do catálogo | Passa: o processo lê `CARTAO` em `public/planos.json`; o corpo do navegador não traz valor |
| Desenho intacto | Passa: mesmas classes, textos, seletor e a mensagem de indisponibilidade já existente |
| Free, Começar grátis e Acessar Página | Passa: `signUpUrl` e `signInUrl` permanecem |
| Volta não confirma pagamento | Passa: os três retornos apontam para a landing, que não lê a URL como prova |
| Só o Asaas, só cartão recorrente | Passa: um único destino e `billingTypes: ["CREDIT_CARD"]` com `chargeTypes: ["RECURRENT"]` |
| Teste do que é regra | Passa: funções puras em `node --test`; a rede fica no roteiro manual |

Reavaliação após o desenho (Fase 1): o contrato da página e o contrato com o Asaas usam o mesmo pedido puro. Nenhuma violação.

## Project Structure

### Documentation (this feature)

```text
specs/005-checkout-assinatura/
├── plan.md              # este arquivo
├── research.md          # Fase 0
├── data-model.md        # Fase 1
├── quickstart.md        # Fase 1
├── contracts/
│   ├── contratacao.md   # o que a página pede ao próprio processo
│   └── asaas-checkout.md # o que esse processo pede ao Asaas
├── checklists/requirements.md
└── tasks.md             # criado por /speckit-tasks, não por este comando
```

### Source Code (repository root)

```text
src/features/subscription/checkout.js                      # NOVO: pedido, nome, preço e endereço, sem rede e sem chave
vite.checkout.js                                           # NOVO: POST /api/contratacao no dev e no preview; Axios só aqui
vite.config.js                                             # EDITA: registra o plugin
src/features/landing/components/PlansSection.jsx           # EDITA: Contratar chama /api/contratacao
src/shared/appLinks.js                                     # EDITA: remove contractUrl; sign-in e sign-up ficam
.env.example                                               # EDITA: ambiente e chave de exemplo, sem valor utilizável
README.md                                                  # EDITA: Contratar deixa de ir ao app; documenta as variáveis
tests/checkout.test.mjs                                    # NOVO: doze combinações, nome, rejeições e endereço
tests/links.test.mjs                                       # EDITA: Contratar sai dos testes do app
package.json                                               # EDITA: dependência axios
package-lock.json                                          # EDITA: trava a versão instalada
```

**Structure Decision**: a regra do checkout fica em `checkout.js`, sem JSX e sem Axios, para o teste e o plugin importarem o mesmo módulo. O plugin segue o desenho de `vite.planos.js`: middleware no servidor do Vite, que é o processo do `Dockerfile` (`npm run dev`). O navegador não importa esse arquivo. `PublicPlanCard.jsx`, `format.js` e `catalogo.js` não mudam de aparência nem de validação.

## Complexity Tracking

Nenhuma violação a justificar.
