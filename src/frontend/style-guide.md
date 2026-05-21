# Guia de Estilo — Frontend Notas v2

Implementação visual alinhada a `outputs/ux/design-system.md`.

## Stack UI

- **Chakra UI v3** — tokens semânticos (`bg.canvas`, `bg.surface`, `fg.muted`, `border.subtle`)
- **next-themes** — classe `dark` no `<html>`
- **react-icons/lu** — ícones

## Tipografia

- UI: sistema / Inter via Chakra default
- Conteúdo MD: `line-height` 1.75, `max-width` 65–75ch no artigo
- Títulos lista: `Heading size="sm"`
- Título nota: `Heading size="2xl"`

## Cores de tags

Preset em `TagFormModal`: 8 cores hex. Aplicadas em `TagBadge` border/background.

## Responsividade

| Breakpoint | Comportamento |
|------------|---------------|
| `< lg` | Sidebar → Drawer |
| `< sm` | CTA Colar full width no header |
| Form mobile | Footer sticky Salvar |

## Markdown

- `github-dark` highlight em dark mode
- Links externos: `target="_blank"`
- Sanitização: `rehype-sanitize`
