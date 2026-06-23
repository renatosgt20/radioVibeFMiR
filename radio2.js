// VIBE FM - Rádio
// ==============================

// Usar apenas o <audio id="audio"> do HTML (evita conflito de 2 players)
// Obter diretamente para garantir que esteja disponível
let playerEl = document.getElementById("audio");

let tocando = false;
let pastaAtual = "";
let filaAtual = [];
let idxAtual = 0;
let audioLiberado = false;

// anti-repetição imediata (evita ended escolher a mesma faixa)
let ultimaMusicaSrc = null;
let proximoPending = false;

// ==============================
// LOCKS/FLAGS anti-concorrência (evita AbortError, play/pause simultâneos e loops)
// ==============================
let playPending = false;        // existe um playerEl.play() pendente (await em andamento)
let pauseRequested = false;    // pedido de pause enquanto playPending estiver true
let lastPlayToken = 0;         // identifica a última tentativa de play (evita corrida)
let clickDebounceTimer = 0;    // debounce do clique no botão
let playClickLocked = false;   // bloqueio de clique duplo
let audioErrorPending = false; // evita múltiplos handlers de error disparando proximaMusica em loop
let connectionRecoveryTimer = null;


// ==============================
// PASTAS
// ==============================

const PASTAS = {

  vibezonefm: {
    arquivos: [
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica96_hvrhoz.mp3",

    ]
  },

  rootsvibe: {
    arquivos: [
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica96_hvrhoz.mp3",

    ]
  },

  baladavibe: {
    arquivos: [
    "https://audio.jukehost.co.uk/019ef1b8-4a6a-7202-8eb7-4ac302a5ad27",
    "https://audio.jukehost.co.uk/019ef1b8-5bb5-730d-8da5-187ad7408311",
    "https://audio.jukehost.co.uk/019ef1b8-b19c-72fd-b912-cdc57cf6acd7",
    "https://audio.jukehost.co.uk/019ef1b8-7e80-7092-b9b4-09d22efc7dfa",
    "https://audio.jukehost.co.uk/019ef1b8-c3b2-704d-9e51-d3a76c07a72d",
    "https://audio.jukehost.co.uk/019ef1b8-cf8d-708f-b24e-00e83268fcda",
    "https://audio.jukehost.co.uk/019ef1b8-cd2f-73e8-bced-94dc10f09ff1",
    "https://audio.jukehost.co.uk/019ef1b8-b0fb-70bb-b6f5-8aa3c1e4441f",
    "https://audio.jukehost.co.uk/019ef1b8-a5b7-7317-bbaa-46aab4a64d59",
    "https://audio.jukehost.co.uk/019ef1b8-aa22-7056-8527-e4062381fa33",
    "https://audio.jukehost.co.uk/019ef1b8-b1ee-718e-8407-bfd7f06d9625",
    "https://audio.jukehost.co.uk/019ef1b8-4b0f-70c8-93b9-c3f573e08180",
    "https://audio.jukehost.co.uk/019ef1b8-7fbb-70e7-8811-83296c4055b5",
    "https://audio.jukehost.co.uk/019ef1b8-ceb4-7160-9fae-2b33cec7c0ef",
    "https://audio.jukehost.co.uk/019ef1b8-cb4e-705c-bfe6-380e37f989f6",
    "https://audio.jukehost.co.uk/019ef1b8-c48f-7384-affe-222c2a2447cf",
    "https://audio.jukehost.co.uk/019ef1b8-c801-7131-a40d-6e363b0207cd",
    "https://audio.jukehost.co.uk/019ef1b8-c5d7-729e-8367-f6626d627588",
    "https://audio.jukehost.co.uk/019ef1b8-d652-7367-aaa9-d89148a21037",
    "https://audio.jukehost.co.uk/019ef1b8-77ce-72e5-9ec3-9a71451d80b5",
    "https://audio.jukehost.co.uk/019ef1b8-8845-714a-b3e2-2bed9abc82f6",
    "https://audio.jukehost.co.uk/019ef1b8-c408-7316-8450-80d32ab4f1cb",
    "https://audio.jukehost.co.uk/019ef1b8-4ba7-7206-8337-3b54a0388c71",
    "https://audio.jukehost.co.uk/019ef1b8-d998-73aa-8696-ff26a7ccd7e1",
    "https://audio.jukehost.co.uk/019ef1b8-b13a-7391-aa83-766dc467429a",
    "https://audio.jukehost.co.uk/019ef1b8-c4d6-7103-86f5-177093904993",
    "https://audio.jukehost.co.uk/019ef1b8-7c45-73c4-a5bc-e15eef35dfe2",
    "https://audio.jukehost.co.uk/019ef1b8-d013-72e3-bd74-b61e46fcf3e5",
    "https://audio.jukehost.co.uk/019ef1b8-cf10-70de-87d6-318723337dd7",
    "https://audio.jukehost.co.uk/019ef1b8-c44b-7231-a5f4-8dc759757123",
    "https://audio.jukehost.co.uk/019ef1b8-d6dc-73ed-994d-53f498352f82",
    "https://audio.jukehost.co.uk/019ef1b8-c51a-738f-b69a-9ad96506c672",
    "https://audio.jukehost.co.uk/019ef1b8-cf50-712c-903b-75b716f3d353",
    "https://audio.jukehost.co.uk/019ef1b8-4c71-7319-a80d-9c62b8c72685",
    "https://audio.jukehost.co.uk/019ef1b8-cdbb-70d5-893f-07249fda4f3e",
    "https://audio.jukehost.co.uk/019ef1b8-85c3-706e-95bd-5f71b1c31902",
    "https://audio.jukehost.co.uk/019ef1b8-cb03-71ff-8e41-9cb8b6562609",
    "https://audio.jukehost.co.uk/019ef1b8-8391-728d-950b-a342c42a7c3b",
    "https://audio.jukehost.co.uk/019ef1b8-cc24-7178-bd49-10c2575e3e9c",
    "https://audio.jukehost.co.uk/019ef1b8-ca69-72ae-9167-a19bd4988701",
    "https://audio.jukehost.co.uk/019ef1b8-ce03-7075-be06-a41c5f5400a3",
    "https://audio.jukehost.co.uk/019ef1b8-8bc5-719b-8fc1-681e2f3a0379",
    "https://audio.jukehost.co.uk/019ef1b8-cc93-73ff-8112-84cab3287110",
    "https://audio.jukehost.co.uk/019ef1b8-d05e-73f7-b0dc-e3efdc9d8354",
    "https://audio.jukehost.co.uk/019ef1b8-4b0f-7164-92ea-d75c2d0e5186",
    "https://audio.jukehost.co.uk/019ef1b8-c366-73dd-9332-5f39ee72f51d",
    "https://audio.jukehost.co.uk/019ef1b8-7921-71ac-a95f-6e32818a152f",
    "https://audio.jukehost.co.uk/019ef1b8-c325-7258-808d-b16f83d9baab",
    "https://audio.jukehost.co.uk/019ef1b8-c8e1-704a-8109-fd446c6c634a",
    "https://audio.jukehost.co.uk/019ef1b8-cb90-7328-b493-25c7a6acfde6",
    "https://audio.jukehost.co.uk/019ef1b8-7f45-714b-a6a8-c5dcffc4ee22",
    "https://audio.jukehost.co.uk/019ef1b8-a8e1-7281-a00a-ca977dd0a49c",
    "https://audio.jukehost.co.uk/019ef1b8-c2e0-7051-83d3-68cd2fdf4b45",
    "https://audio.jukehost.co.uk/019ef1b8-c28e-716d-9601-c5b47c87d054",
    "https://audio.jukehost.co.uk/019ef1b8-cabf-71fa-97f3-f575f2f62940",
    "https://audio.jukehost.co.uk/019ef1b8-4957-70ec-af0a-eab74623c7ad",
    "https://audio.jukehost.co.uk/019ef1b8-c561-7343-b69e-b599836f330f",
    "https://audio.jukehost.co.uk/019ef1b8-ca1b-70f2-9f74-7057d7538238",
    "https://audio.jukehost.co.uk/019ef1b8-a934-735c-8bd3-3307c058a2c9",
    "https://audio.jukehost.co.uk/019ef1b8-d0d2-7334-a74e-c1d820a27281",
    "https://audio.jukehost.co.uk/019ef1b8-83f0-7075-8268-185a26b867f9",
    "https://audio.jukehost.co.uk/019ef1b8-a9dd-7121-85a9-7b7c746458be",
    "https://audio.jukehost.co.uk/019ef1b8-797f-72cc-ab7d-969f21c8924d",
    "https://audio.jukehost.co.uk/019ef1b8-ce58-7133-91f8-0b767518672c",
    "https://audio.jukehost.co.uk/019ef1b8-c736-71b7-b6ce-5ff863d73e0b",
    "https://audio.jukehost.co.uk/019ef1b8-cbd1-7368-840a-c8c38e456eee",
    "https://audio.jukehost.co.uk/019ef1b8-4b3f-72b2-92e1-7671701a4199",
    "https://audio.jukehost.co.uk/019ef1b8-c247-710b-8d77-850c6d610468",
    "https://audio.jukehost.co.uk/019ef1b8-c61d-7107-965c-52f0b8b64a89",
    "https://audio.jukehost.co.uk/019ef1b8-c8aa-7307-9001-6201035689dd",
    "https://audio.jukehost.co.uk/019ef1b8-c1e8-70b6-b97f-998ffbbaed1e",
    "https://audio.jukehost.co.uk/019ef1b8-897c-72e4-91d6-8746207bc3c0",
    "https://audio.jukehost.co.uk/019ef1b8-87e7-71b1-9cfb-fa41695eef90",
    "https://audio.jukehost.co.uk/019ef1b8-cd72-73dd-895f-275ad4ed4000",
    "https://audio.jukehost.co.uk/019ef1b8-cce7-73c5-8c57-22fd597ec1eb",
    "https://audio.jukehost.co.uk/019ef1b8-cdb9-73dc-a504-244a32cd8cc9",
    "https://audio.jukehost.co.uk/019ef1b8-4998-7028-9e22-26b5ff09f2e8",
    "https://audio.jukehost.co.uk/019ef1b8-49d1-70c2-952b-be081fcc37a1",
  

    ]
  },


  lofi: {
    arquivos: [
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica96_hvrhoz.mp3",

    ]
  },

  hitsvibe: {
    arquivos: [
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932734/musica10_canhmr.mp3",

    
    ]
  },

  fundaovibe: {
    arquivos: [
   "https://res.cloudinary.com/dmodpbtae/video/upload/v1778341199/musica47_ww86hb.mp3",

    ]
  },

    chilldrive: {
    arquivos: [
      "https://res.cloudinary.com/dmodpbtae/video/upload/v1778345961/musica11_ozii3j.mp3",
 
    ]
  },

  grove: {
    arquivos: [
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778329906/musica24_unepzg.mp3",

    ]
  },

  night: {
    arquivos: [
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778331304/musica19_b896ns.mp3",

    
    ]
  },

  forest: {
    arquivos: [
    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778333154/musica5_uine2m.mp3",

    ]
  }

};

// ==============================
// ALEATORIEDADE SINCRONIZADA (determinística mas “embaralhada”)
// ==============================
// Mantém a mesma sequência para todos (sem Math.random), mas a ordem dentro da pasta
// não fica na ordem do array.

// FNV-1a 32-bit
function hashStringToInt(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0);
}

// Mulberry32 PRNG determinístico (gera “aleatoriedade” igual em todos)
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleDeterministico(array, seed) {
  const arr = array.slice();
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getFaseKey() {
  // Usamos (pasta + data/hora) no timezone da rádio para manter sincronização por faixa/horário.
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/Belem" })
  );
  // chave por hora (ajuste se quiser granulação diferente)
  return `${now.getDay()}-${now.getHours()}-${now.getDate()}`;
}

function pickAleatorioSemRepeticao(pasta, arquivos, indexGlobal) {
  const n = arquivos.length;
  if (n === 0) return null;
  if (n === 1) return arquivos[0];

  // embaralha uma vez por “fase de horário” e pega o indexGlobal na ordem embaralhada.
  const faseKey = getFaseKey();
  const seed = hashStringToInt(`${pasta}|${faseKey}`);
  const filaEmbaralhada = shuffleDeterministico(arquivos, seed);

  return filaEmbaralhada[indexGlobal % n];
}


// ==============================
// PROGRAMADOR AUTOMÁTICO
// ==============================

function getPastaInicialPorHorario() {
  const now = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "America/Belem"
    })
  );

  const day = now.getDay(); // 0=Dom, 6=Sáb
  const h = now.getHours();

  // =========================================
  // SÁBADO (mantém como está)
  // =========================================
  if (day === 6) {
    // 18h até 21h
    if (h >= 18 && h < 21) {
      return "grove";
    }

    // 21h até 23:59
    if (h >= 21 && h <= 23) {
      return "night";
    }
  }

  // =========================================
  // DOMINGO (00h até 06h mantêm como está)
  // =========================================
  if (day === 0) {
    // 00h até 05h = forest
    if (h >= 0 && h < 5) {
      return "forest";
    }

    // 05h até 06h = grove
    if (h >= 5 && h < 6) {
      return "grove";
    }
  }

  // =========================================
  // SEG-SEX e DOM (após 06h): grade nova
  // =========================================
  // 02h até 04h
  if (h >= 2 && h < 4) {
    return "lofi";
  }

  // 04h até 06h
  if (h >= 4 && h < 6) {
    return "chilldrive";
  }

  // 06h até 08h
  if (h >= 6 && h < 8) {
    return "fundaovibe";
  }

  // 08h até 12h
  if (h >= 8 && h < 12) {
    return "hitsvibe";
  }

  // 12h até 14h
  if (h >= 12 && h < 14) {
    return "hitsvibe";
  }

  // 14h até 17h
  if (h >= 14 && h < 17) {
    return "hitsvibe";
  }

  // 17h até 18h
  if (h >= 17 && h < 18) {
    return "fundaovibe";
  }
  
  // 18h até 02h
  // 18h-24h => hitsvibe
  // 00h-02h => hitsvibe
  if (h >= 18 || h < 2) {
    return "hitsvibe";
  }

  // se não entrou em nenhum bloco acima, é 02h-04h => hitvibe
  // (demais regras já cobrem o resto do dia)
  return "hitsvibe";
}

// ==============================
// ESTADO DA RÁDIO (por fase)
// ==============================
let indexMusicaNaFase = 0; // incrementa quando uma música termina

function getArquivosDaPasta(nomePasta) {
  return PASTAS[nomePasta]?.arquivos || [];
}

function avancarParaNovaFaseSePreciso() {
  const fase = getPastaInicialPorHorario();
  if (fase !== pastaAtual) {
    pastaAtual = fase;
    indexMusicaNaFase = 0; // reseta “deck” ao mudar fase/horário
    return true;
  }
  return false;
}

// ==============================
// TOCAR MÚSICA
// ==============================

function withCacheBust(src) {
  try {
    const ts = Date.now();
    // preserva querystring existente
    return src + (src.includes('?') ? '&' : '?') + 'cb=' + ts;
  } catch {
    return src;
  }
}

async function tocarMusica(src) {
  if (!src) {
    console.warn("Nenhuma música encontrada");
    return;
  }
  if (!playerEl) return;

  // Cloudinary + HTTP/2 pode falhar quando reaproveita conexão/cache.
  // Para forçar novo request do MP3 quando trocamos faixa (ou ao retomar após erro),
  // usamos cache-bust.
  const finalSrc = withCacheBust(src);

  // Troca o src somente se necessário
  if (playerEl.src !== finalSrc) {
    playerEl.src = finalSrc;
  }


  try {
    // Evita múltiplos play() sobrepostos via locks globais.
    if (!playPending) {
      playPending = true;
    }

    await playerEl.play();
    tocando = true;
    console.log("🎵 Tocando:", pastaAtual);
  } catch (e) {
    console.log("Erro ao tocar:", e);
    tocando = false;

    // se falhou por concorrência/pause, liberamos rapidamente o flag de playPending.
    // (o lock principal é controlado por tocarRadio())
    // Não setamos playPending=false aqui para não quebrar token/lock do clique.
  }
}


// ==============================
// PRÓXIMA MÚSICA
// ==============================

async function proximaMusica() {
  // Evita loops/duplicidade se `ended` disparar mais de uma vez.
  if (proximoPending) return;
  // Não avança playlist enquanto play/pause estão no meio do caminho.
  if (playPending) return;
  proximoPending = true;


  try {
    // fase atual pelo horário
    const pastaHorario = getPastaInicialPorHorario();
    if (pastaHorario !== pastaAtual) {
      pastaAtual = pastaHorario;
      indexMusicaNaFase = 0;
      console.log("📅 Mudando programação para:", pastaAtual);
      ultimaMusicaSrc = null; // ao mudar de fase, não força anti-repetição do src anterior
    }

    const arquivos = getArquivosDaPasta(pastaAtual);
    if (!arquivos.length) return;

    // escolhe nova faixa tentando não repetir a atual imediatamente
    let tentativa = 0;
    let musica = null;

    // tentativas limitadas: muda indexMusicaNaFase e gera outra posição no shuffle determinístico
    while (tentativa < 10) {
      const candidato = pickAleatorioSemRepeticao(pastaAtual, arquivos, indexMusicaNaFase);
      indexMusicaNaFase++;

      // pula candidato se for o mesmo src (evita repetição imediata)
      if (candidato && candidato !== ultimaMusicaSrc) {
        musica = candidato;
        break;
      }
      tentativa++;
    }

    // se não achou diferente (playlist com repetição real/única), toca o último candidato válido
    if (!musica) {
      musica = pickAleatorioSemRepeticao(pastaAtual, arquivos, indexMusicaNaFase % arquivos.length);
    }

    if (!musica) return;

    ultimaMusicaSrc = musica;
    await tocarMusica(musica);
    atualizarBtnAgora();
  } finally {
    proximoPending = false;
  }
}


// ==============================
// BOTÃO PLAY
// ==============================
// MAPEAMENTO PASTA -> NOME DO PROGRAMA
// ==============================
const PROGRAMAS = {
  fundaovibe: "🔥 Fundão da Vibe 🔥",
  hitsvibe:   "⭐ Hits Vibe ⭐",
  lofi:        "🎧 Lo-Fi Vibe 🎧",
  chilldrive:  "☕ Chill Vibe ☕",
  grove:       "🌀 PSY Vibe 🌀 ",
  night:       "🌙 PSY Vibe 🌙",
  forest:      "🌲 PSY Vibe 🌲 "
};

function atualizarBtnAgora() {
  const btn = document.getElementById("btnAgora");
  const nomeSpan = document.getElementById("nomePrograma");
  if (!btn || !nomeSpan) return;

  // sincroniza pelo estado real do audio (evita "tocando" preso)
  const isPlaying = !!playerEl && !playerEl.paused && !playerEl.ended;
  tocando = isPlaying;

  if (isPlaying && pastaAtual) {
    btn.style.display = "block";
    nomeSpan.textContent = PROGRAMAS[pastaAtual] || pastaAtual;
  } else {
    btn.style.display = "none";
  }
}


function setMainButtonText(texto) {
  // NÃO mexe em layout/CSS. Apenas texto do botão principal.
  // No seu HTML o botão é: <button class="play-btn" ...>
  // Não existe id="btnRadio".
  const h2 = document.querySelector(".play-btn .play-text h2");
  if (h2) {
    h2.textContent = texto;
  }
}




// ==============================

async function tocarRadio() {
  if (!playerEl) return;

  // debounce + bloqueio de clique duplo (evita múltiplos play() simultâneos)
  const nowTs = Date.now();
  if (nowTs - clickDebounceTimer < 250) return;
  clickDebounceTimer = nowTs;

  // Fonte da verdade antes de agir: evita botão preso após ended/error/pause.
  if (playerEl.ended || playerEl.paused) {
    pauseRequested = false;
    playPending = false;
    playClickLocked = false;
    tocando = false;
  }

  if (playClickLocked) return;

  // Se um play() já está pendente, não dispare outro.
  // Em vez disso, transforma clique em "pedido" de pause.
  if (playPending) {
    pauseRequested = true;
    return;
  }


  // Caso: se estiver tocando, pausa (mas só se NÃO houver play pendente)
  if (!playerEl.paused && !playerEl.ended) {
    pauseRequested = false;
    try {
      // Antes de pausar, garanta que não há play recém-disparado em loop
      if (!playPending) {
        playerEl.pause();
      }
    } catch (e) {
      console.log("Erro ao pausar:", e);
    }
    return;
  }

  // Caso inicial: se não há src/sem tocar ainda, inicia a primeira música
  const temSrc = !!playerEl.getAttribute('src') || !!playerEl.src;
  if (!temSrc && !tocando) {
    // define pastaAtual/idx e toca a primeira faixa
    pastaAtual = getPastaInicialPorHorario();
    indexMusicaNaFase = 0;

    atualizarBtnAgora();

    const arquivos = getArquivosDaPasta(pastaAtual);
    const musica = pickAleatorioSemRepeticao(pastaAtual, arquivos, indexMusicaNaFase);
    indexMusicaNaFase++;

    // lock para evitar double play durante setup do src
    playClickLocked = true;
    const token = ++lastPlayToken;
    playPending = true;

    try {
      await tocarMusica(musica);

      // Se o usuário pediu pause durante o play, aplica agora
      if (pauseRequested && lastPlayToken === token) {
        pauseRequested = false;
        playerEl.pause();
      }
    } catch (e) {
      console.log("Erro ao tocar música inicial:", e);
    } finally {
      // somente o token atual libera o lock (evita corrida)
      if (lastPlayToken === token) {
        playPending = false;
        playClickLocked = false;
      }
      atualizarBtnAgora();
    }
    return;
  }

  // Retomar (pause/ended) com proteção anti-concorrência
  playClickLocked = true;
  const token = ++lastPlayToken;
  playPending = true;
  pauseRequested = false;

  try {
    // sincroniza o estado real antes de chamar play
    // (syncUIFromAudioState é definido dentro do setupAudioEvents; aqui usamos proteção)
    try {
      if (typeof window.syncUIFromAudioState === 'function') {
        window.syncUIFromAudioState();
      }
    } catch (_) {}


    // Se estava pausado/ended, só tenta play.
    if (playerEl.paused || playerEl.ended) {
      await playerEl.play();
    }

    // Se durante o await o usuário pediu pause, aplica.
    if (pauseRequested && lastPlayToken === token) {
      pauseRequested = false;
      try { playerEl.pause(); } catch (_) {}
    }

  } catch (e) {
    console.log("Erro ao retomar:", e);
  } finally {
    if (lastPlayToken === token) {
      playPending = false;
      playClickLocked = false;
    }
    atualizarBtnAgora();
  }
}






// ==============================
// EVENTOS DO ÁUDIO
// ==============================

let audioEventsInitialized = false;

function setupAudioEvents() {
  if (!playerEl) return;
  if (audioEventsInitialized) return;
  audioEventsInitialized = true;


  function setListeningOverlayVisible(visible) {
    // Elemento do HTML: <button id="btnAgora"> ... <span id="txtAgora">Você está ouvindo Agora</span>
    const btnAgora = document.getElementById("btnAgora");
    if (!btnAgora) return;

    btnAgora.style.display = visible ? "block" : "none";
  }

  // Fonte da verdade: sincroniza UI com o estado real do <audio>
  function syncUIFromAudioState() {
    // exporta para o tocarRadio() usar sem ReferenceError
    window.syncUIFromAudioState = syncUIFromAudioState;

    const isPlaying = !!playerEl && !playerEl.paused && !playerEl.ended;
    tocando = isPlaying;


    // Equalizador
    setEqualizerState(isPlaying);

    // Botão principal + overlay do "Ouvir Agora"
    if (isPlaying) {
      setMainButtonText("PARAR");
      atualizarBtnAgora();
      setListeningOverlayVisible(true);
    } else {
      setMainButtonText("OUVIR AGORA");
      atualizarBtnAgora();
      setListeningOverlayVisible(false);
    }
  }

  function resetMainButton() {
    // Reset rápido para o estado "não tocando"; a UI final vem do sync
    pauseRequested = false;
    playPending = false;
    playClickLocked = false;

    tocando = false;
    setEqualizerState(false);

    setMainButtonText("OUVIR AGORA");
    atualizarBtnAgora();
    setListeningOverlayVisible(false);
  }


  // Mantém referência ao setEqualizerState do tocarRadio() via closure
  // (fallback caso ainda não exista)
  function setEqualizerState(running) {
    const bars = document.querySelectorAll(".bar");

    // O equalizador no seu HTML usa apenas animationPlayState nas `.bar`.
    // Não existe `#equalizerBox`, então não devemos depender dele.
    bars.forEach(b => {
      b.style.animationPlayState = running ? "running" : "paused";
    });
  }


  // Atualização 100% baseada nos eventos do <audio>.
  // (Adicionar apenas uma vez; protege travamentos e não duplica listeners)
  playerEl.addEventListener("play", () => {
    // ao iniciar, limpa flags que podem ter ficado presas
    pauseRequested = false;
    playPending = false;
    playClickLocked = false;
    audioErrorPending = false;
    syncUIFromAudioState();
  });

  playerEl.addEventListener("pause", () => {
    pauseRequested = false;
    playPending = false;
    playClickLocked = false;
    syncUIFromAudioState();
  });

  playerEl.addEventListener("ended", () => {
    // Reset antes de avançar: evita travar botão por lock pendente.
    playPending = false;
    pauseRequested = false;
    playClickLocked = false;
    proximoPending = false;
    audioErrorPending = false;

    tocando = false;
    syncUIFromAudioState();

    // Ao terminar naturalmente, tenta próxima música.
    setTimeout(() => proximaMusica(), 0);
  });


  playerEl.addEventListener("error", () => {
    // error pode disparar em cascata durante troca/alt/tab, então protegemos contra loops.
    if (audioErrorPending) return;
    audioErrorPending = true;

    try {
      console.log("⚠️ Erro na música (reconexão falhou/stream quebrado). Tentando recuperar...");

      // Resetar player e UI com segurança
      pauseRequested = true;
      playPending = false;
      playClickLocked = false;

      try { playerEl.pause(); } catch (_) {}
      // Reset de tempo para evitar estados presos
      try { playerEl.currentTime = 0; } catch (_) {}

      tocando = false;
      syncUIFromAudioState();

      // Recuperação: tenta próxima faixa (uma vez) após estabilizar
      setTimeout(() => {
        audioErrorPending = false;

        // Se o usuário ainda não retomou, segue para próxima
        if (!tocando) {
          if (!proximoPending && !playPending) {
            proximaMusica();
          }
        }
      }, 900);

      // caso o navegador nunca dispare pause/play após error, liberamos guard também
      connectionRecoveryTimer = setTimeout(() => {
        audioErrorPending = false;
      }, 6000);
    } catch (e) {
      audioErrorPending = false;
      console.log("Erro no handler de error:", e);
    }
  });



}

// DOM já está pronto quando o script é executado (colocado antes de </body>)
setupAudioEvents();

// (Intencionalmente sem sincronização manual inicial do texto.
// Texto do botão é controlado EXCLUSIVAMENTE pelos eventos: play/pause/ended.)
if (playerEl) {
  atualizarBtnAgora();
}



// OBS: dai pra cima tudo certo salvo ate aqui pangare