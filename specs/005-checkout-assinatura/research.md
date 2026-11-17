# Research: Checkout de assinatura ao contratar

Nenhum item ficou como NEEDS CLARIFICATION. As decisões saem da spec 005, do código atual (`PlansSection.jsx`, `appLinks.js`, `public/planos.json`, `vite.planos.js`, `Dockerfile`, `.gitignore`, `.env.example`) e das fontes já usadas na spec: ADR_163 (27/10/2026), requisitos da LLT-231 v5, guia da conta Asaas, e a documentação oficial do checkout consultada em 17/11/2026.

## 1. Onde a chamada ao Asaas acontece

- **Decision**: a chamada fica num middleware do Vite, registrado em `configureServer` e em `configurePreviewServer`. O navegador faz `POST /api/contratacao` na mesma origem. Axios existe só nesse middleware.
- **Rationale**: o `Dockerfile` sobe com `npm run dev`, então o processo que publica a página no container já é o servidor do Vite. A chave lida por esse processo não entra no JavaScript do navegador. O Vite só publica no pacote variável com prefixo `VITE_`; a chave não usa esse prefixo. `.gitignore` já ignora `.env*` e mantém `.env.example`.
- **Alternatives**: (a) Axios no navegador com `VITE_ASAAS_API_KEY`: a chave iria no pacote, o que a spec e o guia do Asaas recusam; (b) chamar o Core do LhamaLog: a spec desta página pede o checkout a partir do catálogo local, e o Core ainda é outro produto; (c) hospedar só a pasta `dist/` num servidor de arquivo: não há onde guardar a chave, então Contratar fica indisponível, que é o comportamento de FR-010, não o caminho feliz.

## 2. Forma do checkout

- **Decision**: `POST /v3/checkouts` com `billingTypes: ["CREDIT_CARD"]`, `chargeTypes: ["RECURRENT"]` e `subscription.cycle` em `WEEKLY`, `MONTHLY` ou `SEMIANNUALLY`. Sem `customer`, sem `customerData`, sem `installment` e sem `endDate`. `minutesToExpire` é 60.
- **Rationale**: a ADR_163, confirmada no sandbox, diz que o checkout recorrente só aceita cartão de crédito. A spec limita esta entrega a esse checkout. A documentação oficial de 17/11/2026 exige o objeto `subscription` quando o tipo é `RECURRENT` e limita `minutesToExpire` a 10–1440. Não enviar cliente deixa o Asaas pedir os dados na página dele; a landing não ganha formulário. Sem `endDate`, a assinatura não nasce com prazo de fim, porque cancelar está fora desta entrega.
- **Alternatives**: (a) incluir Pix no `billingTypes`: a ADR registrou erro no sandbox para Pix no checkout recorrente, e a spec deixa Pix de fora; (b) link de pagamento (`/v3/paymentLinks`): outro produto do Asaas, não o checkout de assinatura pedido; (c) `nextDueDate` em 14 dias: isso é o teste grátis, que a spec não inicia.

## 3. Primeira cobrança

- **Decision**: `subscription.nextDueDate` é a data e a hora atuais em America/Sao_Paulo, no formato `YYYY-MM-DD HH:mm:ss` que o exemplo oficial usa. Não é uma data futura de teste.
- **Rationale**: a documentação trata `nextDueDate` como a data da primeira cobrança. Adiá-la seria o teste de 14 dias, excluído da spec. O fuso da equipe evita que a virada do dia em UTC mude o dia da cobrança.
- **Alternatives**: (a) omitir `nextDueDate`: o exemplo oficial e o texto do endpoint tratam o objeto de recorrência como a regra do ciclo, e a data da primeira cobrança faz parte dessa regra; (b) só a data, sem hora: o exemplo oficial inclui hora.

## 4. Endereço da página de pagamento

- **Decision**: o processo usa o `id` devolvido pelo Asaas e monta o endereço. A base `https://api-sandbox.asaas.com/v3` abre `https://sandbox.asaas.com/checkoutSession/show?id=`. A base `https://api.asaas.com/v3` abre `https://asaas.com/checkoutSession/show?id=`. Qualquer outra base, ou um `id` com `/`, `?` ou `&`, não redireciona.
- **Rationale**: a documentação oficial de 17/11/2026 manda montar a página a partir do `id`, no host `asaas.com`. O guia do Drive separa o sandbox (`sandbox.asaas.com` e `api-sandbox.asaas.com`) da produção. Montar o endereço no host que corresponde à base configurada impede seguir um link inesperado. A ADR dizia que a resposta já traz o link e o código; o código é o `id`, e o link é este.
- **Alternatives**: (a) redirecionar para um campo `link` da resposta, se existir: recusado, porque a página do visitante só pode ir ao host do ambiente configurado; (b) aceitar qualquer URL HTTPS: abriria caminho para um destino que não é o Asaas.

## 5. Preço, nome e retorno

- **Decision**: o valor é o inteiro `precos[periodo].CARTAO` do catálogo, em centavos, dividido por 100 com duas casas. O nome do item é `Plano {nome} ({semanal|mensal|semestral})`, cortado a 30 caracteres pela ponta do nome, preservando o prefixo `Plano ` e o sufixo da periodicidade. A descrição é `LhamaLog - Plano {nome} ({periodicidade})`, sem esse corte. `externalReference` é `{codigo}:{periodo}`. `successUrl`, `cancelUrl` e `expiredUrl` são a origem da própria landing (`scheme://host/`). A landing não lê a query como pagamento.
- **Rationale**: a spec cobra o preço de cartão, não o de Pix exibido. Os nomes atuais (Starter, Pro, Business, Enterprise) cabem em 30 caracteres; o corte protege um nome editado no ajuste local. A ADR pede o texto "LhamaLog - Plano …" para o que a pessoa vê, e 30 caracteres para o nome curto do item. A documentação oficial diz que o callback só redireciona e não confirma pagamento, o que é o FR-008.
- **Alternatives**: (a) aceitar o valor vindo do navegador: o visitante poderia pagar outro preço; (b) três páginas de retorno com texto de sucesso: a spec proíbe tratar a volta como confirmação e proíbe mudar o desenho.

## 6. Cabeçalhos e segredo

- **Decision**: Axios envia `access_token` com a chave e `User-Agent: LhamaLog-Page`. A chave vem de `ASAAS_API_KEY`. A base vem de `ASAAS_BASE_URL`. As duas são lidas de `process.env` (arquivo `.env` / `.env.local` ou o ambiente do container). Ausentes, vazias ou com base diferente das duas oficiais: a rota responde indisponível e não chama o Asaas. O erro do Axios não volta ao navegador. Tempo limite: 8 segundos.
- **Rationale**: o guia do Drive nomeia `ASAAS_API_KEY` e `ASAAS_BASE_URL`, exige User-Agent junto da chave e manda a chave ficar só em variável de ambiente. Não devolver o corpo de erro evita vazar detalhe da conta. Oito segundos passam o limite de 5 segundos do caminho feliz e ainda soltam a página se o Asaas não responder.
- **Alternatives**: (a) `fetch` em vez de Axios: o pedido desta entrega pede Axios na chamada ao Asaas; (b) gravar o `id` do checkout: a spec não confirma pagamento e não tem webhook, então não há o que atualizar com esse id.

## 7. Uma assinatura ativa por documento

- **Decision**: antes do `POST /v3/checkouts`, a rota exige CPF ou CNPJ válido, consulta `GET /v3/customers?cpfCnpj=` e, se houver cliente, `GET /v3/subscriptions?customer=`. Status `ACTIVE` impede outro checkout. Sem assinatura ativa, o checkout reutiliza o `customer`. Sem cliente, o checkout abre sem esse campo.
- **Rationale**: cada clique criava um checkout e cada pagamento criava outra assinatura. A LLT-231 impede nova contratação de quem já tem plano pago ativo. A landing não grava o documento e não recebe webhook; a consulta é o bloqueio possível neste processo. Assinaturas já duplicadas se encerram no painel do Asaas.
- **Alternatives**: (a) bloquear só no clique, sem documento: a página não sabe quem é a pessoa; (b) esperar o webhook do produto: esta entrega não recebe esse aviso, então dois pagamentos simultâneos ainda podem passar.

## 8. Clique repetido e pacote publicado

- **Decision**: `PlansSection` ignora um segundo clique enquanto o primeiro pedido não terminou, sem trocar a classe do botão. No sucesso, navega para o endereço montado. No fracasso, mostra `SUPPORT_TEXTS.contratarIndisponivel`, que já está na seção. O teste de build procura em `dist/` a chave, o nome `ASAAS_API_KEY`, `access_token` e `assinatura/contratar`, e procura em `src/` um import de Axios.
- **Rationale**: FR-011 pede um checkout por tentativa, e FR-012 pede o desenho atual. O botão já é `<button>`; não vira link. A busca no `dist/` prova o FR-006 no artefato que o visitante receberia se a pasta fosse publicada sozinha.
- **Alternatives**: (a) desabilitar o botão com estilo novo: muda o desenho; (b) deduplicar no Asaas: a API de checkout consultada não oferece chave de idempotência, e o clique local já cobre a spec.
