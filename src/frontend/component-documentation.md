# Documentação de Componentes — Frontend Notas v2

## Layout

| Componente | Caminho | Descrição |
|------------|---------|-----------|
| `AppShell` | `components/layout/AppShell.tsx` | Header + sidebar tags + drawer mobile |
| `Header` | `components/layout/Header.tsx` | Busca, colar, nova nota, tema |

## Notas

| Componente | Props principais |
|------------|------------------|
| `NoteListItem` | `note`, `showPreview?`, `onTogglePin?` |
| `NoteCard` | `note`, `onTogglePin?` |
| `NoteForm` | `initial?`, `onSubmit`, `onCancel` |
| `MarkdownContent` | `content`, `maxW?` |
| `CodeBlock` | `children`, `className?` |
| `PasteNoteModal` | `open`, `onOpenChange`, `onSave` |

## Tags

| Componente | Props principais |
|------------|------------------|
| `TagBadge` | `tag`, `selected?`, `onClick?` |
| `TagSidebar` | `tags`, `totalNotes`, `activeTagSlug`, `onSelectTag` |
| `TagSelector` | `selectedIds`, `onChange` |
| `TagFormModal` | `open`, `initial?`, `onSave` |

## UI

| Componente | Uso |
|------------|-----|
| `EmptyState` | Listas vazias |
| `PageSkeleton` | Loading |
| `ConfirmDialog` | Exclusões |
| `ColorModeButton` | Tema claro/escuro |
| `toaster` | Feedback global |

## Contexto

`useStore()` — `contexts/StoreContext.tsx` expõe CRUD completo sobre localStorage.
