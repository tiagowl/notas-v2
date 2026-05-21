# Sugestões de Features — Notas v2

**Contexto:** Sistema web pessoal para guardar e visualizar notas com intuitividade e eficiência. Público: uso individual. Base planejada: CRUD de notas e tags, vínculo nota–tag, visualização formatada, título/conteúdo/data de publicação, filtro por título e busca por tag. Maioria das notas originadas de respostas do ChatGPT.

---

## 🌟 Features Core (Essenciais)

### 1. Editor e visualização Markdown nativa
| Campo | Detalhe |
|-------|---------|
| **Descrição** | Renderizar conteúdo em Markdown (títulos, listas, código, links, tabelas) na página de visualização e no preview do editor. |
| **Benefício** | Notas vindas do ChatGPT já vêm em Markdown; leitura fiel sem perder formatação. |
| **Impacto negócio** | Alto |
| **Complexidade** | Média |
| **Prioridade** | P1 |

### 2. Importação rápida via colar (paste-to-note)
| Campo | Detalhe |
|-------|---------|
| **Descrição** | Área ou atalho para colar texto do clipboard; detectar título na primeira linha ou `#`; preencher data automaticamente. |
| **Benefício** | Fluxo principal (copiar do ChatGPT → salvar) em segundos. |
| **Impacto negócio** | Alto |
| **Complexidade** | Baixa |
| **Prioridade** | P1 |

### 4. Ordenação e filtros combinados
| Campo | Detalhe |
|-------|---------|
| **Descrição** | Ordenar por data (mais recente/antiga), buscar por titulo e clicar na tag para filtrar as notas por ela;
| **Benefício** | Navegação eficiente em biblioteca crescente de notas. |
| **Impacto negócio** | Médio |
| **Complexidade** | Baixa |
| **Prioridade** | P1 |

### 5. Tags com cor e contagem
| Campo | Detalhe |
|-------|---------|
| **Descrição** | Cor por tag na UI; badge com quantidade de notas; nuvem ou lista lateral de tags mais usadas. |
| **Benefício** | Escaneamento visual rápido; organização sem abrir cada nota. |
| **Impacto negócio** | Médio |
| **Complexidade** | Baixa |
| **Prioridade** | P1 |

### 7. Atalhos de teclado
| Campo | Detalhe |
|-------|---------|
| **Descrição** | Atalhos para nova nota, busca, salvar, voltar à lista (`Ctrl+N`, `Ctrl+K`, `Esc`, etc.). |
| **Benefício** | Eficiência para uso frequente e solo. |
| **Impacto negócio** | Médio |
| **Complexidade** | Baixa |
| **Prioridade** | P2 |

---

## 🚀 Features Diferenciadores


### 11. Vista em cards vs lista compacta
| Campo | Detalhe |
|-------|---------|
| **Descrição** | Alternar entre grid de cards (preview do conteúdo) e lista densa (só título, data, tags). |
| **Benefício** | Adaptar UI ao tipo de consulta (explorar vs encontrar). |
| **Impacto negócio** | Médio |
| **Complexidade** | Baixa |
| **Prioridade** | P2 |

### 12. Notas fixadas (pinned)
| Campo | Detalhe |
|-------|---------|
| **Descrição** | Fixar notas importantes no topo da lista, independente da data. |
| **Benefício** | Acesso imediato a referências frequentes. |
| **Impacto negócio** | Baixo |
| **Complexidade** | Baixa |
| **Prioridade** | P2 |

### 14. Blocos de código com syntax highlight e copiar
| Campo | Detalhe |
|-------|---------|
| **Descrição** | Destaque de sintaxe em fenced code blocks;
| **Benefício** | Notas técnicas do ChatGPT usáveis na hora. |
| **Impacto negócio** | Médio |
| **Complexidade** | Baixa |
| **Prioridade** | P2 |

### 15. Filtro por intervalo de datas
| Campo | Detalhe |
|-------|---------|
| **Descrição** | Seletor “últimos 7 dias”, “este mês”, intervalo customizado na data de publicação. |
| **Benefício** | Revisitar conversas ou temas por período. |
| **Impacto negócio** | Médio |
| **Complexidade** | Baixa |
| **Prioridade** | P2 |

---

## 💎 Features Premium / Wow

---

## 🔮 Features Futuras

### 21. Busca semântica (embeddings)
| Campo | Detalhe |
|-------|---------|
| **Descrição** | Busca por significado (“como configurar Docker”) mesmo sem essas palavras exatas. |
| **Benefício** | Recuperação inteligente em corpus grande. |
| **Impacto negócio** | Alto |
| **Complexidade** | Alta |
| **Prioridade** | P3 |

### 22. Extensão de navegador “Salvar no Notas”
| Campo | Detalhe |
|-------|---------|
| **Descrição** | Capturar seleção ou página do ChatGPT/navegador direto no app. |
| **Benefício** | Elimina passo de copiar/colar manual. |
| **Impacto negócio** | Médio |
| **Complexidade** | Alta |
| **Prioridade** | P3 |

### 23. Sincronização multi-dispositivo (PWA + cloud)
| Campo | Detalhe |
|-------|---------|
| **Descrição** | PWA instalável; sync opcional via backend ou serviço (ex.: Supabase). |
| **Benefício** | Acesso mobile/tablet ao mesmo acervo. |
| **Impacto negócio** | Médio |
| **Complexidade** | Alta |
| **Prioridade** | P3 |

### 24. Integração direta com API OpenAI (opcional)
| Campo | Detalhe |
|-------|---------|
| **Descrição** | Enviar nota ou seleção para re-prompt, continuar conversa dentro do app. |
| **Benefício** | Ciclo fechado sem sair do sistema de notas. |
| **Impacto negócio** | Médio |
| **Complexidade** | Alta |
| **Prioridade** | P3 |

---

## Matriz de Priorização (resumo)

| Feature | Valor usuário | Valor negócio | Esforço | Prioridade |
|---------|---------------|---------------|---------|------------|
| Markdown nativo | Alto | Alto | Médio | P1 |
| Paste-to-note | Alto | Alto | Baixo | P1 |
| Busca full-text | Alto | Alto | Médio | P1 |
| Filtros combinados | Alto | Médio | Baixo | P1 |
| Tags com cor | Médio | Médio | Baixo | P1 |
| Tema claro/escuro | Médio | Médio | Baixo | P1 |
| Modo leitura zen | Alto | Médio | Baixo | P2 |
| Syntax highlight código | Alto | Médio | Baixo | P2 |
| Templates de prompt | Alto | Médio | Baixo | P2 |
| Backup/export | Alto | Alto | Médio | P2 |
| Links wiki [[ ]] | Alto | Alto | Alto | P3 |
| Busca semântica | Alto | Alto | Alto | P3 |

---

## Ideação rápida (metodologia 3+4+3)

| # | Tipo | Ideia | Atratividade | Impacto | Viabilidade | Inovação |
|---|------|-------|--------------|---------|-------------|----------|
| 1 | Must-have | Paste-to-note com auto-título | 5 | 5 | 5 | 3 |
| 2 | Must-have | Visualização Markdown | 5 | 5 | 4 | 3 |
| 3 | Must-have | Busca no conteúdo | 5 | 5 | 4 | 3 |
| 4 | Nice-to-have | Templates de prompt | 4 | 4 | 5 | 4 |
| 5 | Nice-to-have | Tags sugeridas | 4 | 3 | 4 | 4 |
| 6 | Nice-to-have | Vista cards/lista | 4 | 3 | 5 | 3 |
| 7 | Nice-to-have | Filtro por data | 4 | 3 | 5 | 2 |
| 8 | Wow | Dashboard semanal | 4 | 3 | 4 | 4 |
| 9 | Wow | Modo leitura zen | 5 | 3 | 5 | 3 |
| 10 | Wow | Links [[wiki]] | 4 | 4 | 3 | 5 |

---

*Gerado pelo agente Feature Suggester com base nas diretrizes do projeto Notas v2.*
