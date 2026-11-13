# lhamalog-page

Landing page do LhamaLog. Este repositório existe para apresentar, no futuro, os planos, as funcionalidades e a descrição do produto. Nesta inicialização a página só confirma que o projeto está no ar.

A frase visível é `lhamalog-page no ar`.

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

O comando constrói a imagem `lhamalog-page` e sobe só a página, em desenvolvimento, na porta 3000. A primeira execução baixa a imagem do Node 26 e pode demorar. Não sobe banco, fila nem outra ferramenta.

Abra [http://localhost:3000](http://localhost:3000). O único texto visível é `lhamalog-page no ar`.

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

A página abre no mesmo endereço, [http://localhost:3000](http://localhost:3000), com a mesma frase.

### Imagem

```bash
make build
```

`make docker` faz o mesmo. Esse comando só gera a imagem `lhamalog-page`. Ele não publica a página.

Sem make:

```bash
docker build -t lhamalog-page .
```

## Porta ocupada

Os dois caminhos usam a porta 3000. Se ela já estiver em uso, o início falha de forma visível. Libere a porta 3000 e execute o comando outra vez.

## Layout

```
index.html          documento da página
src/main.jsx        frase lhamalog-page no ar
vite.config.js      servidor de desenvolvimento na porta 3000
Dockerfile          imagem Node 26
docker-compose.yml  sobe só a página
Makefile            make run, make build, make docker
```
