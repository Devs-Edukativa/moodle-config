// FUNPRESP-JUD · Meus Cursos — ativa barra de progresso e badge de status
// Roda em /my/courses.php e em qualquer página com block_myoverview
(function () {
  function applyProgress() {
    document.querySelectorAll('.course-card').forEach(function (card) {
      var txt = card.querySelector('.progress-text');
      if (!txt) return;
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

  // roda no load inicial
  if (document.readyState !== 'loading') applyProgress();
  else document.addEventListener('DOMContentLoaded', applyProgress);

  // re-roda quando o myoverview troca de filtro (re-renderiza os cards via AJAX)
  var grid = document.querySelector('[data-region="courses-view"]');
  if (grid) {
    new MutationObserver(applyProgress).observe(grid, { childList: true, subtree: true });
  }
})();

// ═══════════════════════════════════════════════════════════
// FUNPRESP-JUD · Login v3 — split-screen direto no <body>
// Roda só em /login/index.php (body#page-login-index)
// ═══════════════════════════════════════════════════════════
(function () {
  function build() {
    if (document.body.id !== 'page-login-index') return;
    if (document.querySelector('.funp-login-wrapper')) return;

    // 1) Pega o .loginform inteiro (é o que a Lambda envolve no login) */
    var loginform = document.querySelector('.loginform');
    if (!loginform) {
      console.warn('[funp-login] .loginform não encontrado');
      return;
    }

    // 2) Cria o wrapper split-screen */
    var wrapper = document.createElement('div');
    wrapper.className = 'funp-login-wrapper';

    // 3) Painel esquerdo — BRAND */
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

    // 4) Painel direito — envelopa o .loginform inteiro */
    var formPanel = document.createElement('section');
    formPanel.className = 'funp-login-form';
    var inner = document.createElement('div');
    inner.className = 'funp-login-form-inner';
    formPanel.appendChild(inner);

    // 5) Move o .loginform pra dentro do inner */
    inner.appendChild(loginform);

    // 6) Também leva o .loginform-toggle (Lambda extra) se existir */
    var toggle = document.querySelector('.loginform-toggle');
    if (toggle) inner.appendChild(toggle);

    wrapper.appendChild(brand);
    wrapper.appendChild(formPanel);

    // 7) ⭐ Append direto no <body> — escapa de todo container Bootstrap */
    document.body.appendChild(wrapper);

    // 8) Esconde o #page-wrapper original (que tinha header, nav, etc) */
    var oldPage = document.getElementById('page-wrapper') ||
      document.getElementById('page') ||
      document.querySelector('#page-content') ||
      document.querySelector('main');
    if (oldPage) oldPage.style.display = 'none';

    // 9) Marca o body pra ativar o CSS scopado */
    document.body.classList.add('funp-login-active');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();

// ═══════════════════════════════════════════════════════════
// FUNPRESP-JUD · Signup v1 — split-screen direto no <body>
// Roda só em /login/signup.php (body#page-login-signup)
// ═══════════════════════════════════════════════════════════
(function () {
  function build() {
    if (document.body.id !== 'page-login-signup') return;
    if (document.querySelector('.funp-login-wrapper')) return;

    // Pega o .signupform inteiro (é o equivalente ao .loginform aqui)
    var signupform = document.querySelector('.signupform');
    if (!signupform) {
      console.warn('[funp-signup] .signupform não encontrado');
      return;
    }

    var wrapper = document.createElement('div');
    wrapper.className = 'funp-login-wrapper';

    // Painel esquerdo — BRAND (copy adaptado pra cadastro)
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

    // Painel direito — envelopa o .signupform
    var formPanel = document.createElement('section');
    formPanel.className = 'funp-login-form';
    var inner = document.createElement('div');
    inner.className = 'funp-login-form-inner';
    formPanel.appendChild(inner);

    inner.appendChild(signupform);

    // Leva também o .loginform-toggle ("Would you like to log in...")
    var toggle = document.querySelector('.loginform-toggle');
    if (toggle) inner.appendChild(toggle);

    wrapper.appendChild(brand);
    wrapper.appendChild(formPanel);

    document.body.appendChild(wrapper);

    // Esconde o #page-wrapper original
    var oldPage = document.getElementById('page-wrapper') ||
      document.getElementById('page') ||
      document.querySelector('#page-content') ||
      document.querySelector('main');
    if (oldPage) oldPage.style.display = 'none';

    // Marca o body pra ativar o CSS escopado
    document.body.classList.add('funp-login-active');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();

// ═══════════════════════════════════════════════════════════
// FUNPRESP-JUD · CPF + Telefone — global
// • Renomeia "Username" / "Nome de usuário" → "CPF"
// • Máscara visual CPF (000.000.000-00) em #id_username e #id_profile_field_CPF
// • Máscara telefone BR ((XX) XXXXX-XXXX) em qualquer input com "telefone" no name/id
// • Limpa formatação no submit (Moodle recebe só dígitos) — compat. com usuários antigos
// ═══════════════════════════════════════════════════════════
(function () {
  function renameUsernameToCPF() {
    document.querySelectorAll('label').forEach(function (label) {
      var forAttr = (label.getAttribute('for') || '').toLowerCase();
      var idAttr = (label.id || '').toLowerCase();
      if (forAttr.indexOf('username') === -1 && idAttr.indexOf('username') === -1) return;
      label.childNodes.forEach(function (n) {
        if (n.nodeType === 3 && /username|nome de usuário/i.test(n.textContent)) {
          n.textContent = n.textContent
            .replace(/nome de usuário/gi, 'CPF')
            .replace(/username/gi, 'CPF');
        }
      });
    });
    document.querySelectorAll('input[name="username"], #id_username, #username').forEach(function (i) {
      if (i.placeholder && /username|nome de usuário/i.test(i.placeholder)) {
        i.placeholder = '000.000.000-00';
      }
    });
  }

  function applyCPFMask(input) {
    if (!input || input.dataset.cpfMask === '1') return;
    input.dataset.cpfMask = '1';
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('maxlength', '14');
    if (!input.placeholder || /username|nome|cpf/i.test(input.placeholder)) {
      input.placeholder = '000.000.000-00';
    }

    input.addEventListener('input', function () {
      // Se tem letras (username texto antigo), respeita e não formata
      if (/[a-zA-Z]/.test(input.value)) return;
      var v = input.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 9) v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, '$1.$2.$3-$4');
      else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d{1,3}).*/, '$1.$2.$3');
      else if (v.length > 3) v = v.replace(/^(\d{3})(\d{1,3}).*/, '$1.$2');
      input.value = v;
    });

    // Limpa formatação antes de enviar (Moodle salva 12345678901, não 123.456.789-01)
    var form = input.form;
    if (form && form.dataset.cpfClean !== '1') {
      form.dataset.cpfClean = '1';
      form.addEventListener('submit', function () {
        form.querySelectorAll('input[data-cpf-mask="1"]').forEach(function (i) {
          // Só limpa se for CPF formatado (tem ponto ou traço) — preserva usernames texto
          if (/[.\-]/.test(i.value) && !/[a-zA-Z]/.test(i.value)) {
            i.value = i.value.replace(/\D/g, '');
          }
        });
      });
    }
  }

  function applyPhoneMask(input) {
    if (!input || input.dataset.phoneMask === '1') return;
    input.dataset.phoneMask = '1';
    input.setAttribute('inputmode', 'tel');
    input.setAttribute('maxlength', '15');
    if (!input.placeholder) input.placeholder = '(00) 00000-0000';

    input.addEventListener('input', function () {
      var v = input.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{1,4}).*/, '($1) $2-$3');
      else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{1,4}).*/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/^(\d{2})(\d{1,5}).*/, '($1) $2');
      else if (v.length > 0) v = '(' + v;
      input.value = v;
    });
  }

  function init() {
    renameUsernameToCPF();

    // CPF em username + profile_field_CPF
    document.querySelectorAll(
      'input[name="username"], #id_username, #username, ' +
      'input[name="profile_field_CPF"], #id_profile_field_CPF'
    ).forEach(applyCPFMask);

    // Telefone BR em qualquer input cujo name ou id contenha "telefone"
    document.querySelectorAll('input[type="text"], input[type="tel"], input:not([type])').forEach(function (i) {
      var n = (i.name || '').toLowerCase();
      var id = (i.id || '').toLowerCase();
      if (n.indexOf('[format]') > -1 || n.indexOf('[itemid]') > -1) return; // aux Moodle
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
