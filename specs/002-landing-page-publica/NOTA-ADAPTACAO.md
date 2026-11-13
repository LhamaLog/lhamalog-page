# Nota: landing trazida para o lhamalog-page

A spec, o plano e as tarefas desta pasta foram escritos quando a landing estava dentro de uma cópia do `lhamalog-web`
(com login da Clerk, React Router e TypeScript). Ao trazer o código para este repositório, a estrutura dele foi mantida.
O que mudou em relação aos documentos:

## Código

| Antes (cópia do lhamalog-web) | Agora (lhamalog-page) |
|---|---|
| TypeScript (`.tsx`, `.ts`) | JavaScript (`.jsx`, `.js`), como o `src/main.jsx` deste repositório. Os tipos foram tirados; a lógica é a mesma |
| Rota `/landing-teste` e, depois, `/` com `LandingRoute` (logado ia para `/empresa`) | A página é o próprio site: `src/main.jsx` monta a landing. Não há login aqui, então **T034, T035, FR-021 e a User Story 5 não se aplicam** |
| Links internos (`/sign-in`, `/sign-up`) com React Router | Links comuns para o sistema pelo endereço `VITE_APP_URL` (`src/shared/appLinks.js`) |
| FR-019: "Contratar" só aceita destino do mesmo site | O site agora é outro: "Contratar" só monta o endereço com o app configurado em `VITE_APP_URL` (http ou https); sem ele, mostra a mensagem de indisponível |
| Lista de planos pela API do Core com o token da Clerk | Pela API pública do Core, sem login (`VITE_API_URL`), ou por dados falsos em desenvolvimento |
| Seção de planos ainda não feita (T029 a T031) | **Feita aqui**: `PlansSection.jsx` entre a integração e as perguntas, e o selo "Teste grátis de 14 dias" só aparece quando vale (Starter ou Pro, mensal, cartão; FR-022) |

## Mudanças de 12/11/2026 (nesta cópia)

Paleta da marca (#141826, #033473, #0C70F2, #0D65D9, #F2F2F2), botões com animação discreta e a janela animada dos logs no topo
(FR-018, FR-023 a FR-025 e a Fase 7 de `tasks.md`). Depois, fundos alternados branco e cinza, texto #141826 a 18 px, chamada final
escura e rodapé escuro com redes sociais (FR-009 revisado, FR-026, FR-027 e a Fase 8). Nenhuma dependência nova: só React e CSS.

## Dependências novas (para o JP aprovar)

A spec 001 deste repositório diz que dependência além do necessário para iniciar o React entra "depois de consulta". Esta entrega
acrescenta três, porque todo o visual da landing depende delas:

| Pacote | Tipo | Por quê |
|---|---|---|
| `tailwindcss` 4.3 | devDependency | Todas as classes de estilo da landing |
| `@tailwindcss/vite` 4.3 | devDependency | Plugin do Tailwind no Vite (`vite.config.js`) |
| `@fontsource/poppins` 5.3 | dependency | Fonte Poppins da marca, servida pelo próprio site |

## Arquivos de configuração tocados

- `package.json`: scripts `build`, `preview` e `test`, e as três dependências acima (o `package-lock.json` foi atualizado pelo npm).
- `vite.config.js`: plugin do Tailwind (porta 3000 e o resto ficam iguais).
- `index.html`: título e descrição da página.
- `.gitignore`: `!.env.example`, porque o padrão `.env*` escondia o arquivo de exemplo.
- `.env.example`: novo, com `VITE_APP_URL`, `VITE_API_URL` e `VITE_USAR_DADOS_FALSOS`.
- `README.md`: descrição da landing, configuração, testes e o layout das pastas. Os passos de Docker, make e Node 26 ficaram iguais.

## Spec 001

Os requisitos FR-011 e FR-012 da spec 001 (página só com a frase "lhamalog-page no ar") valiam para a inicialização. Esta entrega
os substitui pela landing descrita na spec 002.

## Verificação feita antes de entregar

- `npm test`: 33 testes, todos passando (12/11).
- `npm run build`: passou.
- Navegador: a página abre em `http://localhost:3000`, com as 5 seções (como funciona, recursos, integração, planos, perguntas),
  5 planos, o selo do teste só no Starter e no Pro mensais, sem rolagem lateral em 375 px. "Contratar" no Pro levou a
  `<VITE_APP_URL>/sign-up?redirect_url=<VITE_APP_URL>/assinatura/contratar?plano=PRO&periodo=MENSAL`.
- Não testado: Docker (`make run`), leitor de tela real e celular físico.
