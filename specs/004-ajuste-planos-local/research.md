# Research: Ajuste local do catálogo de planos

Nenhum item ficou como NEEDS CLARIFICATION. As decisões saem da spec 004 e do código atual (`usePlans.js`, `mocks/plans.js`, `PublicPlanCard.jsx`, `PlansCatalog.jsx`, `format.js`, `vite.config.js`, `Dockerfile`, `README.md`).

## 1. Onde mora a oferta

- **Decision**: um arquivo `public/planos.json`, buscado em `/planos.json` quando a seção abre. Preços no arquivo continuam em centavos inteiros, como `planPrice` já lê.
- **Rationale**: o Vite publica `public/` junto com a página, no `dev` e no `dist/`, sem serviço externo. Buscar o arquivo (em vez de importá-lo no JavaScript) permite a seção mostrar falha e "Tentar novamente" se ele faltar ou for ilegível, e o resto da landing continua no ar. Centavos evitam mudar a conta do desconto semestral que `tests/plan-savings.test.mjs` já trava (Starter economiza 995 centavos, 2%).
- **Alternatives**: (a) manter `fakePlans()` e só acrescentar um formulário que edita o `.js`: continua sendo código, rejeitado; (b) importar o JSON no bundle: arquivo ausente quebra o build em vez de mostrar o erro da seção, rejeitado; (c) planilha ou CMS: serviço externo, rejeitado pela spec.

## 2. Conteúdo inicial

- **Decision**: o JSON inicial é a lista de `fakePlans()` mais os textos que hoje estão fixos no cartão. Pro é o único `recomendado: true` e não tem selo. Os códigos permanecem `FREE`, `STARTER`, `PRO`, `BUSINESS`, `ENTERPRISE`.
- **Rationale**: a spec pede a mesma oferta de hoje até alguém salvar. "Contratar" já envia esses códigos em maiúsculas (`contractUrl`). Trocar para "Free" ou "Pro" mudaria o endereço de contratação, e a spec manda conservar o código já usado.
- **Alternatives**: renomear os códigos para a grafia da spec ("Free", "Starter"): rejeitado, porque muda o que "Contratar" envia hoje.

Textos que saem de `PublicPlanCard.jsx` e entram no plano:

| Código | Descrição | Selo |
|---|---|---|
| FREE | Para conhecer o LhamaLog | Para começar |
| STARTER | Para um time pequeno com poucos produtos | Mais acessível |
| PRO | Para times que dependem dos logs todo dia | nenhum |
| BUSINESS | Para empresas com vários produtos | Mais capacidade |
| ENTERPRISE | Para operações grandes e personalizadas | Mais completo |

## 3. Quem pode abrir o formulário

- **Decision**: o formulário só é carregado quando as duas condições valem: `import.meta.env.DEV` é verdadeiro e o hostname da página é `localhost`, `127.0.0.1` ou `::1`. O endereço é `/#ajustar-planos`. O módulo `AjustePlanos.jsx` é importado só dentro desse `if`, para o `npm run build` não colocar o formulário em `dist/`.
- **Rationale**: `import.meta.env.DEV` é verdadeiro em `npm run dev` e em `make run`, e falso no `dist/` e no `vite preview`. O hostname fecha o outro buraco: o `Dockerfile` sobe com `npm run dev` e o `vite.config.js` aceita `lhamalog.com` e o domínio do Railway. Se essa imagem for exposta, o comando ainda é o de desenvolvimento, mas o visitante não está na máquina da equipe. Sem o filtro de hostname, o formulário apareceria no site público.
- **Alternatives**: (a) só `import.meta.env.DEV`: insuficiente com o Dockerfile atual; (b) senha dentro do JavaScript: o texto da senha vai no pacote, rejeitado; (c) formulário também no `vite preview`: a spec limita ao ambiente local de desenvolvimento, rejeitado.

## 4. Como o salvamento grava

- **Decision**: um plugin em `vite.planos.js`, registrado no `vite.config.js`, usa só `configureServer`. Ele aceita `POST /__dev/planos` quando o cabeçalho `Host` é localhost, 127.0.0.1 ou ::1. O corpo é o catálogo no formato do arquivo. A mesma função de `catalogo.js` valida. Se passar, grava só `public/planos.json` (caminho fixo, sem nome vindo do cliente). Se falhar, responde 400 e não grava. Qualquer outro host ou método recebe 404.
- **Rationale**: `configureServer` não existe no build nem no `vite preview`. O volume do `docker-compose.yml` monta o repositório em `/app`, então salvar no container grava o arquivo da equipe. O último salvamento válido vence, como a spec pede.
- **Alternatives**: (a) o formulário baixar o JSON para a pessoa substituir à mão: a spec pede que salvar no ambiente local atualize a oferta daquela execução e o arquivo da próxima publicação; (b) gravar em `localStorage`: só o navegador de quem editou veria a mudança, rejeitado.

## 5. Uma validação para os três usos

- **Decision**: `src/features/subscription/catalogo.js` exporta a validação e a conversão de reais para centavos, sem JSX e sem ler arquivo. O `usePlans`, o plugin e o formulário chamam essa função. Catálogo inválido na página vira o estado de erro já existente ("Falha ao carregar os planos" e "Tentar novamente"). Não há oferta reserva escondida no JavaScript.
- **Rationale**: a spec pede recusar o salvamento inválido sem trocar o arquivo, e mostrar falha na seção sem derrubar o resto da página. Uma função só impede o formulário de aceitar o que a página depois rejeita.
- **Alternatives**: validar só na tela e confiar no arquivo: um JSON editado à mão quebraria os cartões, rejeitado.

## 6. Reais no formulário, centavos no arquivo

- **Decision**: a pessoa digita reais, com vírgula ou ponto e no máximo duas casas (`80,99`). A conversão monta o inteiro pelos dígitos (80 reais e 99 centavos → `8099`), sem multiplicar número de ponto flutuante. Mais de duas casas, vazio ou sinal de menos é erro. O boleto não tem campo: na hora de montar o corpo, `BOLETO` recebe o valor de `PIX`.
- **Rationale**: `format.js` e o teste do desconto já usam centavos. Duas casas evitam arredondamento surpresa. O cartão já informa que o boleto custa o mesmo que o Pix.
- **Alternatives**: guardar reais no JSON: obrigaria `planPrice` a mudar e o teste de 995 centavos deixaria de bater, rejeitado.

## 7. O que o cartão passa a ler do plano

- **Decision**: `PublicPlanCard` usa `plan.descricao` e `plan.selo`. Selo vazio não desenha a etiqueta. `PlansCatalog` usa `plan.recomendado` no lugar da constante `PRO`. Classes, grade, seletor, preço de Pix e textos de franquia/GB a mais permanecem em `format.js`.
- **Rationale**: a spec permite mudar esses textos sem mudar o desenho. O destaque deixa de ser uma constante para a pessoa poder trocar o plano recomendado, desde que seja exatamente um.
- **Alternatives**: deixar descrição e selo no componente: mudar o texto continuaria exigindo código, rejeitado.

## 8. O que sai do repositório

- **Decision**: apagar `fakePlans` quando o JSON existir. `tests/plan-savings.test.mjs` passa a ler `public/planos.json`.
- **Rationale**: duas listas voltariam a divergir. O teste do desconto continua travando os números reais da oferta.
- **Alternatives**: manter `fakePlans` como reserva se o arquivo falhar: a spec quer erro visível, não uma oferta antiga escondida, rejeitado.

## 9. Testes

- **Decision**: `tests/catalogo.test.mjs` cobre a oferta inicial como válida e cada recusa de FR-006 (nome vazio, zero recomendados, dois recomendados, código estranho, plano a mais ou a menos, ordem trocada, franquia ou retenção ≤ 0, membros ou produtos 0, Free com preço, pago sem preço ou sem GB a mais, boleto diferente do Pix, recurso ou painel desconhecido, mais de duas casas decimais). `npm run build` e o quickstart conferem que `dist/` não contém o formulário.
- **Rationale**: a regra cabe em módulo puro. A ausência do formulário no site publicado só se prova no pacote gerado.
- **Alternatives**: biblioteca de teste de tela: pacote novo, rejeitado pelo padrão do repositório.
