# Relatório de Usabilidade — Notas v2

**Data:** 2026-05-20  
**Tipo:** Avaliação heurística pré-implementação + plano de testes moderados  
**Base:** Wireframes e protótipos em `outputs/ux/`  
**Referência:** User stories US-001 a US-021, critérios de aceitação PO

---

## 1. Resumo executivo

| Métrica | Resultado |
|---------|-----------|
| Método aplicado | Heurísticas de Nielsen (10) + revisão de fluxos críticos |
| Problemas encontrados | 12 (0 catastróficos, 4 altos, 5 médios, 3 baixos) |
| Status geral | **Aprovado para desenvolvimento** com correções P0 documentadas |
| Próximo passo | Teste moderado após Sprint 3 (MVP) |

**Conclusão:** Os fluxos propostos atendem aos objetivos de captura rápida e leitura confortável. Os problemas altos concentram-se em **visibilidade do filtro ativo**, **fluxo colar no mobile** e **feedback de busca** — todos endereçáveis no design antes do código.

---

## 2. Método

### 2.1 Avaliação heurística

Avaliadores: agente UX (simulação estruturada)  
Artefatos: wireframes, user flows, design system  
Escala de severidade:

| Grau | Descrição |
|------|-----------|
| 0 | Não é problema |
| 1 | Cosmético |
| 2 | Menor |
| 3 | Maior — corrigir antes do release |
| 4 | Catastrófico — bloqueante |

### 2.2 Plano de teste moderado (pós-MVP)

| Item | Valor |
|------|-------|
| Participantes | 1 (stakeholder) — acceptable para produto pessoal |
| Duração | 30–45 min |
| Ambiente | Protótipo clicável ou staging |
| Métricas | Taxa conclusão, tempo por tarefa, erros, SUS opcional |

---

## 3. Tarefas de teste (roteiro)

| ID | Tarefa | Critério de sucesso | Meta tempo |
|----|--------|---------------------|------------|
| T1 | Colar texto simulado do ChatGPT e salvar com tag "teste" | Nota na lista com tag | ≤ 15s |
| T2 | Encontrar nota pelo título via busca | Nota correta aberta | ≤ 30s |
| T3 | Filtrar notas clicando em tag existente | Só notas da tag | ≤ 20s |
| T4 | Ler nota com código e copiar snippet | Código copiado | ≤ 45s |
| T5 | Excluir nota com confirmação | Nota removida | ≤ 25s |
| T6 | (Mobile) Abrir e ler nota sem scroll horizontal | Leitura confortável | ≤ 30s |

---

## 4. Resultados heurísticos

### H1 — Visibilidade do status do sistema

| ID | Problema | Sev. | Recomendação |
|----|----------|------|--------------|
| U-01 | Filtro por tag ativo pode passar despercebido | 3 | Banner "Filtrando por: X" + chip destacado + limpar |
| U-02 | Busca sem debounce pode parecer "travada" | 2 | Skeleton ou spinner na lista durante fetch |
| U-03 | Salvamento sem feedback | 3 | Toast "Nota salva" obrigatório |

### H2 — Correspondência sistema/mundo real

| ID | Problema | Sev. | Recomendação |
|----|----------|------|--------------|
| U-04 | "Colar nota" mais relevante que "Nova" para persona | 2 | CTA Colar igual ou maior destaque que Nova |
| U-05 | Data "publicação" ambígua | 1 | Label helper: "Data da conversa/resposta" |

### H3 — Controle e liberdade do usuário

| ID | Problema | Sev. | Recomendação |
|----|----------|------|--------------|
| U-06 | Excluir sem confirmação seria destrutivo | 4* | *Mitigado no design: AlertDialog — manter |
| U-07 | Sair do form sem aviso perde dados | 3 | Confirmar se form dirty ao navegar away |

### H4 — Consistência e padrões

| ID | Problema | Sev. | Recomendação |
|----|----------|------|--------------|
| U-08 | Tags clicáveis na lista e no detalhe devem comportar igual | 2 | Sempre → filtro na home |
| U-09 | Ícones de ação diferentes entre lista e detalhe | 1 | Mesmo set (lucide) e ordem Editar/Excluir |

### H5 — Prevenção de erros

| ID | Problema | Sev. | Recomendação |
|----|----------|------|--------------|
| U-10 | Título vazio ao colar gera "Sem título" | 2 | Focar campo título no modal paste se vazio |
| U-11 | Tag duplicada no CRUD | 2 | Validação inline no form tag |

### H6 — Reconhecimento vs memorização

| ID | Problema | Sev. | Recomendação |
|----|----------|------|--------------|
| U-12 | Atalhos de teclado invisíveis | 2 | Tooltip ou página "?" no footer (Fase 2) |

### H7–H10 — Flexibilidade, design minimalista, recuperação erros, ajuda

| ID | Problema | Sev. | Recomendação |
|----|----------|------|--------------|
| U-13 | Erro 500 genérico | 3 | Toast + "Tentar novamente"; não limpar form |
| U-14 | Empty state sem orientação | 3 | CTA Colar + Criar (já no wireframe) |
| U-15 | 404 nota | 2 | Página amigável com link voltar à lista |

---

## 5. Matriz de severidade consolidada

| Severidade | Qtd | IDs |
|------------|-----|-----|
| 4 (bloqueante) | 0* | U-06 mitigado |
| 3 (maior) | 4 | U-01, U-03, U-07, U-13, U-14 |
| 2 (menor) | 5 | U-02, U-04, U-08, U-10, U-11, U-12, U-15 |
| 1 (cosmético) | 2 | U-05, U-09 |

---

## 6. Acessibilidade (revisão rápida)

| Critério | Status | Nota |
|----------|--------|------|
| Contraste AA | Pendente implementação | Validar tokens dark/light no Chakra |
| Navegação teclado | Planejado | Tab order: header → sidebar → lista |
| Screen reader busca | Planeado | `aria-live` em resultados |
| Touch 44px | Planejado | Chips e rows em mobile |

---

## 7. Métricas esperadas pós-teste (baseline)

| Métrica | Baseline alvo | Como medir |
|---------|---------------|------------|
| Taxa conclusão T1–T5 | 100% (1 usuário) | Observação direta |
| Tempo T1 (captura) | ≤ 15s | Cronômetro |
| Tempo T2 (busca) | ≤ 30s | Cronômetro |
| Erros por tarefa | ≤ 1 | Contagem slips/clicks errados |
| SUS (opcional) | ≥ 80 | Questionário 10 itens |

---

## 8. Correções obrigatórias antes/durante MVP (P0 UX)

| ID | Correção | Story |
|----|----------|-------|
| U-01 | Indicador filtro tag ativo | US-009 |
| U-03 | Toast ao salvar | US-001, US-003 |
| U-06 | Dialog exclusão | US-004 |
| U-07 | Guard form dirty | US-001, US-003 |
| U-13 | Tratamento erro API | Todas |
| U-14 | Empty state com CTAs | US-002 |

---

## 9. Backlog de usabilidade pós-MVP

| Prioridade | Item | Fase |
|------------|------|------|
| P1 | Busca full-text com highlight no resultado | US-013 |
| P1 | Modal paste otimizado mobile | US-011 |
| P2 | Tooltips atalhos teclado | US-021 |
| P2 | Vista cards usabilidade A/B informal | US-018 |
| P3 | Modo zen — teste leitura 10 min | US-022 |

---

## 10. Conclusão e sign-off

O design proposto é **consistente com os requisitos do Product Owner** e com as metas de negócio (captura ≤ 15s, busca ≤ 30s). Recomenda-se iniciar implementação do MVP (Sprints 0–3) incorporando as correções P0 da seção 8.

**Status:** ✅ Aprovado para handoff ao Frontend Dev e UI Designer  
**Reavaliar:** Após deploy do MVP com roteiro §3

---

*Relatório de usabilidade — agente UX, Notas v2.*
