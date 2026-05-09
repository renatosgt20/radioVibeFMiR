// ==============================
// VIBE FM - Rádio 
// ==============================

const player = new Audio();
let tocando = false;
let pastaAtual = "lofi";

const PASTAS = {
  lofi: { arquivos: [] },
  hitsnoite: { arquivos: [] },
  psy: { arquivos: [] },
  grove: { arquivos: [] },
  night: { arquivos: [] },
  forest: { arquivos: [] },

  // Novas programações (cole aqui os links .mp3)
  fundaovibe: { arquivos: [] },
  chilldrive: { arquivos: [] }
};

let filaAtual = [];
let idxAtual = 0;
let audioLiberado = false;

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

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115450/musica66_ibpn4p.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115436/musica12_igkfdh.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115458/musica99_juqnfw.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115438/musica23_zuvk5p.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115435/musica13_mumbfk.mp3"
  ];

  // ==============================
  // PASTAS SÁBADO / DOMINGO
  // ==============================
  PASTAS.grove.arquivos = [
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329906/musica24_unepzg.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329901/musica9_shx3zx.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329888/musica36_zmhxza.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329878/musica30_dsxonw.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329849/musica1_y6zvwy.mp3"
  ];

  PASTAS.night.arquivos = [
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331304/musica19_b896ns.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331301/musica21_g5aruq.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331274/musica5_bgsobh.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331273/musica8_pqoazn.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331272/musica4_lno4ei.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331271/musica7_b2nb1g.mp3"
  ];

  PASTAS.forest.arquivos = [
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333154/musica5_uine2m.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333148/musica16_m9p18d.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333109/musica17_c8h8yn.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333050/musica14_gpbgcg.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333035/musica7_ec9k0y.mp3"
  ];

  PASTAS.fundaovibe.arquivos = [
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341199/musica47_ww86hb.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341195/musica45_dmmzrg.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341190/musica44_dj6xun.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341188/musica43_zsfaze.mp3",
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341184/musica41_tluppn.mp3"
  ];

  // psy/chilldrive (você pode preencher depois; por enquanto deixa vazio para não quebrar)
  PASTAS.psy.arquivos = [];
  PASTAS.chilldrive.arquivos = [];

  // Para não quebrar o player caso psy/chilldrive estejam vazios, garantimos fallback em tocarMusica.
  // (A lógica de horário abaixo já encaminha as faixas.)
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
// HORÁRIO
// ==============================

function getPastaInicialPorHorario() {
  const now = new Date();
  const day = now.getDay(); // 0=Dom, 1=Seg, ... 6=Sáb
  const h = now.getHours();

  // ==============================
  // SÁBADO / DOMINGO (blocos fixos)
  // ==============================
  if (day === 6) {
    // sábado
    if (h >= 18 && h < 21) return "psy";
    if (h >= 21 && h < 24) return "grove";
  }

  if (day === 0) {
    // domingo
    if (h >= 0 && h < 5) return "night";
    if (h >= 5 && h < 6) return "forest";
    if (h >= 6 && h < 8) return "fundaovibe";
  }

  // ==============================
  // Regras normais da semana
  // ==============================

  const diaUtil = day >= 1 && day <= 5;

  if (h >= 0 && h < 4) return "lofi";
  if (h >= 4 && h < 6) return diaUtil ? "chilldrive" : "lofi";
  if (h >= 6 && h < 8) return "fundaovibe";
  if (h >= 8 && h < 14) return "hitsnoite";
  if (h >= 14 && h < 17) return "lofi";
  if (h >= 17 && h < 19) return diaUtil ? "fundaovibe" : "hitsnoite";

  return "hitsnoite";
}

// ==============================
// PREPARAR FILA
// ==============================

function prepararFila(pasta) {
  const lista = PASTAS[pasta]?.arquivos || [];
  return {
    fila: embaralhar(lista),
    indice: 0
  };
}

// ==============================
// 🔓 DESBLOQUEAR ÁUDIO
// ==============================

async function desbloquearAudio() {
  if (audioLiberado) return true;

  try {
    await player.play();
    player.pause();
    player.currentTime = 0;

    audioLiberado = true;
    console.log("🔊 Áudio liberado pelo navegador");
    return true;

  } catch (e) {
    console.log("❌ Ainda bloqueado:", e);
    return false;
  }
}

// ==============================
// TOCAR MÚSICA
// ==============================

async function tocarMusica(src, pasta) {
  // fallback se playlist vazia
  if (!src) {
    const fallback = PASTAS.lofi?.arquivos?.[0];
    if (!fallback) return;
    src = fallback;
  }

  player.src = src;
  player.crossOrigin = "anonymous";

  try {
    await player.play();
    tocando = true;
  } catch (e) {
    tocando = false;
    console.log("❌ Bloqueado ao tocar:", e);
  }
}

// ==============================
// PRÓXIMA MÚSICA
// ==============================

function proximaMusica() {
  const pastaPorHorario = getPastaInicialPorHorario();

  if (pastaPorHorario !== pastaAtual || idxAtual >= filaAtual.length) {
    pastaAtual = pastaPorHorario;
    const prep = prepararFila(pastaAtual);
    filaAtual = prep.fila;
    idxAtual = 0;
  }

  const musica = filaAtual[idxAtual];
  idxAtual++;

  tocarMusica(musica, pastaAtual);
}

// ==============================
// BOTÃO PLAY
// ==============================

async function tocarRadio() {
  const btn = document.getElementById("btnRadio");

  if (!audioLiberado) {
    const ok = await desbloquearAudio();
    if (!ok) {
      alert("Clique novamente para liberar o áudio 🔊");
      return;
    }
  }

  if (tocando) {
    player.pause();
    tocando = false;
    if (btn) btn.innerHTML = "▶ PLAY";
    return;
  }

  if (!player.src) {
    inicializarListas();
    pastaAtual = getPastaInicialPorHorario();

    const prep = prepararFila(pastaAtual);
    filaAtual = prep.fila;
    idxAtual = 0;

    player.onended = () => {
      if (tocando) proximaMusica();
    };

    proximaMusica();
  } else {
    try {
      await player.play();
    } catch (e) {
      console.error("Erro ao tocar:", e);
    }
  }
}

