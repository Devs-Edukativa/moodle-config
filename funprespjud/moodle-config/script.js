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
    var loginform = document.querySelector('.loginform');
    if (!loginform) {
      console.warn('[funp-login] .loginform não encontrado');
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
      '<div class="funp-brand-eyebrow">Plataforma EaD</div>' +
      '<h1>Bem-vindo de volta<br><em>à sua jornada.</em></h1>' +
      '<p class="funp-brand-lede">Capacitação em previdência complementar, educação financeira e gestão de fundos de pensão — feita para servidores do Judiciário, MPU e CNMP.</p>' +
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
      console.warn('[funp-signup] .signupform não encontrado');
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
   4. CPF + TELEFONE — máscaras globais
   ───────────────────────────────────────────────────────────
   Roda em qualquer página. Faz três coisas:

   (a) Renomeia labels "Username"/"Nome de usuário" para "CPF"
       — visualmente no login e signup.
   (b) Aplica máscara CPF (000.000.000-00) em #id_username e
       #id_profile_field_CPF. Limita a 11 dígitos.
   (c) Aplica máscara telefone BR ((XX) XXXXX-XXXX) em inputs
       cujo name OU id contenham "telefone".

   ⚠ Compat com usuários antigos:
   - Se o input contém letras (username texto legado), NÃO
     formata e NÃO limpa no submit.
   - Só remove pontuação no submit quando a entrada é
     puramente numérica com . ou -.

   ⚠ Persistência no Moodle:
   - O Moodle SALVA só dígitos (12345678901). A máscara é
     puramente visual; o submit handler limpa antes de enviar.
   ═══════════════════════════════════════════════════════════ */
(function () {
  /**
   * Troca o texto "Username"/"Nome de usuário" para "CPF" nos
   * labels e placeholders associados ao input de username.
   * Mantém estrutura de filhos (ícones, .form-label-addon, etc.).
   */
  function renameUsernameToCPF() {
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
            .replace(/nome de usuário/gi, 'CPF')
            .replace(/username/gi, 'CPF');
        }
      });
    });
    // Placeholder do input — só substitui se for o texto Moodle default.
    document.querySelectorAll('input[name="username"], #id_username, #username').forEach(function (i) {
      if (i.placeholder && /username|nome de usuário/i.test(i.placeholder)) {
        i.placeholder = '000.000.000-00';
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
  function applyCPFMask(input) {
    if (!input || input.dataset.cpfMask === '1') return;
    input.dataset.cpfMask = '1';
    input.setAttribute('inputmode', 'numeric'); // teclado numérico no mobile
    input.setAttribute('maxlength', '14');       // 11 dígitos + 2 pontos + 1 hífen
    if (!input.placeholder || /username|nome|cpf/i.test(input.placeholder)) {
      input.placeholder = '000.000.000-00';
    }

    input.addEventListener('input', function () {
      // Compat: username legado pode ter letras — não formata.
      if (/[a-zA-Z]/.test(input.value)) return;
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
    renameUsernameToCPF();

    // CPF: username (login/signup) + profile_field_CPF (perfil).
    document.querySelectorAll(
      'input[name="username"], #id_username, #username, ' +
      'input[name="profile_field_CPF"], #id_profile_field_CPF'
    ).forEach(applyCPFMask);

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
