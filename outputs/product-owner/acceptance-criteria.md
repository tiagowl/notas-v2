# Critérios de Aceitação — Notas v2

Cada user story possui cenários **Given / When / Then** para validação manual ou automatizada.  
Referência: `user-stories.md`

---

## Sprint 1 — Notas

### US-001 — Criar nota manualmente

**Cenários de sucesso**
- **Dado** que estou na página de nova nota  
  **Quando** preencho título (obrigatório), conteúdo e data de publicação e clico em Salvar  
  **Então** a nota é persistida no Neon via API e sou redirecionado para a listagem ou página da nota  
  **E** a nota aparece na lista com título e data corretos

- **Dado** que não informo data  
  **Quando** salvo a nota  
  **Então** a data de publicação assume a data/hora atual (timezone do servidor ou UTC documentado)

**Casos extremos**
- Título vazio → exibir erro de validação; não persistir
- Conteúdo vazio → exibir erro ou permitir apenas se regra de negócio definir (recomendado: **não permitir**)
- Título &gt; 200 caracteres → erro de validação
- Falha de rede / 500 da API → Toast de erro; dados do formulário preservados

**Validações técnicas**
- `POST /api/notes` retorna `201` com body da nota criada
- Prisma cria registro com `publishedAt`, `createdAt`, `updatedAt`

---

### US-002 — Listar notas

**Cenários de sucesso**
- **Dado** que existem notas no banco  
  **Quando** acesso a página de listagem  
  **Então** vejo todas as notas ordenadas por data de publicação (mais recente primeiro) por padrão  
  **E** cada item exibe título, data formatada e chips de tags (se houver)

- **Dado** que não existem notas  
  **Quando** acesso a listagem  
  **Então** vejo empty state com CTA para criar primeira nota

**Casos extremos**
- Lista com 200+ notas → página carrega em ≤ 2s (RNF-P01); considerar paginação se degradar
- Nota sem tags → exibir item normalmente, sem chips

**Validações técnicas**
- `GET /api/notes` retorna `200` com array JSON
- Loading skeleton exibido durante fetch

---

### US-003 — Editar nota

**Cenários de sucesso**
- **Dado** uma nota existente  
  **Quando** altero título, conteúdo, data ou tags e salvo  
  **Então** alterações persistem e `updatedAt` é atualizado  
  **E** página de visualização reflete mudanças

**Casos extremos**
- ID inexistente → `404` e mensagem amigável
- Edição concorrente (duas abas) → última gravação vence (documentado); sem corrupção de dados

**Validações técnicas**
- `PUT /api/notes/[id]` retorna `200` com nota atualizada

---

### US-004 — Excluir nota

**Cenários de sucesso**
- **Dado** uma nota na listagem ou detalhe  
  **Quando** clico em Excluir e confirmo no dialog  
  **Então** a nota é removida do banco  
  **E** desaparece da listagem  
  **E** vínculos Note–Tag são removidos (cascade ou explícito)

**Casos extremos**
- Cancelar no dialog → nota permanece inalterada
- Excluir nota inexistente → `404`, sem erro não tratado na UI

**Validações técnicas**
- `DELETE /api/notes/[id]` retorna `204` ou `200`

---

### US-005 — Visualizar nota formatada

**Cenários de sucesso**
- **Dado** uma nota com conteúdo em texto/Markdown  
  **Quando** abro `/notas/[id]`  
  **Então** vejo título em destaque, data de publicação e corpo legível  
  **E** layout usa largura máxima confortável para leitura (~65–75ch) em desktop  
  **E** existem ações: Editar, Excluir, Voltar

**Casos extremos**
- Conteúdo muito longo (50k chars) → renderiza sem travar browser (&lt; 1s percebido após load)
- Nota só com texto plano (sem MD) → exibe como parágrafos normais

**Validações técnicas**
- `GET /api/notes/[id]` retorna `200` ou `404`

---

## Sprint 2 — Tags e filtros

### US-006 — Filtrar notas por título

**Cenários de sucesso**
- **Dado** notas com títulos variados  
  **Quando** digito "docker" no campo de busca  
  **Então** a lista exibe apenas notas cujo título contém "docker" (case insensitive)

- **Quando** limpo o campo de busca  
  **Então** a lista completa é restaurada

**Casos extremos**
- Busca sem resultados → empty state "Nenhuma nota encontrada"
- Caracteres especiais (`%`, `_`) → tratados sem quebrar query

**Validações técnicas**
- Filtro funciona via query param ou filtro client conforme arquitetura

---

### US-007 — Gerenciar tags (CRUD)

**Cenários de sucesso**
- **Quando** crio tag "typescript"  
  **Então** tag aparece na lista de tags disponíveis para associar

- **Quando** renomeio tag  
  **Então** notas vinculadas exibem novo nome

- **Quando** excluo tag sem notas vinculadas  
  **Então** tag é removida

**Casos extremos**
- Nome duplicado → erro de validação (unique constraint)
- Excluir tag com notas vinculadas → confirmar: desvincular todas OU bloquear exclusão (definir: **recomendado desvincular** com aviso)

**Validações técnicas**
- CRUD `/api/tags` com códigos HTTP corretos

---

### US-008 — Associar tags à nota

**Cenários de sucesso**
- **Dado** tags "ia" e "código" existentes  
  **Quando** crio/edito nota selecionando ambas  
  **Então** nota exibe ambas tags na listagem e no detalhe

- **Quando** removo uma tag da nota e salvo  
  **Então** vínculo é removido; tag continua existindo globalmente

**Casos extremos**
- Associar 0 tags → permitido
- Associar 10+ tags → UI não quebra; chips com wrap

---

### US-009 — Filtrar notas por tag

**Cenários de sucesso**
- **Dado** 3 notas com tag "react" e 2 sem  
  **Quando** clico na tag "react" (chip ou sidebar)  
  **Então** listagem mostra apenas as 3 notas  
  **E** indicador visual mostra filtro ativo  
  **E** posso limpar filtro para ver todas

**Casos extremos**
- Tag sem notas → lista vazia com mensagem clara

---

## Sprint 3 — Responsivo

### US-010 — Interface responsiva

**Cenários de sucesso**
- **Dado** viewport mobile (&lt; 768px)  
  **Quando** navego lista, detalhe e formulários  
  **Então** não há scroll horizontal involuntário  
  **E** botões têm área de toque adequada (≥ 44px)  
  **E** menu/tags acessível via drawer ou stack vertical

- **Dado** viewport tablet e desktop  
  **Quando** uso o app  
  **Então** sidebar de tags visível ou acessível sem obscurecer conteúdo  
  **E** grid/lista usa espaço disponível de forma equilibrada

**Casos extremos**
- Rotação de tela em mobile → layout se reorganiza sem perda de funcionalidade

**Validações**
- Testar em Chrome DevTools: iPhone SE, iPad, desktop 1440px

---

## Sprint 4 — Fase 1

### US-011 — Paste-to-note

**Cenários de sucesso**
- **Dado** clipboard com texto cuja primeira linha é `# Título da resposta`  
  **Quando** uso "Colar nota"  
  **Então** título = "Título da resposta" (sem `#`)  
  **E** corpo = restante do texto  
  **E** data = hoje

- **Dado** clipboard sem heading  
  **Quando** colo  
  **Então** título = primeiras N palavras ou "Sem título" editável  
  **E** corpo completo preservado

**Casos extremos**
- Clipboard vazio → mensagem "Nada para colar"
- Conteúdo &gt; limite definido (ex. 500k) → erro antes de salvar

---

### US-012 — Visualizar Markdown

**Cenários de sucesso**
- **Dado** nota com `## Sub`, listas, `**bold**`, links e ` ```js `  
  **Quando** abro visualização  
  **Então** elementos MD renderizam corretamente  
  **E** links externos abrem em nova aba (`target="_blank"` + `rel`)

**Casos extremos**
- HTML/script injetado no conteúdo → sanitizado (sem execução XSS)
- Imagens MD `![](url)` → renderizam ou fallback documentado

---

### US-013 — Buscar no conteúdo

**Cenários de sucesso**
- **Dado** nota com "Prisma migrate" no corpo, título unrelated  
  **Quando** busco "Prisma"  
  **Então** nota aparece nos resultados

**Casos extremos**
- Busca com 1 caractere → comportamento definido (ignorar ou buscar)
- 0 resultados → empty state

**Validações**
- Busca case insensitive
- Tempo de resposta ≤ 500ms com 200 notas (RNF-P02)

---

### US-014 — Tema claro/escuro

**Cenários de sucesso**
- **Quando** alterno para tema escuro  
  **Então** todas as páginas principais usam paleta escura Chakra  
  **E** preferência persiste após reload (localStorage)

- **Quando** alterno para claro  
  **Então** contraste WCAG AA em texto primário (RNF-A01)

---

### US-015 — Syntax highlight e copiar

**Cenários de sucesso**
- **Dado** bloco ` ```typescript ` na nota  
  **Quando** visualizo a nota  
  **Então** código exibe highlight  
  **E** botão Copiar coloca código no clipboard  
  **E** Toast confirma "Copiado"

**Casos extremos**
- Linguagem não identificada → exibir como bloco monospace sem highlight

---

## Sprint 5+ — Fase 2

### US-016 — Ordenar listagem

- Ordenar por data desc/asc altera ordem imediatamente
- Ordenar por título A–Z / Z–A funciona com acentos (locale pt-BR)

### US-017 — Tags com cor e contagem

- Ao definir cor `#FF5733` na tag, chips exibem essa cor
- Badge mostra número correto de notas vinculadas
- Contagem atualiza após criar/excluir vínculo

### US-018 — Vista cards / lista

- Toggle persiste na sessão ou localStorage
- Cards mostram preview (~150 chars) sem quebrar layout

### US-019 — Notas fixadas

- Nota pinned aparece no topo em qualquer ordenação por data
- Desfixar restaura ordenação normal

### US-020 — Filtro por período

- "Últimos 7 dias" exibe apenas notas com `publishedAt` no intervalo
- Intervalo customizado com date picker funciona em desktop e mobile

### US-021 — Atalhos de teclado

| Atalho | Ação |
|--------|------|
| `Ctrl+N` / `Cmd+N` | Nova nota |
| `Ctrl+K` / `Cmd+K` | Foco na busca |
| `Esc` | Fechar modal / limpar busca |
| Atalhos não disparam quando foco está em `input` de texto livre (exceto busca global documentada) |

---

## Checklist de aceitação do MVP (Sprints 1–3)

Use este checklist para sign-off do **Marco MVP Fase 0**:

- [ ] **US-001** Criar nota com título, conteúdo e data
- [ ] **US-002** Listar todas as notas
- [ ] **US-003** Editar nota existente
- [ ] **US-004** Excluir com confirmação
- [ ] **US-005** Página de leitura com boa tipografia
- [ ] **US-006** Busca por título
- [ ] **US-007** CRUD de tags
- [ ] **US-008** Associar múltiplas tags
- [ ] **US-009** Filtrar por tag ao clicar
- [ ] **US-010** Layout OK em mobile, tablet e desktop
- [ ] Stack: Next.js + API Routes + Prisma + Neon + Chakra UI v3
- [ ] Fluxo completo: copiar texto ChatGPT → criar nota → taguear → filtrar → ler

---

## Checklist MVP+ (Sprint 4 — lançamento pessoal recomendado)

- [ ] **US-011** Paste-to-note
- [ ] **US-012** Markdown renderizado
- [ ] **US-013** Busca no conteúdo
- [ ] **US-014** Tema claro/escuro

---

## Template para novas stories

```markdown
### US-XXX — [Título]

**Sucesso:** Dado … Quando … Então …
**Extremos:** …
**Validações API:** …
**UI/Chakra:** …
**Responsivo:** …
```

---

*Documento de critérios de aceitação — Product Owner, Notas v2.*
