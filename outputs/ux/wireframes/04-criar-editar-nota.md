# Wireframe — Criar / Editar Nota

**Rotas:** `/notas/nova` · `/notas/[id]/editar`  
**Stories:** US-001, US-003, US-008

---

## Desktop — Formulário

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [◇ Notas v2]  ( 🔍 )                              [Colar] [+ Nova] [☀]      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Notas > Nova nota                                                           │
│                                                                             │
│  Nova nota                                                                  │
│  ──────────                                                                 │
│                                                                             │
│  Título *                                                                   │
│  ( ________________________________________________________ )               │
│                                                                             │
│  Data de publicação                                                         │
│  ( 2026-05-20  )  ℹ️ Data da resposta ou quando foi gerada a nota           │
│                                                                             │
│  Tags                                                                       │
│  ( Buscar ou criar tag...          ▼ )                                      │
│  [ react ×] [ prisma ×] [ + Adicionar ]                                    │
│                                                                             │
│  Conteúdo *                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Cole aqui o Markdown do ChatGPT...                                  │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                                                                     │   │
│  │                                                          min 12 rows│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                                    [ Cancelar ]  [ Salvar nota ]          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Editar nota

Mesmo layout; título da página: **Editar nota**; breadcrumb `Notas > [Título] > Editar`; campos pré-preenchidos; botão **[ Salvar alterações ]**.

---

## Mobile — Form sticky footer

```
┌─────────────────────────────┐
│ ← Cancelar    Nova nota     │
├─────────────────────────────┤
│ Título *                    │
│ (________________)          │
│ Data                        │
│ (____-__-__)                │
│ Tags                        │
│ [chip][chip]                │
│ ( buscar tag... )           │
│ Conteúdo *                  │
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │      textarea           │ │
│ │                         │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ [ Salvar nota — full width ]│
└─────────────────────────────┘
```

---

## Validação inline

```
Título *
( _________________________ )
⚠ Título é obrigatório (máx. 200 caracteres)

Conteúdo *
┌──────────────────────────┐
│                          │
└──────────────────────────┘
⚠ Adicione o conteúdo da nota
```

- Botão Salvar **desabilitado** até título + conteúdo válidos
- Durante submit: loading spinner no botão, campos disabled

---

## Seletor de tags (combobox)

```
┌──────────────────────────────┐
│ Buscar tag...                │
├──────────────────────────────┤
│ ○ react                      │
│ ○ prisma                     │
│ ○ ia                         │
│ ──────────────────────────── │
│ + Criar "nova-tag"           │
└──────────────────────────────┘
```

- Selecionadas aparecem como chips removíveis (×)
- Criar tag inline sem sair do form (POST tag + associar)

---

## Fluxo após salvar

| Origem | Destino sugerido |
|--------|------------------|
| Nova nota | `/notas/[id]` (visualizar) + Toast |
| Editar | `/notas/[id]` + Toast "Alterações salvas" |
| Cancelar (sem dirty) | `/notas` |
| Cancelar (dirty) | Dialog "Descartar alterações?" |

---

## Atalhos (Fase 2)

| Atalho | Ação |
|--------|------|
| `Ctrl+S` / `Cmd+S` | Salvar |
| `Esc` | Cancelar / voltar (com guard dirty) |
