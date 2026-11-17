# lhamalog-page

Landing page pública do LhamaLog: apresenta o produto, como funciona, os recursos, os planos,
as perguntas frequentes e leva ao cadastro no sistema (lhamalog-web).

Seções: barra flutuante, topo com uma janela de logs animada, "Como funciona", recursos (4 blocos com telas de exemplo),
planos, perguntas frequentes, chamada final e rodapé. A especificação está em `specs/002-landing-page-publica/`
(a nota `NOTA-ADAPTACAO.md` explica o que mudou ao trazer a landing para este repositório).

## Pré-requisitos

Há dois caminhos. Os dois usam Node 26 e a porta 3000.

- **Contêiner:** Docker Engine com o plugin Compose (`docker compose`) e make. O Node fica na imagem. Não é preciso instalar a linguagem na máquina.
- **Máquina local:** Node 26 e npm. O Docker pode ficar parado.

Confira a linha do Node com `node --version`. O resultado precisa começar com `v26`.

## Instalando o Docker

Confira no final com `docker --version` e `docker compose version`.

**Windows:**

1. O Docker Desktop usa o WSL 2. Se o instalador pedir, aceite a configuração do WSL.
2. Instale o [Docker Desktop para Windows](https://docs.docker.com/desktop/setup/install/windows-install/):

```powershell
winget install -e --id Docker.DockerDesktop
```

3. Abra o Docker Desktop e espere o status ficar em execução.
4. Feche e abra o terminal antes de usar `docker`.

**Linux (Ubuntu):**

```bash
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
```

Saia e entre de novo na sessão para o grupo `docker` valer. No Debian, use o [repositório Debian](https://docs.docker.com/engine/install/debian/). Nas outras distros, siga o guia do [Docker Engine](https://docs.docker.com/engine/install/).

**macOS:** instale o [Docker Desktop para Mac](https://docs.docker.com/desktop/setup/install/mac-install/) e abra o aplicativo. Com Homebrew: `brew install --cask docker`.

## Instalando o make

**Windows (PowerShell):**

```powershell
winget install ezwinports.make
```

Depois feche e abra o terminal e confira com `make --version`.

**Linux:**

```bash
# Debian/Ubuntu
sudo apt update && sudo apt install -y make
# Fedora
sudo dnf install -y make
# Arch
sudo pacman -S make
make --version
```

**macOS:** `xcode-select --install`.

**Sem make:** os mesmos passos do contêiner estão abaixo, com `docker compose`.

## Instalando o Node 26

Só o caminho local precisa do Node na máquina. A página desta entrega exige a linha 26. Outra versão principal não serve.

O pacote LTS atual dessa linha é o 26.13.0, publicado em 28/10/2026. Qualquer `26.x` atende.

**Windows (PowerShell):**

```powershell
winget install -e --id OpenJS.NodeJS.LTS --version 26.13.0
```

Feche e abra o terminal. Confira com `node --version` e `npm --version`.

**Linux e macOS:** instale a linha 26 a partir de [nodejs.org/download](https://nodejs.org/en/download). Se o `nvm` já estiver instalado:

```bash
nvm install 26
nvm use 26
node --version
```

## Como iniciar

Na raiz do repositório.

### Contêiner

Com o Docker em execução:

```bash
make run
```

O comando constrói a imagem `lhamalog-page` e sobe a página já gerada, na porta 3000. Dentro da imagem roda `npm run build` e o servidor da pasta gerada. Não sobe o modo de desenvolvimento, então não há formulário de ajuste nem endereço de gravação. A primeira execução baixa a imagem do Node 26 e pode demorar. Não sobe banco, fila nem outra ferramenta.

Abra [http://localhost:3000](http://localhost:3000). A landing page aparece completa.

O processo fica nesse terminal. Interrompa com Ctrl+C.

Sem make:

```bash
docker compose up --build
```

Se o Docker estiver parado, o comando falha e nenhum outro serviço é criado. Abra o Docker e tente de novo.

### Máquina local

Com Node 26 e sem depender do Docker. `make install` só instala as dependências. Ele não inicia a página.

```bash
make install
npm run dev
```

Sem make:

```bash
npm install
npm run dev
```

A página abre no mesmo endereço, [http://localhost:3000](http://localhost:3000). Esse modo mostra a landing. O formulário de ajuste dos planos fica desligado até o comando da seção seguinte.

### Imagem

```bash
make build
```

`make docker` faz o mesmo. Esse comando só gera a imagem `lhamalog-page`. Ele não publica a página.

Sem make:

```bash
docker build -t lhamalog-page .
```

## Ajustar os planos

A oferta publicada é o arquivo `public/planos.json`. O formulário que grava esse arquivo só existe na máquina de quem mantém a página, e só quando a variável está ligada:

```bash
LHAMALOG_AJUSTE_PLANOS=1 npm run dev
```

Abra [http://localhost:3000/#ajustar-planos](http://localhost:3000/#ajustar-planos), altere a oferta e salve. O arquivo muda no disco. Faça o commit de `public/planos.json` e publique de novo (`npm run build`, ou a imagem). Sem a variável, `npm run dev` mostra a landing e não aceita gravação. A imagem Docker e o `npm run preview` também não aceitam.

## Porta ocupada

Os dois caminhos usam a porta 3000. Se ela já estiver em uso, o início falha de forma visível. Libere a porta 3000 e execute o comando outra vez.

## Configuração

Copie `.env.example` para `.env.local` (ignorado pelo Git) e ajuste:

| Variável | Para que serve |
|---|---|
| `VITE_APP_URL` | Endereço do sistema (lhamalog-web). "Acessar Página", "Começar grátis" e "Contratar" levam para lá. Vazio: usa o padrão `https://app.lhamalog.com`. Só preencha para apontar para outro ambiente. |

"Contratar" leva a `<VITE_APP_URL>/sign-up?redirect_url=<VITE_APP_URL>/assinatura/contratar?plano=<PLANO>&periodo=<PERIODO>`.

## Testes e build

```bash
npm test
npm run build
```

`npm test` roda os testes de `tests/` com `node --test`: textos iguais aos aprovados na spec, contraste das cores e endereços dos botões.
`npm run build` gera a página em `dist/` (não é o modo de início em desenvolvimento).

## Layout

```
index.html                         documento da página
public/planos.json                 oferta de planos publicada com a página
src/main.jsx                       monta a landing
src/styles.css                     Tailwind e rolagem suave
src/features/landing/              landing: textos (content.js), cores (landingTokens.js), seções e telas de exemplo
src/features/subscription/         cartões e seletor de periodicidade; a oferta fica em public/planos.json
src/shared/                        logo, endereços do app (appLinks.js) e estados (carregando, erro, vazio)
tests/                             testes com node --test
specs/                             Spec Kit: 001 (inicialização), 002 (landing), 003 (reformulação) e 004 (ajuste dos planos)
vite.config.js                     servidor de desenvolvimento na porta 3000, React e Tailwind
Dockerfile                         imagem Node 26
docker-compose.yml                 sobe só a página
Makefile                           make run, make build, make docker
```
