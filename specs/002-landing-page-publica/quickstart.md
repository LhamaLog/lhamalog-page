# Quickstart: validar a landing page

Guia de verificação. Não traz código; os detalhes de cada item estão em [plan.md](plan.md), [data-model.md](data-model.md) e [contracts/ui-contract.md](contracts/ui-contract.md).

## Preparação

1. Em `.env.local`: `VITE_USAR_DADOS_FALSOS=true` (abre sem Clerk e com planos falsos) e `VITE_CONTRATAR_URL=/assinatura/contratar`.
2. `npm run dev` (não instalar nada; se faltar `node_modules`, avisar o André).
3. Verificações automáticas: `npm test` e `npm run build`.

## Cenários (19)

| # | O que fazer | Resultado esperado | Cobre |
|---|---|---|---|
| 1 | Abrir `/` | Barra flutuante, topo com o título e o subtítulo exatos da spec, linha "Plano grátis · Teste de 14 dias nos planos Starter e Pro mensais" | FR-001, FR-002 |
| 2 | Rolar a página inteira | 3 cards, 4 blocos alternando o lado, exemplo OTLP, planos, perguntas, chamada final e rodapé, nessa ordem | FR-004 a FR-009 |
| 3 | Clicar em cada link da barra e em "Ver planos" | Rola até a seção; o título não fica atrás da barra | FR-011 |
| 4 | Trocar a periodicidade na landing e em `/planos` | Mesmos valores, mesmo destaque do Pro. A parte "mudança em um só lugar" do SC-007 é garantida pela estrutura (T005 e T006: as duas páginas usam o mesmo componente e o mesmo hook de planos) e conferida por leitura | FR-007, SC-007 |
| 5 | Clicar "Contratar" (Starter, semestral) | Vai para `/sign-up?redirect_url=…plano=STARTER&periodo=SEMESTRAL…` (conferir o endereço) | FR-010 |
| 6 | Esvaziar `VITE_CONTRATAR_URL` (e, em outro teste, pôr um endereço de outro site), reiniciar, clicar "Contratar" | Mensagem "A contratação não está disponível no momento. Tente novamente mais tarde." nos dois casos; nada quebra | User Story 3, cenário 4 |
| 7 | Abrir `/planos` e comparar com a versão anterior (cabeçalho, seletor, cartões, "Começar grátis" do Free, contratar leva a `/assinatura/contratar`) | Igual ao que era, exceto o selo do teste, que agora só aparece em Starter e Pro na periodicidade mensal (FR-022) | Complexity Tracking |
| 8 | Rodapé | "Termos de Uso" e "Política de Privacidade" desativados com "em breve"; leitor de tela anuncia desativado | FR-009 |
| 9 | Larguras 1672, 1440, 1024 e 375 px (ferramentas do navegador). **Script:** em cada largura, no console do navegador, comparar a largura total do documento (`document.documentElement.scrollWidth`) com a da janela (`window.innerWidth`); a primeira não pode ser maior. **Visual:** percorrer a página inteira em cada largura procurando texto ou botão cortado ou sobreposto | Script sem diferença nas 4 larguras; nada cortado ou sobreposto; menu compacto no 375 | FR-012, SC-003 |
| 10 | Só teclado (Tab, Shift+Tab, Enter, Espaço, Esc) | Ordem lógica, foco visível, sanfona abre/fecha e o leitor de tela anuncia aberta ou fechada, menu do celular (abaixo de 1024 px) abre/fecha com Esc, ordem de leitura igual à visual nos blocos alternados | FR-013, SC-004 |
| 11 | Ativar "reduzir movimento" no sistema | Nenhuma transição ou rolagem suave; conteúdo completo | FR-015, SC-006 |
| 12 | Script de contraste dos pares de cor novos | Todos ≥ 4,5:1 | FR-014, SC-005 |
| 13 | Buscar na página por números de clientes, logos, depoimentos | Nenhum; metas não aparecem | FR-016, SC-008 |
| 14 | Com Clerk real (chave no `.env.local`, fora dos dados falsos): deslogado abre `/`; logado abre `/` | Deslogado vê a landing; logado vai a `/empresa` sem piscar a landing; cadastro → link "entrar" da própria tela mantém o `redirect_url`. **Sem a chave da Clerk, este cenário fica registrado como "não testado"** | FR-010, SC-009 |
| 15 | Revisão com 3 pessoas da equipe: cada uma vê só o topo e "Como funciona" e explica em uma frase o que o LhamaLog faz | Pelo menos 2 das 3 pessoas explicam corretamente | SC-002 |
| 16 | Com Clerk real, simular verificação de sessão lenta ou com falha (bloquear a chamada da Clerk nas ferramentas do navegador) | Aparece o indicador de carregamento e, passado o tempo limite, a landing; nunca tela em branco | FR-021 |
| 17 | Conferir o selo do teste em `/planos` e na landing nas 3 periodicidades | Selo só em Starter e Pro mensal; nenhum selo no semanal e no semestral | FR-022 |
| 18 | Rodapé: medir o contraste do texto desativado "em breve" | ≥ 4,5:1 | FR-014 |
| 19 | Abrir `/` sem login (Fase 4) e contar os cliques até chegar ao cadastro, sem contar a rolagem | No máximo 2 cliques contados a partir da abertura de `/` (na prática 1: "Começar grátis") | SC-001 |

## Limites conhecidos

- O cenário 14 depende da chave da Clerk (André) e da rota `/assinatura/contratar` do outro projeto; sem elas, ficam como "não testado".
- Não há teste de componente automatizado (sem biblioteca nova); as telas são conferidas pelo roteiro acima.
