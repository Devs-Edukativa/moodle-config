# Moodle FUNPRESP-JUD — Configurações

Documentação de toda a customização aplicada ao Moodle da plataforma EaD FUNPRESP-JUD: identidade visual, configurações do tema Lambda, blocos HTML customizados, CSS/JS personalizados, plugin de auto-inscrição e workarounds operacionais.

**Arquivos neste diretório:**

- [style.css](style.css) — CSS customizado completo (colar no campo "Custom CSS" do Lambda)
- [script.js](script.js) — JS customizado completo (colar no campo "Custom JS" do Lambda)
- [html/hero.html](html/hero.html) — bloco HTML do hero + atalhos da home
- [html/about.html](html/about.html) — bloco "Conheça a plataforma" da home
- [html/faq.html](html/faq.html) — accordion FAQ
- [html/footer.html](html/footer.html) — markup do footer institucional

---

## Sumário

1. [Identidade visual (geral)](#1-identidade-visual-geral)
2. [Tema Lambda — Configurações](#2-tema-lambda--configurações)
3. [Customizações por página](#3-customizações-por-página)
4. [Imagens de fundo (hero / sobre)](#4-imagens-de-fundo-hero--sobre)
5. [FAQ — como adicionar/editar](#5-faq--como-adicionareditar)
6. [Plugin autoenrol](#6-plugin-autoenrol)
7. [Editando blocos HTML — TinyMCE x texto puro](#7-editando-blocos-html--tinymce-x-texto-puro)
8. [JS customizado (script.js)](#8-js-customizado-scriptjs)
9. [CSS customizado (style.css)](#9-css-customizado-stylecss)

---

## 1. Identidade visual (geral)

Fonte única de verdade para cores e fontes. Usar exatamente estes valores nos campos do Lambda e nos blocos HTML/CSS — não inventar tons novos.

### 1.1 Paleta

| Token | Hex | Uso |
|---|---|---|
| Azul primário | `#0578be` | CTA, links, hover de cards, eyebrows azuis |
| Azul hover | `#0e509a` | Estado :hover dos CTAs e links |
| Azul marinho | `#0f2137` | Texto principal escuro, fundo do hero, fundo do footer |
| Amarelo brand | `#fbba00` | Eyebrows ("PLATAFORMA EAD"), destaques no painel brand do login |
| Cinza texto | `#1a1a1a` | Headings e body neutros (tema light) |
| Cinza fundo claro | `#f5f5f5` / `#f5f6f8` | Fundos de seções alternadas, fundo de página interna |
| Borda neutra | `#ededed` / `#d8dde3` | Bordas de cards, inputs, divisores |
| Verde concluído | `#2a8e4e` | Badge "Concluído" em meus cursos |
| Cinza não iniciado | `#888` | Badge "Não iniciado" em meus cursos |

### 1.2 Tipografia

- **Família**: Open Sans (carregada via Google Fonts pelo Lambda — `font_body` e `font_heading`)
- **Body text size**: 14px
- **Headings**: weight 700–800, mesma família Open Sans
- **Eyebrows** (rótulos amarelos/azuis pequenos): 10–12px, letter-spacing 1.5–3px, uppercase, weight 600–700

### 1.3 Onde aplicar cada cor

- CTA primário (`Acessar plataforma`, `Inscreva-me`, `Acessar` do login): fundo `#0578be`, hover `#0e509a`
- Fundo escuro (hero, painel brand do login, footer): `#0f2137`
- Eyebrow amarelo (sobre fundos escuros): `#fbba00`
- Eyebrow azul (sobre fundos claros, ex: categoria do curso): `#0578be`
- Bordas de cards: `#ededed`; bordas de inputs: `#d8dde3`
- Linha de footer/copyright: fundo `#08131f`, texto `#94a3b8`

---

## 2. Tema Lambda — Configurações

Caminho: **Administração do site → Aparência → Temas → Lambda**. Cada subseção abaixo corresponde a uma aba do tema.

### 2.1 Geral

| Campo Lambda | Variável | Valor |
|---|---|---|
| Set Page Width | `theme_lambda2 \| page_width` | **1480px** |
| Theme Main Color | `theme_lambda2 \| maincolor` | `#0578be` |
| Theme Secondary Color | `theme_lambda2 \| secondcolor` | `#0f2137` |
| Page background color | `theme_lambda2 \| page_bg_color` | `#ffffff` |

### 2.2 Header

| Campo Lambda | Valor |
|---|---|
| Header Style | **Logo left (with login form), Menu below** |
| Main Logo Height (px) | `90px` |
| Height for the compact version of the logo | `60px` |
| Page Header/Title | Title left aligned (default) |
| Header Color (bg) | `#ffffff` |
| Header Font Color | `#1a1a1a` |
| Header Border | `border - top` |
| Header Border Width | `4px` |
| Header Border Color | `use main theme color` (= `#0578be`) |

### 2.3 Menu (custom menu + dropdown)

| Campo Lambda | Valor |
|---|---|
| Custom Menu Color (`menufirstlevelcolor`) | `#0f2137` |
| Custom Menu - Links (`menufirstlevel_linkcolor`) | `#ffffff` |
| Menu Drop-down Items (`menusecondlevelcolor`) | `#ffffff` |
| Menu Drop-down Items - Links (`menusecondlevel_linkcolor`) | `#1a1a1a` |

### 2.4 Login / Breadcrumb / Search

| Campo Lambda | Valor |
|---|---|
| Custom Menu Home Link (`home_button`) | **Página inicial** |
| Search box on Navigation Bar (`navbar_search_form`) | **hide for non-logged in and guest users** |
| Breadcrumb Navigation (`nav_breadcrumb`) | **always visible** |
| Additional Login Link (`login_link`) | **Esqueceu o seu usuário ou senha?** |
| Custom Login Link URL / Text | (vazio — usa o padrão acima) |
| Oauth2 (`auth_googleoauth2`) | **Não** marcado |

### 2.5 Footer (config no admin Lambda)

| Campo Lambda | Valor |
|---|---|
| Footer Background Color (`footercolor`) | `#0f2137` |
| Footer Heading Color (`footerheadingcolor`) | `#ffffff` |
| Footer Text Color (`footertextcolor`) | `#cbd5e1` |
| Footer Link Color (`footerlinkcolor`) | `Default link color` |
| Footer Copyright Color (`copyrightcolor`) | `#08131f` |
| Copyright Text Color (`copyright_textcolor`) | `#94a3b8` |

> O **conteúdo** do footer (texto, colunas, logos) é controlado pelo HTML colado num bloco do tema — ver [html/footer.html](html/footer.html) e seção 7 sobre como acessar os menus de edição do bloco.

### 2.6 Site Home Options

| Campo Lambda | Valor |
|---|---|
| Site Home Section Headings (`site_home_items_headings`) | `default (left aligned)` |
| Clean Main Region Layout (`fp_clean_layout`) | **marcado (ON)** |
| Hide page header for front page resources (`fp_no_page_header`) | **marcado (ON)** |
| Blog style for site announcements (`fp_blog_announcements`) | **marcado (ON)** |

### 2.7 Fontes

| Campo Lambda | Valor |
|---|---|
| Font type selector (`fonts_source`) | **Google Fonts** |
| Font Selector - Body (`font_body`) | `Open Sans` |
| Body Text Size (`font_body_size`) | `14px` |
| Font Selector - Headings (`font_heading`) | `Open Sans` |
| Font Heading Color (`heading_color`) | `#1a1a1a` |
| Font Body Color (`body_color`) | `#1a1a1a` |
| Link Color (`link_color`) | `#0578be` |
| Use Linearicons (`use_linearicons`) | **desmarcado** |

### 2.8 Custom CSS / Custom JS — onde colar

- **Custom CSS**: Lambda → aba **Custom CSS** → colar o conteúdo de [style.css](style.css) na íntegra.
- **Custom JS**: Lambda → aba **Custom JS** (ou campo `additionalcustomscript` dependendo da versão) → colar o conteúdo de [script.js](script.js) na íntegra.
- Após salvar: **Purge all caches** (Administração → Desenvolvimento → Purgar todos os caches).

---

## 3. Customizações por página

Cada página tem um seletor de body (`#page-<id>`) usado como âncora no [style.css](style.css). Toda override é escopada por esse seletor para não vazar.

### 3.1 Home pública (`#page-site-index`)

Composta por 3 blocos HTML do Moodle + listagem de cursos do Lambda.

| Bloco | Onde colar | Arquivo |
|---|---|---|
| Hero + atalhos | Bloco HTML 1 da home (acima da listagem de cursos) | [html/hero.html](html/hero.html) |
| Conheça a plataforma | Bloco HTML 2 da home (abaixo da listagem de cursos) | [html/about.html](html/about.html) |
| FAQ | Bloco HTML em página dedicada (ver seção 5) | [html/faq.html](html/faq.html) |

CSS relacionado: [style.css](style.css) seção 2 (hero + atalhos) e seção 3 (cursos disponíveis).

Pontos de atenção:

- O Lambda envolve blocos em `.card.card-block` com `overflow: hidden` — o CSS força `overflow: visible` na cadeia inteira de containers para permitir o full-bleed do hero.
- O hero, a faixa de atalhos e o "Conheça a plataforma" usam o truque `width: 100vw` + `margin-left/right: -50vw` para sair da container Bootstrap e ocupar a tela toda.
- Tabs administrativas (Configurações/Participantes/Relatórios) ficam escondidas via `.secondary-navigation { display: none }`.

### 3.2 Meus cursos (`#page-my-index`, `/my/courses.php`)

Layout reescrito: page header limpo com eyebrow "INÍCIO › MEUS CURSOS", filtros como pills, grid 3 colunas, cards minimalistas com barra de progresso e badge de status.

- Barra de progresso e badge são desenhadas via `::before` + `::after` em `.progress-text` / `.card-img-top`. A largura do preenchimento vem de uma CSS var `--progress` setada por JS.
- **Script responsável**: [script.js](script.js) bloco 1 — lê o `% concluído` do texto, seta `--progress` e `data-status` (`naoiniciado` / `andamento` / `concluido`). Roda também via `MutationObserver` quando o myoverview troca de filtro via AJAX.

### 3.3 Login (`#page-login-index`, `/login/index.php`)

Layout split-screen (painel brand à esquerda, formulário à direita) montado em runtime.

- **Script responsável**: [script.js](script.js) bloco 2 — cria `.funp-login-wrapper` direto no `<body>`, move `.loginform` original para dentro do painel direito, esconde o `#page-wrapper` antigo, marca `body.funp-login-active`.
- CSS: [style.css](style.css) seção 5 (v3 + v3.4).
- Para mudar o copy do painel esquerdo: editar o template do `brand.innerHTML` no [script.js](script.js).

### 3.4 Signup (`#page-login-signup`, `/login/signup.php`)

Mesmo padrão split-screen do login, com painel direito scrollable (form é longo). Inclui várias regras específicas pro `mform` empilhar label + input (Moodle entrega `.col-md-3` + `.col-md-9` horizontal por padrão).

- **Script split-screen**: [script.js](script.js) bloco 3.
- **CPF + telefone**: [script.js](script.js) bloco 4 (descrito em detalhe na seção 8).
- CSS: [style.css](style.css) seção 7.

### 3.5 Auto-inscrição (`#page-enrol-index`, `/enrol/index.php?id=<courseid>`)

Página servida pelo plugin **autoenrol** (ver seção 6). Estilizada como dois cards empilhados:

1. Card do curso (banner 280px + categoria como eyebrow azul + título grande + descrição).
2. Card do form de inscrição com **borda esquerda azul** + eyebrow "INSCRIÇÃO" + botão "Inscreva-me" full azul.

CSS: [style.css](style.css) seção 6. O header da página é o `#lambda-incourse-header` do tema — ganha breadcrumb-eyebrow amarelo "INÍCIO › CURSOS › INSCRIÇÃO" via `::before`.

### 3.6 Footer global ([html/footer.html](html/footer.html))

- Grid 4 colunas (`.funp-footer-grid`) com proporções `1fr 1.4fr 1.4fr 1.6fr`.
- Faixa de copyright (`.funp-copyright-row`) full-width fora do container, com fundo `#08131f`.
- CSS: [style.css](style.css) seção 8.

> **Importante**: os menus de edição do bloco do footer podem não aparecer no layout normal. Ver seção 7 para alcançá-los (zoom out, URL direta `bui_editid`, ou trocar editor para texto simples).

---

## 4. Imagens de fundo (hero / sobre)

Os banners de fundo do **hero** (home) e do **"Conheça a plataforma"** não são `<img>` no HTML — são definidos como **`background-image`** em duas classes CSS:

| Bloco | Classe CSS | URL atual da imagem | CSS |
|---|---|---|---|
| Hero (topo da home) | `.funp-hero-bg` | `https://ead.funprespjud.com.br/pluginfile.php/601/block_html/content/Banner-Hero%20%281%29.png` | [style.css](style.css) seção 2.8 |
| Sobre / Conheça | `.funp-known.funp-known-v13` | `https://ead.funprespjud.com.br/pluginfile.php/602/block_html/content/Banner-Institucional%20%281%29.png` | [style.css](style.css) seção 2.12 |

### Por que ficam dentro de `pluginfile.php/<id>/block_html/content/`

Cada bloco HTML do Moodle tem um **id interno** (`601` para o hero, `602` para o sobre — visíveis no path). Quando você faz upload de uma imagem dentro do editor do bloco, ela é armazenada em `pluginfile.php/<bui_id>/block_html/content/<nome-do-arquivo>`. Por isso a URL contém o id do bloco.

### Como editar/trocar uma imagem de fundo

Os blocos HTML da home **não aparecem no fluxo normal de edição da página** (especialmente em telas grandes ou no modo "Site home" do Lambda). O jeito confiável é acessar a URL de edição direta do bloco:

| Bloco | URL de edição |
|---|---|
| Hero | <https://ead.funprespjud.com.br/?bui_editid=174> |
| Sobre | <https://ead.funprespjud.com.br/?bui_editid=175> |

> O parâmetro `bui_editid` é o **block instance id** — diferente do `block_html id` que aparece no path do `pluginfile.php`. Não confundir.

Passos:

1. Logado como admin, acesse a URL de edição do bloco.
2. No editor do bloco (configurações), use o **gerenciador de arquivos** para enviar/substituir a imagem.
3. Pegue a URL final do arquivo (ex.: `pluginfile.php/601/block_html/content/Banner-Hero.png`) — Moodle gera essa URL automaticamente.
4. Atualize a URL no [style.css](style.css):
   - `.funp-hero-bg { background-image: url("..."); }` (seção 2.8)
   - `.funp-known.funp-known-v13 { background: ... url("...") ... ; }` (seção 2.12)
5. Salvar → **Purgar caches** (Administração → Desenvolvimento → Purgar todos os caches).

### Observações

- **Dimensões recomendadas**: largura mínima `1920px`, altura `~720px` (hero) / `~480px` (sobre). Imagens menores ficam borradas em telas grandes.
- **Formato**: PNG ou JPG. PNG só se for arte com transparência/elementos gráficos; JPG para fotos institucionais (peso menor).
- **Codificar espaços no nome**: o Moodle aceita arquivos com espaços, mas a URL fica com `%20`. Para evitar confusão, **renomeie sem espaços** (`Banner-Hero.png` em vez de `Banner Hero.png`).
- A imagem **não é referenciada no HTML do bloco** — o bloco serve só como "container" para hospedar o arquivo. Se você apagar o bloco, perde o arquivo.

---

## 5. FAQ — como adicionar/editar

**Arquivo fonte**: [html/faq.html](html/faq.html).

**Onde aparece no Moodle**: bloco HTML em página dedicada (ex.: página estática "FAQ" criada via Administração → Páginas, ou bloco numa categoria de cursos).

**Estrutura**: accordion Bootstrap 5 nativo do Moodle. Wrapper `<div id="funpFaq" class="accordion">`. Cada pergunta é um `.accordion-item` com IDs únicos `funpFaqH{N}` (header) e `funpFaqC{N}` (collapse). O `data-bs-target` do button precisa casar com o `id` do `.accordion-collapse`.

### Snippet pronto para nova pergunta

Substitua `{N}` por um número sequencial (próximo disponível), `{PERGUNTA}` pelo título da pergunta e `{RESPOSTA_HTML}` por parágrafos `<p>` / listas `<ul>`.

```html
<div class="accordion-item">
  <h2 id="funpFaqH{N}" class="accordion-header">
    <button class="accordion-button collapsed" type="button"
            data-bs-toggle="collapse" data-bs-target="#funpFaqC{N}"
            aria-expanded="false" aria-controls="funpFaqC{N}">
      {PERGUNTA}
    </button>
  </h2>
  <div id="funpFaqC{N}" class="accordion-collapse collapse"
       aria-labelledby="funpFaqH{N}" data-bs-parent="#funpFaq">
    <div class="accordion-body">
      {RESPOSTA_HTML}
    </div>
  </div>
</div>
```

### Checklist ao adicionar

- [ ] `N` é único (próximo número da sequência)
- [ ] `data-bs-target="#funpFaqC{N}"` casa com `id="funpFaqC{N}"`
- [ ] `aria-labelledby="funpFaqH{N}"` casa com `id="funpFaqH{N}"`
- [ ] `data-bs-parent="#funpFaq"` mantido (garante que abrir uma fecha as outras)
- [ ] Recomendado salvar com editor em **modo texto puro** para garantir que `data-bs-toggle` / `data-bs-target` não sofram alteração — ver seção 7 (Opção C)

---

## 6. Plugin autoenrol

Repositório: <https://github.com/bobopinna/moodle-enrol_autoenrol> (fork mantido por Roberto Pinna a partir do `markward/enrol_autoenrol`).

### O que faz

Plugin de método de inscrição que **auto-matricula** o usuário em um curso quando ele:

- Faz login no Moodle, **ou**
- Clica no curso

Útil para cursos de acesso amplo (ex.: trilhas abertas) e, com **filtros**, para acesso reservado por critério (campo de perfil, idioma, método de autenticação).

### Instalação

1. Copiar o diretório `autoenrol/` em `moodle/enrol/`
2. Acessar a área de notificações de admin → instalar quando solicitado
3. **Administração do site → Plugins → Inscrições** → clicar no ícone de olho ao lado de **Auto Enrol** para habilitar
4. Em cada curso onde for usar: aba **Participantes → Métodos de inscrição → Adicionar método → Auto Enrol** e configurar regras

### Configuração

- O plugin expõe **2 capabilities** que controlam quem pode adicionar/configurar a inscrição automática.
- Filtros usam a **interface de availability do Moodle** (a mesma das restrições de acesso) — permite filtrar por campo de perfil, datas, etc.
- Filtros adicionais úteis:
  - Por idioma → requer plugin extra [availability_language](https://moodle.org/plugins/availability_language)
  - Por método de autenticação → requer plugin extra [availability_auth](https://github.com/bobopinna/moodle-availability_auth)

### Onde aparece no front-end

URL: `/enrol/index.php?id=<courseid>` (body `#page-enrol-index`). O CSS custom para essa página está em [style.css](style.css) seção 6 — não depende do plugin estar habilitado, mas só aparece quando há uma instância autoenrol (ou outra inscrição que use a mesma estrutura DOM) configurada no curso.

### Docs

- Plugin: <https://github.com/bobopinna/moodle-enrol_autoenrol>
- Moodle docs (Métodos de inscrição em geral): <https://docs.moodle.org/en/Enrolment_methods>

---

## 7. Editando blocos HTML — TinyMCE x texto puro

**Problema real**: ao tentar editar o **bloco do footer** (e em menor grau o do FAQ), os controles de edição do bloco simplesmente **não aparecem** na tela — o bloco fica visível, mas os ícones de configuração/lápis ficam fora do viewport ou sobrepostos pelo layout do tema. Não é sanitização do TinyMCE; é só que o painel admin do bloco não está renderizando os menus de forma acessível.

### Soluções (qualquer uma resolve)

**Opção A — Zoom out extremo no navegador** (mais rápido)

1. `Ctrl + -` várias vezes (Cmd + - no macOS), até o zoom ficar em ~25–33%.
2. Os menus de configuração do bloco aparecem (geralmente fora do viewport em zoom 100%).
3. Clique em configurar → editar conteúdo do bloco.
4. Volte o zoom ao normal depois.

**Opção B — Editar pela URL direta do bloco**

Como descrito na seção 4, acesse `<https://ead.funprespjud.com.br/?bui_editid=<id>>` com o `bui_editid` do bloco. Isso pula a renderização da home e abre direto o formulário de edição do bloco.

| Bloco | URL |
|---|---|
| Hero | `?bui_editid=174` |
| Sobre | `?bui_editid=175` |
| Footer / FAQ | descobrir o `bui_editid` na primeira vez via Opção A → registrar aqui |

**Opção C — Trocar o editor para "Área de texto simples"** (recomendado para markup complexo)

O TinyMCE preserva markup bem na maioria dos casos, mas se você quiser garantia de que classes, `data-*` e nesting não vão sofrer, troque o editor:

1. Menu do usuário (canto superior direito) → **Preferências** (`/user/preferences.php`)
2. **Preferências do usuário → Preferências do editor**
3. **Editor de texto**: trocar de `TinyMCE / Atto` → **Área de texto simples** (`textarea`)
4. Salvar → reabrir o bloco e colar o HTML cru de [html/footer.html](html/footer.html) (ou [html/faq.html](html/faq.html), etc.)
5. Opcional: voltar para TinyMCE depois. A preferência é por usuário, então não afeta outros editores.

### Onde cada opção faz sentido

- **Footer**: Opção A ou B para alcançar o menu; Opção C se preferir editar como texto puro.
- **FAQ**: Opção C recomendada (`data-bs-toggle` / `data-bs-target` são críticos para o accordion).
- **Hero / Sobre**: Opção B (URL direta) é a mais prática.
- Descrições de curso, fóruns, posts: TinyMCE normal — sem necessidade de mudar nada.

---

## 8. JS customizado (script.js)

[script.js](script.js) tem 4 IIFEs (Immediately Invoked Function Expressions) independentes. Cada um se auto-detecta pela URL/body id e não roda fora do escopo. Colar inteiro no campo **Custom JS** do Lambda.

### Bloco 1 — Progress bar em "Meus cursos"

- Roda em: páginas com `block_myoverview` (ex.: `/my/courses.php`)
- O que faz:
  - Lê `.progress-text` de cada `.course-card` → extrai o número `%`
  - Seta `--progress: <N>%` como CSS var no card (a barra `::after` em `style.css` lê essa var para a largura do preenchimento)
  - Seta `data-status` no card: `naoiniciado` (0%), `andamento` (1–99%), `concluido` (100%)
  - Cria um `MutationObserver` em `[data-region="courses-view"]` — re-aplica quando o usuário troca filtro (re-render AJAX dos cards)

### Bloco 2 — Login split-screen

- Roda em: `body#page-login-index`
- O que faz:
  - Pega `.loginform` original do Moodle
  - Cria `.funp-login-wrapper` com painel `aside.funp-login-brand` (esquerda) + `section.funp-login-form` (direita)
  - Move `.loginform` (e `.loginform-toggle` se existir) para o painel direito
  - Anexa o wrapper direto no `<body>` (escapa qualquer container Bootstrap)
  - Esconde `#page-wrapper` original (com header, nav, etc.)
  - Marca `body.funp-login-active` (CSS escopado em `.funp-login-active` pode ser adicionado se necessário)

### Bloco 3 — Signup split-screen

- Roda em: `body#page-login-signup`
- Idêntico ao bloco 2, mas opera em `.signupform` e usa copy diferente no painel brand ("Crie sua conta — Comece sua jornada").

### Bloco 4 — CPF + telefone (global)

- Roda em: qualquer página
- O que faz:
  - **Renomeia labels**: troca todo texto "Nome de usuário" / "Username" → **"CPF"** em labels associadas a inputs `username`
  - **Máscara CPF visual** (`000.000.000-00`) nos inputs `username`, `#id_username`, `#username`, `input[name="profile_field_CPF"]`, `#id_profile_field_CPF`
    - `maxlength=14`, `inputmode=numeric`
    - Se o input já tem texto com letras (usuário antigo `joao.silva`), **respeita e não formata** — compat com usuários criados antes da padronização
  - **Máscara telefone BR** (`(XX) XXXXX-XXXX`) em qualquer input com `telefone` no `name` ou `id`
    - `maxlength=15`, `inputmode=tel`
  - **Submit hook**: antes de enviar o form, limpa a formatação do CPF (Moodle recebe `12345678901`, não `123.456.789-01`). Não toca em valores com letras.

---

## 9. CSS customizado (style.css)

[style.css](style.css) tem ~2400 linhas, organizado em 8 seções comentadas. Colar inteiro no campo **Custom CSS** do Lambda.

### Estrutura

| # | Seção | Escopo |
|---|---|---|
| 1 | Base & tipografia | global |
| 2 | Home pública | `#page-site-index` |
| 3 | Cursos disponíveis (frontpage course list) | `#page-site-index .coursebox` |
| 4 | Meus cursos | `body#page-my-index` |
| 5 | Login (v3 + v3.4) | `body#page-login-index` |
| 6 | Auto-inscrição | `body#page-enrol-index` |
| 7 | Signup | `body#page-login-signup` |
| 8 | Footer global | `.funp-footer-*`, `.funp-copyright-*` |

### Por que tanto `!important`

O Lambda aplica estilos com seletores muito específicos (ex.: `.block_myoverview > .card-body > h3.card-title`) e, em alguns pontos, estilos inline via Bootstrap utilities. Para vencer essa especificidade sem caçar cada seletor exato do Lambda, as overrides usam `!important` — escopadas em `body#page-<id>` para evitar vazamento.

Regra prática: se adicionar nova regra, **ancorar sempre em `body#page-<id>`** e usar `!important` quando o Lambda já estiver impondo o valor. Não usar `!important` em utilitários novos (`.funp-*`) — esses são markup nosso, sem conflito.

### Cuidados

- **Não remover** as regras de `overflow: visible` na cadeia de containers da home (`#page`, `#page-content`, `#region-main-box`, `.card.card-block`, etc.) — o hero full-bleed deixa de funcionar.
- **Não remover** o `html, body { overflow-x: hidden }` global — o truque `100vw` causa scroll horizontal sem ele.
- **Não remover** o `MutationObserver` em meus cursos — sem ele, ao trocar filtro a barra de progresso some.
