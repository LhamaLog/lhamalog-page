# Quickstart: Inicialização da landing page

Validação manual da spec. Não substitui a implementação.

Contrato da página: [contracts/pagina-no-ar.md](contracts/pagina-no-ar.md). A frase visível é `lhamalog-page no ar`.

## Pré-requisitos

- Caminho por contêiner: Docker em execução e make. Node na máquina não é necessário.
- Caminho local: Node 26 e npm. Docker pode estar parado.
- Instalação das ferramentas: README do repositório, para Windows, Linux e macOS.

## 1. Contêiner

Na raiz:

```bash
make run
```

**Esperado**

- Um comando só.
- A página abre em `http://localhost:3000`.
- O único texto visível é `lhamalog-page no ar`.
- Nenhum contêiner de banco, fila ou observabilidade aparece.
- Interromper com Ctrl+C encerra a página.

Sem make, o equivalente é `docker compose up --build`.

## 2. Máquina local

Com o contêiner parado e Node 26 instalado:

```bash
make install
npm run dev
```

`make install` instala as dependências e não abre a porta 3000.

Sem make, o equivalente da instalação é `npm install`.

**Esperado**: a mesma frase em `http://localhost:3000`.

## 3. Alteração vista nos dois caminhos

Com cada caminho no ar, alterar um arquivo do projeto.

**Esperado**: a porta 3000 reflete a alteração sem gerar uma página construída à parte. Restaurar o arquivo ao terminar, para a frase canônica continuar igual à do README.

## 4. Imagem

```bash
make build
```

**Esperado**: a imagem `lhamalog-page` é gerada. Esse comando não é o início da página.

## 5. Falhas

- Docker parado e `make run`: falha visível, sem contêiner de backend.
- Porta 3000 ocupada: o início falha e o README diz para liberar a porta 3000.
- Node diferente de 26 no caminho local: o README não trata essa versão como válida.

## 6. Revisão do repositório

- O README apresenta o projeto, os dois inícios, a instalação das ferramentas, Node 26 e a porta 3000.
- Cada comando citado existe.
- Não há tela de produto.
- Cada pasta tem função na inicialização ou no trabalho web descrito no plano.
