// ==============================
// VIBE FM - Rádio Automática
// ==============================

const player = new Audio();
let tocando = false;
let pastaAtual = "lofi";

const PASTAS = {
  lofi: { arquivos: [] },
  hitsnoite: { arquivos: [] }
};

// Estado da fila
let filaAtual = [];
let idxAtual = 0;

// ==============================
// LISTAS DAS MÚSICAS
// ==============================

function inicializarListas() {

  PASTAS.lofi.arquivos = [

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica96_hvrhoz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115443/musica49_yoxbjc.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115430/musica123_uhyzyp.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115462/musica101_eldtz1.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115427/musica108_d2nkzz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115438/musica20_yim2xd.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115433/musica9_lnnccr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115429/musica118_kmy7iu.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115442/musica56_zxgswj.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115433/musica122_uzfybx.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115430/musica2_r985ip.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115430/musica123_uhyzyp.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115427/musica113_qc9hqa.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115434/musica11_x75y6i.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115426/musica116_vqpcpf.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115460/musica91_pxbyvh.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115451/musica85_vu8fno.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115431/musica120_q3yssr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115447/musica79_qknod1.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115436/musica22_ioxkds.mp3",

    ""

    ""


  ];

  PASTAS.hitsnoite.arquivos = [

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932734/musica10_canhmr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932771/musica70_slnbr4.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932739/musica24_rehlhm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932776/musica74_j7vyix.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932758/musica55_avwhjt.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932730/musica6_hybjkn.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932774/musica77_x3r74a.mp3",
    
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932768/musica67_leroag.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932749/musica40_wqge80.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932739/musica24_rehlhm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932751/musica41_zde17j.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932750/musica44_o7pxdx.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932746/musica37_w1s4zr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932755/musica51_dxgrm3.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932736/musica17_xioldy.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932726/musica2_v5klda.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932747/musica39_ooiubn.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932740/musica25_ijfrvg.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932757/musica52_qvuodc.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932755/musica48_mirjpq.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932728/musica4_sosrv0.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932726/musica12_lduxli.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932754/musica50_gmm3fv.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932740/musica28_n1vmjz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932763/musica62_b7sy5d.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932759/musica56_okdgsb.mp3",
    


  ];

}

// ==============================
// EMBARALHAR
// ==============================

function embaralhar(array) {

  const arr = array.slice();

  for (let i = arr.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];

  }

  return arr;

}

// ==============================
// DEFINIR PASTA PELO HORÁRIO
// ==============================

function getPastaInicialPorHorario() {

  const agora = new Date();

  const h = agora.getHours();

  return h >= 6 && h < 18
    ? "hitsnoite"
    : "lofi";

}

// ==============================
// PREPARAR FILA
// ==============================

function prepararFilaDaPasta(pasta) {

  const lista = (PASTAS[pasta]?.arquivos || []).filter(Boolean);

  if (!lista.length) {

    return {
      fila: [],
      indice: 0
    };

  }

  return {

    fila: embaralhar(lista),

    indice: 0

  };

}

// ==============================
// TOCAR MÚSICA
// ==============================

function tocarMusica(src, pasta) {

  console.log("🎵 Tocando:", pasta, src);

  document.querySelectorAll(".bar").forEach(barra => {

    barra.style.animationPlayState = "running";

  });

  player.src = src;

  player.play().catch(() => {

    alert("Clique na tela para liberar o áudio 🔊");

  });

}

// ==============================
// TROCAR PASTA
// ==============================

function alternarPasta() {

  pastaAtual =
    pastaAtual === "lofi"
      ? "hitsnoite"
      : "lofi";

}

// ==============================
// PRÓXIMA MÚSICA
// ==============================

function tocarProximaDaFila() {

  if (idxAtual >= filaAtual.length) {

    alternarPasta();

    const prep = prepararFilaDaPasta(pastaAtual);

    filaAtual = prep.fila;

    idxAtual = prep.indice;

    if (!filaAtual.length) {

      console.log("Sem músicas na pasta:", pastaAtual);

      return;

    }

  }

  const musica = filaAtual[idxAtual];

  idxAtual++;

  tocarMusica(musica, pastaAtual);

}

// ==============================
// BOTÃO PLAY
// ==============================

function tocarRadio() {

  const btn = document.getElementById("btnRadio");

  // PAUSAR
  if (tocando) {

    player.pause();

    tocando = false;

    if (btn) {

      btn.innerHTML = "▶ PLAY";

    }

    return;

  }

  // CONTINUAR
  if (player.src) {

    tocando = true;

    player.play().catch(() => {

      alert("Clique na tela para liberar o áudio 🔊");

    });

    if (btn) {

      btn.innerHTML = "⏸ PARAR";

    }

    return;

  }

  // PRIMEIRO PLAY
  tocando = true;

  inicializarListas();

  pastaAtual = getPastaInicialPorHorario();

  const prep = prepararFilaDaPasta(pastaAtual);

  filaAtual = prep.fila;

  idxAtual = prep.indice;

  player.onended = () => {

    if (!tocando) return;

    tocarProximaDaFila();

  };

  tocarProximaDaFila();

  if (btn) {

    btn.innerHTML = "⏸ PARAR";

  }

}