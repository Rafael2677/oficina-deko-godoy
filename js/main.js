/* Oficina mecânica Deko Godoy · site demo Patron */
(function () {
  'use strict';
  document.documentElement.classList.remove('sem-js');

  // WhatsApp confirmado pelo link de catálogo na bio do Instagram da oficina (13/11/2026)
  var WHATSAPP = '5511933413330';

  // Horário publicado no Google em 13/11/2026: [abre, fecha] em horas; índice = dia da semana (0 = domingo)
  var HORARIO = [[8, 20], [7, 21], [7, 21], [7, 21], [7, 21], [7, 21], [8, 20]];
  var DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---------- links de WhatsApp com mensagem pronta ----------
  $$('[data-zap]').forEach(function (a) {
    a.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(a.getAttribute('data-zap'));
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // ---------- aberto agora (sempre no fuso de São Paulo) ----------
  function agoraSP() {
    try {
      var p = {};
      new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      var d = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
      return { dia: d, hora: (+p.hour % 24) + (+p.minute) / 60 };
    } catch (e) {
      var n = new Date();
      return { dia: n.getDay(), hora: n.getHours() + n.getMinutes() / 60 };
    }
  }
  function selo() {
    var a = agoraSP(), h = HORARIO[a.dia], el = $('#aberto'), txt = $('#aberto-txt');
    if (!el || a.dia < 0) return;
    var aberto = a.hora >= h[0] && a.hora < h[1];
    if (aberto) {
      txt.textContent = 'Aberto agora · fecha às ' + h[1] + 'h';
    } else if (a.hora < h[0]) {
      txt.textContent = 'Fechado agora · abre hoje às ' + h[0] + 'h';
    } else {
      var am = (a.dia + 1) % 7;
      txt.textContent = 'Fechado agora · abre ' + (am === 0 || am === 6 ? DIAS[am] : 'amanhã') + ' às ' + HORARIO[am][0] + 'h';
    }
    el.classList.toggle('fechado', !aberto);
    el.hidden = false;
    var tr = $('#horarios tr[data-d="' + a.dia + '"]');
    if (tr) tr.classList.add('hoje');
  }
  selo();
  setInterval(selo, 60000);

  // ---------- linha do tempo "acompanhe o serviço" ----------
  // CONFIRMAR: textos genéricos; trocar pelo processo real contado pelo dono.
  var cam = '<svg viewBox="0 0 32 32"><use href="#i-camera"/></svg>';
  var play = '<svg viewBox="0 0 32 32"><use href="#i-play"/></svg>';
  var ETAPAS = [
    { titulo: 'O carro chega',
      texto: 'Você conta o que está sentindo no carro e a equipe anota. O registro da chegada já pode ir para o seu celular.',
      msgs: [['hora', 'Chegada'], ['of', '<div class="midia">' + cam + 'foto da chegada</div>Carro recebido. Anotamos o que você contou.']] },
    { titulo: 'Diagnóstico explicado',
      texto: 'A equipe examina o carro e mostra o que encontrou, em foto ou vídeo, com a explicação em língua de gente.',
      msgs: [['of', '<div class="midia">' + play + 'vídeo do diagnóstico</div>Achamos a causa. Olha no vídeo o que está acontecendo.']] },
    { titulo: 'Você aprova antes',
      texto: 'Com o orçamento em mãos, você decide o que fazer. Dá para tirar dúvidas ali mesmo, pela conversa.',
      msgs: [['of', 'Segue o orçamento com as peças e a mão de obra.'], ['eu', 'Entendi. Pode fazer 👍']] },
    { titulo: 'Serviço com registro',
      texto: 'Durante o conserto, a oficina manda o andamento e mostra a peça que saiu ao lado da que entrou.',
      msgs: [['of', '<div class="midias"><div class="midia">' + cam + 'peça antiga</div><div class="midia">' + cam + 'peça nova</div></div>Peça trocada. Olha a antiga ao lado da nova.']] },
    { titulo: 'Carro pronto',
      texto: 'Você recebe o aviso de que o carro está pronto e combina a retirada. Quer começar? É só chamar.',
      msgs: [['of', '<div class="midia">' + cam + 'foto do carro pronto</div>Tudo certo! Pode vir buscar.'], ['eu', 'Maravilha, obrigado!']] }
  ];
  var atual = 0, tabs = $$('.etapa'), conversa = $('#conversa');
  function mostra(i, foco) {
    atual = Math.max(0, Math.min(ETAPAS.length - 1, i));
    var e = ETAPAS[atual];
    tabs.forEach(function (t, k) {
      t.setAttribute('aria-selected', k === atual ? 'true' : 'false');
      t.tabIndex = k === atual ? 0 : -1;
      t.classList.toggle('feita', k < atual);
    });
    $('#trilho-cheio').style.width = (atual / (ETAPAS.length - 1) * 100) + '%';
    $('#e-num').textContent = 'Etapa ' + (atual + 1) + ' de ' + ETAPAS.length;
    $('#e-titulo').textContent = e.titulo;
    $('#e-texto').textContent = e.texto;
    $('#painel-etapa').setAttribute('aria-labelledby', 'tab-' + atual);
    $('#e-voltar').disabled = atual === 0;
    var fim = atual === ETAPAS.length - 1;
    $('#e-avancar').hidden = fim;
    $('#e-zap').hidden = !fim;
    conversa.innerHTML = '';
    e.msgs.forEach(function (m, k) {
      var d = document.createElement('div');
      d.className = 'msg' + (m[0] === 'eu' ? ' eu' : m[0] === 'hora' ? ' hora' : '');
      d.style.animationDelay = (k * 0.35) + 's';
      d.innerHTML = m[1];
      conversa.appendChild(d);
    });
    if (foco) tabs[atual].focus();
  }
  if (tabs.length) {
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { mostra(k); });
      t.addEventListener('keydown', function (ev) {
        if (ev.key === 'ArrowRight') { ev.preventDefault(); mostra(atual + 1, true); }
        if (ev.key === 'ArrowLeft') { ev.preventDefault(); mostra(atual - 1, true); }
      });
    });
    $('#e-avancar').addEventListener('click', function () { mostra(atual + 1); });
    $('#e-voltar').addEventListener('click', function () { mostra(atual - 1); });
    mostra(0);
  }

  // ---------- revelação ao rolar ----------
  var rev = $$('.revela');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('visto'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rev.forEach(function (el) { io.observe(el); });
  } else {
    rev.forEach(function (el) { el.classList.add('visto'); });
  }

  // ---------- botão flutuante: aparece depois da primeira tela ----------
  var flut = $('#flutuante');
  function rolou() { flut.classList.toggle('visivel', window.scrollY > window.innerHeight * 0.7); }
  window.addEventListener('scroll', rolou, { passive: true });
  rolou();
})();
