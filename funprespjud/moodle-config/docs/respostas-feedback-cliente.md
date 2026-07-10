# Respostas ao Feedback do Cliente — UX do Portal Educa Funpresp-Jud

> **Status:** respostas finalizadas para envio. Pendências restantes (itens 2
> e 5) dependem de decisão do cliente e de verificação no painel admin do
> Moodle — não de código deste repositório.
>
> Cada item traz: a **resposta sugerida** (texto pronto para envio ao cliente)
> e uma **nota interna** (o que é nativo do Moodle vs. ajustável por nós, e o
> status do ajuste).

---

## 1. Dois acessos para a plataforma (login no topo + botão "Acessar plataforma")

**Pergunta do cliente:** A duplicidade de caminhos não pode gerar dúvidas?
Qual o objetivo de manter dois acessos distintos para a mesma funcionalidade?
Ao acessar o link já autenticado, a página apresentada estava em branco.

**Resposta sugerida:**

> Os dois acessos têm papéis distintos e seguem um padrão consolidado em
> portais com área logada: o login no canto superior atende ao usuário
> recorrente, que já conhece a plataforma e quer entrar rapidamente; o botão
> "Acessar plataforma" é o call-to-action principal da página, pensado para o
> visitante que chega pela primeira vez e percorre o conteúdo institucional
> antes de decidir entrar. Ambos levam à mesma tela de login — que centraliza
> tanto a autenticação quanto a criação de conta — justamente para que exista
> um único ponto de entrada, independentemente de onde o usuário clique. Não
> há duplicidade de funcionalidade, e sim múltiplos pontos de acesso à mesma
> porta, o que reduz a fricção para perfis diferentes de usuário.
>
> Quanto à página em branco ao acessar o link já autenticado: trata-se de um
> comportamento incorreto que identificamos e será corrigido. Adicionalmente,
> vamos ajustar o botão para que, quando o usuário já estiver autenticado, ele
> direcione diretamente ao painel de cursos, eliminando essa quebra.
>
> Vale registrar que, para o usuário autenticado, o destino "Meus cursos"
> também está disponível no menu superior — que é a navegação nativa do
> Moodle, presente em todas as páginas. A coexistência é intencional e cumpre
> papéis distintos: o menu é a navegação sistemática, sempre no mesmo lugar,
> de baixa proeminência visual; o botão do hero é a ação principal da página,
> posicionada no fluxo natural de leitura (identidade → mensagem → ação). O
> usuário que chega à home não precisa procurar no menu o próximo passo — o
> destaque visual do botão o conduz diretamente. Esse tipo de redundância
> deliberada entre navegação estrutural e call-to-action contextual é prática
> recomendada de usabilidade, justamente por atender padrões diferentes de
> leitura da página.

**Nota interna:**

- **Página em branco = bug nosso.** O CSS da seção 5.1 (`style.css`) esconde
  todo o chrome do Moodle em `body#page-login-index` incondicionalmente.
  Quando um usuário já logado acessa `/login/index.php`, o Moodle renderiza a
  página "você já está logado" com o mesmo body id, mas sem `.loginform` — o
  `script.js` aborta e nunca monta o wrapper split-screen. Resultado: tudo
  escondido, nada no lugar → tela branca.
  - **Fix aplicado:** script.js agora detecta a página "já logado" (sem
    `.loginform`): usuário autenticado é redirecionado para `/my/`; se o
    markup do Lambda mudar, a classe `.funp-login-fallback` reexibe a página
    nativa (CSS 5.1/7.1 com `:not(.funp-login-fallback)`). Mesmo fallback no
    signup.
  - **Status:** ✅ implementado — validar em homologação
- **CTA inteligente para usuário logado:** via `script.js` (seção 5), o botão
  do hero passa a apontar para `/my/` com label "Ir para meus cursos" quando
  o body não tem `.notloggedin`.
  - **Status:** ✅ implementado — validar em homologação
- **CTA vs. item "Meus cursos" do menu:** o menu superior é navegação nativa
  do Moodle (presente em todas as páginas). A redundância com o CTA do hero é
  intencional — menu = navegação sistemática, CTA = ação principal no fluxo
  de leitura. Argumentação incluída na resposta sugerida acima.

---

## 2. "Catálogo" vs "Cursos disponíveis"

**Pergunta do cliente:** Qual a diferença entre "Catálogo" e "Cursos
disponíveis"? É necessário exigir autenticação só para visualizar cursos? Por
que a ordem dos cursos difere entre o Catálogo e a página inicial?

**Resposta sugerida:**

> A seção "Cursos disponíveis" é a vitrine nativa da página inicial do Moodle
> — uma amostra dos cursos para quem chega ao portal. O "Catálogo" é a página
> completa de exploração, com a relação integral de cursos. A vitrine da home
> tem limite de exibição definido pelo Moodle; o Catálogo não. À medida que a
> oferta de cursos crescer, essa distinção ficará mais evidente: a home mostra
> destaques, o Catálogo mostra tudo.
>
> Dito isso, a observação é pertinente para o estágio atual, em que o volume
> de cursos faz as duas áreas parecerem idênticas. Podemos avaliar dois
> caminhos: (a) reduzir a vitrine da home a poucos destaques, reforçando o
> Catálogo como caminho principal; ou (b) remover a seção da home e manter
> apenas o card de Catálogo. A ordenação divergente entre as duas áreas também
> será alinhada.
>
> Sobre exigir login para visualizar cursos: há aqui uma limitação técnica do
> plugin de Catálogo utilizado na plataforma, que obrigatoriamente exige
> usuário autenticado para ser acessado — por isso, para o visitante não
> logado, tanto o item "Catálogo de Cursos" do menu quanto os acessos à
> plataforma conduzem à tela de login. Esse comportamento é do plugin, não
> uma escolha de fluxo nossa. É justamente por isso que a seção "Cursos
> disponíveis" da página inicial tem valor para o visitante: ela é a vitrine
> pública dos cursos, visível sem qualquer autenticação. Para a visualização
> das descrições dos cursos sem login, o Moodle permite liberar esse acesso
> (a autenticação passa a ser exigida apenas para inscrever-se ou acessar o
> conteúdo) — é uma configuração administrativa que podemos habilitar, se for
> o entendimento da Fundação.

**Nota interna:**

- **O que é a seção "Cursos disponíveis":** é o course list nativo da
  frontpage do Moodle, renderizado pelo tema Lambda (estilizado pelo nosso
  CSS §3). Não é bloco HTML custom — conteúdo, limite e ordem vêm do core.
- Tudo configuração de admin do Moodle, não CSS:
  - Limite da vitrine: `frontpagecourselimit` + itens da frontpage.
  - Visualização sem login: `forcelogin` / acesso visitante por curso.
  - Ordenação: frontpage usa o sortorder da gestão de cursos; o plugin
    `local/coursecatalog` ordena por critério próprio — alinhar na config do
    plugin.
- **Restrição do plugin de catálogo:** `local/coursecatalog` exige usuário
  autenticado — não há como liberar o Catálogo para visitante. A vitrine
  "Cursos disponíveis" da home é o único caminho público de descoberta de
  cursos; argumento a favor de mantê-la (pesa na decisão vitrine vs. remover
  do item acima).
- Decisão de produto (vitrine reduzida vs. remover seção) é do cliente.
- **Status:** ⬜ aguardando decisão do cliente + acesso admin

---

## 3. "Meus cursos" — separar em andamento de concluídos + filtros

**Pergunta do cliente:** Seria mais adequado separar cursos em andamento dos
concluídos, com os em andamento no topo, e disponibilizar filtros (em
andamento / finalizados / todos).

**Resposta sugerida:**

> A funcionalidade sugerida já está disponível na plataforma: a área "Meus
> cursos" possui, nativamente, o seletor de filtros no topo da listagem, com
> as opções "Todos", "Em andamento", "Não iniciados", "Encerrados",
> "Favoritos" e "Removido da visualização", além do campo de busca por nome
> do curso. Com o filtro "Em andamento", o usuário visualiza imediatamente
> apenas os cursos que demandam continuidade, exatamente como proposto. A
> seleção fica registrada para os próximos acessos, de modo que cada usuário
> pode manter a visualização que preferir como padrão.

**Nota interna:**

- Filtros são nativos do bloco Course Overview / página "My courses" do
  Moodle 4.x. **Verificado em produção: já estão expostos** — Todos, Em
  andamento, Não iniciados, Encerrados, Favoritos, Removido da visualização,
  além do campo Buscar.
- Agrupamento em duas seções empilhadas (andamento em cima, concluídos
  embaixo) **não é nativo** — exigiria customização maior; os filtros
  resolvem a maior parte do pedido.
- **Status:** ✅ resolvido — filtros nativos já disponíveis; resposta ao
  cliente pode apontar para eles

---

## 4. Conteúdo do curso duplicado (área central + menu lateral)

**Pergunta do cliente:** Existe motivo para manter as etapas do curso tanto no
menu lateral quanto na área central? Outras plataformas EaD apresentam os
módulos apenas no menu lateral.

**Resposta sugerida:**

> Essa é a arquitetura padrão do Moodle 4: a área central é a página do curso
> propriamente dita — onde ficam descrições, imagens, instruções e o estado de
> conclusão de cada atividade — enquanto o índice lateral é um auxiliar de
> navegação compacto, que mostra estrutura e progresso e permite saltar entre
> seções. Eles coexistem porque cumprem papéis diferentes: o índice orienta, a
> área central apresenta. Esse comportamento é nativo da plataforma e sua
> remoção exigiria desenvolvimento de tema, com risco de afetar atualizações
> futuras do Moodle.
>
> O que podemos fazer dentro do escopo atual é reduzir a redundância
> percebida: simplificar as descrições na área central e evitar repetir ali
> textos que já constam no vídeo de apresentação.

**Nota interna:**

- Course index (drawer esquerdo) + página central = core do Moodle 4. Sem
  ajuste manual viável dentro do escopo CSS/JS atual.
- **Status:** ✅ sem ação técnica — resposta explicativa

---

## 5. Botão "Avançar" para o próximo módulo (além do "Voltar")

**Pergunta do cliente:** Não seria interessante incluir, além do botão
"Voltar", um botão para avançar diretamente ao módulo seguinte?

**Resposta sugerida:**

> Sugestão acolhida. O Moodle oferece navegação sequencial entre atividades
> (anterior/próxima ao final de cada página de atividade), e vamos verificar a
> habilitação desse recurso no tema em uso. Caso o tema não o exponha, existem
> alternativas via configuração ou plugin homologado que adicionam exatamente
> esse fluxo "próxima etapa", mantendo a navegação contínua sem retorno ao
> menu.

**Nota interna:**

- Lambda pode ter setting de activity navigation; senão, plugin. Confirmar no
  admin antes de prometer prazo.
- **Status:** ⬜ pendente — verificar settings do Lambda

---

## 6. FAQ com quebra de contexto ("Acesse a página inicial...")

**Pergunta do cliente:** A resposta do FAQ manda o usuário acessar a página
inicial, mas ele já está nela. Sensação de texto genérico copiado de manual
externo.

**Resposta sugerida:**

> Observação correta — a resposta foi redigida em formato de manual
> autocontido e não considera que o usuário já está na página. Vamos
> reescrever as respostas do FAQ em tom contextual (ex.: "Clique em 'Acessar
> plataforma' acima e, na tela de login, selecione 'Criar uma conta'"), com
> links diretos para cada ação.

**Nota interna:**

- 100% nosso (`html/faq.html`). Reescritas as respostas 1, 2 e 3 (todas
  mandavam "acessar https://ead.funprespjud.com.br" estando na própria
  página): agora apontam para a seção "Cursos disponíveis"/Catálogo, para a
  tela de login e para a página de recuperação de senha diretamente.
- **Status:** ✅ implementado — recolar o HTML no bloco da home

---

## Resumo das ações

| # | Item | Onde | Tipo | Status |
|---|------|------|------|--------|
| 1a | Tela branca no login autenticado | `style.css` + `script.js` | Bug fix | ✅ |
| 1b | CTA "Acessar plataforma" → `/my/` se logado | `script.js` | Melhoria | ✅ |
| 2 | Catálogo vs Cursos disponíveis (vitrine, ordenação, login) | Admin Moodle | Config + decisão do cliente | ⬜ |
| 3 | Filtros em "Meus cursos" | Admin Moodle / tema | Verificação | ✅ |
| 4 | Área central + menu lateral | — | Nativo, sem ação | ✅ |
| 5 | Botão "Avançar" entre módulos | Settings Lambda / plugin | Verificação | ⬜ |
| 6 | FAQ contextual | `html/faq.html` | Copywriting | ✅ |
