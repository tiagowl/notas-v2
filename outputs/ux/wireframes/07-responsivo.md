# Wireframe — Comportamento Responsivo

**Story:** US-010  
**Breakpoints:** mobile &lt; 768px · tablet 768–1024px · desktop &gt; 1024px

---

## Matriz de layout por breakpoint

| Componente | Mobile | Tablet | Desktop |
|------------|--------|--------|---------|
| Header busca | Ícone expande ou full width 2ª linha | Inline média | Inline larga |
| Sidebar tags | Drawer via [☰] | Drawer ou narrow 200px | Fixa 240px |
| Lista notas | 1 coluna full | 1 coluna | Coluna flex 1 |
| Cards grid | 1 col | 2 col | 3 col |
| Form | 1 col, footer sticky | 1 col max 600px centrado | max 720px centrado |
| Artigo leitura | padding 16px | padding 24px | max 720px center |
| Tabela tags | Cards | Cards ou table scroll | Table full |

---

## Header — adaptação

### Mobile
```
┌─────────────────────────────┐
│ [◇]              [☰] [☀]   │
│ ( 🔍 Buscar...            ) │
│ [ Colar nota — full width ]│  opcional 2ª linha
└─────────────────────────────┘
```

### Desktop
```
┌──────────────────────────────────────────────────────┐
│ [◇ Notas v2]  ( 🔍 Buscar... )  [Colar] [+ Nova] [☀] │
└──────────────────────────────────────────────────────┘
```

---

## Sidebar → Drawer (mobile)

```
        [☰] tap
           ↓
┌─────────────────────────────┐
│ ×                           │
│ ── Tags ──                  │
│ ● Todas                     │
│ ○ react (12)                │
│ ○ prisma (8)                │
│ ─────────────────────────── │
│ Colar nota                  │
│ Nova nota                   │
│ Gerenciar tags              │
│ ─────────────────────────── │
│ Tema: Claro / Escuro        │
└─────────────────────────────┘
         overlay escuro 40%
```

- Swipe ou tap fora fecha
- Trap de foco para acessibilidade

---

## Touch targets

| Elemento | Mínimo |
|----------|--------|
| Row da lista | height 56px |
| Chip tag | height 36px, padding horizontal 12px |
| Botões header | 44×44px |
| FAB (se usado) | 56×56px |

---

## Tipografia responsiva

| Token | Mobile | Desktop |
|-------|--------|---------|
| Título nota (h1) | xl | 2xl–3xl |
| Título lista | md | lg |
| Body leitura | md | md–lg |

---

## Orientação landscape (mobile)

- Manter drawer para tags (não sidebar fixa — pouca largura)
- Artigo: usar largura total com padding lateral 24px

---

## Testes de dispositivo recomendados

| Dispositivo | Largura | Foco |
|-------------|---------|------|
| iPhone SE | 375px | Drawer, form sticky |
| iPad | 768px | Transição sidebar |
| Desktop | 1440px | 2 colunas, leitura centrada |

---

## Checklist responsivo (DoD US-010)

- [ ] Sem scroll horizontal em nenhuma rota
- [ ] Busca utilizável com teclado virtual aberto
- [ ] Modal/drawer não cortado em viewport pequena
- [ ] Tabelas de tags degradam para cards
- [ ] Code blocks em MD com scroll horizontal apenas no bloco
