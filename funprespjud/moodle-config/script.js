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
