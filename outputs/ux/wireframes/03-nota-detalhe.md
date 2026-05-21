# Wireframe — Visualização da Nota (`/notas/[id]`)

**Stories:** US-005, US-012, US-015

---

## Desktop — Modo leitura

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [◇ Notas v2]  ( 🔍 Buscar... )                    [Colar] [+ Nova] [☀]      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ← Voltar para notas                                                         │
│                                                                             │
│                    Como configurar Prisma no Next.js                        │
│                    ─────────────────────────────────────                    │
│                    12 de maio de 2026  ·  [react] [prisma] [backend]        │
│                                                                             │
│                              [ Editar ]  [ Excluir ]                        │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                             │
│                    ┌─────────────────────────────────────┐                  │
│                    │  ## Introdução                      │                  │
│                    │  Texto do markdown renderizado...   │                  │
│                    │                                     │                  │
│                    │  ```typescript          [ Copiar ]  │                  │
│                    │  const prisma = ...                 │                  │
│                    │  ```                                │                  │
│                    │                                     │                  │
│                    │  - Lista item                       │                  │
│                    │  - Outro item                       │                  │
│                    └─────────────────────────────────────┘                  │
│                         max-width ~720px, centrado                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Anotações leitura

| # | Regra |
|---|-------|
| R1 | `h1` da página = título da nota (único h1) |
| R2 | Tags clicáveis → navega `/notas?tag=slug` |
| R3 | Links MD abrem nova aba |
| R4 | Code block: botão Copiar visível no hover/focus |
| R5 | Imagens MD: `max-width: 100%` |

---

## Mobile

```
┌─────────────────────────────┐
│ ←  Notas                    │
├─────────────────────────────┤
│ Título da nota              │
│ 12 mai 2026                 │
│ [tag] [tag]                 │
│ [Editar]  [Excluir]         │
├─────────────────────────────┤
│                             │
│  ( conteúdo MD scroll )     │
│                             │
│                             │
└─────────────────────────────┘
```

Ações Editar/Excluir: podem ir em menu `⋮` se largura &lt; 360px.

---

## Modo Zen (Fase 3 — opcional)

```
┌─────────────────────────────────────────────────────────────┐
│ [× Sair modo foco]                                          │
│                                                             │
│              Título da nota (menor)                         │
│                                                             │
│              Apenas corpo MD                                │
│              sem header app                                 │
│              tipografia amplificada                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Toggle: ícone "expandir" na barra de ações da nota.

---

## Estados

| Estado | UI |
|--------|-----|
| Loading | Skeleton título + 4 linhas |
| 404 | "Nota não encontrada" + [Voltar à lista] |
| Conteúdo vazio | Mensagem rara; link editar |

---

## Hierarquia tipográfica (conteúdo MD)

| Elemento MD | Estilo |
|-------------|--------|
| h1–h6 | Escala decrescente, margin-top generoso |
| p | line-height 1.7 |
| ul/ol | indent + spacing |
| blockquote | borda esquerda accent |
| table | scroll horizontal em mobile |
| code inline | bg muted, mono |
| pre | bg surface elevated + highlight |
