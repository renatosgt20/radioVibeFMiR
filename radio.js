// ==============================
// VIBE FM - Rádio Corrigida
// ==============================

const player = new Audio();
let tocando = false;
let pastaAtual = "lofi";

const PASTAS = {
  lofi: { arquivos: [] },
  hitsnoite: { arquivos: [] }
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

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115435/musica13_mumbfk.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica96_hvrhoz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115443/musica60_whrq1i.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115426/musica102_o2f91u.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115434/musica4_aw1vbm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932740/musica29_jy22qr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115456/musica97_pacsjm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115452/musica94_jj16yp.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115462/musica100_ujiumi.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115453/musica95_aizpxd.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115450/musica87_yjzsre.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115449/musica73_uhmt5d.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115444/musica63_vqcqw8.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115426/musica104_orp1za.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115449/musica83_s2dtxb.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115443/musica49_yoxbjc.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115439/musica36_nvimic.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115435/musica15_njcaog.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115432/musica5_hnqppl.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115451/musica89_ve0xgz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115446/musica65_yzh0dj.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115434/musica14_u9gq1h.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115441/musica19_adakv0.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115440/musica27_yivplp.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115454/musica88_wftkjl.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115426/musica117_oo6er0.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778115443/musica49_yoxbjc.mp3",
    
  
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

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932744/musica32_lgiwrv.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932732/musica16_yvxrbq.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932725/qv65scjsfldixfcjvzf6.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932773/musica73_ldue2a.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932734/musica20_h1f70y.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932731/musica9_e0en3x.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932770/musica64_s2uehd.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932755/musica47_lp6trp.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932747/musica35_qe4vix.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932770/musica72_jdya60.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932760/musica49_m4kaqz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932747/musica34_ei1cdg.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932730/musica8_ddcwbe.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932769/musica61_tym5bw.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932766/musica65_vmpnqr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932752/musica38_qiarcc.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932731/musica14_afrfr5.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932760/musica58_nxe7no.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932736/musica22_t5gyl3.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932733/musica18_pf16df.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932775/musica78_xrjftu.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932759/musica54_n416ug.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932752/musica45_jhesn6.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932734/musica19_vcr1cq.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932764/musica60_gghhhr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932766/musica66_i8kbrc.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932760/musica53_wfpgbs.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1777932765/musica63_m6bpa1.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168688/musica11_gz4g0p.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168680/musica9_zgayef.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168673/musica8_uylvfb.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168664/musica7_h1rieq.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168657/musica6_bfnvp7.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168650/musica5_rgcmma.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168642/musica4_uvflqa.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168635/musica3_rpn0gh.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168628/musica2_e0n25c.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168591/musica56_zzrssq.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168570/musica105_dkivbm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168570/musica51_dkivbm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168564/musica50_heyvpr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168549/musica48_x8txde.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168541/musica47_lyj9ds.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168534/musica46_x4ipvh.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168527/musica45_bjushz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168521/musica44_ov9tdy.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168505/musica41_zeodpr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168498/musica40_nv8onu.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168470/musica34_uj4qqk.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168464/musica32_rz63zi.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168455/musica31_ouir1j.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168449/musica30_elszpz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168441/musica29_wuryjg.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168434/musica28_lw1izl.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168426/musica27_hmaehr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168419/musica26_jjdxv4.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168413/musica25_fnlpgw.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168405/musica24_pdvjxa.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168398/musica23_th1upb.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168385/musica20_mndfpo.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168376/musica18_qk2wrd.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168368/musica17_bwp8xv.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168355/musica15_ptpjuv.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168347/musica14_sbgmhm.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778168334/musica12_zjpiom.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176977/musica87_cwjl8p.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176958/musica82_slbeoz.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176947/musica81_ojx6md.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176927/musica79_joga82.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176909/musica77_tez7pp.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176897/musica76_axlz4x.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176887/musica75_jdmni4.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176350/musica63_efmbgv.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176331/musica102_zgfabr.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176320/musica101_swd1fd.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778176302/musica98_gxfhm3.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778174937/musica95_kxhvsy.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778174920/musica94_bu2oad.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778174908/musica92_dzztgs.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778174869/musica89_hysmbk.mp3",

    "https://res.cloudinary.com/dmodpbtae/video/upload/v1778178487/musica222_wtaacz.mp3",

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
// HORÁRIO
// ==============================

function getPastaInicialPorHorario() {
  const h = new Date().getHours();
  return h >= 6 && h < 18 ? "hitsnoite" : "lofi";
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
// 🔓 DESBLOQUEAR ÁUDIO (ESSENCIAL)
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

  console.log("🎵 Tocando:", pasta, src);

  player.src = src;
  player.crossOrigin = "anonymous";

  try {
    await player.play();
    tocando = true;

  } catch (e) {
    console.log("❌ Bloqueado ao tocar:", e);
  }
}

// ==============================
// PRÓXIMA MÚSICA
// ==============================

function proximaMusica() {

  if (idxAtual >= filaAtual.length) {
    pastaAtual = pastaAtual === "lofi" ? "hitsnoite" : "lofi";
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

  // 🔓 PRIMEIRO CLIQUE: LIBERA ÁUDIO
  if (!audioLiberado) {
    const ok = await desbloquearAudio();
    if (!ok) {
      alert("Clique novamente para liberar o áudio 🔊");
      return;
    }
  }

  // PAUSAR
  if (tocando) {
    player.pause();
    tocando = false;
    if (btn) btn.innerHTML = "▶ PLAY";
    return;
  }

  // PRIMEIRA INICIALIZAÇÃO
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
    player.play();
  }

  tocando = true;
  if (btn) btn.innerHTML = "⏸ PARAR";
}