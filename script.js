const abertura = document.getElementById('abertura');
const luz = abertura.querySelector('.luz');

function terminarAbertura() {
  abertura.remove();
  document.body.classList.remove('abertura-ativa');
  window.scrollTo(0, 0);
}

luz.addEventListener('animationend', () => {
  abertura.classList.add('saindo');
});

abertura.addEventListener('transitionend', terminarAbertura);

setTimeout(() => {
  if (document.body.contains(abertura)) {
    terminarAbertura();
  }
}, 10000);

const fundo = document.querySelector('.fundo');

const LARGURA_AZULEJO = 1440;
const ALTURA_AZULEJO = 1024;

const itens = [
  { arquivo: 'livro-04.png', x: 107,  y: 64,  largura: 447 },
  { arquivo: 'livro-06.png', x: 443,  y: 342, largura: 403 },
  { arquivo: 'livro-07.png', x: 945,  y: 360, largura: 393 },
  { arquivo: 'livro-08.png', x: 9,    y: 420, largura: 336 },
  { arquivo: 'livro-10.png', x: 939,  y: 672, largura: 306 },
  { arquivo: 'livro-07.png', x: 640,  y: 20,  largura: 393, espelhado: true },
  { arquivo: 'livro-08.png', x: 1100, y: 120, largura: 336, espelhado: true },
  { arquivo: 'livro-04.png', x: 20,   y: 680, largura: 447, espelhado: true },
  { arquivo: 'livro-08.png', x: 540,  y: 790, largura: 336 },
  { arquivo: 'estrela-01.png', x: 555,  y: 27,  largura: 47, estrela: true },
  { arquivo: 'estrela-02.png', x: 1087, y: 278, largura: 46, estrela: true },
  { arquivo: 'estrela-03.png', x: 797,  y: 653, largura: 54, estrela: true },
  { arquivo: 'estrela-01.png', x: 1300, y: 560, largura: 47, estrela: true },
  { arquivo: 'estrela-02.png', x: 420,  y: 930, largura: 46, estrela: true },
];

function sortear(min, max) {
  return min + Math.random() * (max - min);
}

function montarFundo() {
  fundo.innerHTML = '';

  const larguraTela = window.innerWidth;
  const escala = Math.min(Math.max(larguraTela, 900), 1440) / LARGURA_AZULEJO;
  const larguraAzulejo = LARGURA_AZULEJO * escala;
  const alturaAzulejo = ALTURA_AZULEJO * escala;
  const colunas = Math.ceil(larguraTela / larguraAzulejo) + 1;
  const linhas = Math.ceil(window.innerHeight / alturaAzulejo) + 1;

  for (let linha = 0; linha < linhas; linha++) {
    const deslocamento = linha % 2 === 1 ? -larguraAzulejo / 2 : 0;

    for (let coluna = 0; coluna < colunas; coluna++) {
      itens.forEach(item => {
        const img = document.createElement('img');
        img.src = 'fundo/' + item.arquivo;
        img.alt = '';
        img.className = item.estrela ? 'estrela' : 'livro-fundo';
        if (item.espelhado) img.classList.add('espelhado');

        img.style.left = (coluna * larguraAzulejo + deslocamento + item.x * escala) + 'px';
        img.style.top = (linha * alturaAzulejo + item.y * escala) + 'px';
        img.style.width = (item.largura * escala) + 'px';

        const tempo = item.estrela ? sortear(3, 5) : sortear(3, 5);
        img.style.setProperty('--tempo', tempo + 's');
        img.style.setProperty('--atraso', -sortear(0, tempo) + 's');
        img.style.setProperty('--giro', (Math.random() < .5 ? -1 : 1) * sortear(2, 3) + 'deg');

        fundo.appendChild(img);
      });
    }
  }
}

montarFundo();

let esperaRedimensionar;
window.addEventListener('resize', () => {
  clearTimeout(esperaRedimensionar);
  esperaRedimensionar = setTimeout(montarFundo, 200);
});

const linksMenu = document.querySelectorAll('.menu-link');
const secoes = document.querySelectorAll('main section[id]');

const observador = new IntersectionObserver(entradas => {
  entradas.forEach(entrada => {
    if (!entrada.isIntersecting) return;

    linksMenu.forEach(link => {
      const ehEsta = link.getAttribute('href') === '#' + entrada.target.id;
      link.classList.toggle('ativo', ehEsta);

      if (ehEsta) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  });
}, { rootMargin: '-50% 0px -50% 0px' });

secoes.forEach(secao => observador.observe(secao));

const menu = document.querySelector('.menu');
const menuBotao = document.getElementById('menu-botao');

function atualizarRotuloMenu() {
  const aberto = menu.classList.contains('aberto');
  menuBotao.setAttribute('aria-label', aberto ? t('menu.fechar') : t('menu.abrir'));
}

function abrirMenu(abrir) {
  menu.classList.toggle('aberto', abrir);
  menuBotao.setAttribute('aria-expanded', abrir);
  atualizarRotuloMenu();
}

menuBotao.addEventListener('click', () => {
  abrirMenu(!menu.classList.contains('aberto'));
});

linksMenu.forEach(link => link.addEventListener('click', () => abrirMenu(false)));

document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape' && menu.classList.contains('aberto')) {
    abrirMenu(false);
    menuBotao.focus();
  }
});

const botaoIdioma = document.getElementById('botao-idioma');
const listaIdiomas = document.getElementById('lista-idiomas');
let idiomaAtual = 'pt';


function t(chave) {
  return traducoes[idiomaAtual][chave];
}

function aplicarIdioma(idioma) {
  idiomaAtual = idioma;

  document.documentElement.lang = t('codigo');
  document.title = t('site.titulo');

  document.querySelectorAll('[data-i18n]').forEach(elemento => {
    elemento.textContent = t(elemento.dataset.i18n);
  });

  document.querySelectorAll('[data-i18n-label]').forEach(elemento => {
    elemento.setAttribute('aria-label', t(elemento.dataset.i18nLabel));
  });

  listaIdiomas.querySelectorAll('button').forEach(botao => {
    if (botao.dataset.idioma === idioma) {
      botao.setAttribute('aria-current', 'true');
    } else {
      botao.removeAttribute('aria-current');
    }
  });

  atualizarRotuloTema(); 
  atualizarRotuloMenu();
  localStorage.setItem('idioma', idioma);
}

function abrirIdiomas(abrir) {
  listaIdiomas.hidden = !abrir;
  botaoIdioma.setAttribute('aria-expanded', abrir);
}

botaoIdioma.addEventListener('click', () => {
  abrirIdiomas(listaIdiomas.hidden);
});

listaIdiomas.addEventListener('click', evento => {
  const botao = evento.target.closest('button[data-idioma]');
  if (!botao) return;

  aplicarIdioma(botao.dataset.idioma);
  abrirIdiomas(false);
  botaoIdioma.focus();
});

document.addEventListener('click', evento => {
  if (!evento.target.closest('.idiomas')) abrirIdiomas(false);
});

document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape' && !listaIdiomas.hidden) {
    abrirIdiomas(false);
    botaoIdioma.focus();
  }
});

const botaoTema = document.getElementById('botao-tema');

function atualizarRotuloTema() {
  const temaAtual = document.documentElement.dataset.tema;
  botaoTema.setAttribute('aria-label', temaAtual === 'claro' ? t('tema.ativarEscuro') : t('tema.ativarClaro'));
}

function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  atualizarRotuloTema();
}

aplicarTema('escuro');

botaoTema.addEventListener('click', () => {
  const temaAtual = document.documentElement.dataset.tema;
  aplicarTema(temaAtual === 'claro' ? 'escuro' : 'claro');
});

const idiomaSalvo = localStorage.getItem('idioma');
const idiomaNavegador = navigator.language.slice(0, 2);

if (idiomaSalvo && traducoes[idiomaSalvo]) {
  aplicarIdioma(idiomaSalvo);
} else if (traducoes[idiomaNavegador]) {
  aplicarIdioma(idiomaNavegador);
} else {
  aplicarIdioma('pt');
}

const formulario = document.getElementById('formulario');
const aviso = document.getElementById('aviso');

function mostrarErro(campo, mensagem) {
  const erro = document.getElementById('erro-' + campo.id);
  erro.textContent = mensagem;
  campo.setAttribute('aria-invalid', mensagem ? 'true' : 'false');
}

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const nome = formulario.nome;
  const email = formulario.email;
  const mensagem = formulario.mensagem;
  let valido = true;

  // 1. Confere cada campo
  if (!nome.value.trim()) {
    mostrarErro(nome, t('form.erroNome'));
    valido = false;
  } else {
    mostrarErro(nome, '');
  }

  if (!email.value.trim() || !email.validity.valid) {
    mostrarErro(email, t('form.erroEmail'));
    valido = false;
  } else {
    mostrarErro(email, '');
  }

  if (mensagem.value.trim().length < 10) {
    mostrarErro(mensagem, t('form.erroMensagem'));
    valido = false;
  } else {
    mostrarErro(mensagem, '');
  }

  if (!valido) {
    formulario.querySelector('[aria-invalid="true"]').focus(); 
    return;
  }

  const botao = formulario.querySelector('button');
  botao.disabled = true;
  aviso.textContent = t('form.enviando');

  try {
    const resposta = await fetch(formulario.action, {
      method: 'POST',
      body: new FormData(formulario),
      headers: { Accept: 'application/json' },
    });

    if (resposta.ok) {
      aviso.textContent = t('form.sucesso');
      formulario.reset();
    } else {
      aviso.textContent = t('form.falha');
    }
  } catch {
    aviso.textContent = t('form.semInternet');
  }

  botao.disabled = false;
});

document.getElementById('ano').textContent = new Date().getFullYear();