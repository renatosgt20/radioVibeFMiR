// ==============================
// VIBE FM - Modo "Pasta por vez" (SEM repetir dentro da pasta)
// Requisito:
// - Começa conforme horário:
//    06:00-18:00 => hitsnoite
//    18:00-06:00 => lofi
// - Toca TODAS as músicas da pasta atual (baralho embaralhado, sem repetir)
// - Quando acabar a pasta, troca para a outra e toca TODAS as músicas dela
// - Alterna continuamente entre as duas pastas
// ==============================

const player = new Audio();
let tocando = false;
let pastaAtual = "lofi";

const PASTAS = {
  lofi: { arquivos: [] },
  hitsnoite: { arquivos: [] }
};

// Estado do “baralho” da pasta atual
let filaAtual = [];
let idxAtual = 0;

function inicializarListas() {
  // Importante:
  // O navegador não consegue listar diretórios localmente (ex.: ler a pasta no servidor).
  // Então precisamos de uma lista com os arquivos que existem.
  // (lista mantida como no seu arquivo original)

  // Seus arquivos têm extensão .MP3 em MAIÚSCULO.
  PASTAS.lofi.arquivos = [
    "musicas/lofi/musica2.MP3",
    "musicas/lofi/musica4.MP3",
    "musicas/lofi/musica5.MP3",
    "musicas/lofi/musica9.MP3",
    "musicas/lofi/musica11.MP3",
    "musicas/lofi/musica12.MP3",
    "musicas/lofi/musica13.MP3",
    "musicas/lofi/musica14.MP3",
    "musicas/lofi/musica15.MP3",
    "musicas/lofi/musica19.MP3",
    "musicas/lofi/musica20.MP3",
    "musicas/lofi/musica21.MP3",
    "musicas/lofi/musica22.MP3",
    "musicas/lofi/musica23.MP3",
    "musicas/lofi/musica27.MP3",
    "musicas/lofi/musica36.MP3",
    "musicas/lofi/musica39.MP3",
    "musicas/lofi/musica49.MP3",
    "musicas/lofi/musica56.MP3",
    "musicas/lofi/musica60.MP3",
    "musicas/lofi/musica63.MP3",
    "musicas/lofi/musica65.MP3",
    "musicas/lofi/musica66.MP3",
    "musicas/lofi/musica73.MP3",
    "musicas/lofi/musica77.MP3",
    "musicas/lofi/musica79.MP3",
    "musicas/lofi/musica83.MP3",
    "musicas/lofi/musica85.MP3",
    "musicas/lofi/musica87.MP3",
    "musicas/lofi/musica88.MP3",
    "musicas/lofi/musica89.MP3",
    "musicas/lofi/musica91.MP3",
    "musicas/lofi/musica94.MP3",
    "musicas/lofi/musica95.MP3",
    "musicas/lofi/musica96.MP3",
    "musicas/lofi/musica97.MP3",
    "musicas/lofi/musica98.MP3",
    "musicas/lofi/musica99.MP3",
    "musicas/lofi/musica100.MP3",
    "musicas/lofi/musica101.MP3",
    "musicas/lofi/musica102.MP3",
    "musicas/lofi/musica104.MP3",
    "musicas/lofi/musica108.MP3",
    "musicas/lofi/musica113.MP3",
    "musicas/lofi/musica116.MP3",
    "musicas/lofi/musica117.MP3",
    "musicas/lofi/musica118.MP3",
    "musicas/lofi/musica120.MP3",
    "musicas/lofi/musica122.MP3",
    "musicas/lofi/musica123.MP3"
  ];

  PASTAS.hitsnoite.arquivos = [
    "musicas/hitsnoite/musica1.MP3",
    "musicas/hitsnoite/musica2.MP3",
    "musicas/hitsnoite/musica3.MP3",
    "musicas/hitsnoite/musica4.MP3",
    "musicas/hitsnoite/musica5.MP3",
    "musicas/hitsnoite/musica6.MP3",
    "musicas/hitsnoite/musica7.MP3",
    "musicas/hitsnoite/musica8.MP3",
    "musicas/hitsnoite/musica9.MP3",
    "musicas/hitsnoite/musica10.MP3",
    "musicas/hitsnoite/musica11.MP3",
    "musicas/hitsnoite/musica12.MP3",
    "musicas/hitsnoite/musica13.MP3",
    "musicas/hitsnoite/musica14.MP3",
    "musicas/hitsnoite/musica15.MP3",
    "musicas/hitsnoite/musica16.MP3",
    "musicas/hitsnoite/musica17.MP3",
    "musicas/hitsnoite/musica18.MP3",
    "musicas/hitsnoite/musica19.MP3",
    "musicas/hitsnoite/musica20.MP3",
    "musicas/hitsnoite/musica21.MP3",
    "musicas/hitsnoite/musica22.MP3",
    "musicas/hitsnoite/musica23.MP3",
    "musicas/hitsnoite/musica24.MP3",
    "musicas/hitsnoite/musica25.MP3",
    "musicas/hitsnoite/musica26.MP3",
    "musicas/hitsnoite/musica27.MP3",
    "musicas/hitsnoite/musica28.MP3",
    "musicas/hitsnoite/musica29.MP3",
    "musicas/hitsnoite/musica30.MP3",
    "musicas/hitsnoite/musica31.MP3",
    "musicas/hitsnoite/musica32.MP3",
    "musicas/hitsnoite/musica33.MP3",
    "musicas/hitsnoite/musica34.MP3",
    "musicas/hitsnoite/musica35.MP3",
    "musicas/hitsnoite/musica36.MP3",
    "musicas/hitsnoite/musica37.MP3",
    "musicas/hitsnoite/musica38.MP3",
    "musicas/hitsnoite/musica39.MP3",
    "musicas/hitsnoite/musica40.MP3",
    "musicas/hitsnoite/musica41.MP3",
    "musicas/hitsnoite/musica42.MP3",
    "musicas/hitsnoite/musica43.MP3",
    "musicas/hitsnoite/musica44.MP3",
    "musicas/hitsnoite/musica45.MP3",
    "musicas/hitsnoite/musica46.MP3",
    "musicas/hitsnoite/musica47.MP3",
    "musicas/hitsnoite/musica48.MP3",
    "musicas/hitsnoite/musica49.MP3",
    "musicas/hitsnoite/musica50.MP3",
    "musicas/hitsnoite/musica51.MP3",
    "musicas/hitsnoite/musica52.MP3",
    "musicas/hitsnoite/musica53.MP3",
    "musicas/hitsnoite/musica54.MP3",
    "musicas/hitsnoite/musica55.MP3",
    "musicas/hitsnoite/musica56.MP3",
    "musicas/hitsnoite/musica57.MP3",
    "musicas/hitsnoite/musica58.MP3",
    "musicas/hitsnoite/musica59.MP3",
    "musicas/hitsnoite/musica60.MP3",
    "musicas/hitsnoite/musica61.MP3",
    "musicas/hitsnoite/musica62.MP3",
    "musicas/hitsnoite/musica63.MP3",
    "musicas/hitsnoite/musica64.MP3",
    "musicas/hitsnoite/musica65.MP3",
    "musicas/hitsnoite/musica66.MP3",
    "musicas/hitsnoite/musica67.MP3",
    "musicas/hitsnoite/musica68.MP3",
    "musicas/hitsnoite/musica69.MP3",
    "musicas/hitsnoite/musica70.MP3",
    "musicas/hitsnoite/musica71.MP3",
    "musicas/hitsnoite/musica72.MP3",
    "musicas/hitsnoite/musica73.MP3",
    "musicas/hitsnoite/musica74.MP3",
    "musicas/hitsnoite/musica75.MP3",
    "musicas/hitsnoite/musica76.MP3",
    "musicas/hitsnoite/musica77.MP3",
    "musicas/hitsnoite/musica78.MP3"
  ];
}

function embaralhar(array) {
  // Fisher–Yates
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getPastaInicialPorHorario() {
  const agora = new Date();
  const h = agora.getHours();
  // 06:00-18:00 => hitsnoite; 18:00-06:00 => lofi
  return h >= 6 && h < 18 ? "hitsnoite" : "lofi";
}

function prepararFilaDaPasta(pasta) {
  const lista = (PASTAS[pasta]?.arquivos || []).filter(Boolean);
  if (!lista.length) return { fila: [], indice: 0 };
  return { fila: embaralhar(lista), indice: 0 };
}

function tocarMusica(src, pasta) {
  console.log("🎵 Tocando:", pasta, src);

  // Liga o equalizador a cada troca de música
  document.querySelectorAll(".bar").forEach(b => {
    b.style.animationPlayState = "running";
  });

  player.src = src;
  player.play().catch(() => {
    alert("Clique na tela para liberar o áudio 🔊");
  });
}

function alternarPasta() {
  pastaAtual = pastaAtual === "lofi" ? "hitsnoite" : "lofi";
}

function tocarProximaDaFila() {
  // Se acabou a fila atual, troca de pasta e recarrega a fila
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
  idxAtual += 1;
  tocarMusica(musica, pastaAtual);
}

// Botão no index.html: onclick="tocarRadio()"
function tocarRadio() {
  const btn = document.getElementById("btnRadio");

  // Se já está tocando: pausa (não muda a música/estado da fila)
  if (tocando) {
    player.pause();
    tocando = false;
    if (btn) btn.innerHTML = "⏸ PARAR";
    return;
  }

  // Se está parado: retoma a partir da música atual
  // (não recarrega a lista, não muda pasta, não troca música)
  if (player.src) {
    tocando = true;
    player.play().catch(() => {
      alert("Clique na tela para liberar o áudio 🔊");
    });
    if (btn) btn.innerHTML = "⏸ PARAR";
    return;
  }

  // Primeiro start: inicializa lista e começa conforme horário
  tocando = true;
  inicializarListas();

  pastaAtual = getPastaInicialPorHorario();

  const prep = prepararFilaDaPasta(pastaAtual);
  filaAtual = prep.fila;
  idxAtual = prep.indice;

  player.onended = () => {
    // Só avança quando realmente terminou E o usuário não pausou
    if (!tocando) return;
    tocarProximaDaFila();
  };

  tocarProximaDaFila();

  if (btn) btn.innerHTML = "⏸ PARAR";
}





