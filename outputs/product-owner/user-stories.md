# User Stories — Notas v2

**Formato:** Como [persona] / Eu quero [ação] / Para que [valor]  
**Persona padrão:** Tiago — usuário único do sistema  
**Referência:** `requirements.md`, `outputs/feature-suggester/feature-suggestions.md`

---

## Épico E0 — Fundação e MVP (Fase 0)

### US-001 — Criar nota manualmente
**Como** usuário do sistema  
**Eu quero** criar uma nova nota informando título, conteúdo e data de publicação  
**Para que** eu possa registrar conhecimento originado do ChatGPT ou de outras fontes

**Prioridade:** P0 | **Estimativa:** M | **Fase:** 0

---

### US-002 — Listar notas
**Como** usuário do sistema  
**Eu quero** ver uma lista de todas as minhas notas com título, data e tags  
**Para que** eu tenha visão geral do meu acervo

**Prioridade:** P0 | **Estimativa:** M | **Fase:** 0

---

### US-003 — Editar nota
**Como** usuário do sistema  
**Eu quero** editar título, conteúdo, data de publicação e tags de uma nota existente  
**Para que** eu possa corrigir ou atualizar informações armazenadas

**Prioridade:** P0 | **Estimativa:** M | **Fase:** 0

---

### US-004 — Excluir nota
**Como** usuário do sistema  
**Eu quero** excluir uma nota com confirmação  
**Para que** eu remova conteúdo obsoleto sem acidentes

**Prioridade:** P0 | **Estimativa:** S | **Fase:** 0

---

### US-005 — Visualizar nota formatada
**Como** usuário do sistema  
**Eu quero** abrir uma página dedicada de visualização da nota com boa tipografia e espaçamento  
**Para que** eu leia respostas longas do ChatGPT com conforto

**Prioridade:** P0 | **Estimativa:** M | **Fase:** 0

---

### US-006 — Filtrar notas por título
**Como** usuário do sistema  
**Eu quero** buscar/filtrar notas digitando parte do título  
**Para que** eu encontre rapidamente uma nota quando lembro do assunto

**Prioridade:** P0 | **Estimativa:** S | **Fase:** 0

---

### US-007 — Gerenciar tags (CRUD)
**Como** usuário do sistema  
**Eu quero** criar, renomear e excluir tags  
**Para que** eu mantenha uma taxonomia consistente dos meus temas

**Prioridade:** P0 | **Estimativa:** M | **Fase:** 0

---

### US-008 — Associar tags à nota
**Como** usuário do sistema  
**Eu quero** selecionar uma ou mais tags ao criar ou editar uma nota  
**Para que** eu categorize o conteúdo para consultas futuras

**Prioridade:** P0 | **Estimativa:** M | **Fase:** 0

---

### US-009 — Filtrar notas por tag
**Como** usuário do sistema  
**Eu quero** clicar em uma tag e ver apenas as notas vinculadas a ela  
**Para que** eu explore um tema específico sem buscar nota a nota

**Prioridade:** P0 | **Estimativa:** S | **Fase:** 0

---

### US-010 — Interface responsiva
**Como** usuário do sistema  
**Eu quero** usar o app em celular, tablet e desktop com layout adaptado  
**Para que** eu consulte notas em qualquer dispositivo

**Prioridade:** P0 | **Estimativa:** M | **Fase:** 0

---

## Épico E1 — Captura e leitura (Fase 1)

### US-011 — Colar nota rapidamente (paste-to-note)
**Como** usuário do sistema  
**Eu quero** colar texto do clipboard em um fluxo rápido que preencha título (primeira linha ou `#`) e data automaticamente  
**Para que** eu arquive respostas do ChatGPT em poucos segundos

**Prioridade:** P1 | **Estimativa:** S | **Fase:** 1

---

### US-012 — Visualizar Markdown
**Como** usuário do sistema  
**Eu quero** que o conteúdo em Markdown seja renderizado na página de visualização (títulos, listas, links, tabelas, código)  
**Para que** a formatação do ChatGPT seja preservada na leitura

**Prioridade:** P1 | **Estimativa:** M | **Fase:** 1

---

### US-013 — Buscar no conteúdo da nota
**Como** usuário do sistema  
**Eu quero** buscar palavras ou frases dentro do corpo das notas, não só no título  
**Para que** eu encontre trechos técnicos que não estão no título

**Prioridade:** P1 | **Estimativa:** M | **Fase:** 1


---

## Épico E2 — Organização e eficiência (Fase 2)

### US-016 — Ordenar listagem
**Como** usuário do sistema  
**Eu quero** ordenar notas por data (mais recente/antiga) ou por título (A–Z)  
**Para que** eu organize a visualização conforme minha tarefa atual

**Prioridade:** P1 | **Estimativa:** S | **Fase:** 2

---

### US-017 — Tags com cor e contagem
**Como** usuário do sistema  
**Eu quero** definir cor para cada tag e ver quantas notas estão vinculadas  
**Para que** eu identifique categorias visualmente na sidebar ou lista

**Prioridade:** P1 | **Estimativa:** S | **Fase:** 2

---

### US-018 — Vista cards e lista
**Como** usuário do sistema  
**Eu quero** alternar entre visualização em cards (com preview) e lista compacta  
**Para que** eu escolha entre explorar conteúdo ou localizar rapidamente

**Prioridade:** P2 | **Estimativa:** S | **Fase:** 2

---

### US-019 — Fixar notas importantes
**Como** usuário do sistema  
**Eu quero** fixar notas no topo da listagem independente da data  
**Para que** referências frequentes fiquem sempre acessíveis

**Prioridade:** P2 | **Estimativa:** S | **Fase:** 2

---

### US-020 — Filtrar por período
**Como** usuário do sistema  
**Eu quero** filtrar notas por intervalo de data de publicação (ex.: últimos 7 dias, este mês)  
**Para que** eu revise o que aprendi em um período específico

**Prioridade:** P2 | **Estimativa:** M | **Fase:** 2

---

### US-021 — Atalhos de teclado
**Como** usuário do sistema  
**Eu quero** usar atalhos para nova nota, busca, salvar e voltar à lista  
**Para que** eu opere o sistema com eficiência no desktop

**Prioridade:** P2 | **Estimativa:** S | **Fase:** 2

---

---

---

## Mapa de stories por página (referência UX)

| Página / área | Stories |
|---------------|---------|
| `/` ou `/notas` | US-002, US-006, US-009, US-016, US-018, US-019, US-020 |
| `/notas/nova` | US-001, US-008, US-011 |
| `/notas/[id]` | US-003, US-005, US-012, US-015, US-022 |
| `/notas/[id]/editar` | US-003, US-008 |
| `/tags` | US-007, US-017 |
| Global | US-010, US-013, US-014, US-021 |

---

## Legenda de estimativa

| Tamanho | Significado |
|---------|-------------|
| S | ≤ 1 dia |
| M | 2–3 dias |
| L | ≥ 1 semana |

---

*Stories US-001 a US-010 formam o **Definition of Done** do lançamento pessoal mínimo.*
