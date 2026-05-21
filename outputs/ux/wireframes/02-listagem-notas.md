# Wireframe — Listagem de Notas (`/notas`)

**Stories:** US-002, US-006, US-009, US-016, US-018, US-019, US-020

---

## Desktop (≥ 1024px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [◇ Notas v2]  ( 🔍 Buscar por título ou conteúdo...          )  [Colar] [+ Nova] [☀] │
├──────────────────┬──────────────────────────────────────────────────────────┤
│ TAGS             │  Notas                                    [≡ Lista][▦ Cards] │
│ ───────────────  │  Ordenar: [Mais recentes ▼]    [Limpar filtros]          │
│ ● Todas (42)     │  ─────────────────────────────────────────────────────── │
│ ○ react (12)     │  ┌────────────────────────────────────────────────────┐ │
│ ○ prisma (8)     │  │ 📌 Como configurar Prisma no Next.js               │ │
│ ○ ia (15)        │  │     12 mai 2026 · preview uma linha do conteúdo... │ │
│ ○ docker (5)     │  │     [react] [prisma]                                │ │
│                  │  └────────────────────────────────────────────────────┘ │
│ [+ Nova tag]     │  ┌────────────────────────────────────────────────────┐ │
│                  │  │ Hooks useEffect — guia completo                     │ │
│ [Gerenciar tags] │  │     10 mai 2026 · ...                               │ │
│                  │  │     [ia]                                            │ │
│                  │  └────────────────────────────────────────────────────┘ │
│                  │  ··· scroll ···                                          │
└──────────────────┴──────────────────────────────────────────────────────────┘
```

### Anotações

| # | Elemento | Comportamento |
|---|----------|---------------|
| A1 | Sidebar tags | Clique filtra lista; "Todas" remove filtro |
| A2 | Contador `(N)` | Total de notas por tag |
| A3 | Busca header | Filtra em tempo real; Fase 1 inclui conteúdo |
| A4 | Banner filtro | Exibir quando `?tag=` ativo: "Filtrando: react [×]" |
| A5 | Toggle lista/cards | US-018 — Fase 2 |
| A6 | Ordenação | US-016 — dropdown |
| A7 | Row pinned | Ícone 📌 + sempre no topo |

---

## Vista Cards (Fase 2)

```
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│ Título da nota      │ │ Outra nota          │ │ Terceira nota       │
│ 12 mai · [tag][tag] │ │ 10 mai · [tag]      │ │ 08 mai              │
│ Preview 2-3 linhas  │ │ Preview...          │ │ Preview...          │
│ do conteúdo markdown│ │                     │ │                     │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘
        grid 3 colunas (desktop) · 2 colunas (tablet) · 1 coluna (mobile)
```

---

## Empty state

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                    [ ícone documento ]                   │
│                                                          │
│                 Nenhuma nota ainda                       │
│     Cole sua primeira resposta do ChatGPT ou crie        │
│                    uma nota manualmente.                 │
│                                                          │
│              [ Colar nota ]    [ Criar nota ]            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Mobile (&lt; 768px)

```
┌─────────────────────────────┐
│ [◇] [🔍...........] [☰]    │
├─────────────────────────────┤
│ [Filtrando: react  ×]       │  ← se filtro ativo
│ Ordenar [▼]                 │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ Título nota             │ │
│ │ 12 mai · [tag]          │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Outra nota              │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│      [ + ]  FAB Nova        │  opcional
└─────────────────────────────┘

[☰] abre Drawer:
  ├── Tags (lista)
  ├── Colar nota
  ├── Nova nota
  ├── Gerenciar tags
  └── Tema claro/escuro
```

---

## Estados

| Estado | UI |
|--------|-----|
| Loading | 5× Skeleton rows |
| Erro API | Alert inline + "Tentar novamente" |
| Sem resultados busca | "Nenhuma nota encontrada para «termo»" |
| Filtro tag sem itens | "Nenhuma nota com esta tag" |

---

## Filtro por data (Fase 2 — US-020)

```
[ Últimos 7 dias ] [ Este mês ] [ Personalizado ▼ ]
```

Chips abaixo do header da lista; combinável com tag e busca.
