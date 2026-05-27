# Moodle FUNPRESP-JUD — Configurações

Documentação operacional da plataforma EaD FUNPRESP-JUD: identidade visual, configurações do tema do Moodle, blocos de conteúdo customizados, plugin de auto-inscrição e procedimentos de manutenção.

O portal usa **Moodle** com o tema **Lambda**. Em cima do Lambda foram aplicadas customizações de CSS, JavaScript e blocos HTML para entregar a experiência institucional da FUNPRESP-JUD (hero, atalhos, "Conheça a plataforma", FAQ, footer, layouts de login/cadastro/inscrição).

---

## Sumário

- [Glossário](#glossário)
1. [Identidade visual (geral)](#1-identidade-visual-geral)
2. [Tema Lambda — Configurações](#2-tema-lambda--configurações)
3. [Customizações por página](#3-customizações-por-página)
4. [Imagens de fundo (hero / sobre)](#4-imagens-de-fundo-hero--sobre)
5. [FAQ — como adicionar/editar](#5-faq--como-adicionareditar)
6. [Plugin autoenrol](#6-plugin-autoenrol)
7. [Editando blocos HTML — TinyMCE x texto puro](#7-editando-blocos-html--tinymce-x-texto-puro)
8. [JS customizado](#8-js-customizado)
9. [CSS customizado](#9-css-customizado)

---

## Glossário

Termos curtos que aparecem no documento. Volte aqui quando esbarrar com um.

| Termo | Significado |
|---|---|
| **CTA** | *Call-to-action*. Botão ou link cuja função é levar o usuário a uma ação principal (ex.: "Acessar plataforma", "Inscreva-me", "Conhecer a Funpresp-Jud"). Não confundir com link de navegação comum. |
| **CTA marketing** | CTA das páginas institucionais (hero, sobre). No portal hoje usa **amber** (`#fbba00` fundo, `#2a1d00` texto). |
| **CTA de form** | Botão de submit em formulários do Moodle (login, signup, inscrição). Continua **azul primário** (`#0578be`) porque é estilizado sobre o markup nativo do Moodle. |
| **Eyebrow** | Rótulo curto em CAIXA ALTA, letter-spacing largo, posicionado acima de um título. Funciona como categoria/contexto. Pode ser amarelo (`#fbba00`, fundos escuros) ou azul (`#0578be`, fundos claros). |
| **Lede** | Parágrafo de abertura logo abaixo do título principal — texto mais denso que resume a seção. |
| **Full-bleed** | Conteúdo que sai do container central (max-width: 1320px) e ocupa **100% da largura da tela**. Usado no hero e nas faixas de fundo. |
| **Bloco HTML** | Tipo de bloco do Moodle (`block_html`) que aceita markup HTML cru. Usado para hero, sobre, FAQ, footer — qualquer conteúdo customizado fora do fluxo padrão do tema. |
| **`bui_editid`** | *Block UI edit id* — id da **instância** do bloco na página. Vai na URL `?bui_editid=<n>` para abrir o formulário de edição direto, pulando a renderização da home. |
| **Lambda** | Tema do Moodle usado no portal (`theme_lambda2`). Define o "chrome" (header, nav, footer, layouts de página). As customizações são overrides em cima dele. |
| **Custom CSS / Custom JS** | Campos do admin do Lambda onde o CSS e o JavaScript customizados são colados na íntegra. Ver seção 2.8. |
| **Split-screen** | Layout de duas colunas usado em login e signup: painel "brand" escuro à esquerda + formulário à direita. Montado em runtime por JavaScript. |
| **mform** | Sistema de formulários do Moodle. Por padrão entrega label + input em layout horizontal (grid Bootstrap). Várias regras CSS empilham isso em vertical no cadastro. |
| **Eyebrow breadcrumb** | Texto pequeno em maiúsculas tipo "INÍCIO › MEUS CURSOS" injetado via CSS no header de páginas internas. Não é o breadcrumb real do Moodle. |
| **Pluginfile** | Endpoint do Moodle (`pluginfile.php/<context>/...`) que serve arquivos enviados pelo gerenciador de arquivos. Hospeda as imagens de fundo do hero e do sobre. |
| **`!important`** | Modificador CSS que vence regras com mesma especificidade. Usado abundantemente para sobrescrever o Lambda — sempre escopado em `body#page-<id>` para não vazar. |

---

## 1. Identidade visual (geral)

Fonte única de verdade para cores e fontes. Usar exatamente estes valores nos campos do Lambda e nos blocos HTML — não inventar tons novos.

### 1.1 Paleta

| Token | Hex | Uso |
|---|---|---|
| Azul primário | `#0578be` | CTA de form, links, hover de cards, eyebrows azuis |
| Azul hover | `#0e509a` | Estado :hover dos CTAs e links |
| Azul marinho | `#0f2137` | Texto principal escuro, fundo do hero, fundo do footer |
| Amber brand | `#fbba00` | CTA marketing, eyebrows amarelos, destaques no painel brand do login |
| Cinza texto | `#1a1a1a` | Headings e body neutros (tema light) |
| Cinza fundo claro | `#f5f5f5` / `#f5f6f8` | Fundos de seções alternadas, fundo de página interna |
| Borda neutra | `#ededed` / `#d8dde3` | Bordas de cards, inputs, divisores |
| Verde concluído | `#2a8e4e` | Badge "Concluído" em meus cursos |
| Cinza não iniciado | `#888` | Badge "Não iniciado" em meus cursos |

### 1.2 Tipografia

- **Família**: Open Sans (carregada via Google Fonts pelo Lambda — campos `font_body` e `font_heading`)
- **Body text size**: 14px
- **Headings**: weight 700–800, mesma família
- **Eyebrows** (rótulos amarelos/azuis pequenos): 10–12px, letter-spacing 1.5–3px, uppercase, weight 600–700

### 1.3 Onde aplicar cada cor

Padrão atual de CTA é **amber** para landing/marketing e **azul** apenas para botões de submit dos formulários do Moodle.

**CTAs (botões de ação principal)**

| Contexto | Cor fundo | Cor texto | Onde aparece |
|---|---|---|---|
| CTA marketing (hero, sobre) | `#fbba00` | `#2a1d00` | Home — "Acessar plataforma", "Conhecer a Funpresp-Jud" |
| CTA de form Moodle (submit) | `#0578be` (hover `#0e509a`) | `#ffffff` | Login, signup, inscrição |
| Link textual com sublinhado amarelo | transparente | `#ffffff` (borda inferior amber) | "explorar o catálogo →" no bloco sobre |

> Existem variações de botão azul-cheio, azul-outline e dark-cheio definidas no CSS que **não estão mais sendo usadas nas páginas atuais** — sobreviveram de versões anteriores. Não usar para CTAs novos; padrão é amber.

**Outras cores**

- Fundo escuro (hero, painel brand do login, footer): `#0f2137`
- Fundo "Conheça a plataforma": overlay escuro `#0a1a2e` ~88% sobre imagem (variante V13)
- Eyebrow amarelo (sobre fundos escuros): `#fbba00`
- Eyebrow azul (sobre fundos claros, ex.: categoria do curso, "INSCRIÇÃO"): `#0578be`
- Eyebrow amarelo de breadcrumb interno ("INÍCIO › MEUS CURSOS"): `#fbba00`
- Links em texto corrido: `#0578be`, hover `#0e509a`
- Bordas de cards: `#ededed`; bordas de inputs: `#d8dde3`
- Linha de footer/copyright: fundo `#0a1626`, texto `#94a3b8`
- Footer link headings: `#4ea8e0` (azul claro, sobre fundo `#0f2137`)

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

> O **conteúdo** do footer (texto, colunas, logos) é controlado pelo HTML colado num bloco do tema. Ver seção 7 sobre como acessar os menus de edição do bloco.

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

- **Custom CSS**: Lambda → aba **Custom CSS** → colar o CSS customizado na íntegra.
- **Custom JS**: Lambda → aba **Custom JS** (ou campo `additionalcustomscript` dependendo da versão) → colar o JavaScript customizado na íntegra.
- Após salvar: **Purge all caches** (Administração → Desenvolvimento → Purgar todos os caches).

---

## 3. Customizações por página

Cada página tem um seletor de body (`#page-<id>`) usado como âncora no CSS. Toda override é escopada por esse seletor para não vazar para outras páginas.

### 3.1 Home pública (`#page-site-index`)

Composta por blocos HTML do Moodle + listagem de cursos do Lambda.

| Bloco | Onde aparece |
|---|---|
| Hero + atalhos | Bloco HTML acima da listagem de cursos |
| Conheça a plataforma | Bloco HTML abaixo da listagem de cursos |
| FAQ | Bloco HTML em página dedicada (ver seção 5) |

Pontos de atenção (técnico):

- O Lambda envolve blocos em `.card.card-block` com `overflow: hidden` — o CSS força `overflow: visible` na cadeia inteira de containers para permitir o full-bleed do hero.
- O hero, a faixa de atalhos e o "Conheça a plataforma" usam o truque `width: 100vw` + `margin-left/right: -50vw` para sair da container Bootstrap e ocupar a tela toda.
- Tabs administrativas (Configurações/Participantes/Relatórios) ficam escondidas via `.secondary-navigation { display: none }`.

### 3.2 Meus cursos (`#page-my-index`, `/my/courses.php`)

Layout reescrito: page header limpo com eyebrow "INÍCIO › MEUS CURSOS", filtros como pills, grid 3 colunas, cards minimalistas com barra de progresso e badge de status.

- Barra de progresso e badge são desenhadas via CSS (`::before` + `::after`) em `.progress-text` / `.card-img-top`. A largura do preenchimento vem de uma CSS var `--progress` setada por JavaScript.
- O JS lê o `% concluído` do texto, seta `--progress` e `data-status` (`naoiniciado` / `andamento` / `concluido`) em cada card. Re-aplica via `MutationObserver` quando o usuário troca filtro (re-render AJAX).

### 3.3 Login (`#page-login-index`, `/login/index.php`)

Layout split-screen (painel brand à esquerda, formulário à direita) montado em runtime por JavaScript.

- O JS pega `.loginform` original do Moodle, cria `.funp-login-wrapper` direto no `<body>`, move o form para o painel direito e esconde o `#page-wrapper` antigo (com header, nav, etc.).
- Para mudar o copy do painel esquerdo: editar o template do `brand.innerHTML` no bloco de login do JS customizado.

### 3.4 Signup (`#page-login-signup`, `/login/signup.php`)

Mesmo padrão split-screen do login, com painel direito scrollable (form é longo). Inclui várias regras CSS específicas para o `mform` empilhar label + input em vertical (Moodle entrega `.col-md-3` + `.col-md-9` horizontal por padrão).

Há também tratamento global de **CPF + telefone** (descrito na seção 8).

### 3.5 Auto-inscrição (`#page-enrol-index`, `/enrol/index.php?id=<courseid>`)

Página servida pelo plugin **autoenrol** (ver seção 6). Estilizada como dois cards empilhados:

1. **Card do curso** — banner 280px + categoria como eyebrow azul + título grande + descrição.
2. **Card do form de inscrição** — borda esquerda azul + eyebrow "INSCRIÇÃO" + botão "Inscreva-me" full azul.

O header da página é o `#lambda-incourse-header` do tema — recebe breadcrumb-eyebrow amarelo "INÍCIO › CURSOS › INSCRIÇÃO" via CSS `::before`.

### 3.6 Footer global

- Grid 3 colunas (`.funp-footer-grid`): logo institucional · links Funpresp-Jud/Privacidade · "Onde estamos".
- Faixa de copyright (`.funp-copyright-row`) full-width fora do container, com fundo `#0a1626`.

> **Importante**: os menus de edição do bloco do footer podem não aparecer no layout normal. Ver seção 7 para alcançá-los (zoom out, URL direta `bui_editid`, ou trocar editor para texto simples).

---

## 4. Imagens de fundo (hero / sobre)

Os banners de fundo do **hero** (home) e do **"Conheça a plataforma"** não são `<img>` no HTML — são definidos como **`background-image`** em classes CSS dedicadas.

| Bloco | Classe CSS | URL atual da imagem |
|---|---|---|
| Hero (topo da home) | `.funp-hero-bg` | `https://ead.funprespjud.com.br/pluginfile.php/601/block_html/content/Banner-Hero%20%281%29.png` |
| Sobre / Conheça | `.funp-known.funp-known-v13` | `https://ead.funprespjud.com.br/pluginfile.php/602/block_html/content/Banner-Institucional%20%281%29.png` |

### Por que ficam dentro de `pluginfile.php/<id>/block_html/content/`

Cada bloco HTML do Moodle tem um **id interno** (`601` para o hero, `602` para o sobre — visíveis no path). Quando você faz upload de uma imagem dentro do editor do bloco, ela é armazenada em `pluginfile.php/<id>/block_html/content/<nome-do-arquivo>`. Por isso a URL contém o id do bloco.

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
3. O Moodle gera a URL final automaticamente, no formato `pluginfile.php/<id>/block_html/content/<nome>.png`.
4. Pedir ao dev para atualizar a URL no CSS customizado nas duas classes:
   - `.funp-hero-bg` (background-image do hero)
   - `.funp-known.funp-known-v13` (background composto do sobre)
5. Salvar → **Purgar caches** (Administração → Desenvolvimento → Purgar todos os caches).

### Observações

- **Dimensões recomendadas**: largura mínima `1920px`, altura `~720px` (hero) / `~480px` (sobre). Imagens menores ficam borradas em telas grandes.
- **Formato**: PNG ou JPG. PNG só se for arte com transparência/elementos gráficos; JPG para fotos institucionais (peso menor).
- **Evitar espaços no nome**: o Moodle aceita arquivos com espaços, mas a URL fica com `%20`. Para evitar confusão, **renomeie sem espaços** (`Banner-Hero.png` em vez de `Banner Hero.png`).
- A imagem **não é referenciada no HTML do bloco** — o bloco serve só como "container" para hospedar o arquivo. Se o bloco for apagado, o arquivo se perde.

---

## 5. FAQ — como adicionar/editar

**Onde aparece**: bloco HTML em página dedicada (ex.: página estática "FAQ" criada via Administração → Páginas, ou bloco numa categoria de cursos).

**Estrutura**: accordion Bootstrap 5 nativo do Moodle. Wrapper `<div id="funpFaq" class="accordion">`. Cada pergunta é um `.accordion-item` com IDs únicos `funpFaqH{N}` (header) e `funpFaqC{N}` (collapse). O `data-bs-target` do botão precisa casar com o `id` do `.accordion-collapse`.

### Snippet pronto para nova pergunta

Substitua `{N}` por um número sequencial (próximo disponível), `{PERGUNTA}` pelo título e `{RESPOSTA_HTML}` por parágrafos `<p>` ou listas `<ul>`.

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
- [ ] `data-bs-parent="#funpFaq"` mantido (garante que abrir uma pergunta fecha as outras)
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

URL: `/enrol/index.php?id=<courseid>` (body `#page-enrol-index`). Estilização descrita na seção 3.5. A página existe apenas quando há uma instância autoenrol (ou outra inscrição que use a mesma estrutura DOM) configurada no curso.

### Docs

- Plugin: <https://github.com/bobopinna/moodle-enrol_autoenrol>
- Moodle docs (Métodos de inscrição em geral): <https://docs.moodle.org/en/Enrolment_methods>

---

## 7. Editando blocos HTML — TinyMCE x texto puro

**Problema real**: ao tentar editar o **bloco do footer** (e em menor grau o do FAQ), os controles de edição do bloco simplesmente **não aparecem** na tela — o bloco fica visível, mas os ícones de configuração/lápis ficam fora do viewport ou sobrepostos pelo layout do tema. Não é sanitização do editor; é só que o painel admin do bloco não está renderizando os menus de forma acessível.

### Soluções (qualquer uma resolve)

**Opção A — Zoom out extremo no navegador** (mais rápido)

1. `Ctrl + -` várias vezes (Cmd + - no macOS), até o zoom ficar em ~25–33%.
2. Os menus de configuração do bloco aparecem (geralmente fora do viewport em zoom 100%).
3. Clique em configurar → editar conteúdo do bloco.
4. Volte o zoom ao normal depois.

**Opção B — Editar pela URL direta do bloco**

Acesse `https://ead.funprespjud.com.br/?bui_editid=<id>` com o `bui_editid` do bloco. Isso pula a renderização da home e abre direto o formulário de edição do bloco.

| Bloco | URL |
|---|---|
| Hero | `?bui_editid=174` |
| Sobre | `?bui_editid=175` |
| Footer / FAQ | descobrir o `bui_editid` na primeira vez via Opção A → registrar aqui |

**Opção C — Trocar o editor para "Área de texto simples"** (recomendado para markup complexo)

O TinyMCE preserva markup bem na maioria dos casos, mas se houver receio de que classes, `data-*` e nesting sejam alterados, troque o editor:

1. Menu do usuário (canto superior direito) → **Preferências** (`/user/preferences.php`)
2. **Preferências do usuário → Preferências do editor**
3. **Editor de texto**: trocar de `TinyMCE / Atto` → **Área de texto simples** (`textarea`)
4. Salvar → reabrir o bloco e colar o HTML cru
5. Opcional: voltar para TinyMCE depois. A preferência é por usuário, então não afeta outros editores.

### Onde cada opção faz sentido

- **Footer**: Opção A ou B para alcançar o menu; Opção C se preferir editar como texto puro.
- **FAQ**: Opção C recomendada (`data-bs-toggle` / `data-bs-target` são críticos para o accordion).
- **Hero / Sobre**: Opção B (URL direta) é a mais prática.
- Descrições de curso, fóruns, posts: TinyMCE normal — sem necessidade de mudar nada.

---

## 8. JS customizado

O JavaScript customizado é colado no campo **Custom JS** do Lambda (seção 2.8). É composto por 4 IIFEs (Immediately Invoked Function Expressions) independentes. Cada um se auto-detecta pela URL/body id e não roda fora do escopo.

### Bloco 1 — Progress bar em "Meus cursos"

- Roda em: páginas com `block_myoverview` (ex.: `/my/courses.php`)
- O que faz:
  - Lê `.progress-text` de cada `.course-card` → extrai o número `%`
  - Seta `--progress: <N>%` como CSS var no card (a barra é desenhada via `::after` no CSS, que lê essa var para definir a largura do preenchimento)
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
  - Marca `body.funp-login-active` (escopo CSS adicional pode ser anexado a essa classe se necessário)

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

## 9. CSS customizado

O CSS customizado é colado no campo **Custom CSS** do Lambda (seção 2.8). Aproximadamente 2400 linhas, organizado em 8 seções comentadas.

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

Regra prática: ao adicionar nova regra, **ancorar sempre em `body#page-<id>`** e usar `!important` quando o Lambda já estiver impondo o valor. Não usar `!important` em utilitários novos (`.funp-*`) — esses são markup nosso, sem conflito.

### Cuidados

- **Não remover** as regras de `overflow: visible` na cadeia de containers da home (`#page`, `#page-content`, `#region-main-box`, `.card.card-block`, etc.) — o hero full-bleed deixa de funcionar.
- **Não remover** o `html, body { overflow-x: hidden }` global — o truque `100vw` causa scroll horizontal sem ele.
- **Não remover** o `MutationObserver` em meus cursos (no JS) — sem ele, ao trocar filtro a barra de progresso some.
