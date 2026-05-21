# Wireframe — Arquitetura da Informação

## Mapa do site

```
Notas v2
├── / ........................... redirect → /notas
├── /notas ...................... Lista de notas (HOME)
│   └── ?q= &tag= &sort= &view=
├── /notas/nova ................. Criar nota
├── /notas/[id] ................. Visualizar nota
├── /notas/[id]/editar .......... Editar nota
└── /tags ....................... Gerenciar tags
```

## Hierarquia de informação (global)

| Nível | Conteúdo | Persistência |
|-------|----------|--------------|
| L0 | Header: marca, busca, ações globais, tema | Todas as páginas |
| L1 | Sidebar tags (desktop) / drawer (mobile) | Lista e opcionalmente detalhe |
| L2 | Conteúdo principal da rota | Por página |
| L3 | Ações contextuais (editar, excluir) | Detalhe / form |

## Navegação principal

```mermaid
flowchart TB
    HOME[/notas]
    NEW[/notas/nova]
    VIEW[/notas/id]
    EDIT[/notas/id/editar]
    TAGS[/tags]
    HOME --> NEW
    HOME --> VIEW
    VIEW --> EDIT
    VIEW --> HOME
    NEW --> VIEW
    NEW --> HOME
    EDIT --> VIEW
    HOME --> TAGS
    TAGS --> HOME
```

## Prioridade de ações no header

| Ordem visual | Ação | Tipo |
|--------------|------|------|
| 1 | Busca | Sempre visível |
| 2 | Colar nota | Primary (Fase 1) |
| 3 | Nova nota | Secondary |
| 4 | Tema | Icon button |

## Rotas × User Stories

| Rota | Stories cobertas |
|------|------------------|
| `/notas` | US-002, US-006, US-009, US-016, US-018, US-019, US-020 |
| `/notas/nova` | US-001, US-008, US-011 |
| `/notas/[id]` | US-005, US-012, US-015 |
| `/notas/[id]/editar` | US-003, US-008 |
| `/tags` | US-007, US-017 |

## Breadcrumbs

| Página | Breadcrumb |
|--------|------------|
| Lista | `Notas` |
| Nova | `Notas > Nova nota` |
| Detalhe | `Notas > [Título]` |
| Editar | `Notas > [Título] > Editar` |
| Tags | `Notas > Tags` |
