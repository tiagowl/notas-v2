# Wireframe — Colar Nota (Paste-to-note)

**Story:** US-011 (Fase 1)  
**Entrada:** Header [Colar] · Drawer mobile · Empty state CTA

---

## Fluxo resumido

```
[Colar] → Lê clipboard → Modal preview → Ajusta título/tags → Salvar → /notas/[id]
```

---

## Modal — Desktop

```
┌─────────────────────────────────────────────────────────────────┐
│  Colar nota                                                [×]  │
├─────────────────────────────────────────────────────────────────┤
│  Conteúdo detectado do clipboard                                │
│                                                                 │
│  Título (editável)                                              │
│  ( Como configurar Prisma no Next.js___________________ )       │
│                                                                 │
│  Data de publicação                                             │
│  ( 2026-05-20 )                                                 │
│                                                                 │
│  Tags (opcional)                                                │
│  [ ia ×] [ + Adicionar tag ]                                    │
│                                                                 │
│  Pré-visualização do conteúdo                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ## Introdução                                             │  │
│  │ Texto colado...                                           │  │
│  │ (scroll, max-height 200px)                                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│                      [ Cancelar ]  [ Salvar nota ]              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Regras de detecção de título

| Entrada clipboard | Título sugerido |
|-------------------|----------------|
| Primeira linha `# Título` | "Título" (sem `#`) |
| Primeira linha texto curto (&lt; 80 chars) | Essa linha |
| Sem linha clara | "Sem título" — **focar campo** |
| Corpo | Resto após primeira linha (ou tudo se sem título) |

---

## Mobile — full screen sheet

```
┌─────────────────────────────┐
│ ×    Colar nota             │
├─────────────────────────────┤
│ Título                      │
│ (________________________)  │
│ Data                        │
│ Tags [chip]                 │
│ Preview                     │
│ ┌─────────────────────────┐ │
│ │ texto...                │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ [ Salvar nota — full ]      │
└─────────────────────────────┘
```

---

## Estados do modal

| Estado | UI |
|--------|-----|
| Lendo clipboard | Spinner "Lendo área de transferência…" |
| Clipboard vazio | "Nada para colar. Copie texto do ChatGPT primeiro." |
| Permissão negada | Instrução manual: "Cole no campo abaixo" + textarea |
| Salvando | Botão loading |
| Erro | Toast + manter modal aberto |

---

## Alternativa: rota dedicada `/notas/colar`

Se modal for complexo no MVP Fase 1, usar página com mesmo layout do form **Nova nota** porém:

- Conteúdo pré-preenchido via `navigator.clipboard.readText()` no mount
- Banner: *"Conteúdo colado do clipboard — revise e salve"*

---

## Métrica UX

Meta: **≤ 3 interações** (Colar → Salvar → ver nota) quando título/tags default aceitos.
