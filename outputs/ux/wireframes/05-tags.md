# Wireframe — Gestão de Tags (`/tags`)

**Stories:** US-007, US-017

---

## Desktop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [◇ Notas v2]  ( 🔍 )                              [Colar] [+ Nova] [☀]      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Notas > Tags                                                                │
│                                                                             │
│  Gerenciar tags                                    [ + Nova tag ]           │
│  ──────────────                                                             │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │ Cor   Nome              Notas      Ações                             │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │ [■]   react             12         [ Editar ] [ Excluir ]            │  │
│  │ [■]   prisma             8         [ Editar ] [ Excluir ]            │  │
│  │ [■]   ia                15         [ Editar ] [ Excluir ]            │  │
│  │ [■]   docker             5         [ Editar ] [ Excluir ]            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  [← Voltar para notas]                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Fase 0 (MVP)

Tabela simplificada sem coluna Cor:

```
│ Nome              Notas      Ações        │
│ react             12         [Editar][X]  │
```

### Fase 2 (US-017)

- Coluna **Cor**: color picker ou paleta preset (8 cores)
- Preview chip com cor ao editar

---

## Modal — Nova / Editar tag

```
┌─────────────────────────────────┐
│  Nova tag                    [×]│
├─────────────────────────────────┤
│  Nome *                         │
│  ( _________________ )          │
│                                 │
│  Cor (Fase 2)                   │
│  (■)(■)(■)(■)(■)(■)(■)(■)       │
│                                 │
│        [ Cancelar ] [ Salvar ]  │
└─────────────────────────────────┘
```

---

## Mobile

```
┌─────────────────────────────┐
│ ← Notas    Gerenciar tags   │
├─────────────────────────────┤
│ [ + Nova tag ]              │
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │ [■] react          12   │ │
│ │     [Editar] [Excluir]  │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ [■] prisma          8   │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

Cards empilhados em vez de tabela.

---

## Excluir tag — confirmação

```
┌─────────────────────────────────────────┐
│  Excluir tag "react"?                   │
│                                         │
│  Esta tag está em 12 notas.             │
│  As notas não serão excluídas, apenas   │
│  desvinculadas desta tag.               │
│                                         │
│       [ Cancelar ]  [ Excluir tag ]     │
└─────────────────────────────────────────┘
```

---

## Empty state

```
Nenhuma tag criada.
Crie tags para organizar suas notas por tema.

[ + Nova tag ]
```

---

## Link desde sidebar

Item **"Gerenciar tags"** no rodapé da sidebar → `/tags`
