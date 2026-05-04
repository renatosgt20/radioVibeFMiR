function getProgramaAtual() {
  const agora = new Date();
  const hora = agora.getHours();
  const dia = agora.getDay();

  if (dia === 6 && hora >= 18) return "psy";
  if (dia === 0 && hora < 6) return "psy";

  if (hora >= 6 && hora < 8) return "fundao";
  if (hora >= 8 && hora < 12) return "invibe";
  if (hora >= 12 && hora < 17) return "hits";
  if (hora >= 17 && hora < 21) return "hitsnoite";
  if (hora >= 21 && hora < 24) return "balada";
  if (hora >= 0 && hora < 4) return "lofi";
  if (hora >= 4 && hora < 6) return "chill";

  return "hits";
}

const playlists = {
  fundao: ["musicas/fundao/musica1.mp3"],
  invibe: ["musicas/invibe/musica1.mp3"],
  hits: ["musicas/hits/musica1.mp3"],
  hitsnoite: ["musicas/hitsnoite/musica1.mp3"],
  balada: ["musicas/balada/musica1.mp3"],
  lofi: ["musicas/lofi/musica1.mp3"],
  chill: ["musicas/chill/musica1.mp3"],
  psy: ["musicas/psy/musica1.mp3"]
};

let player = new Audio();

function tocarRadio() {
  const programa = getProgramaAtual();
  const lista = playlists[programa];

  if (!lista || lista.length === 0) {
    console.log("Sem músicas:", programa);
    return;
  }

  const index = Math.floor(Math.random() * lista.length);
  const musica = lista[index];

  console.log("🎧 Tocando:", musica);

  player.src = musica;

  player.play().catch(() => {
    alert("Clique no botão novamente para liberar o áudio 🔊");
  });

  player.onended = () => {
    tocarRadio();
  };
}