# Contrato: ajuste local do catálogo

Só existe com `LHAMALOG_AJUSTE_PLANOS=1 npm run dev` e com o navegador em `localhost`, `127.0.0.1` ou `::1`. Sem a variável, o `npm run dev` não registra a gravação. A imagem e o `npm run preview` servem o `dist/` de `npm run build`; nesse processo o contrato não existe.

## Formulário

- **Endereço**: `/#ajustar-planos`
- **Como abrir**: nesse endereço, nas condições acima. Um link "Ajustar planos" aparece na seção de planos só nessas condições. Fora delas o link não é renderizado e o endereço mostra a landing normal, sem formulário.
- **Conteúdo**: os cinco planos vigentes, com os campos do [data-model.md](../data-model.md). Preço, GB a mais e armazenamento extra são editados em reais (vírgula ou ponto, no máximo duas casas). Não há campo de boleto nem campo de desconto semestral.
- **Ilimitado**: membros ou produtos sem quantidade são enviados como `null`. Zero é erro.
- **Salvar**: converte os reais para centavos, copia o Pix para o boleto em cada periodicidade e em cada valor extra, e envia o catálogo no formato do arquivo com `Content-Type: application/json`.
- **Sucesso**: a seção da mesma execução passa a mostrar os valores salvos.
- **Recusa**: o formulário lista as mensagens da validação e o arquivo anterior permanece.

O módulo do formulário só é importado dentro da condição de dev local com a variável ligada, para não entrar em `dist/`.

## Gravação

- **Endereço**: `POST /__dev/planos`
- **Onde existe**: `configureServer` do Vite, e somente se `LHAMALOG_AJUSTE_PLANOS=1`. Não entra no build nem no `vite preview`.
- **Host**: o cabeçalho `Host` precisa ser `localhost`, `127.0.0.1` ou `::1` (com ou sem porta). Outro host, outro método ou outro caminho recebem 404 e não gravam.
- **Conteúdo**: `Content-Type` precisa ser `application/json`. Outro tipo recebe 400 e não grava. Um POST simples de outro site não consegue definir esse tipo sem uma consulta prévia, que este endereço não autoriza.
- **Origem**: se o cabeçalho `Origin` vier, o host precisa ser local. `Sec-Fetch-Site`, quando vier, precisa ser `same-origin`. Os outros valores recebem 403 e não gravam.
- **Corpo**: JSON do catálogo, no formato de [catalogo.md](catalogo.md), já em centavos.
- **Sucesso** (`200`): `{ "ok": true }`. O processo grava somente `public/planos.json`, com indentação de dois espaços e quebra de linha no fim. Chaves na ordem do modelo, para o diff ficar legível.
- **Recusa** (`400`): `{ "ok": false, "erros": ["..."] }`. O arquivo não é aberto para escrita.
- **Corpo que não é JSON ou passa de 100 KB**: 400, sem gravar.

Dois salvamentos válidos seguidos: vale o último.
