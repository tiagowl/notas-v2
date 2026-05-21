# Análise Competitiva — Notas v2

**Nota:** O usuário não indicou concorrentes específicos. Esta análise cobre **referências de categoria** — apps de notas pessoais e PKM frequentemente usados em fluxos similares (incluindo arquivamento de respostas de IA).

**Tipo de sistema:** Web app pessoal de notas com tags.  
**Objetivo:** Intuitividade e eficiência na guarda e visualização de notas.

---

## 1. Concorrentes analisados

| Produto | Tipo | Foco principal |
|---------|------|----------------|
| **Notion** | Web/desktop | Wiki + databases, flexível |
| **Obsidian** | Desktop (+ sync pago) | PKM local, Markdown, grafo |
| **Apple Notes** | Nativo Apple | Simplicidade, integração OS |
| **Google Keep** | Web/mobile | Notas rápidas, labels, lembretes |
| **Bear** | Apple | Markdown, tags, design |
| **Mem** | Web | AI tagging, busca semântica |
| **Reflect** | Web | Daily notes, backlinks, AI |
| **Standard Notes** | Web | Privacidade, criptografia, Markdown |

---

## 2. Features comuns (paridade competitiva necessária)

Funcionalidades que usuários **esperam** de qualquer app de notas credível:

| Feature | Notion | Obsidian | Keep | Bear | Notas v2 (planejado) |
|---------|--------|----------|------|------|----------------------|
| CRUD de notas | ✅ | ✅ | ✅ | ✅ | ✅ |
| Título + corpo | ✅ | ✅ | ✅ | ✅ | ✅ |
| Data/ordenação | ✅ | ✅ | ✅ | ✅ | ✅ (publicação) |
| Tags/labels | ✅ | ✅ | ✅ | ✅ | ✅ |
| Busca por texto | ✅ | ✅ | ✅ | ✅ | Parcial (título) → **expandir conteúdo** |
| Filtro por tag | ✅ | ✅ | ✅ | ✅ | ✅ |
| Visualização formatada | ✅ | ✅ | Básico | ✅ MD | ✅ (planejado) |
| Tema escuro | ✅ | ✅ | ✅ | ✅ | **Recomendado P1** |

**Gap de paridade:** busca no corpo da nota, Markdown renderizado, tema escuro, export/backup.

---

## 3. Features diferenciadas por concorrente

| Concorrente | Diferenciais fortes |
|-------------|---------------------|
| **Notion** | Bases relacionais, templates, colaboração, embeds |
| **Obsidian** | Grafo, plugins, vault local, backlinks nativos |
| **Google Keep** | Lembretes geo/tempo, checklist rápido, integração Google |
| **Bear** | Tipografia, `#tags` inline, export bonito |
| **Mem** | Auto-tagging AI, busca semântica sem esforço |
| **Reflect** | Daily note, AI assistant, rede de links |
| **Standard Notes** | E2E encryption, foco privacidade |
| **Apple Notes** | Scan, desenho, integração Siri/iCloud |

---

## 4. Gaps e oportunidades não exploradas (para Notas v2)

### Gap 1 — Fluxo otimizado “ChatGPT → nota”
Nenhum concorrente mainstream posiciona explicitamente o **paste inteligente** (título, data, preview) como fluxo principal. Notion/Obsidian são genéricos.

**Oportunidade:** Paste-to-note, templates de prompt, detecção de blocos de código.

### Gap 2 — Simplicidade web sem vault
Obsidian exige instalação e conceito de vault; Notion é pesado para uma nota isolada.

**Oportunidade:** Web app único, zero configuração, foco leitura.

### Gap 3 — Visual premium sem subscrição
Bear/Reflect/Mem são pagos ou freemium limitado.

**Oportunidade:** UI moderna gratuita para uso pessoal (projeto próprio).

### Gap 4 — Tags visuais sem complexidade de grafo
Obsidian/Reflect brilham com links; muitos usuários só querem **tags coloridas + busca**.

**Oportunidade:** Tags com cor e contagem, sem obrigar wiki-links no MVP.

### Gap 5 — Export portável desde cedo
Notion exporta mal para Markdown; Keep é lock-in Google.

**Oportunidade:** JSON + Markdown zip como feature P2.

---

## 5. Features que podemos fazer melhor (no contexto do projeto)

| Área | Como superar referências |
|------|--------------------------|
| **Onboarding** | 1 tela: colar → pronto; vs Notion workspace vazio |
| **Leitura de respostas IA** | Modo zen + MD + code copy vs Keep texto plano |
| **Categorização** | Tags sugeridas + cores vs digitar tags manualmente sempre |
| **Performance** | Lista enxuta só para notas vs Notion lento em páginas grandes |
| **Foco** | Zero features de equipe = UI mais limpa que Notion |

---

## 6. Inovações que nenhum concorrente oferece (combinação única)

Combinações raras no mercado **no mesmo produto leve**:

1. **Paste-to-note + Markdown + templates de prompt ChatGPT** — ecossistema fechado para o seu workflow.
2. **Dashboard “semana em notas”** sem SaaS — estatísticas pessoais simples.
3. **Modo leitura zen** otimizado para blocos de código de respostas técnicas.

*Nenhum item isolado é inédito; o diferencial é a **integração focada no seu caso de uso**.*

---

## 7. Matriz competitiva resumida

| Critério | Notas v2 (alvo) | Notion | Obsidian | Keep |
|----------|-----------------|--------|----------|------|
| Curva de aprendizado | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Markdown/IA | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ |
| Tags simples | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Busca poderosa | ⭐⭐⭐ (meta) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Visual moderno | ⭐⭐⭐⭐⭐ (meta) | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Privacidade/controle | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Colaboração | N/A | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

---

## 8. Recomendações competitivas

### Curto prazo (defender nicho)
- Igualar paridade: **busca no conteúdo**, **Markdown**, **tema escuro**.
- Destacar: **paste rápido** e **página de leitura** superior ao Keep.

### Médio prazo (diferenciar)
- Templates de prompt, tags sugeridas, syntax highlight.
- Export/backup para não ficar atrás de Obsidian em portabilidade.

### Longo prazo (opcional)
- Links `[[wiki]]` e busca semântica — aproximar Obsidian/Mem sem perder simplicidade.

---

## 9. Conclusão

Notas v2 **não compete** com Notion em equipes nem com Obsidian em plugins. Compete em **eficiência do fluxo pessoal ChatGPT → arquivo → releitura**. Os maiores gaps hoje são busca full-text, Markdown nativo e polish visual (tema, tipografia, modo leitura). Preencher esses gaps no MVP+ coloca o produto à frente do Keep e na mesma conversa que Bear/Obsidian para o caso de uso específico do usuário.

---

*Análise gerada pelo Feature Suggester. Concorrentes escolhidos como referência de mercado; lista ajustável se o usuário indicar preferências futuras.*
