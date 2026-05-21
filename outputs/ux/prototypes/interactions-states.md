# Protótipos — Interações, Estados e Transições

Especificação para implementação de UI states em React + Chakra UI v3.

---

## 1. Estados globais da aplicação

| Estado | Trigger | UI global |
|--------|---------|-----------|
| `idle` | App carregada | Normal |
| `loading` | Fetch inicial | Skeletons |
| `error` | Falha rede | Toast + retry onde aplicável |
| `colorMode.light` | Preferência | Tokens light |
| `colorMode.dark` | Toggle | Tokens dark |

**Persistência:** `colorMode` em `localStorage` key `notas-v2-color-mode`.

---

## 2. Header

### Busca

| Estado | Visual | Comportamento |
|--------|--------|---------------|
| `empty` | Placeholder visível | — |
| `typing` | Valor no input | Debounce 300ms |
| `loading` | Spinner no InputGroup | Durante fetch |
| `results` | Lista abaixo ou página filtrada | Ver F2 |
| `no-results` | Mensagem na lista | Copy: "Nenhuma nota encontrada" |

**Transição:** `empty` → `typing` (onChange) → `loading` (após debounce) → `results` | `no-results`

### Toggle tema

| Evento | Transição |
|--------|-----------|
| click | `light` ↔ `dark` instantâneo (sem animação longa) |
| mount | Lê localStorage → aplica antes paint (evitar flash) |

---

## 3. Lista de notas (`/notas`)

### Estados da página

| Estado | Condição | UI |
|--------|----------|-----|
| `loading` | GET pendente | 5 Skeleton rows |
| `empty` | 0 notas | Empty state CTAs |
| `populated` | ≥1 nota | Lista/cards |
| `filtered` | `?tag=` ou `?q=` | Banner + lista parcial |
| `empty-filter` | filtro sem match | Mensagem específica |

### Note list item

| Estado | Estilo |
|--------|--------|
| `default` | bg transparent |
| `hover` | bg.subtle |
| `focus` | ring 2px (keyboard) |
| `pinned` | ícone 📌 + sort order top |

**Transição hover:** 150ms background-color

### Filtro tag (sidebar)

| Estado | `aria-pressed` | Estilo |
|--------|----------------|--------|
| `inactive` | false | ghost |
| `active` | true | solid cor tag |

**Click:** `inactive` → `active` (aplica filtro); `active` → `inactive` (mesma tag ou "Todas")

---

## 4. Modal Colar nota

| Estado | UI |
|--------|-----|
| `closed` | — |
| `opening` | Fade in overlay 150ms |
| `reading-clipboard` | Spinner + copy |
| `preview` | Form editável |
| `submitting` | Botão disabled + spinner |
| `error` | Alert no modal |

**Transições:**
- `closed` → `opening` → `reading-clipboard` → `preview` | `error-empty-clipboard`
- `preview` → `submitting` → `closed` (sucesso, navega away)

**Fechar:** ×, Cancelar, Esc, click overlay → se dirty confirm dialog

---

## 5. Formulário nota (criar/editar)

### Field states

| Estado | Indicador |
|--------|-----------|
| `pristine` | Sem erro |
| `dirty` | Valor alterado |
| `invalid` | Borda red + mensagem |
| `valid` | Normal |
| `disabled` | Durante submit |

### Form global

| Estado | Salvar botão |
|--------|--------------|
| `invalid` | disabled |
| `valid` | enabled |
| `submitting` | loading |

**Transição leave:** `dirty` + navegação → `ConfirmDialog` (U-07)

---

## 6. Página detalhe (`/notas/[id]`)

| Estado | UI |
|--------|-----|
| `loading` | Skeleton |
| `ready` | Artigo MD renderizado |
| `not-found` | 404 friendly |
| `copy-code-success` | Toast 2s |

### Code block

| Estado | Botão copiar |
|--------|--------------|
| `idle` | opacity 0 (desktop hover → 1) |
| `visible` | mobile: sempre visível |
| `copied` | ícone check 2s → volta idle |

---

## 7. Dialog exclusão

| Estado | Ações |
|--------|-------|
| `open` | Foco no "Cancelar" (segurança) |
| `deleting` | Ambos disabled, spinner no confirmar |
| `closed` | — |

**Transição:** confirm → DELETE → toast → redirect lista

---

## 8. Gestão tags (`/tags`)

### Table row

| Estado | Ações visíveis |
|--------|----------------|
| `default` | Editar, Excluir |
| `deleting` | Row opacity 0.5 |

### Modal tag

Mesmos estados do form nota (pristine/dirty/invalid/submitting).

---

## 9. Drawer mobile (sidebar)

| Estado | Comportamento |
|--------|---------------|
| `closed` | — |
| `open` | Slide from left 200ms |
| `closing` | Slide out |

**Focus trap** enquanto `open`. **Scroll** body locked.

---

## 10. Toasts (feedback)

| Tipo | Duração | Exemplo |
|------|---------|---------|
| `success` | 3000ms | "Nota salva" |
| `error` | 5000ms | "Erro ao salvar. Tente novamente." |
| `info` | 3000ms | "Copiado para área de transferência" |

Posição: `bottom-end` desktop · `top` mobile (não cobrir footer sticky).

---

## 11. Skeleton patterns

| Componente | Padrão |
|------------|--------|
| List row | retângulo título + linha curta + 2 chips |
| Detalhe | retângulo largo + 4 linhas texto |
| Tags table | 4 rows × 3 colunas |

**Transição:** Skeleton → conteúdo crossfade 200ms (opcional)

---

## 12. Query params (estado na URL)

| Param | Valores | Efeito |
|-------|---------|--------|
| `q` | string | Busca |
| `tag` | slug/id | Filtro tag |
| `sort` | `date-desc` \| `date-asc` \| `title-asc` | Ordenação |
| `view` | `list` \| `cards` | Vista (Fase 2) |

Sincronizar estado UI ↔ URL (shareable links).

---

## 13. Microinterações

| Elemento | Interação | Spec |
|----------|-----------|------|
| Chip tag remove | click × | Scale 0.95 → remove 150ms |
| Salvar | click | Button scale 0.98 on press |
| Lista row | click | Navigate imediato; prefetch Next.js link |
| Pin toggle | click | Ícone fill animação 200ms |

`prefers-reduced-motion: reduce` → desabilitar scale animations.

---

## 14. Mapa componente → estados (implementação)

| Componente React sugerido | Estados |
|---------------------------|---------|
| `NotesPage` | loading, empty, populated, filtered |
| `NoteListItem` | default, hover, pinned |
| `SearchInput` | empty, typing, loading |
| `TagSidebar` | tag active/inactive |
| `PasteNoteModal` | closed, reading, preview, submitting |
| `NoteForm` | invalid, valid, submitting, dirty |
| `NoteArticle` | loading, ready, not-found |
| `DeleteNoteDialog` | open, deleting |
| `TagManager` | loading, empty, populated |

---

## 15. Handoff checklist Frontend

- [ ] Implementar máquina de estados do `PasteNoteModal`
- [ ] URL sync para `q`, `tag`, `sort`
- [ ] Guard form dirty (Next.js `beforeunload` ou router blocker)
- [ ] Toast provider global Chakra
- [ ] Skeleton em lista e detalhe
- [ ] `aria-pressed` em tags filtro
- [ ] Trap foco em Dialog e Drawer

---

*Protótipo de interações — agente UX, Notas v2.*
