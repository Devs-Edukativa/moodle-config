/* ═══════════════════════════════════════════════════════════
   FUNPRESP-JUD · Moodle Lambda — Custom JS
   ───────────────────────────────────────────────────────────
   Injetado em todas as páginas via Custom JS do Moodle. Cada
   funcionalidade vive numa IIFE independente — se uma quebrar,
   as outras seguem funcionando.

   Sintaxe: ES5 (var/function) por compatibilidade com Moodle
   e navegadores antigos. NÃO converter para ES6+ sem revisão.

   Convenções:
     • IIFE por feature (sem poluir o escopo global).
     • Guards "se já existe / se elemento não existe, sai".
     • Dataset flags (data-cpf-mask, data-phone-mask) evitam
       reaplicar handlers em re-renders AJAX.
     • Logs em pt-BR com prefixo [funp-<feature>].
   ───────────────────────────────────────────────────────────
   ÍNDICE
     1. Meus Cursos — barra de progresso + badge de status
                      (escopo: páginas com .course-card)
     2. Login v3   — split-screen builder
                      (escopo: body#page-login-index)
     3. Signup v1  — split-screen builder
                      (escopo: body#page-login-signup)
     4. CPF + Telefone — global
                      • Rename "Username" → "CPF"
                      • Máscara CPF em #id_username e #id_profile_field_CPF
                      • Máscara telefone BR em inputs com "telefone" no name/id
                      • Limpa formatação no submit (Moodle salva só dígitos)
     5. CTA inteligente — hero da home aponta pra /my/ se logado
                      (escopo: body#page-site-index)
   ═══════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════
   1. MEUS CURSOS — barra de progresso + badge de status
   ───────────────────────────────────────────────────────────
   Roda em /my/courses.php e em qualquer página com
   block_myoverview. Lê o número exibido pelo Moodle dentro de
   .progress-text > span (ex.: "42%"), seta CSS var --progress
   no card e define data-status para CSS pintar o badge.

   CSS correspondente: style.css §4.6 (badge) e §4.9 (barra).
   ═══════════════════════════════════════════════════════════ */
(function () {
  /**
   * Varre todos .course-card visíveis, lê o % do .progress-text
   * e popula --progress + data-status no elemento do card.
   *
   * Status derivado:
   *   0%      → naoiniciado
   *   1-99%   → andamento
   *   ≥100%   → concluido
   */
  function applyProgress() {
    document.querySelectorAll('.course-card').forEach(function (card) {
      var txt = card.querySelector('.progress-text');
      if (!txt) return;
      // O Moodle envolve o número num <span> visível e usa .visually-hidden
      // para o "X percent complete" do screen reader — pegamos o visível.
      var num = txt.querySelector('span:not(.visually-hidden)');
      if (!num) return;
      var pct = parseInt(num.textContent, 10);
      if (isNaN(pct)) return;

      card.style.setProperty('--progress', pct + '%');

      var status = 'andamento';
      if (pct === 0) status = 'naoiniciado';
      else if (pct >= 100) status = 'concluido';
      card.setAttribute('data-status', status);
    });
  }

  // Primeira passada — assim que o DOM estiver pronto.
  if (document.readyState !== 'loading') applyProgress();
  else document.addEventListener('DOMContentLoaded', applyProgress);

  // myoverview re-renderiza os cards via AJAX ao trocar filtro/ordenação.
  // MutationObserver re-aplica progress sem custo de polling.
  var grid = document.querySelector('[data-region="courses-view"]');
  if (grid) {
    new MutationObserver(applyProgress).observe(grid, { childList: true, subtree: true });
  }
})();


/* ═══════════════════════════════════════════════════════════
   2. LOGIN v3 — split-screen direto no <body>
   ───────────────────────────────────────────────────────────
   Roda só em body#page-login-index. Move o <form .loginform>
   para dentro de um wrapper customizado que vira filho direto
   do <body>, escapando dos containers Bootstrap do Lambda.

   CSS correspondente: style.css §5 (Login).
   Estrutura final:
     body
       └ .funp-login-wrapper
           ├ aside.funp-login-brand   (painel esquerdo)
           └ section.funp-login-form
               └ div.funp-login-form-inner
                   ├ .loginform        (movido do DOM original)
                   └ .loginform-toggle (se existir)
   ═══════════════════════════════════════════════════════════ */
(function () {
  /**
   * Constrói o wrapper split-screen e move o form do Moodle para dentro.
   * Idempotente: se já existir .funp-login-wrapper, não faz nada.
   */
  function build() {
    // Guard 1 — só executa na página de login.
    if (document.body.id !== 'page-login-index') return;
    // Guard 2 — idempotência (re-execução acidental ou hot reload).
    if (document.querySelector('.funp-login-wrapper')) return;

    // 1) Pega o .loginform inteiro (é o que o Lambda envolve no login).
    //    Ausente em dois cenários: usuário já autenticado (Moodle mostra
    //    "você já está logado" com o mesmo body id) ou mudança de markup
    //    do Lambda. Sem este guard a página ficava em branco, porque o
    //    CSS 5.1 esconde o chrome contando com o wrapper que nunca nasce.
    var loginform = document.querySelector('.loginform');
    if (!loginform) {
      if (!document.body.classList.contains('notloggedin')) {
        // Já autenticado — manda direto pro painel.
        window.location.replace('/my/');
        return;
      }
      // Markup mudou — reexibe a página nativa do Moodle (CSS 5.1 ignora
      // o hide quando .funp-login-fallback está presente).
      console.warn('[funp-login] .loginform não encontrado — fallback nativo');
      document.body.classList.add('funp-login-fallback');
      return;
    }

    // 2) Cria o wrapper split-screen.
    var wrapper = document.createElement('div');
    wrapper.className = 'funp-login-wrapper';

    // 3) Painel esquerdo — BRAND (copy do login).
    var brand = document.createElement('aside');
    brand.className = 'funp-login-brand';
    brand.innerHTML =
      '<div>' +
      '<div class="funp-brand-eyebrow">Portal Educa Funpresp-Jud</div>' +
      '<h1>Bem-vindo à sua jornada de capacitação com a Funpresp-Jud!</h1>' +
      '<p class="funp-brand-lede">Capacitação em educação financeira, previdência complementar e previdenciária — feita para servidores do Judiciário da União, MPU, CNMP, Conselheiros e Representantes Funpresp-Jud.</p>' +
      '</div>' +
      '<div class="funp-brand-footer">© ' + new Date().getFullYear() +
      ' Fundação de Previdência Complementar do Servidor Público Federal do Poder Judiciário</div>';

    // 4) Painel direito — envelopa o .loginform inteiro.
    var formPanel = document.createElement('section');
    formPanel.className = 'funp-login-form';
    var inner = document.createElement('div');
    inner.className = 'funp-login-form-inner';
    formPanel.appendChild(inner);

    // 5) Move o .loginform pra dentro do inner.
    //    appendChild move (não clona) — preservando event listeners.
    inner.appendChild(loginform);

    // 6) Leva também o .loginform-toggle (componente extra do Lambda)
    //    quando presente. CSS esconde via display:none.
    var toggle = document.querySelector('.loginform-toggle');
    if (toggle) inner.appendChild(toggle);

    wrapper.appendChild(brand);
    wrapper.appendChild(formPanel);

    // 7) Append direto no <body> — escapa de qualquer container Bootstrap
    //    com max-width/padding que limitaria o full-bleed do split-screen.
    document.body.appendChild(wrapper);

    // 8) Esconde o #page-wrapper original (header, nav, breadcrumbs, etc).
    //    Fallback em cascata caso o Lambda mude IDs em versões futuras.
    var oldPage = document.getElementById('page-wrapper') ||
      document.getElementById('page') ||
      document.querySelector('#page-content') ||
      document.querySelector('main');
    if (oldPage) oldPage.style.display = 'none';

    // 9) Flag no body para o CSS escopado (caso queiram regras extra).
    document.body.classList.add('funp-login-active');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();


/* ═══════════════════════════════════════════════════════════
   3. SIGNUP v1 — split-screen direto no <body>
   ───────────────────────────────────────────────────────────
   Roda só em body#page-login-signup. Mesma estratégia do
   login v3, porém movendo o <form .signupform> e usando copy
   adaptado para cadastro.

   CSS correspondente: style.css §7 (Signup).
   ═══════════════════════════════════════════════════════════ */
(function () {
  /**
   * Constrói o wrapper split-screen do signup.
   * Idempotente: se já existir .funp-login-wrapper, não faz nada.
   */
  function build() {
    // Guard 1 — só na página de cadastro.
    if (document.body.id !== 'page-login-signup') return;
    // Guard 2 — idempotência.
    if (document.querySelector('.funp-login-wrapper')) return;

    // Pega o .signupform inteiro (equivalente ao .loginform aqui).
    var signupform = document.querySelector('.signupform');
    if (!signupform) {
      // Sem form não dá pra montar o split-screen — reexibe a página
      // nativa em vez de deixá-la em branco (CSS ignora o hide quando
      // .funp-login-fallback está presente).
      console.warn('[funp-signup] .signupform não encontrado — fallback nativo');
      document.body.classList.add('funp-login-fallback');
      return;
    }

    var wrapper = document.createElement('div');
    wrapper.className = 'funp-login-wrapper';

    // Painel esquerdo — BRAND com copy adaptado para cadastro.
    var brand = document.createElement('aside');
    brand.className = 'funp-login-brand';
    brand.innerHTML =
      '<div>' +
      '<div class="funp-brand-eyebrow">Plataforma EaD</div>' +
      '<h1>Crie sua conta<br><em>Comece sua jornada.</em></h1>' +
      '<p class="funp-brand-lede">Capacitação em previdência complementar, educação financeira e gestão de fundos de pensão — feita para servidores do Judiciário, MPU e CNMP.</p>' +
      '</div>' +
      '<div class="funp-brand-footer">© ' + new Date().getFullYear() +
      ' Fundação de Previdência Complementar do Servidor Público Federal do Poder Judiciário</div>';

    // Painel direito — envelopa o .signupform.
    var formPanel = document.createElement('section');
    formPanel.className = 'funp-login-form';
    var inner = document.createElement('div');
    inner.className = 'funp-login-form-inner';
    formPanel.appendChild(inner);

    inner.appendChild(signupform);

    // Leva o .loginform-toggle ("Would you like to log in...") se houver.
    var toggle = document.querySelector('.loginform-toggle');
    if (toggle) inner.appendChild(toggle);

    wrapper.appendChild(brand);
    wrapper.appendChild(formPanel);

    document.body.appendChild(wrapper);

    // Esconde a estrutura original do Moodle. Cascata de fallbacks.
    var oldPage = document.getElementById('page-wrapper') ||
      document.getElementById('page') ||
      document.querySelector('#page-content') ||
      document.querySelector('main');
    if (oldPage) oldPage.style.display = 'none';

    // Marca o body para ativar regras CSS escopadas, se houver.
    document.body.classList.add('funp-login-active');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();


/* ═══════════════════════════════════════════════════════════
   4. CPF + TELEFONE — comportamento por página
   ───────────────────────────────────────────────────────────
   O campo de fluxo difere entre LOGIN e CADASTRO:

   • CADASTRO (body#page-login-signup): username É o CPF.
       - Label vira "CPF", placeholder 000.000.000-00.
       - Aceita SÓ números (máscara strict, sem letras).
       - Valida dígito verificador no submit; CPF inválido
         BLOQUEIA o envio e mostra mensagem inline.

   • LOGIN (body#page-login-index): username = CPF OU e-mail.
       - Label vira "CPF ou e-mail".
       - SEM máscara/validação (e-mail tem letras e seria
         quebrado pela máscara CPF).

   • PERFIL (qualquer página): #id_profile_field_CPF recebe
     máscara CPF (strict, só números).

   • TELEFONE (qualquer página): máscara BR ((XX) XXXXX-XXXX)
     em inputs cujo name OU id contenham "telefone".

   ⚠ Persistência no Moodle:
   - O Moodle SALVA só dígitos (12345678901). A máscara é
     puramente visual; o submit handler limpa antes de enviar.

   ⚠ Login por e-mail é setting de servidor (Admin → Plugins →
     Autenticação → "Permitir login via e-mail"). O frontend só
     deixa o campo aceitar o e-mail; o backend precisa do toggle.
   ═══════════════════════════════════════════════════════════ */
(function () {
  /**
   * Valida CPF pela regra oficial (dígitos verificadores).
   * Entrada: string qualquer; considera só os dígitos.
   * Rejeita comprimento != 11 e sequências repetidas (111... etc).
   */
  function isValidCPF(value) {
    var cpf = (value || '').replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false; // todos iguais
    var sum, rest, i;
    sum = 0;
    for (i = 1; i <= 9; i++) sum += parseInt(cpf.charAt(i - 1), 10) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.charAt(9), 10)) return false;
    sum = 0;
    for (i = 1; i <= 10; i++) sum += parseInt(cpf.charAt(i - 1), 10) * (12 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.charAt(10), 10)) return false;
    return true;
  }

  /**
   * Troca o texto do label/placeholder do input de username.
   * Mantém estrutura de filhos (ícones, .form-label-addon, etc.).
   * @param {string} newText     texto que substitui "username"/"nome de usuário"
   * @param {string} placeholder placeholder aplicado ao input
   */
  function renameUsernameLabel(newText, placeholder) {
    document.querySelectorAll('label').forEach(function (label) {
      var forAttr = (label.getAttribute('for') || '').toLowerCase();
      var idAttr = (label.id || '').toLowerCase();
      // Só mexe em labels do username — for="username" ou id contendo "username".
      if (forAttr.indexOf('username') === -1 && idAttr.indexOf('username') === -1) return;
      // Itera só nos text nodes diretos (nodeType 3) para não destruir
      // estrutura de ícones/spans aninhados que o Lambda injeta.
      label.childNodes.forEach(function (n) {
        if (n.nodeType === 3 && /username|nome de usuário/i.test(n.textContent)) {
          n.textContent = n.textContent
            .replace(/nome de usuário/gi, newText)
            .replace(/username/gi, newText);
        }
      });
    });
    // Placeholder do input — só substitui se for o texto Moodle default.
    document.querySelectorAll('input[name="username"], #id_username, #username').forEach(function (i) {
      if (i.placeholder && /username|nome de usuário/i.test(i.placeholder)) {
        i.placeholder = placeholder;
      }
    });
  }

  /**
   * Aplica máscara visual de CPF no input dado e instala
   * submit-handler no form para limpar a formatação antes do
   * envio (Moodle persiste só dígitos).
   *
   * Idempotente: usa dataset.cpfMask como flag.
   * Compat: respeita usernames legados com letras.
   */
  function applyCPFMask(input, strict) {
    if (!input || input.dataset.cpfMask === '1') return;
    input.dataset.cpfMask = '1';
    input.setAttribute('inputmode', 'numeric'); // teclado numérico no mobile
    input.setAttribute('maxlength', '14');       // 11 dígitos + 2 pontos + 1 hífen
    if (!input.placeholder || /username|nome|cpf/i.test(input.placeholder)) {
      input.placeholder = '000.000.000-00';
    }

    input.addEventListener('input', function () {
      // Sem strict: username legado pode ter letras — não formata.
      // Com strict (cadastro/perfil): força só números, descartando letras.
      if (!strict && /[a-zA-Z]/.test(input.value)) return;
      // Pega só dígitos, limita a 11.
      var v = input.value.replace(/\D/g, '').slice(0, 11);
      // Aplica máscara progressivamente conforme o tamanho.
      if (v.length > 9) v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, '$1.$2.$3-$4');
      else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d{1,3}).*/, '$1.$2.$3');
      else if (v.length > 3) v = v.replace(/^(\d{3})(\d{1,3}).*/, '$1.$2');
      input.value = v;
    });

    // Submit handler — uma vez por form, marcado com dataset.cpfClean.
    var form = input.form;
    if (form && form.dataset.cpfClean !== '1') {
      form.dataset.cpfClean = '1';
      form.addEventListener('submit', function () {
        form.querySelectorAll('input[data-cpf-mask="1"]').forEach(function (i) {
          // Só limpa se for CPF formatado (ponto OU hífen) e sem letras.
          // Isso preserva usernames texto legados sem corromper o submit.
          if (/[.\-]/.test(i.value) && !/[a-zA-Z]/.test(i.value)) {
            i.value = i.value.replace(/\D/g, '');
          }
        });
      });
    }
  }

  /**
   * Validação de CPF no submit do CADASTRO. CPF inválido bloqueia
   * o envio e exibe mensagem inline abaixo do campo.
   *
   * IMPORTANTE: anexa o listener DEPOIS do clean-handler do
   * applyCPFMask (mesmo form) para ler já como dígitos. Use
   * captura (true) garantindo que roda antes do submit nativo.
   * Idempotente via dataset.cpfValidate.
   */
  function attachCPFValidation(input) {
    var form = input.form;
    if (!form || form.dataset.cpfValidate === '1') return;
    form.dataset.cpfValidate = '1';
    var ERR_ID = 'funp-cpf-error';

    form.addEventListener('submit', function (e) {
      var digits = (input.value || '').replace(/\D/g, '');
      var prev = document.getElementById(ERR_ID);
      if (prev) prev.remove();

      if (isValidCPF(digits)) {
        input.removeAttribute('aria-invalid');
        return;
      }

      e.preventDefault();
      e.stopPropagation();
      input.setAttribute('aria-invalid', 'true');

      var msg = document.createElement('div');
      msg.id = ERR_ID;
      msg.className = 'funp-cpf-error';
      msg.setAttribute('role', 'alert');
      msg.style.cssText = 'color:#c0392b;font-size:.875rem;margin-top:.35rem;';
      msg.textContent = digits.length === 0
        ? 'Informe o CPF.'
        : 'CPF inválido. Digite um CPF válido (somente números).';
      input.insertAdjacentElement('afterend', msg);
      input.focus();
    });
  }

  /**
   * Aplica máscara visual de telefone BR — (XX) XXXXX-XXXX
   * (celular 11d) ou (XX) XXXX-XXXX (fixo 10d).
   *
   * Não instala submit-handler — o Moodle aceita o telefone
   * formatado nos custom profile fields (texto livre).
   */
  function applyPhoneMask(input) {
    if (!input || input.dataset.phoneMask === '1') return;
    input.dataset.phoneMask = '1';
    input.setAttribute('inputmode', 'tel');
    input.setAttribute('maxlength', '15'); // "(XX) XXXXX-XXXX"
    if (!input.placeholder) input.placeholder = '(00) 00000-0000';

    input.addEventListener('input', function () {
      var v = input.value.replace(/\D/g, '').slice(0, 11);
      // 11 dígitos = celular com 9; 10 = fixo. Demais = parcial.
      if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{1,4}).*/, '($1) $2-$3');
      else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{1,4}).*/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/^(\d{2})(\d{1,5}).*/, '($1) $2');
      else if (v.length > 0) v = '(' + v;
      input.value = v;
    });
  }

  /**
   * Inicialização: rename labels + aplica máscaras nos inputs alvo.
   */
  function init() {
    var page = document.body.id;

    if (page === 'page-login-signup') {
      // CADASTRO: username é o CPF. Só números + validação no submit.
      renameUsernameLabel('CPF', '000.000.000-00');
      document.querySelectorAll(
        'input[name="username"], #id_username, #username'
      ).forEach(function (i) {
        applyCPFMask(i, true);
        attachCPFValidation(i);
      });
    } else if (page === 'page-login-index') {
      // LOGIN: aceita CPF OU e-mail — sem máscara (e-mail tem letras).
      renameUsernameLabel('CPF ou e-mail', 'CPF ou e-mail');
    }

    // Perfil (qualquer página): campo CPF personalizado, só números.
    document.querySelectorAll(
      'input[name="profile_field_CPF"], #id_profile_field_CPF'
    ).forEach(function (i) { applyCPFMask(i, true); });

    // Telefone: qualquer input text/tel com "telefone" no name ou id.
    document.querySelectorAll('input[type="text"], input[type="tel"], input:not([type])').forEach(function (i) {
      var n = (i.name || '').toLowerCase();
      var id = (i.id || '').toLowerCase();
      // Pula campos auxiliares do Moodle (filemanager etc.).
      if (n.indexOf('[format]') > -1 || n.indexOf('[itemid]') > -1) return;
      if (n.indexOf('telefone') > -1 || id.indexOf('telefone') > -1) {
        applyPhoneMask(i);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/* ═══════════════════════════════════════════════════════════
   5. CTA INTELIGENTE — "Acessar plataforma" na home
   ───────────────────────────────────────────────────────────
   Roda só em body#page-site-index. Se o usuário já está
   autenticado (body sem .notloggedin), o CTA do hero passa a
   apontar pro painel /my/ em vez da tela de login, com label
   ajustado. Evita o caminho home → login → "já está logado".

   HTML correspondente: html/hero.html (.funp-hero-ctas a).
   ═══════════════════════════════════════════════════════════ */
(function () {
  function smartCTA() {
    // Guard 1 — só na home pública.
    if (document.body.id !== 'page-site-index') return;
    // Guard 2 — visitante não autenticado mantém o fluxo de login.
    if (document.body.classList.contains('notloggedin')) return;

    document
      .querySelectorAll('.funp-hero-ctas a[href*="/login/"]')
      .forEach(function (cta) {
        cta.href = '/my/';
        cta.textContent = 'Ir para meus cursos';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', smartCTA);
  } else {
    smartCTA();
  }
})();
