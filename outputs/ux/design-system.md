# Design System UX — Notas v2

**Base de implementação:** Chakra UI v3  
**Referência PO:** Visual moderno, intuitivo, profissional; responsivo mobile/tablet/desktop  
**Escopo:** Fundações UX + padrões de componentes (handoff para UI Designer e Frontend)

---

## 1. Princípios de design

| Princípio | Significado na prática |
|-----------|------------------------|
| **Clareza** | Uma ação primária por tela; hierarquia tipográfica óbvia |
| **Velocidade** | Captura e busca acessíveis sem menu profundo |
| **Conforto de leitura** | Prosa e código legíveis; largura limitada no conteúdo |
| **Consistência** | Mesmos padrões de chip, botão e espaçamento em todo o app |
| **Acessibilidade** | WCAG AA, foco visível, alvos de toque adequados |

---

## 2. Fundações

### 2.1 Breakpoints (Chakra defaults)

| Token | Valor | Uso |
|-------|-------|-----|
| `base` | 0px | Mobile portrait |
| `sm` | 480px | Mobile landscape |
| `md` | 768px | Tablet — sidebar colapsável |
| `lg` | 1024px | Desktop — layout 2 colunas |
| `xl` | 1280px | Desktop amplo — max-width container |

**Container:** `maxW="container.xl"` (1280px) com padding horizontal `4` (mobile) → `6` (desktop).

### 2.2 Espaçamento (escala 4px)

| Token | px | Uso típico |
|-------|-----|------------|
| `1` | 4 | Gap entre chips |
| `2` | 8 | Padding interno chip |
| `3` | 12 | Gap lista |
| `4` | 16 | Padding card |
| `6` | 24 | Seções |
| `8` | 32 | Entre blocos página |
| `12` | 48 | Margem vertical página leitura |

### 2.3 Tipografia

| Estilo | Token Chakra | Tamanho | Peso | Uso |
|--------|--------------|---------|------|-----|
| Display | `heading.xl` | 2xl–3xl | 700 | Título da nota (leitura) |
| H1 lista | `heading.lg` | xl | 600 | Título item lista |
| H2 | `heading.md` | lg | 600 | Seções formulário |
| Body | `body.md` | md | 400 | Texto UI, preview |
| Body leitura | custom `prose` | md–lg | 400 | Conteúdo Markdown |
| Meta | `body.sm` | sm | 400 | Data, contadores |
| Label | `label.sm` | sm | 500 | Form labels |

**Font stack sugerida:**
- UI: `Inter, system-ui, sans-serif`
- Código: `'JetBrains Mono', 'Fira Code', monospace`

**Leitura longa:**
- `lineHeight`: 1.65–1.75 no corpo
- `maxW`: `65ch`–`75ch` no container do artigo

### 2.4 Cores (semânticas)

Alinhar aos tokens Chakra `fg`, `bg`, `border` com suporte a `colorMode`.

#### Tema claro

| Token semântico | Uso | Sugestão |
|-----------------|-----|----------|
| `bg.canvas` | Fundo app | gray.50 |
| `bg.surface` | Cards, sidebar | white |
| `fg.default` | Texto principal | gray.900 |
| `fg.muted` | Meta, placeholders | gray.600 |
| `accent.default` | CTA primário | blue.600 |
| `accent.hover` | Hover CTA | blue.700 |
| `border.subtle` | Divisores | gray.200 |

#### Tema escuro

| Token semântico | Uso | Sugestão |
|-----------------|-----|----------|
| `bg.canvas` | Fundo app | gray.900 |
| `bg.surface` | Cards | gray.800 |
| `fg.default` | Texto | gray.50 |
| `accent.default` | CTA | blue.400 |

#### Tags (cor custom por tag)

- Armazenar hex ou token; aplicar em `Badge` / `Tag` com contraste automático no texto (função `getContrastColor`).

### 2.5 Elevação e borda

| Nível | Sombra | Uso |
|-------|--------|-----|
| 0 | none | Lista flat |
| 1 | `sm` | Cards, sidebar |
| 2 | `md` | Modal, drawer mobile |
| Focus | ring 2px `accent` | Todos interativos |

`borderRadius`: `md` (8px) cards; `lg` (12px) modais; `full` chips.

---

## 3. Componentes (padrões UX)

### 3.1 App Shell

```
┌──────────────────────────────────────────────────────────┐
│ [Logo] Notas v2    [🔍 Busca...........]  [Colar] [+ Nova] [☀/🌙] │
├────────────┬─────────────────────────────────────────────┤
│  SIDEBAR   │  CONTEÚDO PRINCIPAL                          │
│  Tags      │                                              │
│            │                                              │
└────────────┴─────────────────────────────────────────────┘
```

| Componente | Chakra | Notas |
|------------|--------|-------|
| Header | `Flex` + `Container` | Sticky top, `zIndex: sticky` |
| Sidebar | `Box` / `Drawer` | `display: none` &lt; md → Drawer trigger |
| Main | `Box` flex 1 | `minH: 100dvh` |

### 3.2 Botões

| Variante | Uso | Exemplo |
|----------|-----|---------|
| **Solid** primary | Salvar, Colar nota | `colorPalette="blue"` |
| **Outline** | Nova nota secundária | — |
| **Ghost** | Voltar, cancelar | — |
| **Danger** | Excluir confirmado | `colorPalette="red"` |

Tamanhos: `sm` lista inline; `md` formulários; `lg` empty state CTA.

### 3.3 Campo de busca

- Ícone lupa à esquerda (`InputGroup` + `InputElement`)
- Placeholder: *"Buscar por título ou conteúdo…"*
- Debounce 300ms
- Atalho `Ctrl+K` foca o campo (Fase 2)
- Mobile: ocupa largura total abaixo do logo ou ícone expandível

### 3.4 Note List Item

| Elemento | Comportamento |
|----------|---------------|
| Título | 1 linha, truncate; link para `/notas/[id]` |
| Meta | Data relativa ("há 2 dias") + opcional preview 1 linha |
| Tags | `Badge` horizontal wrap max 3 visíveis + "+N" |
| Pin | Ícone 📌 à esquerda se `pinned` |
| Hover | `bg.subtle` + sombra leve |
| Click row | Navega para detalhe |

### 3.5 Tag Chip (filtro)

| Estado | Visual |
|--------|--------|
| Default | Outline, cor da tag |
| Selected (filtro ativo) | Solid com cor da tag |
| Hover | Escurecer 10% |

Incluir `aria-pressed` quando filtro ativo.

### 3.6 Empty State

- Ilustração opcional ou ícone `LuFileText`
- Título: *"Nenhuma nota ainda"*
- Texto: *"Cole sua primeira resposta do ChatGPT ou crie uma nota."*
- CTAs: **[Colar nota]** (primary) + [Criar nota] (secondary)

### 3.7 Formulário nota

| Campo | Componente | Validação UX |
|-------|------------|--------------|
| Título | `Input` | Obrigatório, max 200, erro inline |
| Data | `Input type="date"` ou DatePicker | Default hoje |
| Tags | `CreatableSelect` ou combobox multi | Chips removíveis |
| Conteúdo | `Textarea` min 8 rows ou editor MD | Obrigatório; monospace opcional |

Barra de ações fixa no rodapé mobile: [Cancelar] [Salvar].

### 3.8 Página de leitura (Article)

- Breadcrumb: `Notas > [Título truncado]`
- Meta bar: data · tags (clicáveis → filtro)
- Corpo: `Prose` + estilos MD
- Code block: toolbar copiar no hover
- Actions top-right: Editar · Excluir

### 3.9 Feedback

| Situação | Padrão |
|----------|--------|
| Salvar sucesso | Toast success 3s |
| Erro API | Toast error + manter form |
| Excluir | `AlertDialog` confirmação |
| Loading lista | `Skeleton` × 5 rows |
| Loading detalhe | Skeleton título + parágrafos |

### 3.10 Modal Paste-to-note

- Título: *"Colar nota"*
- Preview split: título detectado (editável) + corpo
- Tags opcionais antes de salvar
- [Cancelar] [Salvar nota]

---

## 4. Padrões de interação

| Padrão | Regra |
|--------|-------|
| Navegação | SPA Next.js; back do browser respeitado |
| Filtro tag | Clicar aplica; clicar de novo ou "Limpar filtros" remove |
| Destructive | Sempre 2 passos (dialog) |
| Forms | Salvar desabilitado até válido; loading no botão durante submit |
| Links externos MD | `target="_blank"` + ícone externo |

---

## 5. Acessibilidade (checklist)

- [ ] Contraste texto/fundo ≥ 4.5:1 (AA)
- [ ] Foco visível em todos os controles interativos
- [ ] `aria-label` em ícones (busca, tema, colar, excluir)
- [ ] Headings em ordem lógica (h1 único por página)
- [ ] Modais com trap de foco e `Esc` fecha
- [ ] Lista de notas: `ul`/`li` ou `role="list"`
- [ ] Anúncio de resultados de busca para screen readers (`aria-live="polite"`)
- [ ] Alvos de toque mínimo 44×44px em mobile

---

## 6. Iconografia

Biblioteca sugerida: **lucide-react** ou **react-icons/lu**

| Ação | Ícone |
|------|-------|
| Nova nota | `Plus` |
| Colar | `ClipboardPaste` |
| Busca | `Search` |
| Editar | `Pencil` |
| Excluir | `Trash2` |
| Pin | `Pin` |
| Tema | `Sun` / `Moon` |
| Voltar | `ArrowLeft` |
| Copiar código | `Copy` |
| Tags | `Tag` |
| Filtro ativo | `Filter` + badge |

---

## 7. Motion (reduzida)

| Transição | Duração | Uso |
|-----------|---------|-----|
| Fade | 150ms | Toast, modal overlay |
| Slide | 200ms | Drawer mobile sidebar |
| None | — | Lista, preferir performance |

Respeitar `prefers-reduced-motion`.

---

## 8. Mapeamento Chakra UI v3

| Padrão UX | Implementação |
|-----------|---------------|
| Provider tema | `ChakraProvider` + custom config |
| Color mode | `useColorMode` + toggle header |
| Layout | `Flex`, `Grid`, `Container` |
| Forms | `Field`, `Input`, `Textarea`, `NativeSelect` |
| Lista | `Stack`, `Card`, `Skeleton` |
| Tags | `Badge`, `Tag` ou `Chakra Badge` com `colorPalette` |
| Dialog | `Dialog` / `AlertDialog` |
| Drawer | `Drawer` para sidebar mobile |

---

## 9. Handoff

| Para | Entregar |
|------|----------|
| **UI Designer** | Refinar paleta, ícones, empty illustrations |
| **Frontend Dev** | Este doc + `wireframes/` + `prototypes/interactions-states.md` |
| **Tester** | Checklist §5 acessibilidade nos casos de teste |

---

*Design System UX — agente UX, Notas v2. Complementa (não substitui) futuro output do UI Designer.*
