const html             = document.querySelector('html');
const banner           = document.querySelector('.app__image');
const titulo           = document.querySelector('.app__title');

const focoBt           = document.querySelector('.app__card-button--foco');
const curtoBt          = document.querySelector('.app__card-button--curto');
const longoBt          = document.querySelector('.app__card-button--longo');
const botoes           = document.querySelectorAll('.app__card-button');

const startPauseBt     = document.querySelector('#start-pause ');
const iniciarPausarBt  = document.querySelector('#start-pause span');
const iniciarPausarImg = document.querySelector('.app__card-primary-butto-icon');

const musicaFocoInput  = document.querySelector('#alternar-musica');
const musica           = new Audio('./sons/luna-rise-part-one.mp3');
const iniciarSom       = new Audio('./sons/play.wav');
const pausarSom        = new Audio('./sons/pause.mp3');
const fimSom           = new Audio('./sons/beep.mp3');

const tempoTela            = document.getElementById('timer');
let temporizadorEmSegundos = 60*25;
let intervaloId            = null;

musica.loop = true;

focoBt.addEventListener('click',() => {
    temporizadorEmSegundos = 60*25;
    alterarContexto('foco');
    focoBt.classList.add('active');
});

curtoBt.addEventListener('click',() => {
    temporizadorEmSegundos = 60*5;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
});

longoBt.addEventListener('click',() => {
    temporizadorEmSegundos = 60*15;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
});

musicaFocoInput.addEventListener('change', () => {
    if(musica.paused){
        musica.play();
    } else {
        musica.pause();
    }
});

startPauseBt.addEventListener('click', () => {
    iniciarPausar();
});

function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function (contexto){
        contexto.classList.remove('active');
    })

    html.setAttribute('data-contexto',contexto);
    banner.setAttribute('src',`./imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `
                Otimize sua produtividade,<br>
                <strong class="app__title-strong">mergulhe no que importa.</strong>
            `;
            break;
        case 'descanso-curto':
            titulo.innerHTML = `
                Que tal dar uma respirada?<br>
                <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `;
            break;
        case 'descanso-longo':
            titulo.innerHTML = `
                Hora de voltar à superfície.<br>
                <strong class="app__title-strong">Faça uma pausa longa.</strong>
            `;
            break;
        default:
            break;
    };
}

const contagemRegressiva = () => {
    if(temporizadorEmSegundos <= 0){
        fimSom.play();
        alert('Fim do Tempo!');
        focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado');
            document.dispatchEvent(evento);
        }
        zerar();
        return;
    }
    temporizadorEmSegundos -= 1;
    mostrarTempo();
}

function iniciarPausar() {
    if(intervaloId){
        pausarSom.play();
        zerar();
        return;
    }
    iniciarSom.play();
    intervaloId     = setInterval(contagemRegressiva,1000);
    iniciarPausarBt.textContent = "Pausar";
    iniciarPausarImg.setAttribute('src',`./imagens/pause.png`);
}

function zerar() {
    clearInterval(intervaloId);
    intervaloId = null;
    iniciarPausarBt.textContent = "Começar";
    iniciarPausarImg.setAttribute('src',`./imagens/play_arrow.png`);
}

function mostrarTempo() {
    const tempo          = new Date(temporizadorEmSegundos*1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br',{minute: '2-digit', second: '2-digit'});
    tempoTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();